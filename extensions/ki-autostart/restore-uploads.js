// Re-stage locally backed-up FileUpload data in the active Pyodide filesystem.
// Only the owning course controller supplies files for the current notebook.
// This does not execute uploaded content or restore arbitrary Python objects.
const MAX_FILE_BYTES = 8 * 1024 * 1024;
const MAX_TOTAL_BYTES = 16 * 1024 * 1024;
const CHUNK_CHARS = 256 * 1024; // multiple of four: each chunk is valid base64

export function prepareUploads(files) {
  if (!Array.isArray(files) || files.length > 30) throw Error('Zu viele Notebook-Uploads.');
  let total = 0;
  return files.map((file, index) => {
    if (!file || typeof file.name !== 'string' || !file.name || file.name.length > 300 ||
        typeof file.content !== 'string' || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(file.content)) {
      throw Error('Eine gesicherte Notebook-Datei ist ungültig.');
    }
    const size = file.content.length * 3 / 4 - (file.content.endsWith('==') ? 2 : file.content.endsWith('=') ? 1 : 0);
    total += size;
    if (size > MAX_FILE_BYTES || total > MAX_TOTAL_BYTES) {
      throw Error('Die Notebook-Uploads sind für die automatische Wiederverwendung zu gross. Die ZIP-Sicherung enthält die Originaldaten.');
    }
    const name = file.name.replace(/[^A-Za-z0-9._-]/g,'_').replace(/^\.+/,'_').slice(0,100) || 'upload';
    return {filename:index + '_' + name, content:file.content};
  });
}

export async function restoreNotebookUploads(kernel, files) {
  const uploads = prepareUploads(files);
  if (!uploads.length) return 0;
  const execute = async code => {
    const future = kernel.requestExecute({code,silent:true,store_history:false,stop_on_error:true});
    const reply = await future.done;
    if (reply?.content?.status !== 'ok') throw Error('Gesicherte Notebook-Dateien konnten nicht bereitgestellt werden.');
  };
  await execute(`from pathlib import Path as _ki_upload_path
_ki_upload_folder = _ki_upload_path('/home/pyodide/ki-uploads')
_ki_upload_folder.mkdir(parents=True, exist_ok=True)
for _ki_old_file in _ki_upload_folder.iterdir():
    if _ki_old_file.is_file() and not _ki_old_file.is_symlink():
        _ki_old_file.unlink()`);
  for (const file of uploads) {
    // Never interpolate an original filename or uploaded source code into Python.
    const path = JSON.stringify('/home/pyodide/ki-uploads/' + file.filename);
    for (let position = 0; position < file.content.length; position += CHUNK_CHARS) {
      const chunk = file.content.slice(position,position + CHUNK_CHARS);
      await execute(`import base64 as _ki_upload_base64
with open(${path}, 'ab') as _ki_upload_target:
    _ki_upload_target.write(_ki_upload_base64.b64decode('${chunk}', validate=True))`);
    }
    // Empty FileUpload payloads are rare but still represent valid empty files.
    if (!file.content.length) await execute(`open(${path}, 'wb').close()`);
  }
  return uploads.length;
}
