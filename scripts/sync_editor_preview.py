"""Synchronise the editor's sandbox visual preview with the real course template.

The Worker only exposes the existing admin.js route, so both stylesheets and
course chrome must be inlined into that JavaScript. Run without --check after
changing portal.css or index.template.html, then commit the changed admin.js.
"""
from pathlib import Path
import argparse
import json
import re

ROOT = Path(__file__).resolve().parents[1]
PAGE = ROOT / "projekt/index.template.html"
PORTAL_CSS = ROOT / "projekt/portal.css"
ADMIN = ROOT / "projekt/admin/admin.js"


def values():
    template = PAGE.read_text(encoding="utf-8")
    m = re.search(r"<style>([\\s\\S]*?)</style>", template)
    if not m:
        raise RuntimeError("Embedded course stylesheet is missing")
    body = template.index("<body>") + len("<body>")
    first_section = template.index('<section class="hero" id="start">', body)
    chrome = template[body:first_section]
    if '<div class="shell"><main id="inhalt">' not in chrome:
        raise RuntimeError("Course shell structure has changed")
    return {
        "COURSE_PREVIEW_CSS": m.group(1) + "\n" + PORTAL_CSS.read_text(encoding="utf-8"),
        "COURSE_PREVIEW_CHROME": chrome,
    }


def sync(check=False):
    content = ADMIN.read_text(encoding="utf-8")
    for name, expected in values().items():
        regex = re.compile(r"(?m)^const " + name + r" = (.+);$")
        matches = list(regex.finditer(content))
        if len(matches) != 1:
            raise RuntimeError("Expected exactly one constant " + name)
        match = matches[0]
        actual = json.loads(match.group(1))
        if check and actual != expected:
            raise SystemExit(name + " differs from the real portal; run python scripts/sync_editor_preview.py")
        if not check:
            content = content[:match.start(1)] + json.dumps(expected, ensure_ascii=False) + content[match.end(1):]
    if not check:
        ADMIN.write_text(content, encoding="utf-8")
    print("PASS Editor preview CSS and layout match published course sources")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    sync(parser.parse_args().check)
