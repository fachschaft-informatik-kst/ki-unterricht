# Xeus Python – isolierter Startzeitvergleich

Dieses Experiment ist **kein Bestandteil des veröffentlichten Unterrichts**. Es verändert weder JupyterLite-Kursiframes, Uploads noch die ZIP-Wiederherstellung.

## Prototyp bauen

Für das Xeus-WebAssembly-Kernelpaket muss **micromamba** installiert und auf `PATH` sein (siehe auch GitHub-Workflow). Ohne micromamba kann JupyterLite die Emscripten-/Conda-Umgebung nicht erzeugen.

In einer separaten Python-3.12-Umgebung:

```sh
python -m venv .venv-xeus
.venv-xeus/bin/python -m pip install -r benchmarks/xeus/requirements.txt
cd benchmarks/xeus
../../.venv-xeus/bin/jupyter lite build --contents content --output-dir ../../_build/xeus-probe
cd ../..
python -m http.server 8891 --directory _build/xeus-probe
```

Danach `http://localhost:8891/lab/index.html?path=xeus_probe.ipynb` öffnen. Nur der XeUS-Kernel ist installiert. `environment.yml` stellt NumPy, Matplotlib und Widgets bereit. Der erste Codeblock schreibt `KI_KERNEL_BENCH_OK`; die weiteren Zellen prüfen Widget- und Diagrammkompatibilität.

## Fairer Vergleich

Den gleichen Probe-Code in einer **separat gebauten** Pyodide-JupyterLite-0.8-Site ausführen. Browser/Hardware, Netz und Caches gleich halten; jede Variante einmal mit leerem Cache und mehrmals mit warmem Cache testen. Nach dem Laden der Notebook-Oberfläche dieselben Zellen ausführen und Zeit bis zur Ausgabe `KI_KERNEL_BENCH_OK` messen. Daneben Ladevolumen, Widgetfunktion und Diagramme überprüfen. Nicht die BOK-Startzeit gegen die reduzierte Xeus-Probe vergleichen, denn das wären unterschiedliche Arbeitslasten.

Dieses reine Kernel-Profil beweist **keine** Eignung zum Austausch im Kursportal: Es hat weder die vertrauenswürdige Autostart-Erweiterung noch die projektgebundene Widget-/Upload- und ZIP-Wiederherstellung. Vor einem Plattformwechsel wären genau diese Schnittstellen, die Python-Fotoprojektmodule und die Emscripten-Abhängigkeiten in echten Browsern zu testen.

Ergebnisse erst nach realen Messungen festhalten; ein schnellerer Kernel allein rechtfertigt keinen Wechsel ohne funktionsfähige Kurssicherung.
