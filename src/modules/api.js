const http = require('superagent');

const api = {};

api.URL = "https://whereat-server.herokuapp.com";

// (UserLocation) -> Promise[Array[UserLocation]]
api.init = (req) => api.post(req, 'init');

// (UserLocationTimed) -> Promise[Array[UserLocation]]
api.refresh = (req) => api.post(req, 'refresh');

// (UserLocation) -> Promise[String]
api.remove = (req) => api.post(req, 'remove');

// (LocationRequest, String) -> Primise[Array[LocationResponse]]
const post = (req, endpoint) => new Promise(
  (rslv, rej) => http
    .post(`${api.URL}/locations/${endpoint}`)
    .send(req.toJS)
    .end((err, res) => err ? rej(err) : rslv(res))
);

module.exports = api;
