#!/usr/bin/env node
const program = require('commander');
const path = require('path');
const exporter = require('./exporter');
const pkg = require('../package.json');
const paddedNewLine = `\n${new Array(24).fill('').join(' ')}`;

program
  .version(pkg.version, '--version')
  .option('--host <host>', 'Device hostname or IP address')
  .option('--port <port>', 'SSH port of the device', 22)
  .option('--username <username>', 'Device username')
  .option('--password <password>', 'Device password')
  .option('--file <file>', 'Path of the exported file', 'config.rsc')
  .option('--keep-comments', 'Keep Comments')
  .option('--no-beautify', 'No Beautify')
  .option('--secrets <secrets>', 'Comma separated list of secrets to conceal')
  .option('--keep-secrets', 'Keep Secrets')
  .option('--delay <delay>', `Add a delay at the beginning of the file ${paddedNewLine} https://forum.mikrotik.com/viewtopic.php?t=73663#p374885 ${paddedNewLine} Set \`none\` for no delay.`, '30s')
  .parse(process.argv);

let optionMissing;
function requiredOption(message) {
  optionMissing=true;
  console.log(message);
}

const options = {
  host: program.host || process.env.MIKROTIK_HOST || requiredOption('Please set the device hostname or ip address by setting --host option or MIKROTIK_HOST environment variable'),
  port: program.port,
  username: program.username || process.env.MIKROTIK_USERNAME || requiredOption('Please set the device username by setting --username option or MIKROTIK_USERNAME environment variable'),
  password: program.password || process.env.MIKROTIK_PASSWORD || requiredOption('Please set the device password by setting --password option or MIKROTIK_PASSWORD environment variable'),
  file: path.resolve(process.cwd(), program.file),
  keepComments: program.keepComments,
  beautify: program.beautify,
  delay: program.delay,
  secrets: (program.secrets ||  process.env.MIKROTIK_SECRETS || '').split(',').map(s => s.trim()).filter( val => !!val),
  keepSecrets: program.keepSecrets
}

if(optionMissing) process.exit(1);

exporter.exportConfig(options)
  .then(()=> console.log(`Config file exported to ${options.file}`))
  .catch(console.error.bind(console));



