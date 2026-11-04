"""Generate illustrative plots using each course's own helper module."""
from pathlib import Path
import contextlib
import importlib.util
import io
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt


def build_previews(destination: Path, course_content: Path) -> None:
    source = Path(course_content) / "unterricht_tools.py"
    if not source.is_file():
        raise FileNotFoundError(source)
    spec = importlib.util.spec_from_file_location("_ki_preview_tools", source)
    if spec is None or spec.loader is None:
        raise ValueError(f"Cannot load preview module: {source}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    target = Path(destination) / "previews"
    target.mkdir(parents=True, exist_ok=True)
    for name, function in (("perzeptron", module.perzeptron),
                           ("xor", module.xor_netz), ("datenplan", module.datenplan)):
        plt.close("all")
        with contextlib.redirect_stdout(io.StringIO()):
            function()
        plt.gcf().savefig(target / (name + ".png"), dpi=140,
                          bbox_inches="tight", facecolor="white")
    plt.close("all")
