"""Test MVC separation: teaching content must already exist in the built HTML."""
import json
from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
soup = BeautifulSoup((ROOT / "projekt/index.html").read_text(), "html.parser")
js = (ROOT / "projekt/portal.js").read_text()
for forbidden in ("createElement('figure')", "createElement('article')",
                  "createElement('iframe')", "createElement('textarea')",
                  "setChapterTitle(", "embeddedLearningPath(",
                  "const learningExamples=", "const ruleTask=",
                  "const papageiMount=", "const turingMount=",
                  "const saveSection="):
    assert forbidden not in js, f"Authored content leaked into controller: {forbidden}"
for selector in ("#lernarten-wissen article.card", "#lernarten-lernend article.card",
                 "#lernarten-intro figure", "#sprache-2 iframe",
                 "#sprache-4 aside.turing-activity", "#sicherung .project-transfer-actions",
                 "#lernarten-5 .learning-example-links",
                 "#lernarten-6 .learning-example-links",
                 "#lernarten-7 .learning-example-links"):
    assert len(soup.select(selector)) == 1, selector
keys = [el["data-answer"] for el in soup.select("[data-answer]")]
assert len(keys) == len(set(keys)), "Duplicate answer keys"
for key in ("wissen_fragen", "wissen_unbekannt", "wissen_regeln",
            "lernend_nachbarn", "lernend_aendert", "lernend_daten"):
    assert key in keys, key
pairs = json.loads(soup.select_one("#memory-pairs").get_text())
assert len(pairs) == 3 and all(len(pair) == 2 for pair in pairs)
print("PASS static lesson content, stable keys, Memory source data and MVC separation")
