const { Client } = require('ssh2');

function executeCommandOnDevice(command, { username, password, host, port}) {
  return new Promise((resolve, reject)=> {
    const connectionConfig = { host, port, username, password };
    const client = new Client();
    client.on("ready", ()=> {
      client.exec(command, (err, stream)=> {
        if(err) return reject(err);
        let stdout = '', stderr = '';
        stream.on("data", data=> (stdout += data));
        stream.stderr.on("data", data=> (stderr += data));
        stream.on("close", ()=> {
          client.end();
          resolve({ stderr, stdout });
        });
      });
    });
    client.connect(connectionConfig);
  });
}

module.exports = { executeCommandOnDevice };
