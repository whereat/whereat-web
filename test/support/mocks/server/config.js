const { URL } = require('../../../../src/modules/api');
const init = require('./initResponse');
//const refresh = require('./refreshResponse');

module.exports = [
  {
  pattern: "https://whereat-server.herokuapp.com/locations/init",
  fixtures: init,
  callback: (match, data) => ({ body: data })
  }
  // {
  // pattern: `${URL}/locations/refresh`,
  // fixtures: refresh,
  // callback: (match, data) => ({ body: data })
  // }
];
