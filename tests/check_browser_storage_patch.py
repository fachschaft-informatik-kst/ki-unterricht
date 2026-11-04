"""Verify the pinned storage patch is idempotent and fails on upstream changes."""
from pathlib import Path
import sys
from tempfile import TemporaryDirectory

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from patch_browser_storage import BUNDLE, REPLACEMENTS, patch_bundle, patch_source


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
    patch_bundle(site)
    assert bundle.read_text(encoding="utf-8") == patched
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

print("PASS storage patch guards, idempotence, upstream rejection and atomic validation")
