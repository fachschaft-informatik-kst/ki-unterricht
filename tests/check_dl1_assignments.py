"""Static contracts for DL1 matching tasks in both courses."""
from pathlib import Path
from bs4 import BeautifulSoup

root=Path(__file__).resolve().parents[1]/"_build/site"
expected={
  "regeln":{"automat":"regeln","uebersetzung":"daten","ampel":"regeln","gesicht":"daten"},
  "begriffe":{"ampel":"keine","schach":"regelki","spam":"ml","bilder":"deep","text":"generativ"},
}
for sub,section,attribute in (("basis","basis-ki","data-basis-answer"),("projekt","einstieg","data-answer")):
  folder=root/sub
  soup=BeautifulSoup((folder/"index.html").read_text(encoding="utf-8"),"html.parser")
  for kind,mapping in expected.items():
    task=soup.select_one(f"#{section} [data-ki-sort-task='{kind}']")
    assert task, (sub,kind)
    cards=task.select("[data-ki-sort-card]")
    assert len(cards)==len(mapping)
    assert {c["data-ki-sort-card"]:c["data-ki-sort-correct"] for c in cards}==mapping
    categories={b["data-ki-sort-bin"] for b in task.select("[data-ki-sort-bin]")}
    assert categories=={"regeln","daten"} if kind=="regeln" else categories=={"keine","regelki","ml","deep","generativ"}
    for card in cards:
      field=card.select_one(f"select[{attribute}]")
      assert field and field.find("option",value=""), (sub,kind,card["data-ki-sort-card"])
      assert {o["value"] for o in field.select("option") if o.get("value")}==categories
    assert task.select_one("[data-ki-sort-check]") and task.select_one("[data-ki-sort-reset]")
  reflection=soup.select_one(f"#{section} #einstieg-2 textarea[{attribute}='regeln_oder_daten']")
  assert reflection is not None
  assert len(soup.select(f"#{section} #einstieg-2 textarea[{attribute}^='begriff_bsp_']"))==4
  for asset in ("dl1_sort.css","dl1_sort.js"):
    assert (folder/asset).is_file(),(sub,asset)
    assert soup.select_one(f'link[href="{asset}"]' if asset.endswith("css") else f'script[src="{asset}"]'),(sub,asset)
print("PASS DL1 matching: both tracks, 4+5 unambiguous examples, alternatives, history and assets")
