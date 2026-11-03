"""Build course-scoped notebook copies with shared Python runtime.

Old BOK JupyterLite paths (portal/<filename>) are retained so saved states and
existing URLs continue to resolve. IRN/new teachers use portal/<slug>/<filename>.
"""
from pathlib import Path
import json
import re
import shutil

ROOT = Path(__file__).resolve().parents[1]
REGISTRY = json.loads((ROOT / "experimente/registry.json").read_text(encoding="utf-8"))
REGISTERED = [entry["source"] for entry in REGISTRY]
if len({Path(path).name for path in REGISTERED}) != len(REGISTERED) or sum(bool(e.get("project")) for e in REGISTRY) != 1:
    raise ValueError("Experiments need unique notebook names and exactly one project")


def prepare_notebook(source: Path, target: Path, *, source_label: str) -> None:
    import nbformat

    nb = nbformat.read(source, as_version=4)
    nb.cells = [cell for cell in nb.cells if "ki-standalone-only" not in cell.metadata.get("tags", [])]
    first = not source.name.startswith(("lesson_", "basis_lesson_"))
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
            cell.source = ("from pathlib import Path\nimport sys\n"
                "_basis = Path.cwd()\n"
                "while _basis.name != 'portal' and _basis != _basis.parent:\n"
                "    _basis = _basis.parent\n"
                "_basis = _basis.parent if _basis.name == 'portal' else Path.cwd()\n"
                "sys.path[:0] = [str(_basis), str(_basis / 'ki_projekt')]\n" + cell.source)
            cell.metadata["jupyter"] = {"source_hidden": True}
            first = False
    nb.metadata["ki_source"] = source_label
    nbformat.validate(nb)
    target.parent.mkdir(parents=True, exist_ok=True)
    nbformat.write(nb, target)


def build():
    staging = ROOT / "_build/content"
    if staging.exists():
        shutil.rmtree(staging)
    shutil.copytree(ROOT / "content", staging,
                    ignore=shutil.ignore_patterns("portal", "__pycache__", ".ipynb_checkpoints"))
    out = staging / "portal"
    out.mkdir(exist_ok=True)
    courses = json.loads((ROOT / "shared/course-sites.json").read_text(encoding="utf-8"))["courses"]
    copied = 0
    # Keep all existing BOK entrypoint notebook names, including the old first
    # and fourth-year shared examples, preserving browser state compatibility.
    for item in REGISTERED:
        filename = Path(item).name
        grade = 1 if filename.startswith("basis_") else 4
        source = ROOT / "kurse" / "bok" / f"{grade}-klasse" / "content" / item
        if not source.is_file():
            raise FileNotFoundError(source)
        prepare_notebook(source, out / filename, source_label=item)
        copied += 1
    for course in courses:
        root = ROOT / course["courseRoot"] / "content"
        if not root.is_dir():
            raise FileNotFoundError(root)
        paths = sorted(root.rglob("*.ipynb"))
        # Newly authored per-course notebooks are not in the global registry.
        if course["teacher"] == "BOK":
            for item in paths:
                if not item.name.startswith(("basis_lesson_", "lesson_")):
                    continue
                if course["grade"] == 1 and not item.name.startswith("basis_"):
                    continue
                if course["grade"] == 4 and item.name.startswith("basis_"):
                    continue
                prepare_notebook(item, out / item.name,
                                 source_label=item.relative_to(root).as_posix())
                copied += 1
            continue
        for item in paths:
            relative = item.relative_to(root)
            target = out / course["slug"] / relative.name
            prepare_notebook(item, target, source_label=relative.as_posix())
            copied += 1
    print(f"Generated {copied} course notebooks, preserving legacy BOK paths")


if __name__ == "__main__":
    build()
