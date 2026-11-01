"""Regression protection for content-first refactoring and saved student work."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from build_portal import assemble, render_fragment

contract = json.loads((ROOT / "tests/fixtures/content-contract.json").read_text(encoding="utf-8"))
rendered = (ROOT / "_build/site/projekt/index.html").read_text(encoding="utf-8")
assembled = assemble()

# The AVIVA builder replaces only deliberately generated teaching-plan blocks.
def no_aviva(value: str) -> str:
    return re.sub(
        r"<!-- LESSONS:[a-z0-9-]+ -->.*?<!-- /LESSONS:[a-z0-9-]+ -->",
        "<!-- GENERATED AVIVA -->", value, flags=re.S
    )

assert no_aviva(rendered) == no_aviva(assembled), (
    "The published HTML differs from the content sources outside generated AVIVA plans"
)
soup = BeautifulSoup(rendered, "html.parser")
ids = {tag.get("id") for tag in soup.select("[id]")}
assert len(soup.select("[id]")) == len(ids), "Duplicate HTML ids"
# Temporary runtime mounts are replaced by their real static components at build time.
retired_mounts = {"papagei-placeholder", "turing-mount"}
assert set(contract["ids"]) - retired_mounts <= ids, "Existing links or DOM ids were removed"
assert all(not soup.select_one("#" + mount) for mount in retired_mounts)
assert soup.select_one("#sprache-2 figure.external-map iframe")
assert soup.select_one("#sprache-4 aside.turing-activity")
assert soup.select_one("#memory-pairs[type='application/json']")
for attr, values in contract["tags"].items():
    current = [tag.get(attr) for tag in soup.select(f"[{attr}]")]
    assert len(current) == len(set(current)), f"Duplicate persistent key: {attr}"
    assert set(values) <= set(current), f"Removed or renamed saved state keys: {attr}"
chapters = [tag["id"] for tag in soup.select("details.kapitel")]
assert set(contract["chapters"]) <= set(chapters), "Existing lesson chapter removed"

for section in contract["sections"]:
    assert soup.select_one("main > section#" + section), "Section missing: " + section

# Verify future authoring works with pure Markdown, images and subheadings.
new = render_fragment(
    "---\ntype: chapter\nid: perzeptron-demo\nnummer: 3a\n"
    "titel: Demo\nkurz: Ein neues Kapitel\n---\n\n"
    "Ein Text mit **Fettdruck**.\n\n## Unterkapitel\n\n"
    "![Neuron](grafiken/perzeptron.svg)\n",
    ROOT / "kursseiten" / "sample.md",
)
new_soup = BeautifulSoup(new, "html.parser")
assert new_soup.select_one("details.kapitel#perzeptron-demo")
assert new_soup.select_one(".kapitel-body strong").get_text() == "Fettdruck"
assert new_soup.select_one(".kapitel-body h2").get_text() == "Unterkapitel"
assert new_soup.select_one(".kapitel-body img")["src"] == "grafiken/perzeptron.svg"

block = render_fragment(
    '<div><!-- MD:START -->\nEin **neuer** Absatz.\n<!-- MD:END --></div>',
    ROOT / "kursseiten" / "sample.md",
)
assert "<strong>neuer</strong>" in block
assert "<div>" in block and "</div>" in block

# Markdown tables in lesson fragments must become actual HTML tables, not pipe text.
perzeptron_tables = soup.select("#perzeptron-3 table")
assert len(perzeptron_tables) >= 2, "Perzeptron truth/calculation tables not rendered"
truth = perzeptron_tables[0]
assert [c.get_text(strip=True) for c in truth.select("thead th")] == [
    "x₁", "x₂", "AND", "OR", "NAND"
]
assert len(truth.select("tbody tr")) == 4
calculation = perzeptron_tables[1]
assert len(calculation.select("tbody tr")) == 4
assert "AND-Ziel" in calculation.get_text()
assert "|:--:" not in soup.select_one("#perzeptron-3").get_text()

# Project diagram distinguishes pretrained feature extraction from the actual training.
pipeline = soup.select("#projekt-4 .project-train-flow > li")
assert len(pipeline) == 4, "Expected four model-training stages in the A/B comparison chapter"
assert [item.select_one("strong").get_text(strip=True)[0] for item in pipeline] == list("1234")
assert "model-fixed" in pipeline[1].get("class", [])
assert "1280" in pipeline[1].get_text()
assert "unverändert" in pipeline[1].get_text()
assert "model-trained" in pipeline[2].get("class", [])
assert "60 Epochen" in pipeline[2].get_text()
assert "Hier wird wirklich trainiert" in pipeline[2].get_text()
assert "neuen Bildern" in pipeline[3].get_text()

# Students still download/import their full local answer state and all notebooks.
js = (ROOT / "projekt/portal.js").read_text(encoding="utf-8")
progress = (ROOT / "projekt/progress.js").read_text(encoding="utf-8")
for key in ['kst-ki-kursportal-v1', 'data-answer', 'data-journal', 'download-backup',
            'download-submission', 'restore-package', 'notebooks/', 'runtime/']:
    assert key in js, key
for key in ['ki-projekt-seitenstand-v1', 'data-check', 'data-skill']:
    assert key in progress, key
for notebook in ["perzeptron_und_neuronale_netze.ipynb", "mehrschichtige_netze.ipynb",
                 "daten_training.ipynb", "ki_lernlabor.ipynb"]:
    assert notebook in rendered, notebook
assert (ROOT / "content/ki_projekt/ki_tandemprojekt.ipynb").is_file()
assert "projectName" in js and "showNotebook(projectName" in js

print("PASS lossless assembled course, stable form keys, Markdown authoring, export/import hooks")
