"""Validate every course-owned notebook structurally, not its authored wording.

The actual Python browser runtime and ZIP integration use separate technical
tests. CI must not execute teachers' manually edited learning examples.
"""
from pathlib import Path
import ast
import json
import nbformat

ROOT = Path(__file__).resolve().parents[1]
courses = json.loads((ROOT / "shared/course-sites.json").read_text(encoding="utf-8"))["courses"]
count = 0
for course in courses:
    source = ROOT / course["courseRoot"] / "content"
    notebooks = sorted(source.rglob("*.ipynb"))
    if not notebooks:
        raise AssertionError(f"No notebooks in {course['slug']}")
    for path in notebooks:
        nb = nbformat.read(path, as_version=4)
        nbformat.validate(nb)
        for cell in nb.cells:
            if cell.cell_type != "code":
                continue
            code = cell.source.strip()
            if not code or code.startswith(("%%", "%", "!")):
                continue
            try:
                ast.parse(code, filename=str(path))
            except SyntaxError as exc:
                raise AssertionError(f"Invalid Python in {path}: {exc}") from exc
        count += 1
    print(f"PASS {course['slug']}: {len(notebooks)} notebooks")
print(f"PASS {count} course-owned notebooks structurally valid")
