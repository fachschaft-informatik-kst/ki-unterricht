const {spawnSync}=require("node:child_process");
const path=require("node:path");
const root=path.resolve(__dirname,"..");
const tests=[
  "check_admin_form",
  "check_teacher_browser",
  "check_editor_course_matrix",
  "check_basis_browser",
  "check_course_theme",
  "check_project_pages",
  "check_notebook_startup_browser",
  "check_course_runtime_browser",
  "check_fotostudio_storage",
  "check_autostart_browser",
  "check_portal",
  "check_persistence"
];
for(const test of tests){
  console.log("\n=== "+test+" ===");
  const result=spawnSync(process.execPath,["tests/"+test+".cjs"],{
    cwd:root,stdio:"inherit",
    env:{...process.env,CHECK_NOTEBOOK:"1",CHECK_TRAINING:"1",KI_WIDGET_COLD_START:"1"}
  });
  if(result.error)throw result.error;
  if(result.status!==0){
    console.error(test+" failed ("+(result.signal||result.status)+")");
    process.exit(result.status||1);
  }
}
console.log("\nPASS all "+tests.length+" browser suites (sequential, including Python training and ZIP restore)");
