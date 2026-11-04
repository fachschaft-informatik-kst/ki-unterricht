"""Only course-owned source files are tracked; compatibility mirrors are generated."""
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[1]
roots = ("kursseiten", "lehrperson", "content")
tracked = subprocess.check_output(["git", "ls-files", "--", *roots], cwd=ROOT, text=True).splitlines()
assert not tracked, "Obsolete tracked root sources: " + ", ".join(tracked[:10])
for name in roots:
    assert (ROOT / name).is_dir(), f"Run sync_course_sources.py first: {name}"
    result = subprocess.run(["git", "check-ignore", "-q", name], cwd=ROOT, check=False)
    assert result.returncode == 0, f"Compatibility mirror must be ignored: {name}"
canonical = ROOT / "kurse/bok/4-klasse/content"
mirror = ROOT / "content"
files = [p for p in canonical.rglob("*") if p.is_file()]
assert files, "Missing canonical notebook sources"
for original in files:
    path = mirror / original.relative_to(canonical)
    assert path.is_file() and path.read_bytes() == original.read_bytes(), original
for grade in (1, 4):
    source = ROOT / f"kurse/bok/{grade}-klasse/kursseiten/manifest.json"
    target = ROOT / "kursseiten" / ("basis-manifest.json" if grade == 1 else "manifest.json")
    assert target.read_bytes() == source.read_bytes(), target
print(f"PASS {len(files)} runtime files and BOK manifests regenerated, no tracked root mirrors")
