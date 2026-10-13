"""Execute the short classroom path. Run from repo root.
Writes executed copies plus PNGs under the chosen output directory (default /tmp/ki-notebooks).
Default keeps pupil templates free of model answers; the final-test gate is tested separately.
"""
import ast
import asyncio
import base64
import os
import sys
from pathlib import Path
import nbformat
from IPython.core.interactiveshell import InteractiveShell
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
root=Path(__file__).resolve().parents[1]
out=Path(sys.argv[1] if len(sys.argv)>1 else '/tmp/ki-notebooks');out.mkdir(parents=True,exist_ok=True)
paths=['perzeptron_und_neuronale_netze.ipynb','mehrschichtige_netze.ipynb','daten_training.ipynb','ki_projekt/ki_lernlabor.ipynb','ki_projekt/ki_tandemprojekt.ipynb']
shell=InteractiveShell.instance()
for name in paths:
    path=root/'content'/name;nb=nbformat.read(path,4);env={'__name__':'__main__'}
    os.chdir(path.parent);sys.path.insert(0,str(path.parent));counter=0
    for i,cell in enumerate(nb.cells):
        if cell.cell_type!='code':continue
        counter+=1;cell.outputs=[];cell.execution_count=counter
        # Execute with top-level await (Pyodide setup cells) and capture printed text.
        import io,contextlib
        buf=io.StringIO();figs=[];old_show=plt.show
        def show(*a,**k):
            for num in plt.get_fignums():
                fig=plt.figure(num);stream=io.BytesIO();fig.savefig(stream,format='png',bbox_inches='tight',dpi=120)
                png=stream.getvalue();figs.append(png);plt.close(fig)
        plt.show=show
        try:
            with contextlib.redirect_stdout(buf):
                code=compile(cell.source,str(path), 'exec',flags=ast.PyCF_ALLOW_TOP_LEVEL_AWAIT)
                result=eval(code,env)
                if result is not None:asyncio.run(result)
            text=buf.getvalue()
            # Widget repr and downloadable base64 payloads are not useful static notebook output.
            lines=[l for l in text.splitlines() if not l.startswith(('VBox(', 'interactive(', '<IPython.core.display.HTML', 'FileUpload('))]
            if lines:cell.outputs.append(nbformat.v4.new_output('stream',name='stdout',text='\n'.join(lines)+'\n'))
            for j,png in enumerate(figs):
                cell.outputs.append(nbformat.v4.new_output('display_data',data={'image/png':base64.b64encode(png).decode()}))
                (out/f'{path.stem}-{i}-{j}.png').write_bytes(png)
        finally:plt.show=old_show;plt.close('all')
    target=out/name;target.parent.mkdir(parents=True,exist_ok=True);nbformat.validate(nb);nbformat.write(nb,target)
    print('PASS',name)
