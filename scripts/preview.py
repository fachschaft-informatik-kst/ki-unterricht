"""Fast local content preview. --full builds and serves the actual JupyterLite site."""
import argparse
import functools
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import subprocess
import sys
import threading

ROOT = Path(__file__).resolve().parents[1]


def command(*args):
    print("+", " ".join(map(str, args)), flush=True)
    subprocess.run(args, cwd=ROOT, check=True)


def build_content():
    command(sys.executable, "scripts/build_portal.py")
    command(sys.executable, "scripts/build_course.py")


def build_full():
    command("npm", "ci", "--prefix", "extensions/ki-autostart")
    command("npm", "run", "build", "--prefix", "extensions/ki-autostart")
    command(sys.executable, "scripts/build_portal_notebooks.py")
    command("jupyter", "lite", "build", "--contents", "content", "--output-dir", "dist")
    command(sys.executable, "scripts/copy_portal.py", "dist")


def fingerprints():
    paths = [ROOT / "projekt/index.template.html"]
    paths.extend((ROOT / "kursseiten").rglob("*.md"))
    paths.extend((ROOT / "lehrperson").rglob("*.md"))
    paths.extend((ROOT / "kursseiten").rglob("*.json"))
    paths.extend((ROOT / "unterricht/lektionen").glob("*.json"))
    return {str(path): path.stat().st_mtime_ns for path in paths if path.is_file()}


def watch(stop):
    previous = fingerprints()
    while not stop.wait(0.8):
        current = fingerprints()
        if current == previous:
            continue
        previous = current
        try:
            build_content()
            print("Inhalte neu erstellt. Browser aktualisieren.", flush=True)
        except subprocess.CalledProcessError:
            print("Build fehlgeschlagen: Eingabedatei korrigieren und erneut speichern.", file=sys.stderr)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--full", action="store_true", help="Serve complete JupyterLite/ZIP environment")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8000)
    parser.add_argument("--no-watch", action="store_true")
    args = parser.parse_args()
    build_content()
    if args.full:
        build_full()
    directory = ROOT / "dist" if args.full else ROOT
    handler = functools.partial(SimpleHTTPRequestHandler, directory=str(directory))
    stop = threading.Event()
    if not args.no_watch and not args.full:
        threading.Thread(target=watch, args=(stop,), daemon=True).start()
    url = f"http://{args.host}:{args.port}/projekt/"
    print("Kursportal:", url, flush=True)
    if not args.full:
        print("Schnellvorschau ohne lauffähige Jupyter-Notebooks/Vorschaugrafiken;")
        print("für den vollständigen Test: python scripts/preview.py --full")
    else:
        print("Vollständiges JupyterLite mit Notebooks und ZIP-Laufzeit.")
    try:
        with ThreadingHTTPServer((args.host, args.port), handler) as server:
            server.serve_forever()
    except KeyboardInterrupt:
        print("Vorschau beendet.")
    finally:
        stop.set()


if __name__ == "__main__":
    main()
