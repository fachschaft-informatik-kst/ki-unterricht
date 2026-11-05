"""Test IPython 9 kernel API compatibility without a WASM browser build."""
from pathlib import Path
from tempfile import TemporaryDirectory
from zipfile import ZipFile
import csv
import io
import json
import hashlib
import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from patch_pyodide_kernel import patch_bundle, patch_python

original = """async def run(self, code):
    exec_code = self.interpreter.transform_cell(code)
    if self.interpreter.should_run_async(code):
        await self.interpreter.run_cell_async(code, store_history=True)
"""
patched = patch_python(original)
assert "transformed_cell=exec_code" in patched
assert patched.count("transformed_cell=exec_code") == 2
assert patch_python(patched) == patched

with TemporaryDirectory() as root:
    site = Path(root)
    folder = site / "extensions/@jupyterlite/pyodide-kernel-extension/static/pypi"
    folder.mkdir(parents=True)
    wheel = folder / "pyodide_kernel-0.5.0-py3-none-any.whl"
    with ZipFile(wheel, "w") as z:
        z.writestr("pyodide_kernel/kernel.py", original)
        z.writestr("pyodide_kernel-0.5.0.dist-info/RECORD",
                   "pyodide_kernel/kernel.py,,\npyodide_kernel-0.5.0.dist-info/RECORD,,\n")
    index = folder / "all.json"
    index.write_text(json.dumps({"releases": {"0.5.0": [
        {"filename": wheel.name, "digests": {"sha256": "old"}}]}}))
    config = site / "jupyter-lite.json"
    config.write_text(json.dumps({"jupyter-config-data": {"litePluginSettings": {
        "@jupyterlite/pyodide-kernel-extension:kernel": {
            "pipliteUrls": [f"./{index.relative_to(site)}?sha256=old"]
        }
    }}}))
    static = folder.parent
    worker = static / "352.test.js"
    worker.write_text('/*! license */\n(()=>{importScripts(url);self.loadPyodide({});})();\n')
    app_chunk = static / "288.test.js"
    app_chunk.write_text('(self.webpackChunk_x=self.webpackChunk_x||[]).push([[288],{}]);importScripts(url);loadPyodide;')
    try:
        patch_bundle(site.joinpath("missing")); raise AssertionError("A bundle without a kernel must be rejected")
    except (ValueError, OSError):
        pass
    patch_bundle(site)
    once = wheel.read_bytes()
    patched_worker = worker.read_text()
    patch_bundle(site)
    assert once == wheel.read_bytes(), "Must be idempotent"
    assert worker.read_text() == patched_worker and patched_worker.count("ki-fetch-retry") == 1
    assert patched_worker.startswith("/*ki-fetch-retry*/") and "self.fetch=g" in patched_worker
    assert "ki-fetch-retry" not in app_chunk.read_text(), "Only the standalone worker may be patched"
    with ZipFile(wheel) as z:
        assert "transformed_cell=exec_code" in z.read("pyodide_kernel/kernel.py").decode()
        rows = list(csv.reader(io.StringIO(z.read("pyodide_kernel-0.5.0.dist-info/RECORD").decode())))
        assert rows[0][2] == str(len(z.read("pyodide_kernel/kernel.py")))
        assert rows[0][1].startswith("sha256=")
    digest = hashlib.sha256(once).hexdigest()
    assert json.loads(index.read_text())["releases"]["0.5.0"][0]["digests"]["sha256"] == digest
    assert "sha256=" + hashlib.sha256(index.read_bytes()).hexdigest() in config.read_text()
print("PASS wheel patch, wheel RECORD, piplite sha256, cache hashes, worker fetch retry and idempotence")
