"""Build regression: missing version is repaired, incompatible locks fail closed."""
import hashlib
import json
from pathlib import Path
import sys
import tempfile
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from fix_pyodide_lock import fix_lock

with tempfile.TemporaryDirectory() as directory:
    root = Path(directory)
    (root / 'static/pyodide').mkdir(parents=True)
    (root / 'static/pyodide-lock').mkdir()
    runtime = {'version':'0.27.0','abi_version':'2024_0','arch':'wasm32',
               'platform':'emscripten_3_1_58','python':'3.12.7'}
    (root / 'static/pyodide/pyodide-lock.json').write_text(json.dumps({'info':runtime}))
    info = {k:v for k,v in runtime.items() if k != 'version'}
    packages = {'example':{'file_name':'../../static/example.whl','sha256':'unchanged'}}
    lock_path = root / 'static/pyodide-lock/pyodide-lock-offline.json'
    lock_path.write_text(json.dumps({'info':info,'packages':packages}))
    kernel = {'pyodideUrl':'./static/pyodide/pyodide.js', 'loadPyodideOptions':{
        'lockFileURL':'./static/pyodide-lock/pyodide-lock-offline.json?sha256=old'}}
    config_path = root / 'jupyter-lite.json'
    config_path.write_text(json.dumps({'jupyter-config-data':{'litePluginSettings':{
        '@jupyterlite/pyodide-kernel-extension:kernel':kernel}}}))
    fix_lock(root)
    fixed = json.loads(lock_path.read_text())
    assert fixed['info']['version'] == '0.27.0'
    assert fixed['packages'] == packages
    config = json.loads(config_path.read_text())
    url = config['jupyter-config-data']['litePluginSettings']['@jupyterlite/pyodide-kernel-extension:kernel']['loadPyodideOptions']['lockFileURL']
    assert url.endswith(hashlib.sha256(lock_path.read_bytes()).hexdigest())
    before = lock_path.read_bytes(); fix_lock(root); assert lock_path.read_bytes() == before
    for key,value in [('version','0.28.0'),('abi_version','incompatible')]:
        invalid = json.loads(before); invalid['info'][key] = value
        lock_path.write_text(json.dumps(invalid))
        try: fix_lock(root)
        except ValueError: pass
        else: raise AssertionError('Incompatible '+key+' was accepted')
print('PASS missing runtime version, cache hash, unchanged packages, idempotence and mismatch rejection')
