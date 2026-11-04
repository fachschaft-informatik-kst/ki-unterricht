"""Guard localForage reconnects against stores still initializing in JupyterLite."""
from pathlib import Path


BUNDLE = "build/927.399dde7.js"
REPLACEMENTS = (
    (
        "o._dbInfo.db&&(o._dbInfo.db.close(),o._dbInfo.db=null)",
        "o._dbInfo&&o._dbInfo.db&&(o._dbInfo.db.close(),o._dbInfo.db=null)",
    ),
    (
        "t[o]._dbInfo.db=r",
        "t[o]._dbInfo&&(t[o]._dbInfo.db=r)",
    ),
    (
        "i!==n&&(i._dbInfo.db=t.db,i._dbInfo.version=t.version)",
        "i!==n&&i._dbInfo&&(i._dbInfo.db=t.db,i._dbInfo.version=t.version)",
    ),
)


def patch_source(source: str) -> str:
    for old, new in REPLACEMENTS:
        if source.count(new) == 1 and old not in source.replace(new, ""):
            continue
        if source.count(old) != 1:
            raise ValueError("Unexpected localForage source; refusing storage patch")
        source = source.replace(old, new)
    return source


def patch_bundle(site: Path) -> None:
    bundle = site / BUNDLE
    source = bundle.read_text(encoding="utf-8")
    patched = patch_source(source)
    if source != patched:
        bundle.write_text(patched, encoding="utf-8")
    print("Validated localForage initialization/reconnect guards:", BUNDLE)


if __name__ == "__main__":
    import sys
    patch_bundle(Path(sys.argv[1]) if len(sys.argv) > 1 else Path("dist"))
