"""Hinweis am Seitenende: «Diese Seite wurde mit Hilfe von KI erstellt.»

Der Hinweis wird beim Bauen in jede veröffentlichte HTML-Seite eingefügt,
als letztes Element vor </body>. Der Text steht nur hier und in
admin-worker/src/teacher.mjs (Lehrpersonenbereich).
"""
from __future__ import annotations

TEXT = "Diese Seite wurde mit Hilfe von KI erstellt."
MARKER = 'class="ki-hinweis"'
HTML = (
    '<p class="ki-hinweis" style="clear:both;margin:2.5rem auto 1.5rem;padding:0 16px;'
    'max-width:60rem;text-align:center;font:0.85rem/1.5 system-ui,sans-serif;'
    'color:#5f6b6e">' + TEXT + "</p>"
)


def add_ki_hinweis(page: str) -> str:
    """Fügt den Hinweis einmal ganz unten ein (idempotent)."""
    if MARKER in page:
        return page
    index = page.lower().rfind("</body>")
    if index < 0:
        index = page.lower().rfind("</html>")
    if index < 0:
        return page + HTML
    return page[:index] + HTML + page[index:]
