from __future__ import annotations

import os
import subprocess

import modal


MODEL_REPO = "Qwen/Qwen3-8B"
SERVED_MODEL_NAME = "qwen3-8b"
VLLM_PORT = 8000

image = (
    modal.Image.from_registry("nvidia/cuda:12.9.0-devel-ubuntu22.04", add_python="3.12")
    .entrypoint([])
    .uv_pip_install("vllm==0.21.0")
)
model_cache = modal.Volume.from_name("love21-huggingface-cache", create_if_missing=True)
app = modal.App("love21-qwen")


async def model_auth_middleware(request, call_next):
    from starlette.responses import JSONResponse

    # Allow infrastructure/readiness probes and docs endpoints without auth.
    if request.url.path in {
        "/metrics",
        "/health",
        "/openapi.json",
        "/docs",
        "/docs/oauth2-redirect",
        "/redoc",
    }:
        return await call_next(request)

    expected = f"Bearer {os.environ['MODEL_API_KEY']}"
    if request.headers.get("authorization") != expected:
        return JSONResponse(
            {"detail": "Invalid model API key"},
            status_code=401,
            headers={"WWW-Authenticate": "Bearer"},
        )
    return await call_next(request)


@app.server(
    image=image,
    gpu="L4",
    port=VLLM_PORT,
    startup_timeout=10 * 60,
    scaledown_window=5 * 60,
    target_concurrency=4,
    volumes={"/root/.cache/huggingface": model_cache},
    secrets=[modal.Secret.from_name("love21-model")],
    unauthenticated=True,
)
class ModelServer:
    @modal.enter()
    def start(self) -> None:
        self.process = subprocess.Popen(
            [
                "vllm",
                "serve",
                MODEL_REPO,
                "--served-model-name",
                SERVED_MODEL_NAME,
                "--host",
                "0.0.0.0",
                "--port",
                str(VLLM_PORT),
                "--middleware",
                "modal_llm.model_auth_middleware",
                "--max-model-len",
                "8192",
                "--gpu-memory-utilization",
                "0.90",
                "--enable-prefix-caching",
                "--enforce-eager",
            ]
        )

    @modal.exit()
    def stop(self) -> None:
        self.process.terminate()