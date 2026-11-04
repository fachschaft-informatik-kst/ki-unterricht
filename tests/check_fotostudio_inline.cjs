/* Parse each course's own Fotostudio controller. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const courses=JSON.parse(fs.readFileSync(path.join(root,'shared/course-sites.json'),'utf8')).courses;
for(const course of courses){
 const html=fs.readFileSync(path.join(root,course.courseRoot,'content/ki_projekt/fotostudio.html'),'utf8');
 const inline=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).filter(Boolean);
 assert(inline.length>=1,course.slug+': no inline controller');
 for(const code of inline)new vm.Script(code,{filename:course.slug+'/fotostudio.inline.js'});
 assert(html.includes('fotostudio_storage.js'),course.slug+': storage script missing');
 for(const id of ['label','group','files','add','save','resume'])
   assert.equal((html.match(new RegExp('id="'+id+'"','g'))||[]).length,1,course.slug+': '+id);
}
console.log('PASS Fotostudio JS parses for '+courses.length+' courses');
