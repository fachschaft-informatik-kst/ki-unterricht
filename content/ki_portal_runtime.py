"""Separate notebook variables while sharing one loaded Python interpreter."""
import types
from IPython import get_ipython

_spaces = {}


def activate(path, reset=False):
    shell = get_ipython()
    if reset or path not in _spaces:
        _spaces[path] = types.ModuleType('__main__')
    module = _spaces[path]
    shell.user_module = module
    shell.user_ns = module.__dict__
    shell.init_user_ns()


def protocol(path):
    module = _spaces.get(path)
    if module is None or 'experiment' not in module.__dict__:
        return None
    return module.__dict__['ki'].protokoll(module.__dict__['experiment'], export=False)
