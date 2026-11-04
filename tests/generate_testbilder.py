"""Import a pinned, attributed Fruits-360 photo subset into one course.

The eight views of each source collection stay in one local data group.
This is a small pipeline demo, not evidence of independent physical specimens.
"""
import argparse
import hashlib
import io
import json
import sys
from pathlib import Path
from urllib.parse import quote
from urllib.request import Request, urlopen

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from course_registry import load_registry

REPOSITORY = "fruits-360/fruits-360-100x100"
REVISION = "bed1c24ee70de1569272de3882fbde88211c08b5"
GROUPS = ["T1", "T2", "V1", "P1", "P2"]
COLLECTIONS = {
    "Apfel": ["Apple Red 1", "Apple Golden 1", "Apple Granny Smith 1",
              "Apple Braeburn 1", "Apple Pink Lady 1"],
    "Banane": ["Banana 1", "Banana 2", "Banana 3", "Banana 4", "Banana Lady Finger 1"],
}


def fetch(url):
    with urlopen(Request(url, headers={"User-Agent": "KI-Unterricht-photo-import"}),
                 timeout=60) as response:
        return response.read()


def generate(course):
    output = ROOT / course["courseRoot"] / "testbilder"
    records, downloads = [], []
    for label, collections in COLLECTIONS.items():
        for group, collection in zip(GROUPS, collections):
            folder = "Training/" + collection
            listing = json.loads(fetch(
                f"https://api.github.com/repos/{REPOSITORY}/contents/"
                f"{quote(folder)}?ref={REVISION}"))
            photos = sorted(entry["name"] for entry in listing
                            if entry["type"] == "file" and entry["name"].endswith(".jpg"))
            if len(photos) < 8:
                raise ValueError(f"Too few source photos: {collection}")
            selected = [photos[round(index * (len(photos) - 1) / 7)] for index in range(8)]
            for index, name in enumerate(selected, 1):
                source_path = folder + "/" + name
                url = f"https://raw.githubusercontent.com/{REPOSITORY}/{REVISION}/{quote(source_path)}"
                data = fetch(url)
                with Image.open(io.BytesIO(data)) as image:
                    image.verify()
                relative = f"{label}/{group}/{label.lower()}_{group}_{index}.jpg"
                downloads.append((relative, data))
                records.append({
                    "path": relative, "label": label, "group": group,
                    "collection": collection, "url": url,
                    "sha256": hashlib.sha256(data).hexdigest(),
                })
            print(f"Downloaded {label}/{group}: {collection}, 8 real photographs")
    manifest = {
        "author": "Mihai Oltean", "dataset": "Fruits-360",
        "repository": f"https://github.com/{REPOSITORY}",
        "revision": REVISION, "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "changes": "Subset selection and renamed files; JPEG bytes unchanged. "
                   "Upstream photos are background-segmented and resized to 100x100.",
        "records": records,
    }
    for relative, data in downloads:
        target = output / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
    (output / "quellen.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Imported 80 photos with source URLs, licenses and SHA-256 checksums")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--course", default="bok/4-klasse")
    args = parser.parse_args()
    course = next((c for c in load_registry() if c["slug"] == args.course), None)
    if course is None:
        parser.error(f"Unknown course: {args.course}")
    generate(course)
