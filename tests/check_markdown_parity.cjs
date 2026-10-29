/* Ensure the editor and course use identical Markdown-it/CommonMark table output. */
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const {spawnSync}=require("node:child_process");
const ROOT=path.resolve(__dirname,"..");
const sandbox={};
vm.runInNewContext(fs.readFileSync(path.join(ROOT,"projekt/admin/markdown-it.min.js"),"utf8"),sandbox,{timeout:5000});
assert.equal(typeof sandbox.markdownit,"function");
const browser=sandbox.markdownit("commonmark",{html:true}).enable("table");
const files=[
  "kursseiten/perzeptron/030-perzeptron-3.md",
  "kursseiten/basis-neuron/030-perzeptron-3.md",
  "kursseiten/netze/030-netze-3.md",
  "kursseiten/basis-netze/030-netze-3.md",
  "kursseiten/einstieg/materialien.md",
  "kursseiten/lernziele/000-inhalt.md"
];
const samples=[
  "# CommonMark\n\n**Bold** and *italic*, [link](https://example.org).",
  "Ein Absatz mit **Zeilenumbruch** und\nzweiter Zeile.\n\n- Eintrag\n- anderer Eintrag",
  "| x₁ | x₂ | AND | OR | NAND |\n|:--:|:--:|:---:|:--:|:----:|\n| 0 | 0 | 0 | 0 | 1 |\n| 1 | 1 | **1** | 1 | **0** |",
  "<figure><img src=\"grafiken/perzeptron.svg\" alt=\"Test\"></figure>",
  "> Ein Zitat mit **Fettdruck**",
  "### Überschrift\n\n    Ein eingerückter Codeblock"
];
for(const name of files){
  const source=fs.readFileSync(path.join(ROOT,name),"utf8");
  let found=false;
  for(const match of source.matchAll(/<!-- MD:START -->\r?\n([\s\S]*?)\r?\n<!-- MD:END -->/g)){
    samples.push(match[1]);found=true;
  }
  if(source.startsWith("---\n")){
    const header=/^---\r?\n[\s\S]*?\r?\n---\r?\n/.exec(source);
    assert.ok(header,name+" invalid frontmatter");
    samples.push(source.slice(header[0].length));found=true;
  }
  if(!found&&!source.includes("<details"))samples.push(source);
}
const program="import json,sys\nfrom markdown_it import MarkdownIt\nmd=MarkdownIt('commonmark',{'html':True}).enable('table')\nprint(json.dumps([md.render(s) for s in json.load(sys.stdin)],ensure_ascii=False))";
const python=spawnSync("python",["-c",program],{input:JSON.stringify(samples),encoding:"utf8",maxBuffer:20*1024*1024});
assert.equal(python.status,0,python.stderr);
const expected=JSON.parse(python.stdout);
for(let i=0;i<samples.length;i++)
  assert.equal(browser.render(samples[i]),expected[i],"Markdown discrepancy for sample "+i+": "+samples[i].slice(0,85));
assert.ok(samples.length>=12,"Missing real course fragments");
console.log("PASS editor/course Markdown-it parity: "+samples.length+" real and synthetic fragments");
