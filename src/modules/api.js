const http = require('superagent');

const api = {};

api.URL = "https://whereat-server.herokuapp.com";

// (UserLocationRefresh) -> Promise[Array[UserLocation]]
api.update = (req) => post(req, 'update')

// (UserLocation) -> Promise[Array[UserLocation]]
api.init = (req) => post(req, 'init');

// (UserLocationTimed) -> Promise[Array[UserLocation]]
api.refresh = (req) => post(req, 'refresh');

// (UserLocation) -> Promise[String]
api.remove = (req) => post(req, 'remove');

const post = (req, endpoint) => (new Promise(
  (rslv, rej) => http
    .post(`${api.URL}/locations/${endpoint}`)
    .send(req.toJS())
    .end((err, res) => err ? rej(err) : rslv(res.body))));

module.exports = api;
