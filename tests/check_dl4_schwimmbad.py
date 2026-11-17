"""DL4: Beide Notebook-Dateinamen zeigen dasselbe Schwimmbadnetz, nicht die alten PNGs."""
from pathlib import Path
from unittest.mock import patch
import json
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
REV = "dl4-schwimmbad-v2"
roots = [ROOT / "kurse" / sub for sub in
         ("_vorlagen/1-klasse", "_vorlagen/4-klasse", "bok/1-klasse", "bok/4-klasse")]
for root in roots:
    for name in ("basis_netze.ipynb", "mehrschichtige_netze.ipynb"):
        notebook = json.loads((root / "content" / name).read_text(encoding="utf-8"))
        assert notebook["metadata"]["ki_didaktik"]["notebook_revision"] == REV
        content = json.dumps(notebook, ensure_ascii=False)
        assert "merhschichtiges_netzwerk.png" not in content
        assert "merhschichtiges_netzwerk_xor.png" not in content
        assert "schwimmbad_labor()" in content
        assert "xor_lernen_regler" in content
        assert "ki-autostart" in content
    expected = (root / "assets/grafiken/schwimmbad_xor_netz.svg").read_bytes()
    actual = (root / "content/img/schwimmbad_xor_netz.svg").read_bytes()
    assert actual == expected, root
    module = (root / "content/schwimmbad_netz.py").read_text(encoding="utf-8")
    compile(module, str(root / "content/schwimmbad_netz.py"), "exec")
    assert "widgets.IntSlider" in module
    assert "widgets.FloatSlider" in module

# Observe the real ipywidgets callbacks, not just a copied XOR truth table.
sys.path.insert(0, str(roots[-1] / "content"))
import IPython.display as ip_display
import ipywidgets as widgets
from schwimmbad_netz import schwimmbad_labor

rendered = []
with patch.object(ip_display, "display", side_effect=rendered.append):
    schwimmbad_labor()
assert len(rendered) == 1
ui = rendered[0]
inputs = {w.description: w for w in ui.children if isinstance(w, widgets.IntSlider)}
assert set(inputs) == {"Sonne (S)", "Freund:innen (F)", "Prüfung morgen (P)"}
selector = next(w for w in ui.children if isinstance(w, widgets.Dropdown))
weights = [w for w in ui.children if isinstance(w, widgets.FloatSlider)]
assert len(weights) == 4
net = next(w for w in ui.children if isinstance(w, widgets.HTML) and "<svg" in w.value)
for p in (0, 1):
    inputs["Prüfung morgen (P)"].value = p
    for s in (0, 1):
        inputs["Sonne (S)"].value = s
        for f in (0, 1):
            inputs["Freund:innen (F)"].value = f
            result = re.search(r"\(y=(\d)\)", net.value)
            assert result, (s, f, p)
            assert int(result.group(1)) == int(bool(s) != bool(f) and p == 0), (s, f, p)
# Changing the weight changes the real output and the graphical status.
inputs["Sonne (S)"].value = 0
inputs["Freund:innen (F)"].value = 1
inputs["Prüfung morgen (P)"].value = 0
assert "(y=1)" in net.value
selector.value = "or"
weights[1].value = -1
assert "(y=0)" in net.value
reset = next(w for w in ui.children if isinstance(w, widgets.Button))
reset.click()
assert "(y=1)" in net.value
print("PASS DL4: 8/8 network cases, weight slider, reset and matching course SVGs")
