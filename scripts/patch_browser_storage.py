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
DRIVE_WORKERS = {
    "288.da9122dbb795853aa184.js": 2,
    "352.3014c3141745cb055fab.js": 1,
    "620.1f7022cb36bb0022cde6.js": 1,
}
DRIVE_REPLY = "this._channel.postMessage(i)"
CORRELATED_REPLY = (
    "this._channel.postMessage(t.kiDriveRequestId?"
    "{kiDriveRequestId:t.kiDriveRequestId,data:i}:i)"
)
CORE_DRIVE = "build/649.062c1f9.js"
CORE_REPLY = "this._channel.postMessage(n)"
CORE_CORRELATED_REPLY = (
    "this._channel.postMessage(e.kiDriveRequestId?"
    "{kiDriveRequestId:e.kiDriveRequestId,data:n}:n)"
)
DRIVE_REQUEST = (
    'async function broadcastOne(e){const a=new Promise((e=>{broadcast.onmessage=a=>'
    '{e(new Response(JSON.stringify(a.data)))}})),t=await e.json();'
    'return t.receiver="broadcast.ts",broadcast.postMessage(t),await a}'
)
CORRELATED_REQUEST = (
    'async function broadcastOne(e){const t=await e.json(),id=crypto.randomUUID();'
    't.receiver="broadcast.ts";t.kiDriveRequestId=id;'
    'return new Promise(resolve=>{const timer=setTimeout(()=>{'
    'broadcast.removeEventListener("message",receive);'
    'console.error("JupyterLite drive request timed out",t.method,t.path);'
    'resolve(new Response("Drive request timed out",{status:504}));},60000);'
    'const receive=event=>{if(event.data?.kiDriveRequestId!==id)return;'
    'clearTimeout(timer);broadcast.removeEventListener("message",receive);'
    'resolve(new Response(JSON.stringify(event.data.data)));};'
    'broadcast.addEventListener("message",receive);broadcast.postMessage(t);});}'
)


def replace_once(source: str, old: str, new: str, count: int = 1) -> str:
    if source.count(new) == count and old not in source.replace(new, ""):
        return source
    if new in source or source.count(old) != count:
        raise ValueError("Unexpected JupyterLite drive bridge; refusing patch")
    return source.replace(old, new)


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
    updates = {bundle: patched}
    service_worker = site / "service-worker.js"
    updates[service_worker] = replace_once(
        service_worker.read_text(encoding="utf-8"), DRIVE_REQUEST, CORRELATED_REQUEST
    )
    core = site / CORE_DRIVE
    updates[core] = replace_once(
        core.read_text(encoding="utf-8"), CORE_REPLY, CORE_CORRELATED_REPLY
    )
    for name, count in DRIVE_WORKERS.items():
        worker = site / "extensions/@jupyterlite/pyodide-kernel-extension/static" / name
        updates[worker] = replace_once(
            worker.read_text(encoding="utf-8"), DRIVE_REPLY, CORRELATED_REPLY, count
        )
    for path, content in updates.items():
        if path.read_text(encoding="utf-8") != content:
            path.write_text(content, encoding="utf-8")
    print("Validated localForage initialization/reconnect guards:", BUNDLE)
    print("Validated correlated JupyterLite drive requests for concurrent kernels")


if __name__ == "__main__":
    import sys
    patch_bundle(Path(sys.argv[1]) if len(sys.argv) > 1 else Path("dist"))
