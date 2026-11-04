"""Package independently owned course assets with one shared JupyterLite runtime."""
from pathlib import Path
import shutil
import sys

from fix_pyodide_lock import fix_lock
from patch_pyodide_kernel import patch_bundle
from build_previews import build_previews
from build_course_routes import build as build_course_routes
from course_registry import load_registry
from protect_teacher_pages import protect

root = Path(__file__).resolve().parents[1]
out = Path(sys.argv[1] if len(sys.argv) > 1 else root / "dist")
fix_lock(out)

# Internal template assets and shared editor. Neither has a public course index.
shutil.copytree(root / "_build/site/projekt", out / "projekt", dirs_exist_ok=True)
shutil.copytree(root / "_build/site/basis", out / "basis", dirs_exist_ok=True)
patch_bundle(out)
build_course_routes(out)

for course in load_registry(root):
    if course["status"] != "published":
        continue
    source = root / course["courseRoot"] / "content"
    target = out / course["slug"]
    studio = target / "studio"
    studio.mkdir(exist_ok=True)
    for filename in ("fotostudio_core.js", "fotostudio_storage.js"):
        shutil.copy2(source / "ki_projekt" / filename, studio / filename)
    shutil.copy2(source / "ki_projekt/fotostudio.html", studio / "index.html")
    runtime = target / "runtime"
    runtime.mkdir(exist_ok=True)
    for filename in ("ki_foto_tools.py", "ki_projekt_tools.py", "foto_uebungsdaten.json"):
        shutil.copy2(source / "ki_projekt" / filename, runtime / filename)
    shutil.copy2(source / "unterricht_tools.py", runtime / "unterricht_tools.py")
    build_previews(target, source)

protect(out)
for old in ("basis", "projekt"):
    (out / old / "index.html").unlink(missing_ok=True)
