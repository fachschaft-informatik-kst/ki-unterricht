"""Package course-owned resources and shared UI into the JupyterLite build."""
from pathlib import Path
import sys

from build_course_routes import build
from build_previews import build_previews
from course_registry import load_registry
from fix_pyodide_lock import fix_lock
from patch_pyodide_kernel import patch_bundle
from protect_teacher_pages import protect

ROOT = Path(__file__).resolve().parents[1]


def main() -> None:
    out = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "dist"
    fix_lock(out)
    courses = load_registry(ROOT)
    build(out, courses)
    build_previews(out, courses)
    patch_bundle(out)
    protect(out)
    for obsolete in ("basis", "projekt"):
        (out / obsolete / "index.html").unlink(missing_ok=True)


if __name__ == "__main__":
    main()
