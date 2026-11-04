"""Build course-scoped notebook copies with shared Python runtime.

Each course owns portal/<teacher>/<grade>-klasse/ notebooks and helper files.
"""
from pathlib import Path
import json
import re
import shutil

ROOT = Path(__file__).resolve().parents[1]
REGISTRY = json.loads((ROOT / "kurse/bok/4-klasse/content/experiments.json").read_text(encoding="utf-8"))
REGISTERED = [entry["source"] for entry in REGISTRY]
if len({Path(path).name for path in REGISTERED}) != len(REGISTERED) or sum(bool(e.get("project")) for e in REGISTRY) != 1:
    raise ValueError("Experiments need unique notebook names and exactly one project")


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
                # A local notebook's imports MUST resolve to its teacher-owned
                # helper code before falling back to shared platform modules.
                setup += (f"_workspace = _basis / 'portal' / {workspace!r}\n"
                          "sys.path[:0] = [str(_workspace), str(_workspace / 'ki_projekt'), "
                          "str(_basis), str(_basis / 'ki_projekt')]\n")
            else:
                setup += "sys.path[:0] = [str(_basis), str(_basis / 'ki_projekt')]\n"
            cell.source = setup + cell.source
            cell.metadata["jupyter"] = {"source_hidden": True}
            first = False
    nb.metadata["ki_source"] = source_label
    nbformat.validate(nb)
    target.parent.mkdir(parents=True, exist_ok=True)
    nbformat.write(nb, target)


def build():
    """Stage isolated JupyterLite workspaces entirely from kurse/."""
    staging = ROOT / "_build/content"
    if staging.exists():
        shutil.rmtree(staging)
    out = staging / "portal"
    out.mkdir(parents=True)
    courses = json.loads((ROOT / "shared/course-sites.json").read_text(encoding="utf-8"))["courses"]
    copied = 0
    for course in courses:
        source = ROOT / course["courseRoot"] / "content"
        if not source.is_dir():
            raise FileNotFoundError(source)
        workspace = out / course["slug"]
        workspace.mkdir(parents=True)
        notebooks = sorted(source.rglob("*.ipynb"))
        names = [path.name for path in notebooks]
        if not notebooks or len(names) != len(set(names)):
            raise ValueError(f"Missing or duplicate notebook names in {course['slug']}")
        for asset in sorted(source.rglob("*")):
            if not asset.is_file() or asset.is_symlink() or asset.suffix == ".ipynb":
                continue
            target = workspace / asset.relative_to(source)
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(asset, target)
        for notebook in notebooks:
            prepare_notebook(notebook, workspace / notebook.name,
                             source_label=notebook.relative_to(source).as_posix(),
                             workspace=course["slug"])
            copied += 1
    print(f"Generated {copied} independent course notebooks and their assets")


if __name__ == "__main__":
    build()
