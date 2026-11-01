"""Basic and advanced courses must build independently and remain pedagogically consistent."""
from pathlib import Path
import json
import sys

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from course_model import load_course

basic = load_course(ROOT, "kursseiten/basis-manifest.json")
advanced = load_course(ROOT)
assert len(basic["lessons"]) == 10
assert len(advanced["lessons"]) >= 10
assert all(sum(p["minutes"] for p in lesson["phases"]) == 90 for lesson in basic["lessons"])
assert [lesson["number"] for lesson in basic["lessons"]] == list(range(1,11))
assert len({lesson["id"] for lesson in basic["lessons"]}) == 10
assert set(l["view"] for l in basic["lessons"]).isdisjoint({l["view"] for l in advanced["lessons"]})

base = ROOT / "_build/site/basis"
page = BeautifulSoup((base / "index.html").read_text(encoding="utf-8"), "html.parser")
assert page.select_one("#basis-start h1").get_text() == "KI entdecken"
assert len(page.select("main > section")) == 13
assert len(page.select("details.lesson-plan")) == 10
assert len(page.select("details.kapitel")) >= 30
assert len(page.select("[data-basis-answer]")) >= 24
assert len(page.select("a.course-card")) == 10
assert len(page.select(".nav > a")) == 13
assert len(page.select("#basis-neuron details.kapitel")) == 7, "DL3 must mirror seven fourth-year chapters"
assert page.select_one("#basis-neuron .typen.protokoll")
assert page.select_one("#basis-neuron a[href*='portal/basis_neuron.ipynb']")
assert page.select_one('[data-basis-answer="basis-neuron-sw_gs"]')
assert page.select_one("#basis-neuron img[src='grafiken/neuron_biologisch.svg']")
assert page.select_one("#basis-neuron #basis-neuron-2")
assert page.select_one("#basis-sprache [data-basis-language] select[data-language-context]")
assert page.select_one("#basis-sprache #basis-sprache-papier")
assert page.select_one("#basis-sprache #basis-sprache-papagei iframe[src*='inf-schule.de']")
assert page.select_one("#basis-sprache #basis-sprache-netz img[src='grafiken/papagei_vs_netz.svg']")
assert page.select_one("#basis-sprache #basis-sprache-soekia.basis-optional")
assert len(page.select("#basis-sprache details.kapitel")) == 7
assert [l["view"] for l in basic["lessons"]] == ["basis-ki","basis-lernen","basis-neuron","basis-netze","basis-daten","basis-plan","basis-training","basis-abschluss","basis-sprache","basis-gesellschaft"]
assert [lesson["title"] for lesson in basic["lessons"]][7].lower().find("fachgespräch") >= 0
assert basic["lessons"][8]["view"] == "basis-sprache"
assert basic["lessons"][9]["view"] == "basis-gesellschaft"
assert len(page.select("#basis-netze details.kapitel")) == 4, "DL4 must have all non-digit fourth-year chapters"
assert page.select_one("#basis-netze img[src='grafiken/xor_gerade.svg']")
assert page.select_one("#basis-netze a[href*='portal/xor_einzelne_neuronen.ipynb']")
assert page.select_one("#basis-netze a[href*='portal/basis_netze.ipynb']")
assert page.select_one('[data-basis-answer="basis-netze-hand_xor_max"]')
assert not page.select("#basis-netze a[href*='ziffernerkennung.ipynb']")
assert not page.select("#basis-netze img[src='grafiken/ziffern_netz.png']")
assert page.select_one("#basis-daten a[href*='portal/basis_bildmodell.ipynb']"), "Digit classifier must begin in DL5"
assert page.select_one("#basis-ki #einstieg-1")
assert page.select_one("#basis-lernen #lernarten-4")
assert page.select_one("#basis-lernen #memory-board")
assert page.select_one("#basis-gesellschaft #gesellschaft-1")
assert page.select_one(".crumb img.school-logo[src='grafiken/kst_logo.png']")
assert page.select_one("#basis-lernziele .grid.two")
assert len(page.select("#basis-lernziele .card")) == 7
assert not page.select("a[href='../projekt/']"), "Course switching must use the landing page, not direct cross-links"
assert page.select_one("a[href='../kurse.html']")
assert "Kantonsschule Stadelhofen Informatik Künstliche Intelligenz" in page.select_one(".crumb").get_text(" ",strip=True)
assert "Kantonsschule Stadelhofen" in page.get_text()
assert all(len(page.select(f"#{v} details.kapitel")) >= 2 for v in ("basis-neuron","basis-netze","basis-plan","basis-gesellschaft"))
assert "Sprachmodelle" in page.get_text()
assert "wahrscheinliche" in page.get_text()
assert page.select_one("a[href*='portal/basis_fotoprojekt.ipynb']")
assert (base/"persistence.js").is_file(), "Basis ZIP export/import controller missing"
for path in ["basis.css","basis.js","theme.css","dl1_sort.css","dl1_sort.js","kurs.json","unterrichtsplan.html"]:
    assert (base/path).is_file(), path
styles = (base/"theme.css").read_text(encoding="utf-8")
assert "--accent" in styles and ".sidebar" in styles
basic_style=(base/"basis.css").read_text(encoding="utf-8")
assert "--accent:#3653a3" in basic_style
assert (base/"grafiken/kst_logo.png").is_file(), "KST logo must be packaged with basic course"
assert (base/"grafiken/kst_logo.png").stat().st_size > 100, "Logo must contain real image data"
assert "basis-network-diagram" in basic_style
# Typography and figure sizing must match the shared fourth-year portal in DL1–4.
assert "body .concept-figure img{display:block;width:100%;max-width:700px" in basic_style
assert "body .neuron-figure img{max-width:900px}" in basic_style
assert "body thead th,body .typen thead th,body .phase-table thead th" in basic_style
assert "background:#e6edff" in basic_style
assert page.select_one("#basis-ki img[src='grafiken/ki_programmierung.png']")
assert page.select_one("#basis-neuron img[src='grafiken/neuron_biologisch.svg']")

js=(base/"basis.js").read_text(encoding="utf-8")
assert "kst-ki-basis-v1" in js
assert "kst-ki-kursportal-v1" not in js
assert "kst-ki-kursportal-v1" in (ROOT/"projekt/portal.js").read_text(encoding="utf-8")
assert "kursseiten/basis-manifest.json" in (ROOT/"projekt/admin/admin.js").read_text(encoding="utf-8")
assert "basis-manifest.json" in (ROOT/"admin-worker/src/index.mjs").read_text(encoding="utf-8")
assert "KI entdecken" in (base/"unterrichtsplan.html").read_text(encoding="utf-8")
assert "Papagei" in (base/"index.html").read_text(encoding="utf-8")
# The first-year image project must be runnable and restorable after deployment.
import json as _json
_registry=_json.loads((ROOT/"experimente/registry.json").read_text(encoding="utf-8"))
_names={item["source"] for item in _registry}
assert {"basis_neuron.ipynb","basis_netze.ipynb","basis_bildmodell.ipynb","basis_fotoprojekt.ipynb"} <= _names
for _name in ("basis_neuron.ipynb","basis_netze.ipynb","basis_bildmodell.ipynb","basis_fotoprojekt.ipynb"):
    _nb=_json.loads((ROOT/"content"/_name).read_text(encoding="utf-8"))
    assert _nb["nbformat"] == 4 and any(c["cell_type"]=="code" for c in _nb["cells"])
    assert (ROOT/"_build/content/portal"/_name).is_file(), f"Notebook missing from JupyterLite staging: {_name}"
assert (base/"index.html").read_text(encoding="utf-8").count('<script type="module" src="persistence.js"></script>') == 1
assert (ROOT/"content/ki_projekt/fotostudio_core.js").is_file()
assert (ROOT/"content/ki_projekt/fotostudio.html").is_file()
assert "224" in (ROOT/"content/ki_projekt/fotostudio_core.js").read_text(encoding="utf-8")
_persistence=(base/"persistence.js").read_text(encoding="utf-8")
assert "indexedDB" in _persistence and "makeZip" in _persistence and "readZip" in _persistence
assert "fotodaten/fotostudio.json" in _persistence and "Reflexionen.txt" in _persistence
assert "basis_fotoprojekt.ipynb" in (base/"index.html").read_text(encoding="utf-8")
assert "xor_einzelne_neuronen.ipynb" in _persistence, "The extra XOR notebook must be saved in ZIP"
assert 'Notebook der 1. Klasse' not in _persistence, "Remove generic first-year notebook title"
assert "const notebookTitles=" in _persistence
assert "className='lab-panel'" in _persistence, "Reuse fourth-year notebook presentation"
assert "portal/'+name" in _persistence, "Open selected Jupyter notebook directly"
assert "requestFullscreen" in _persistence

# The teacher footer, navbar and complete blue palette must match the fourth-year structure.
teacher_footer = page.select_one("footer.footer > details")
assert teacher_footer is not None
assert teacher_footer.summary.get_text(" ", strip=True) == "Quellen & Hinweise für die Lehrperson"
for target in ("unterrichtsplan.html", "materialien.html", "../projekt/admin/"):
    assert teacher_footer.select_one(f'a[href="{target}"]'), f"Teacher link missing: {target}"
assert page.select_one('.sidebar-bottom a[href="#basis-sicherung"]')
assert page.select_one("#basis-sicherung #basis-download")
assert page.select_one("#basis-sicherung #basis-backup-controls")
assert (base/"materialien.html").is_file()
material_page = BeautifulSoup((base/"materialien.html").read_text(encoding="utf-8"), "html.parser")
assert len(material_page.select("section.basis-resource")) == 10, "All ten teacher-resource sections required"
assert (base/"grafiken/netz_hintergrund_blau.svg").is_file()
blue_svg=(base/"grafiken/netz_hintergrund_blau.svg").read_text(encoding="utf-8")
assert "#3653a3" in blue_svg and "#076959" not in blue_svg, "Network artwork must use blue, not green"
assert "netz_hintergrund_blau.svg" in basic_style
assert "radial-gradient(1200px 600px at 85% -10%,#dfe9ff" in basic_style
assert "kst-ki-basis-nav-collapsed" in js
assert "window.print()" in js

# Source parity: first-year DL3/4 must retain *all* fourth-year teaching content,
# except the optional digit-recognition chapter and its bridge in the network notebook.
import re as _re
import nbformat as _nbformat

def _mirror_chapter(raw,src,dst):
    raw=raw.replace(f'id="{src}-',f'id="{dst}-').replace(f'href="#{src}-',f'href="#{dst}-')
    # In-chapter Notebook blocks mirror the very same activity, but open the
    # class-specific JupyterLite notebook just like the existing lab buttons.
    raw=raw.replace('content/perzeptron_und_neuronale_netze.ipynb','content/basis_neuron.ipynb')
    raw=raw.replace('portal/perzeptron_und_neuronale_netze.ipynb','portal/basis_neuron.ipynb')
    raw=raw.replace('content/mehrschichtige_netze.ipynb','content/basis_netze.ipynb')
    raw=_re.sub(r'data-answer="([^"]+)"',lambda m:f'data-basis-answer="{dst}-{m.group(1)}"',raw)
    def _button(m):
        notebook={"perzeptron_und_neuronale_netze.ipynb":"basis_neuron.ipynb",
                  "mehrschichtige_netze.ipynb":"basis_netze.ipynb"}.get(m.group(1),m.group(1))
        return f'<a class="ki-notebook-launch" href="../lab/index.html?path=portal/{notebook}">{m.group(2)}</a>'
    return _re.sub(r'<button type="button" class="ki-notebook-launch" data-lab="([^"]+)">([\\s\\S]*?)</button>',_button,raw)

for _a,_b,_filenames in [
    ("perzeptron","basis-neuron",[f"0{i}0-perzeptron-{i}.md" for i in range(1,8)]),
    ("netze","basis-netze",[f"0{i}0-netze-{i}.md" for i in range(1,5)]),
]:
    for _file in _filenames:
        _fourth=(ROOT/"kursseiten"/_a/_file).read_text(encoding="utf-8")
        _expect=_mirror_chapter(_fourth,_a,_b)
        if _file=="040-netze-4.md":
            # The ungraded readiness check is deliberately part of advanced DL4,
            # not the first-year mirror. Keep all shared XOR lessons identical.
            _expect=_re.sub(r'(?m)^    <div class="callout" id="projekt-bereit-check"[^\n]*\n[\s\S]*?^    </div>\n','',_expect)
            _expect=_expect.replace(
                "Die Planung und Datenaufteilung folgen selbstständig in Doppellektion 5.",
                "In Doppellektion 5 untersucht ihr erstmals das Ziffernerkennungsmodell.")
        _first=(ROOT/"kursseiten"/_b/_file).read_text(encoding="utf-8")
        assert _first==_expect, f"DL3/4 source drift from fourth-year course: {_b}/{_file}"

_nb4_neuron=_nbformat.read(ROOT/"content/perzeptron_und_neuronale_netze.ipynb",as_version=4)
_nb1_neuron=_nbformat.read(ROOT/"content/basis_neuron.ipynb",as_version=4)
assert [c.source for c in _nb1_neuron.cells]==[c.source for c in _nb4_neuron.cells], "DL3 notebook must match fourth year"
_nb4_network=_nbformat.read(ROOT/"content/mehrschichtige_netze.ipynb",as_version=4)
_nb1_network=_nbformat.read(ROOT/"content/basis_netze.ipynb",as_version=4)
assert len(_nb1_network.cells)==len(_nb4_network.cells)-1, "Only digit model bridge may be omitted"
assert not any("Ziffernerkennung" in c.source for c in _nb1_network.cells if c.cell_type=="markdown"), "No digits in DL4"
assert _nb1_neuron.metadata.get("ki_didaktik",{}).get("ursprung")=="content/perzeptron_und_neuronale_netze.ipynb"
assert _nb1_network.metadata.get("ki_didaktik",{}).get("ursprung")=="content/mehrschichtige_netze.ipynb"

print("PASS ten differentiated 90-minute basic lessons, shared styling, live activity, separate storage and one editor")
