"""A course builds without any other teacher's sources or root mirrors."""
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import patch
import json
import shutil
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

import build_basis
import build_course_routes
import build_portal
import build_portal_notebooks
import build_teacher_clone
from course_registry import load_registry

for obsolete in ("basis", "projekt", "content", "kursseiten", "lehrperson",
                 "experimente", "worksheets", "testbilder", "templates"):
    assert not (ROOT / obsolete).exists(), f"Root mirror remains: {obsolete}"

courses = load_registry()
for course in courses:
    with TemporaryDirectory() as temp:
        root = Path(temp)
        base = root / course["courseRoot"]
        shutil.copytree(ROOT / "shared", root / "shared")
        shutil.copytree(ROOT / course["courseRoot"], base,
                        ignore=shutil.ignore_patterns("__pycache__", ".ipynb_checkpoints"))
        (root / "shared/course-sites.json").write_text(
            json.dumps({"version": 1, "courses": [course]}), encoding="utf-8")
        for name in ("kurse.html", "portal-index.html"):
            shutil.copy2(ROOT / name, root / name)
        marker = "isolated-" + course["id"]
        image = base / "projekt/grafiken/kst_logo.png"
        image.write_bytes(marker.encode())
        registry = base / "experimente/registry.json"
        entries = json.loads(registry.read_text(encoding="utf-8"))
        entries[0]["title"] = marker
        registry.write_text(json.dumps(entries), encoding="utf-8")
        legacy = root / "site/projekt/obsolete-course-data.json"
        legacy.parent.mkdir(parents=True)
        legacy.write_text("stale course content", encoding="utf-8")
        with (patch.object(build_course_routes, "ROOT", root),
              patch.object(build_teacher_clone, "ROOT", root),
              patch.object(build_basis, "ROOT", root),
              patch.object(build_basis, "SOURCE", root / "shared/basis"),
              patch.object(build_portal, "ROOT", root),
              patch.object(build_portal, "PORTAL", root / "shared/portal"),
              patch.object(build_portal_notebooks, "ROOT", root)):
            build_course_routes.build(root / "site")
            build_portal_notebooks.build()
        target = root / "site" / course["slug"]
        assert not legacy.exists(), "A repeated build must remove obsolete shared course data"
        assert (target / "grafiken/kst_logo.png").read_bytes() == marker.encode()
        assert json.loads((target / "experiments.json").read_text())[0]["title"] == marker
        assert (target / "studio/fotostudio_core.js").read_bytes() == (
            base / "content/ki_projekt/fotostudio_core.js").read_bytes()
        assert (target / "runtime/unterricht_tools.py").read_bytes() == (
            base / "content/unterricht_tools.py").read_bytes()
        page = (target / "index.html").read_text(encoding="utf-8")
        assert "data-course-theme" in page
        assert not (target / "admin").exists()
        assert (root / "_build/content/portal" / course["slug"] / "unterricht_tools.py").is_file()
        for other in courses:
            if other["id"] != course["id"]:
                assert not (root / "site" / other["slug"]).exists()
        print(f"PASS {course['slug']}: builds alone with its own assets, registry and runtime")
