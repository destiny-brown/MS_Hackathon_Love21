from __future__ import annotations

import html
import re
from pathlib import Path

# Keep body parsing in sync with frontend preview, which renders this template via POST /admin/newsletter/preview.
TEMPLATE_PATH = Path(__file__).resolve().parents[1] / "templates" / "newsletter.html"


def _paragraphs_to_html(content: str) -> str:
    blocks = [block.strip() for block in re.split(r"\n\s*\n", content.strip()) if block.strip()]
    parts: list[str] = []
    for block in blocks:
        lines = [line.strip() for line in block.splitlines() if line.strip()]
        if not lines:
            continue
        heading_prefixes = ("Subject:", "Dear", "Program", "Event", "Impact", "Get Involved")
        first = lines[0]
        if any(first.startswith(prefix) for prefix in heading_prefixes) or first.endswith(":"):
            title = re.sub(r"^[🌟💪❤️🤝📅📊🙏🎟️🏆]+\s*", "", first)
            parts.append(f'<div class="section"><h2>{html.escape(title)}</h2>')
            for line in lines[1:]:
                parts.append(f'<div class="card"><p>{html.escape(line)}</p></div>')
            parts.append("</div>")
        else:
            parts.append(f"<p>{html.escape(' '.join(lines))}</p>")
    return "\n".join(parts)


def render_newsletter_html(subject: str, content: str, unsubscribe_url: str) -> str:
    template = TEMPLATE_PATH.read_text(encoding="utf-8")
    body_html = _paragraphs_to_html(content)
    return (
        template.replace("{{SUBJECT}}", html.escape(subject))
        .replace("{{BODY}}", body_html)
        .replace("{{UNSUBSCRIBE_URL}}", html.escape(unsubscribe_url, quote=True))
    )
