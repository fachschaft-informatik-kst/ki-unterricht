"""Generate short embedded notebooks from the maintained teaching originals.
Run before jupyter lite build. Originals and teacher resources stay available.
"""
from pathlib import Path
import nbformat

ROOT = Path(__file__).resolve().parents[1]
ITEMS = {
 'lernarten.ipynb': ['Vorbereitung', 'Ohne Training spielen', 'Trainieren und vergleichen', 'Gegen die trainierte KI spielen'],
 'perzeptron_und_neuronale_netze.ipynb': ['Vorbereitung','Ein Neuron','Gewichte verändern','Ein Lernschritt'],
 'mehrschichtige_netze.ipynb': ['Vorbereitung','Das XOR-Netz'],
 'daten_training.ipynb': ['Vorbereitung','Daten fair aufteilen','Was läuft hier falsch?'],
 'klassifikation_ziffern.ipynb': ['Vorbereitung','Ziffern erkennen'],
 'ki_projekt/ki_lernlabor.ipynb': ['Vorbereitung','Übungsdaten ansehen','A und B vergleichen','Beispiele prüfen'],
 'ki_projekt/ki_tandemprojekt.ipynb': ['Vorbereitung','Fotostudio','1 · Daten auswählen','2 · Daten prüfen','3 · A und B trainieren','4 · Beispiele vergleichen','5 · Abschlusstest freigeben','6 · Protokoll anzeigen'],
}

def build():
 out = ROOT/'content/portal'
 out.mkdir(exist_ok=True)
 for source, titles in ITEMS.items():
  nb = nbformat.read(ROOT/'content'/source, as_version=4)
  codes = [c for c in nb.cells if c.cell_type=='code']
  assert len(codes)==len(titles), source
  cells=[]
  for i,(cell,title) in enumerate(zip(codes,titles)):
   if source.endswith('ki_tandemprojekt.ipynb') and i==1:
    continue  # The photo studio is embedded in the website itself.
   cell.outputs=[];cell.execution_count=None
   if i==0:
    cell.source = 'from pathlib import Path\nimport sys\n_basis = Path.cwd().parent if Path.cwd().name == "portal" else Path.cwd()\nsys.path[:0] = [str(_basis), str(_basis / "ki_projekt")]\n'+cell.source
    cell.metadata['jupyter']={'source_hidden':True}
   cells += [nbformat.v4.new_markdown_cell('### '+title),cell]
  nb.cells=cells
  nb.metadata['ki_source']=source
  nbformat.validate(nb)
  nbformat.write(nb,out/Path(source).name)
 print(f'Generated {len(ITEMS)} embedded notebooks in content/portal')
if __name__=='__main__':build()
