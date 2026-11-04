"""Build static example figures; never run a student's project or final test."""
from pathlib import Path
import contextlib
import io
import importlib.util
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt


def build_previews(out, courses):
    root=Path(__file__).resolve().parents[1]
    for course in courses:
        if course["status"] != "published":
            continue
        source=root/course["courseRoot"]/'content/unterricht_tools.py'
        spec=importlib.util.spec_from_file_location("course_tools",source)
        if spec is None or spec.loader is None:
            raise ImportError(f"Python-Hilfsmodul nicht ladbar: {source}")
        module=importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        dest=Path(out)/course["slug"]/'previews'
        dest.mkdir(parents=True,exist_ok=True)
        for name,fn in [('perzeptron',module.perzeptron),('xor',module.xor_netz),('datenplan',module.datenplan)]:
            plt.close('all')
            with contextlib.redirect_stdout(io.StringIO()): fn()
            plt.gcf().savefig(dest/(name+'.png'),dpi=140,bbox_inches='tight',facecolor='white')
        plt.close('all')
