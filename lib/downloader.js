const request = require('request');
const progress = require('request-progress');
const url = require('url');
const path = require('path');
const fs = require('fs');
const ascii = require('cli-progress');
const _colors = require('colors');
const _pretty = require('prettysize');


function getFileName(urlstring) {
  return path.basename(url.parse(urlstring).pathname);
}

function download(urlstring, file) {
  let filename = getFileName(urlstring);

  if (filename === '') {
    filename = 'index.html';
  }

  if (typeof file !== 'undefined') {
    filename = file;
  }

  console.log(_colors.cyan(`Downloading ${filename}\n`));

  const filepath = path.join(process.cwd(), filename);
  const filestream = fs.createWriteStream(filepath);

  const status = progress(request(urlstring));

  const bar = new ascii.Bar({
    format: `Downloading | ${_colors.cyan('{bar}\u25A0')}| {percentage}% || ETA: {eta} s || Speed: {speed}`,
    barCompleteChar: '\u25A0',
    barIncompleteChar: ' ',
    hideCursor: true,
  });

  bar.start(100, 0, {
    eta: 'N/A',
    speed: '0 kb/s',
  });

  let elapsed = 0;
  status.on('progress', (stat) => {
    const size = _pretty(stat.speed);
    elapsed = stat.time.elapsed;
    bar.update(stat.percent * 100, {
      speed: `${size}/s`,
      eta: `${Math.round(stat.time.remaining)}`,
    });
  });

  status.on('error', (err) => {
    console.error(err);
  });

  status.on('end', () => {
    bar.stop();
    console.log(_colors.cyan(`\nDownloading done after ${elapsed.toString()} seconds`));
  });

  status.pipe(filestream);
}

module.exports.download = download;
