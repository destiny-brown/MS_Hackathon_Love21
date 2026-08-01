from __future__ import annotations

import html
import re
from pathlib import Path

TEMPLATE_PATH = Path(__file__).resolve().parents[3] / "newsletter.html"


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
            parts.append(f'<div class="hero"><p>{html.escape(" ".join(lines))}</p></div>')
    return "\n".join(parts)


def render_newsletter_html(subject: str, content: str, unsubscribe_url: str) -> str:
    template = TEMPLATE_PATH.read_text(encoding="utf-8")
    body_html = _paragraphs_to_html(content)
    rendered = template.replace(
        "<h1>A Summer Update from Love 21</h1>",
        f"<h1>{html.escape(subject)}</h1>",
    )
    rendered = re.sub(
        r'<div class="hero">.*?</div>\s*<div class="section">',
        body_html + '\n    <div class="section" style="display:none">',
        rendered,
        count=1,
        flags=re.DOTALL,
    )
    rendered = rendered.replace('<a href="#">Unsubscribe</a>', f'<a href="{html.escape(unsubscribe_url)}">Unsubscribe</a>')
    return rendered
