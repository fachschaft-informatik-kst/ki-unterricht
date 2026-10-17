"""Preserve teaching explanations and portable image attachments in embedded notebooks."""
from pathlib import Path
import re
import nbformat
import json
import shutil

ROOT = Path(__file__).resolve().parents[1]
REGISTRY = json.loads((ROOT / "experimente/registry.json").read_text(encoding="utf-8"))
ITEMS = [e["source"] for e in REGISTRY]
if len({Path(p).name for p in ITEMS}) != len(ITEMS) or sum(bool(e.get("project")) for e in REGISTRY) != 1:
    raise ValueError("Experiments need unique notebook names and exactly one project")

def build():
    staging = ROOT / '_build/content'
    if staging.exists():
        shutil.rmtree(staging)
    shutil.copytree(ROOT / 'content', staging, dirs_exist_ok=True,
                    ignore=shutil.ignore_patterns('portal', '__pycache__', '.ipynb_checkpoints'))
    out = staging / 'portal'
    out.mkdir(exist_ok=True)
    targets = {Path(s).name for s in ITEMS}
    for stale in out.glob('*.ipynb'):
        if stale.name not in targets:
            stale.unlink()  # This directory contains generated files only.
    for source in ITEMS:
        nb = nbformat.read(ROOT/'content'/source, as_version=4)
        nb.cells = [c for c in nb.cells if 'ki-standalone-only' not in c.metadata.get('tags', [])]
        first = True
        for cell in nb.cells:
            if cell.cell_type == 'markdown':
                cell.source = re.sub(r'\[([^]]+)\]\((?:ki_projekt/)?[^/)]+\.ipynb\)', r'**\1** (über die Kursnavigation)', cell.source)
                continue
            if cell.cell_type != 'code':
                continue
            cell.outputs = []
            cell.execution_count = None
            if first:
                cell.source = ('from pathlib import Path\nimport sys\n'
                    '_basis = Path.cwd().parent if Path.cwd().name == "portal" else Path.cwd()\n'
                    'sys.path[:0] = [str(_basis), str(_basis / "ki_projekt")]\n' + cell.source)
                cell.metadata['jupyter'] = {'source_hidden': True}
                first = False
        nb.metadata['ki_source'] = source
        nbformat.validate(nb)
        nbformat.write(nb, out / Path(source).name)
    print(f'Generated {len(ITEMS)} teaching notebooks')

if __name__ == '__main__':
    build()
