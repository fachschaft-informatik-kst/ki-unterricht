"""Regression for DL3 SVG decision boundaries across every course and template.

Fast source-only test: no JupyterLite build, Matplotlib or browser required.
"""
from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path
from xml.etree import ElementTree as ET


ROOT = Path(__file__).resolve().parents[1]
KURSE = (
    "bok/1-klasse",
    "bok/4-klasse",
    "irn/1-klasse",
    "irn/4-klasse",
    "_vorlagen/1-klasse",
    "_vorlagen/4-klasse",
)


def linien(svg):
    root = ET.fromstring(svg)
    assert root.tag.endswith("svg")
    return [element.attrib for element in root.iter()
            if element.tag.endswith("line") and "data-role" in element.attrib]


def testen(kurs):
    pfad = ROOT / "kurse" / kurs / "content" / "unterricht_tools.py"
    assert pfad.is_file(), kurs
    spec = spec_from_file_location("lernlinien_" + kurs.replace("/", "_"), pfad)
    modul = module_from_spec(spec)
    spec.loader.exec_module(modul)

    lerner = modul._Lerner("AND", .4)
    grafiken = []
    alte_anzeige = modul.display
    modul.display = lambda obj: grafiken.append(obj.data)
    try:
        while len(lerner.staende) - 1 < 3:
            info = lerner.schritt()
            assert info is not None
        modul._lern_bild(lerner, info)

        while len(lerner.staende) - 1 < 4:
            info = lerner.schritt()
            assert info is not None
        modul._lern_bild(lerner, info)
    finally:
        modul.display = alte_anzeige

    assert len(grafiken) == 2, kurs
    dritte, vierte = grafiken
    assert "Aktuelle Grenze liegt ausserhalb des Bildes" in dritte, kurs
    assert "überall 0 aus" in dritte, kurs
    assert "ausserhalb des Bildes" not in vierte, kurs
    assert "<clipPath" not in vierte, kurs
    assert all(linie["data-role"] != "aktuelle-grenze" for linie in linien(dritte)), kurs
    aktuell = [linie for linie in linien(vierte)
               if linie["data-role"] == "aktuelle-grenze"]
    vorher = [linie for linie in linien(vierte)
              if linie["data-role"] == "fruehere-grenze"]
    assert len(aktuell) == 1 and len(vorher) >= 2, kurs
    assert aktuell[0]["stroke"] == "#263b43"
    assert aktuell[0]["stroke-width"] == "3"
    for linie in aktuell + vorher:
        for axis, min_value, max_value in (("x1", 68, 438), ("x2", 68, 438),
                                           ("y1", 50, 334), ("y2", 50, 334)):
            assert min_value <= float(linie[axis]) <= max_value, (kurs, axis, linie)
    assert abs(float(aktuell[0]["x2"]) - float(aktuell[0]["x1"])) > 100, kurs

    assert modul._grenzabschnitt(.2, .2, -.9) is None
    assert modul._grenzabschnitt(0, 0, -.5) is None
    assert modul._grenzabschnitt(1, 0, -.5) == ((.5, -.4), (.5, 1.4))
    assert modul._grenzabschnitt(0, 1, -.5) == ((-.4, .5), (1.4, .5))
    print(f"PASS {kurs}: dritte Korrektur ausserhalb, vierte Linie sichtbar")


if __name__ == "__main__":
    for kurs in KURSE:
        testen(kurs)
