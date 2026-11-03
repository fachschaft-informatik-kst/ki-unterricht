"""Copy the portal and its runtime assets into the completed JupyterLite build."""
from pathlib import Path
import shutil,sys
from fix_pyodide_lock import fix_lock
from patch_pyodide_kernel import patch_bundle
from importlib.metadata import version
from build_previews import build_previews
root=Path(__file__).resolve().parents[1]
out=Path(sys.argv[1] if len(sys.argv)>1 else root/'dist')
# The 0.8 kernel owns its lockfile format and URL; the old Pyodide 0.27
# post-processing must never run on the new Python 3.14 runtime.
kernel_version = version('jupyterlite-pyodide-kernel')
if kernel_version.startswith('0.5.'):
 fix_lock(out)
elif not kernel_version.startswith('0.8.'):
 raise RuntimeError('Unverified JupyterLite kernel version: '+kernel_version)
shutil.copytree(root/'_build/site/projekt',out/'projekt',dirs_exist_ok=True)
shutil.copytree(root/'_build/site/basis',out/'basis',dirs_exist_ok=True)
(out/'projekt/studio').mkdir(exist_ok=True)
(out/'projekt/runtime').mkdir(exist_ok=True)
shutil.copy(root/'content/ki_projekt/fotostudio.html',out/'projekt/studio/index.html')
shutil.copy(root/'content/ki_projekt/fotostudio_core.js',out/'projekt/studio/fotostudio_core.js')
shutil.copy(root/'content/ki_projekt/fotostudio_storage.js',out/'projekt/studio/fotostudio_storage.js')
for file in ['ki_foto_tools.py','ki_projekt_tools.py','foto_uebungsdaten.json']:
 shutil.copy(root/'content/ki_projekt'/file,out/'projekt/runtime'/file)
shutil.copy(root/'content/unterricht_tools.py',out/'projekt/runtime/unterricht_tools.py')
shutil.copy(root/'portal-index.html',out/'index.html')
shutil.copy(root/'kurse.html',out/'kurse.html')

build_previews(out)
if kernel_version.startswith('0.5.'):
    patch_bundle(out)  # only the legacy kernel needs the IPython async fix
else:
    print('Current Pyodide kernel: no legacy wheel or lock post-processing necessary')
from build_course_routes import build as build_course_routes
build_course_routes(out)
from protect_teacher_pages import protect
protect(out)
