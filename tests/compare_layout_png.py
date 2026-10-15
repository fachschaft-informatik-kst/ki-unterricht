"""Compare pairs of Chromium screenshot PNGs with a small anti-aliasing tolerance."""
from PIL import Image, ImageChops
from pathlib import Path
import sys

files = sys.argv[1:]
if not files or len(files) % 2:
    raise SystemExit("Pass original and new PNGs in pairs")
for old_path, new_path in zip(files[::2], files[1::2]):
    old = Image.open(old_path).convert("RGB")
    new = Image.open(new_path).convert("RGB")
    if old.size != new.size:
        raise AssertionError(f"{Path(old_path).name}: screenshot size {old.size} != {new.size}")
    diff = ImageChops.difference(old, new)
    changed = sum(1 for rgb in diff.getdata() if max(rgb) > 20)
    fraction = changed / (old.width * old.height)
    if fraction > 0.008:
        raise AssertionError(
            f"{Path(old_path).name}: {fraction:.3%} of pixels changed (max 0.8%)"
        )
    print(f"PASS {Path(old_path).name}: {fraction:.3%} differing pixels")
