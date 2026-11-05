"""Verify the pinned storage patch is idempotent and fails on upstream changes."""
from pathlib import Path
import sys
from tempfile import TemporaryDirectory

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from patch_browser_storage import (
    BUNDLE, REPLACEMENTS, patch_bundle, patch_source, replace_once,
    DRIVE_REQUEST, CORRELATED_REQUEST, DRIVE_WORKERS, DRIVE_REPLY, CORRELATED_REPLY,
    CORE_DRIVE, CORE_REPLY, CORE_CORRELATED_REPLY,
)


original = ";\n".join(old for old, _ in REPLACEMENTS)
patched = patch_source(original)
assert patched == ";\n".join(new for _, new in REPLACEMENTS)
assert patch_source(patched) == patched

for invalid in ("", original + original, patched + original,
                original.replace(REPLACEMENTS[0][0], "upstream_changed")):
    try:
        patch_source(invalid)
    except ValueError:
        pass
    else:
        raise AssertionError("Unknown or duplicated source must fail the build")

with TemporaryDirectory() as temporary:
    site = Path(temporary)
    bundle = site / BUNDLE
    bundle.parent.mkdir()
    bundle.write_text(original, encoding="utf-8")
    service_worker = site / "service-worker.js"
    service_worker.write_text(DRIVE_REQUEST, encoding="utf-8")
    core = site / CORE_DRIVE
    core.write_text(CORE_REPLY, encoding="utf-8")
    for name, count in DRIVE_WORKERS.items():
        worker = site / "extensions/@jupyterlite/pyodide-kernel-extension/static" / name
        worker.parent.mkdir(parents=True, exist_ok=True)
        worker.write_text(";\n".join([DRIVE_REPLY] * count), encoding="utf-8")
    patch_bundle(site)
    assert bundle.read_text(encoding="utf-8") == patched
    assert service_worker.read_text(encoding="utf-8") == CORRELATED_REQUEST
    assert core.read_text(encoding="utf-8") == CORE_CORRELATED_REPLY
    for name, count in DRIVE_WORKERS.items():
        worker = site / "extensions/@jupyterlite/pyodide-kernel-extension/static" / name
        assert worker.read_text(encoding="utf-8") == ";\n".join([CORRELATED_REPLY] * count)
    patch_bundle(site)
    assert bundle.read_text(encoding="utf-8") == patched
    bundle.write_text("upstream_changed", encoding="utf-8")
    try:
        patch_bundle(site)
    except ValueError:
        pass
    else:
        raise AssertionError("Unrecognized bundle must fail")
    assert bundle.read_text(encoding="utf-8") == "upstream_changed"

for old, new in ((DRIVE_REQUEST, CORRELATED_REQUEST), (DRIVE_REPLY, CORRELATED_REPLY)):
    assert replace_once(old, old, new) == new
    assert replace_once(new, old, new) == new
    for invalid in ("", old + old, new + old):
        try:
            replace_once(invalid, old, new)
        except ValueError:
            pass
        else:
            raise AssertionError("Unrecognized drive bridge must fail the build")

print("PASS storage patch guards, idempotence, upstream rejection and atomic validation")
