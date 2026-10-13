"""A lesson must not overwrite project data, functions or the trained model."""
from pathlib import Path
import sys
from IPython.core.interactiveshell import InteractiveShell
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'content'))
import ki_portal_runtime as runtime
shell=InteractiveShell.instance()
runtime.activate('project')
shell.run_cell('experiment = {"test": 42}\ndef result():\n    return experiment["test"]',store_history=False)
project_function=shell.user_ns['result']
runtime.activate('lesson')
shell.run_cell('experiment = {"test": 999}',store_history=False)
assert project_function()==42  # Function globals remain in their own notebook.
runtime.activate('project');assert shell.user_ns['result']()==42
runtime.activate('project',reset=True);assert 'experiment' not in shell.user_ns
runtime.activate('lesson');assert shell.user_ns['experiment']['test']==999
assert runtime.protocol('project') is None
print('PASS isolated notebook globals, function globals and independent reset')
