#!/usr/bin/env node
const path = require('path');
const { program } = require('commander');
const exporter = require('./exporter');
const pkg = require('../package.json');
const paddedNewLine = `\n${''.padStart(22, ' ')}`;

program
  .version(pkg.version, '--version', 'Output the version number')
  .option('--host <host>', 'Device hostname or IP address')
  .option('--port <port>', 'SSH port of the device', '22')
  .option('--username <username>', 'Device username')
  .option('--password <password>', 'Device password')
  .option('--file <file>', 'Path of the exported file', 'config.rsc')
  .option('--keep-comments', 'Keep comments')
  .option('--no-beautify', 'No beautify')
  .option('--secrets <secrets>', 'Comma separated list of secrets to conceal')
  .option('--keep-secrets', 'Keep all secrets')
  .option('--delay <delay>', `Add a delay at the beginning of the file ${paddedNewLine} https://forum.mikrotik.com/viewtopic.php?t=73663#p374885 ${paddedNewLine} Set \`none\` for no delay.`, '30s')
  .helpOption('-h, --help', 'Display help')
  .parse(process.argv);

let optionMissing;
function requiredOption(message) {
  optionMissing=true;
  console.log(message);
}

const options = program.opts();

const settings = {
  host: options.host || process.env.MIKROTIK_HOST || requiredOption('Please set the device hostname or ip address by setting --host option or MIKROTIK_HOST environment variable'),
  port: Number.parseInt(options.port, 10),
  username: options.username || process.env.MIKROTIK_USERNAME || requiredOption('Please set the device username by setting --username option or MIKROTIK_USERNAME environment variable'),
  password: options.password || process.env.MIKROTIK_PASSWORD || requiredOption('Please set the device password by setting --password option or MIKROTIK_PASSWORD environment variable'),
  file: path.resolve(process.cwd(), options.file),
  keepComments: options.keepComments,
  beautify: options.beautify,
  delay: options.delay,
  secrets: (options.secrets ||  process.env.MIKROTIK_SECRETS || '').split(',').map(s=> s.trim()).filter(val=> !!val),
  keepSecrets: options.keepSecrets
};

if(optionMissing) {
  return process.exit(1);
} else {
  exporter.exportConfig(settings)
    .then(()=> console.log(`Config file exported to ${settings.file}.`))
    .catch(console.error.bind(console));
}
