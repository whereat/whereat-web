const time = {};

time.now = () => new Date().getTime();

time.pretty = (millis) => 'hmmm..';

module.exports = time;
