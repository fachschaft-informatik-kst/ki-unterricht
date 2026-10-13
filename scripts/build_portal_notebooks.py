"""Preserve teaching explanations and portable image attachments in embedded notebooks."""
from pathlib import Path
import re
import nbformat

ROOT = Path(__file__).resolve().parents[1]
ITEMS = [
    'perzeptron_und_neuronale_netze.ipynb', 'mehrschichtige_netze.ipynb',
    'daten_training.ipynb', 'ki_projekt/ki_lernlabor.ipynb',
    'ki_projekt/ki_tandemprojekt.ipynb',
]

def build():
    out = ROOT / 'content/portal'
    out.mkdir(exist_ok=True)
    targets = {Path(s).name for s in ITEMS} | {'ki_workspace.ipynb'}
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
    workspace = nbformat.v4.new_notebook(cells=[nbformat.v4.new_markdown_cell('Python wird vorbereitet …')])
    workspace.metadata['kernelspec'] = nb.metadata['kernelspec']
    workspace.metadata['language_info'] = nb.metadata['language_info']
    nbformat.write(workspace, out/'ki_workspace.ipynb')
    print(f'Generated {len(ITEMS)} teaching notebooks and one internal workspace')

if __name__ == '__main__':
    build()
