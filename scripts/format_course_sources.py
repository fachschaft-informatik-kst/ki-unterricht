"""Turn compact lesson HTML into readable Markdown text + indented functional HTML."""
from __future__ import annotations
import argparse
from pathlib import Path
import re

ROOT=Path(__file__).resolve().parents[1]
COURSE=ROOT/"kursseiten"
TOKENS=re.compile(
    r"<!-- MD:START -->\n.*?\n<!-- MD:END -->"
    r"|<(?:textarea|pre|code|script|style|svg)\b[^>]*>.*?</(?:textarea|pre|code|script|style|svg)>"
    r"|<!--.*?-->"
    r'|<(?:[^>"\']|"[^"]*"|\'[^\']*\')*>'
    r"|[^<]+",re.S|re.I
)
BLOCK={"div","details","summary","article","section","figure","figcaption",
       "ul","ol","li","p","label","h1","h2","h3","h4","h5","h6","table",
       "thead","tbody","tfoot","tr","td","th","nav","aside","blockquote",
       "header","footer","fieldset","form"}
INLINE={"p","h1","h2","h3","h4","h5","h6","li","summary","th",
        "td","figcaption","label"}

def prose_to_markdown(text):
    regions=re.split(r"(<!-- MD:START -->\n.*?\n<!-- MD:END -->)",text,flags=re.S)
    for i in range(0,len(regions),2):
        part=regions[i]
        def para(m):
            value=m.group(1).strip()
            if not value or "\n" in value or re.search(r"(^|\s)([#*~\x60]|\d+\.\s)",value):
                return m.group(0)
            return "<!-- MD:START -->\n"+value+"\n<!-- MD:END -->"
        def heading(m):
            value=m.group(2).strip()
            if not value or "\n" in value:
                return m.group(0)
            return "<!-- MD:START -->\n"+"#"*int(m.group(1))+" "+value+"\n<!-- MD:END -->"
        part=re.sub(r"<p>([^<>]*?)</p>",para,part,flags=re.S)
        part=re.sub(r"<h([23])>([^<>]*?)</h\1>",heading,part,flags=re.S)
        regions[i]=part
    return "".join(regions)

def pretty_html(source):
    tokens=TOKENS.findall(source)
    if "".join(tokens)!=source:
        raise ValueError("Cannot round-trip HTML tokens without losing content")
    out=[]
    depth=0
    stack=[]
    beginning=True
    def newline():
        nonlocal beginning
        if out and not beginning:
            out.append("\n")
            beginning=True
    def emit(value):
        nonlocal beginning
        if beginning:
            out.append("  "*max(depth,0))
        out.append(value)
        beginning=value.endswith("\n")
    for token in tokens:
        if not token: continue
        if token.startswith("<!--"):
            newline()
            emit(token)
            newline()
            continue
        if not token.startswith("<"):
            if token.isspace() and ("\n" in token or beginning):
                continue
            if beginning:
                # Already indented HTML text must not gain new indentation on reruns.
                token=token.lstrip()
            # Trailing indentation after a text node is source formatting, not
            # prose. Keeping it would add one blank line on every formatter pass.
            if re.search(r"\n[ \t]*$",token):
                token=token.rstrip()
            if token:
                emit(token)
            continue
        m=re.match(r"<\s*(/?)\s*([\w:-]+)",token)
        if not m:
            emit(token)
            continue
        closing,name=bool(m.group(1)),m.group(2).lower()
        if name not in BLOCK:
            emit(token)
        elif closing:
            if name in stack:
                while stack and stack[-1]!=name:
                    stack.pop()
                    depth-=1
                stack.pop()
                depth-=1
            if name not in INLINE:
                newline()
            emit(token)
            newline()
        else:
            newline()
            emit(token)
            stack.append(name)
            depth+=1
            if name not in INLINE:
                newline()
    return "".join(out).rstrip()+("\n" if source.endswith("\n") else "")

def format_fragment(source):
    return pretty_html(prose_to_markdown(source))

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check",action="store_true")
    args=parser.parse_args()
    changed=[]
    for path in sorted(COURSE.rglob("*.md")):
        if not re.fullmatch(r"[0-9]{3}-.+\.md", path.name): continue
        old=path.read_text(encoding="utf-8")
        if old.startswith("---\n"): continue
        new=format_fragment(old)
        if new!=old:
            changed.append(str(path.relative_to(ROOT)))
            if not args.check:
                path.write_text(new,encoding="utf-8")
    print("Course source formatting: ",len(changed),"file(s)",flush=True)
    print("\n".join(changed[:15]))
    if changed and args.check:
        raise SystemExit(1)

if __name__=="__main__":
    main()
