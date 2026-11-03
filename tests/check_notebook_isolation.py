"""Post-build regression: notebook and helper code never cross teacher course roots."""
from __future__ import annotations

import json
from pathlib import Path
import nbformat

ROOT = Path(__file__).resolve().parents[1]
out = ROOT / "_build/content/portal"
courses = json.loads((ROOT / "shared/course-sites.json").read_text(encoding="utf-8"))["courses"]
assert out.is_dir(), "Run build_portal_notebooks.py first"

for course in courses:
    if course["teacher"] == "BOK":
        continue
    sources = ROOT / course["courseRoot"] / "content"
    target = out / course["slug"]
    assert target.is_dir(), course["slug"]
    modules = sorted(path for path in sources.rglob("*")
                     if path.is_file() and path.suffix != ".ipynb")
    assert modules, course["slug"]
    for file in modules:
        assert (target / file.relative_to(sources)).read_bytes() == file.read_bytes(), file
    notebooks = sorted(sources.rglob("*.ipynb"))
    assert notebooks, course["slug"]
    for file in notebooks:
        published = target / file.name
        assert published.is_file(), str(published)
        nb = nbformat.read(published, as_version=4)
        assert nb.metadata["ki_source"] == file.relative_to(sources).as_posix()
        executable = [c for c in nb.cells if c.cell_type == "code"]
        if executable:
            code = executable[0].source
            assert "_workspace = _basis / 'portal' / " in code, file
            assert course["slug"] in code, file
            assert "sys.path[:0] = [str(_workspace)" in code, file
    print(f"PASS {course['slug']}: {len(notebooks)} notebooks, "
          f"{len(modules)} independent helper/data files")
print("PASS notebook runtime isolation with shared Pyodide runtime")
