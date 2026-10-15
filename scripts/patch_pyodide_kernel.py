"""Fix the outdated IPython async API in JupyterLite 0.5's bundled kernel wheel.

JupyterLite 0.5 calls should_run_async(code) without transformed_cell. IPython 9
raises TypeError. Patch the *distribution wheel*, not students' notebooks, and
update the wheel RECORD + Piplite index hashes + JupyterLite URL fingerprints.
Refuse unfamiliar upstream source layouts instead of silently corrupting builds.
"""
from __future__ import annotations

import base64
import csv
import hashlib
import io
import json
from pathlib import Path
import re
from urllib.parse import urlsplit, urlunsplit, parse_qsl, urlencode
from zipfile import ZipFile


WHEEL_PATTERN = "pyodide_kernel-0.5.0-py3-none-any.whl"
KERNEL_FILE = "pyodide_kernel/kernel.py"
OLD_ASYNC = "self.interpreter.should_run_async(code)"
NEW_ASYNC = ("self.interpreter.should_run_async(\n"
             "                code,\n"
             "                transformed_cell=exec_code,\n"
             "            )")
OLD_RUN = "self.interpreter.run_cell_async(code, store_history=True)"
NEW_RUN = ("self.interpreter.run_cell_async(\n"
           "                    code,\n"
           "                    store_history=True,\n"
           "                    transformed_cell=exec_code,\n"
           "                )")


def sha(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def patch_python(src: str) -> str:
    """Use the existing *already transformed* cell in both async APIs."""
    if NEW_ASYNC in src and NEW_RUN in src:
        return src
    if src.count(OLD_ASYNC) != 1 or src.count(OLD_RUN) != 1:
        raise ValueError("Unexpected pyodide-kernel 0.5.0 source; refusing patch")
    if "exec_code = self.interpreter.transform_cell(code)" not in src:
        raise ValueError("Missing upstream transform_cell; refusing patch")
    return src.replace(OLD_ASYNC, NEW_ASYNC).replace(OLD_RUN, NEW_RUN)


def patch_wheel(wheel: Path) -> str:
    source = wheel.read_bytes()
    with ZipFile(io.BytesIO(source)) as archive:
        files = {i.filename: (i, archive.read(i.filename)) for i in archive.infolist()}
    if KERNEL_FILE not in files:
        raise ValueError(f"No kernel implementation in {wheel}")
    old = files[KERNEL_FILE][1]
    changed = patch_python(old.decode("utf-8")).encode("utf-8")
    if changed == old:
        return sha(source)
    record_names = [name for name in files if name.endswith(".dist-info/RECORD")]
    if len(record_names) != 1:
        raise ValueError(f"Unexpected wheel RECORD: {record_names}")
    record = record_names[0]
    rows = list(csv.reader(io.StringIO(files[record][1].decode("utf-8"))))
    for row in rows:
        if row[0] == KERNEL_FILE:
            row[1] = "sha256=" + base64.urlsafe_b64encode(
                hashlib.sha256(changed).digest()
            ).decode("ascii").rstrip("=")
            row[2] = str(len(changed))
            break
    else:
        raise ValueError("Kernel missing from wheel RECORD")
    new_record = io.StringIO()
    csv.writer(new_record, lineterminator="\n").writerows(rows)
    data = io.BytesIO()
    with ZipFile(data, "w") as archive:
        for name, (info, content) in files.items():
            archive.writestr(
                info, changed if name == KERNEL_FILE else
                new_record.getvalue().encode("utf-8") if name == record else content
            )
    wheel.write_bytes(data.getvalue())
    return sha(data.getvalue())


def patch_digest_entries(payload, filename: str, digest: str) -> int:
    """Rewrite PyPI-style metadata for precisely the bundled patched wheel."""
    updated = 0

    def visit(node):
        nonlocal updated
        if isinstance(node, dict):
            references_wheel = any(
                isinstance(v, str) and filename in v for v in node.values()
            )
            if references_wheel:
                for name in ("digests", "hashes"):
                    data = node.get(name)
                    if isinstance(data, dict) and isinstance(data.get("sha256"), str):
                        data["sha256"] = digest
                        updated += 1
                if isinstance(node.get("sha256"), str):
                    node["sha256"] = digest
                    updated += 1
            for value in node.values():
                visit(value)
        elif isinstance(node, list):
            for value in node:
                visit(value)

    visit(payload)
    return updated


def update_query_hash(raw: str, new_hash: str) -> str:
    url = urlsplit(raw)
    params = dict(parse_qsl(url.query, keep_blank_values=True))
    params["sha256"] = new_hash
    return urlunsplit((url.scheme, url.netloc, url.path, urlencode(params), url.fragment))


def patch_bundle(site: Path) -> None:
    site = Path(site)
    wheels = list(site.rglob(WHEEL_PATTERN))
    if not wheels:
        raise ValueError(f"No bundled {WHEEL_PATTERN} found in {site}")
    print("Fixing bundled pyodide-kernel for IPython 8/9")
    wheel_hashes = {}
    for wheel in wheels:
        digest = patch_wheel(wheel)
        wheel_hashes[wheel.name] = digest
        print("Validated patched wheel:", wheel.relative_to(site), digest[:12])

    # Extension piplite indices are referenced by hashed URLs in jupyter-lite.json.
    index_hashes = {}
    updated_indices = 0
    for index in site.rglob("all.json"):
        obj = json.loads(index.read_text(encoding="utf-8"))
        changes = patch_digest_entries(obj, WHEEL_PATTERN, wheel_hashes[WHEEL_PATTERN])
        if changes:
            index.write_text(json.dumps(obj, indent=2) + "\n", encoding="utf-8")
            updated_indices += 1
            index_hashes[index.name] = sha(index.read_bytes())
            print("Updated wheel index:", index.relative_to(site), changes)

    if updated_indices == 0:
        raise ValueError("No matching index digest for patched Pyodide kernel wheel")

    config_path = site / "jupyter-lite.json"
    data = json.loads(config_path.read_text(encoding="utf-8"))
    kernels = data["jupyter-config-data"]["litePluginSettings"]
    settings = kernels["@jupyterlite/pyodide-kernel-extension:kernel"]
    urls = settings.get("pipliteUrls", [])
    matching = [i for i, u in enumerate(urls) if "all.json" in urlsplit(u).path]
    if not matching:
        raise ValueError("Missing extension pipliteUrls for patched wheel")
    for i in matching:
        urls[i] = update_query_hash(urls[i], index_hashes["all.json"])
    # The offline resolver may also embed the kernel wheel metadata.
    lock_url = settings.get("loadPyodideOptions", {}).get("lockFileURL")
    if lock_url:
        lock_path = (site / urlsplit(lock_url).path).resolve()
        if not lock_path.is_relative_to(site.resolve()):
            raise ValueError("Unsafe offline lockfile path")
        lock = json.loads(lock_path.read_text(encoding="utf-8"))
        if patch_digest_entries(lock, WHEEL_PATTERN, wheel_hashes[WHEEL_PATTERN]):
            lock_path.write_text(json.dumps(lock, indent=2) + "\n", encoding="utf-8")
            settings["loadPyodideOptions"]["lockFileURL"] = update_query_hash(
                lock_url, sha(lock_path.read_bytes())
            )
    config_path.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    import sys
    patch_bundle(Path(sys.argv[1] if len(sys.argv) > 1 else "dist"))
