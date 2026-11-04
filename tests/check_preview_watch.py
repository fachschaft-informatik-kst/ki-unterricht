"""Fast preview must watch canonical teacher sources, never their generated mirrors."""
from __future__ import annotations

import os
import sys
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import preview

with TemporaryDirectory() as temp:
    root = Path(temp)
    course = root / "kurse/bok/1-klasse/kursseiten/basis-neuron/010-start.md"
    legacy = root / "kursseiten/basis-neuron/010-start.md"
    for file in (course, legacy):
        file.parent.mkdir(parents=True, exist_ok=True)
        file.write_text("Ausgangstext", encoding="utf-8")
    with patch.object(preview, "ROOT", root):
        original = preview.fingerprints()
        assert str(course) in original, "Live preview must watch the canonical course"
        assert str(legacy) not in original, "Mirrors must not trigger repeated builds"
        stamp = legacy.stat().st_mtime_ns
        os.utime(legacy, ns=(stamp + 5_000_000, stamp + 5_000_000))
        assert preview.fingerprints() == original, "Build-produced mirrors should not retrigger builds"
        stamp = course.stat().st_mtime_ns
        os.utime(course, ns=(stamp + 5_000_000, stamp + 5_000_000))
        assert preview.fingerprints() != original, "Course edits must retrigger the preview"

print("PASS preview watches per-teacher sources without a mirror feedback loop")
