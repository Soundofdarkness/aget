const program = require('commander');
const pkg = require('../package.json');
const process = require('process');
const downloader = require('./downloader');

program
  .version(pkg.version)
  .name('lget')
  .usage('<options> [url]')
  .option('-f, --file', 'file to download to')
  .parse(process.argv);


if (typeof program.args[0] === 'undefined') {
  program.outputHelp();
  process.exit(1);
}
downloader.download(program.args[0], program.file);
