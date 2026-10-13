"""Build static example figures; never run a student's project or final test."""
from pathlib import Path
import contextlib
import io
import sys
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt


def build_previews(out):
    root=Path(__file__).resolve().parents[1]
    sys.path.insert(0,str(root/'content'))
    import unterricht_tools as u
    dest=Path(out)/'projekt/previews';dest.mkdir(parents=True,exist_ok=True)
    for name,fn in [('perzeptron',u.perzeptron),('xor',u.xor_netz),('datenplan',u.datenplan)]:
        plt.close('all')
        with contextlib.redirect_stdout(io.StringIO()): fn()
        plt.gcf().savefig(dest/(name+'.png'),dpi=140,bbox_inches='tight',facecolor='white')
    plt.close('all')
