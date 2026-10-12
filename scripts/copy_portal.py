"""Copy the portal and its runtime assets into the completed JupyterLite build."""
from pathlib import Path
import shutil,sys
from fix_pyodide_lock import fix_lock
root=Path(__file__).resolve().parents[1]
out=Path(sys.argv[1] if len(sys.argv)>1 else root/'dist')
fix_lock(out)
shutil.copytree(root/'projekt',out/'projekt',dirs_exist_ok=True)
(out/'projekt/studio').mkdir(exist_ok=True)
(out/'projekt/runtime').mkdir(exist_ok=True)
shutil.copy(root/'content/ki_projekt/fotostudio.html',out/'projekt/studio/index.html')
shutil.copy(root/'content/ki_projekt/fotostudio_core.js',out/'projekt/studio/fotostudio_core.js')
for file in ['ki_foto_tools.py','ki_projekt_tools.py','foto_uebungsdaten.json']:
 shutil.copy(root/'content/ki_projekt'/file,out/'projekt/runtime'/file)
shutil.copy(root/'portal-index.html',out/'index.html')
