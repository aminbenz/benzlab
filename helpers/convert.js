function secondsToHms(seconds) {
  seconds = Number(seconds);
  var h = Math.floor(seconds / 3600);
  var m = Math.floor((seconds % 3600) / 60);
  var s = Math.floor((seconds % 3600) % 60);

  var hDisplay = h > 0 ? h + (h == 1 ? ' hour, ' : ' hours, ') : '';
  var mDisplay = m > 0 ? m + (m == 1 ? ' minute, ' : ' minutes, ') : '';
  var sDisplay = s > 0 ? s + (s == 1 ? ' second' : ' seconds') : '';
  return `${hDisplay + mDisplay + sDisplay}`;
}

function bytesToSize(bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

module.exports = { secondsToHms, bytesToSize };
