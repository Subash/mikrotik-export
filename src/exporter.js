const fs = require('fs');
const { promisify } = require('util');
const { executeCommandOnDevice } = require('./mikrotik');
const writeFileAsync = promisify(fs.writeFile.bind(fs));

function beautifyConfig(data) {
   data = data.replace(/\\\s+/gi, '');
   data = data.replace(/\n\//gi, '\n\n/');
   data = data.split('\n').map(line=> line.trim()).join('\n');
   return data;
}

function removeComments(data) {
  return data.split('\n')
    .filter(line=> !line.startsWith('#'))
    .join('\n');
}

function concealSecrets(data, secrets) {
  for(const secret of secrets) {
    data = data.replace(new RegExp(`${secret}`, 'gi'), '****');
  }
  return data;
}

function addDelay(data, delay) {
  return `:delay ${delay}\n\n${data}`;
}

async function exportConfig({ username, password, host, port, file, keepComments, beautify, delay, secrets, keepSecrets }) {
  let { stdout: data } = await executeCommandOnDevice('/export', { username, password, host, port });
  if(!keepComments) data = removeComments(data);
  if(beautify) data = beautifyConfig(data);
  if(secrets.length && !keepSecrets) data = concealSecrets(data, secrets);
  if(delay !== 'none') data = addDelay(data, delay);
  await writeFileAsync(file, data);
}

exports.exportConfig = exportConfig;
