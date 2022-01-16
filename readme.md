## Export MikroTik Config

### Installing
```bash
npm install -g mikrotik-export
```

### Running
```bash
mikrotik-export --help

Usage: mikrotik-export [options]

Options:

  --version              output the version number
  --host <host>          Device hostname or IP address
  --port <port>          SSH port of the device (default: 22)
  --username <username>  Device username
  --password <password>  Device password
  --file <file>          Path of the exported file (default: config.rsc)
  --keep-comments        Keep Comments
  --no-beautify          No Beautify
  --secrets <secrets>    Comma separated list of secrets to conceal
  --keep-secrets         Keep Secrets
  --delay <delay>        Add a delay at the beginning of the file
                         https://forum.mikrotik.com/viewtopic.php?t=73663#p374885
                         Set `none` for no delay. (default: 30s)
  -h, --help             output usage information
```
