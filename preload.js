/* The below source code is licensed under MIT. */

const fs = require('fs');
const electron = require('electron');

const { join } = require('path');
const path = join(__dirname, 'sperms.json');

const log = (error) => {
  console.error('%c[Sperm-Bank-Save-File]:', 'color: red font-weight: 700;', error);
};

const writeFile = (data) => {
  fs.writeFileSync(path, data, log);
};

const readFile = () => {
  if (!fs.existsSync(path)) return '{}';
  return fs.readFileSync(path, 'utf-8', log);
};

const open = () => {
  try { electron.shell.openPath(path); }
  catch (error) { log(error); }
};

electron.contextBridge.exposeInMainWorld('SpermBank', {
  get sperms() { return JSON.parse(readFile()); }, open,
  set sperms(data) { writeFile(JSON.stringify(data)); },
});