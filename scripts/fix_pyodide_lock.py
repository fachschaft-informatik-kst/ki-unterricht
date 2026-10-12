"""Keep the generated package lock compatible with the bundled Pyodide runtime.

Some lock-generator releases omit info.version. Pyodide 0.27 requires that
field even when the ABI and all packages match. Read it from the actual
bundled runtime; never guess a version or suppress a genuine mismatch.
"""
from pathlib import Path
import hashlib
import json
from urllib.parse import urlsplit


def fix_lock(out):
    out = Path(out)
    config_path = out / 'jupyter-lite.json'
    config = json.loads(config_path.read_text())
    kernel = config['jupyter-config-data'].get('litePluginSettings', {}).get(
        '@jupyterlite/pyodide-kernel-extension:kernel', {})
    options = kernel.get('loadPyodideOptions', {})
    lock_url = options.get('lockFileURL')
    if not lock_url:
        return  # Development builds may intentionally disable the lock addon.

    def local_file(url):
        parsed = urlsplit(url)
        if parsed.scheme or parsed.netloc:
            raise ValueError('Expected a bundled Pyodide resource: ' + url)
        path = (out / parsed.path).resolve()
        if not path.is_relative_to(out.resolve()):
            raise ValueError('Pyodide resource must be inside the build')
        return path

    runtime_path = local_file(kernel['pyodideUrl']).parent / 'pyodide-lock.json'
    runtime = json.loads(runtime_path.read_text())['info']
    lock_path = local_file(lock_url)
    lock = json.loads(lock_path.read_text())
    info = lock['info']
    for key in ('abi_version', 'arch', 'platform', 'python'):
        if info.get(key) != runtime.get(key):
            raise ValueError('Pyodide lock/runtime mismatch: ' + key)
    version = runtime['version']
    if info.get('version') not in (None, version):
        raise ValueError('Pyodide lock/runtime mismatch: version')
    info['version'] = version
    data = (json.dumps(lock, indent=2) + '\n').encode()
    lock_path.write_bytes(data)
    options['lockFileURL'] = urlsplit(lock_url).path + '?sha256=' + hashlib.sha256(data).hexdigest()
    config_path.write_text(json.dumps(config, indent=2) + '\n')
    print('Verified Pyodide lock/runtime version:', version)


if __name__ == '__main__':
    import sys
    fix_lock(sys.argv[1] if len(sys.argv) > 1 else 'dist')
