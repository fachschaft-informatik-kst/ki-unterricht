"""Build course-scoped notebook copies with shared Python runtime.

Old BOK JupyterLite paths (portal/<filename>) are retained so saved states and
existing URLs continue to resolve. IRN/new teachers use portal/<slug>/<filename>.
"""
from pathlib import Path
import json
import re
import shutil
from course_registry import load_registry, load_experiments

ROOT = Path(__file__).resolve().parents[1]


def prepare_notebook(source: Path, target: Path, *, source_label: str, workspace: str | None = None) -> None:
    import nbformat

    nb = nbformat.read(source, as_version=4)
    nb.cells = [cell for cell in nb.cells if "ki-standalone-only" not in cell.metadata.get("tags", [])]
    first = workspace is not None or not source.name.startswith(("lesson_", "basis_lesson_"))
    for cell in nb.cells:
        if cell.cell_type == "markdown":
            cell.source = re.sub(r"\[([^]]+)\]\((?:ki_projekt/)?[^/)]+\.ipynb\)",
                                 r"**\1** (über die Kursnavigation)", cell.source)
            continue
        if cell.cell_type != "code":
            continue
        cell.outputs = []
        cell.execution_count = None
        if first:
            setup = ("from pathlib import Path\nimport sys\n"
                "_basis = Path.cwd()\n"
                "while _basis.name != 'portal' and _basis != _basis.parent:\n"
                "    _basis = _basis.parent if _basis.name != 'portal' else _basis\n"
                "_basis = _basis.parent if _basis.name == 'portal' else Path.cwd()\n")
            if workspace:
                setup += (f"_workspace = _basis / 'portal' / {workspace!r}\n"
                          "sys.path[:0] = [str(_workspace), str(_workspace / 'ki_projekt')]\n")
            else:
                setup += "sys.path[:0] = [str(_basis), str(_basis / 'ki_projekt')]\n"
            cell.source = setup + cell.source
            cell.metadata["jupyter"] = {"source_hidden": True}
            first = False
    nb.metadata["ki_source"] = source_label
    nbformat.validate(nb)
    target.parent.mkdir(parents=True, exist_ok=True)
    nbformat.write(nb, target)


def build(courses: list[dict] | None = None):
    staging = ROOT / "_build/content"
    if staging.exists():
        shutil.rmtree(staging)
    out = staging / "portal"
    out.mkdir(parents=True)
    courses = load_registry(ROOT) if courses is None else courses
    copied = 0
    for course in courses:
        if course["status"] != "published":
            continue
        load_experiments(course, ROOT)
        root = ROOT / course["courseRoot"] / "content"
        if not root.is_dir():
            raise FileNotFoundError(root)
        paths = sorted(root.rglob("*.ipynb"))
        workspace = out / course["slug"]
        for asset in sorted(root.rglob("*")):
            if (not asset.is_file() or asset.is_symlink() or asset.suffix == ".ipynb"
                    or any(part in {"__pycache__", ".ipynb_checkpoints"} for part in asset.parts)):
                continue
            target = workspace / asset.relative_to(root)
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(asset, target)
        names = set()
        for item in paths:
            if item.name in names:
                raise ValueError(f"Doppelter Notebookname in {course['slug']}: {item.name}")
            names.add(item.name)
            relative = item.relative_to(root)
            target = workspace / relative.name
            prepare_notebook(item, target, source_label=relative.as_posix(),
                             workspace=course["slug"])
            # Preserve BOK document IDs used by existing browser saves and ZIPs.
            if course["teacher"] == "BOK" and item.name.startswith("basis_") == (course["grade"] == 1):
                shutil.copy2(target, out / item.name)
            copied += 1
    print(f"Generated {copied} course notebooks, preserving legacy BOK paths")


if __name__ == "__main__":
    build()
