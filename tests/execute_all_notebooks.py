"""Execute every code cell of all registered teaching notebooks, including optional sections.

Runs locally with the CI Python packages, not as a replacement for browser/Pyodide tests.
Browser-only file upload remains covered by check_ki_basis and Chromium tests.
"""
import io
import json
import sys
from contextlib import redirect_stdout, redirect_stderr
from pathlib import Path
import nbformat
import matplotlib
matplotlib.use("Agg")
from IPython.core.interactiveshell import InteractiveShell

ROOT = Path(__file__).resolve().parents[1]
sys.path[:0] = [str(ROOT / "content"), str(ROOT / "content/ki_projekt")]
# The registry is the single source of truth: newly separated exercises must
# never escape the full notebook execution check.
PATHS = [e["source"] for e in json.loads((ROOT / "experimente/registry.json").read_text())]

def run_notebook(path):
    shell = InteractiveShell.instance()
    shell.reset(new_session=True)
    nb = nbformat.read(ROOT / "content" / path, as_version=4)
    executed = 0
    for index, cell in enumerate(nb.cells, 1):
        if cell.cell_type != "code":
            continue
        source = cell.source
        # Standalone-only cells also run; optional exercises must not be silently skipped.
        try:
            with redirect_stdout(io.StringIO()), redirect_stderr(io.StringIO()):
                result = shell.run_cell(source, store_history=False)
            if result.error_before_exec or result.error_in_exec:
                raise result.error_before_exec or result.error_in_exec
        except Exception as exc:
            raise AssertionError(f"{path}: code cell {index} failed: {exc}") from exc
        executed += 1
    assert executed == sum(c.cell_type == "code" for c in nb.cells)
    print(f"PASS {path}: executed all {executed} code cells (including optional sections)")

if __name__ == "__main__":
    for name in PATHS:
        run_notebook(name)
