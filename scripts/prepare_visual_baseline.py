"""Materialise the unmodified PR #12 page for before/after browser layout comparison."""
from pathlib import Path
import shutil
import subprocess
import sys

BASELINE = "6eec070d9135f20e0609af4f24a8c47fdd58d61e"  # merge commit of PR #12
ROOT = Path(__file__).resolve().parents[1]


def git(*args, **kwargs):
    return subprocess.run(("git", *args), cwd=ROOT, check=True, **kwargs)


def main():
    dist = ROOT / (sys.argv[1] if len(sys.argv) > 1 else "dist")
    current = dist / "projekt"
    if not (current / "index.html").is_file():
        raise SystemExit("Build the JupyterLite site before preparing visual baseline")
    try:
        git("cat-file", "-e", BASELINE + "^{commit}", stdout=subprocess.DEVNULL)
    except subprocess.CalledProcessError:
        git("fetch", "--no-tags", "--depth=1", "origin", BASELINE)
    target = dist / "baseline"
    shutil.copytree(current, target, dirs_exist_ok=True)
    for name in ("index.html", "portal.js", "progress.js", "portal.css", "archive.js"):
        data = subprocess.check_output(
            ("git", "show", f"{BASELINE}:projekt/{name}"), cwd=ROOT
        )
        (target / name).write_bytes(data)
    print("Prepared PR #12 layout baseline at", target)


if __name__ == "__main__":
    main()
