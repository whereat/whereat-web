/**
 *
 * Copyright (c) 2015-present, Total Location Test Paragraph.
 * All rights reserved.
 *
 * This file is part of Where@. Where@ is free software:
 * you can redistribute it and/or modify it under the terms of
 * the GNU General Public License (GPL), either version 3
 * of the License, or (at your option) any later version.
 *
 * Where@ is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For more details,
 * see the full license at <http://www.gnu.org/licenses/gpl-3.0.en.html>
 *
 */

import http from 'superagent';

const api = {};

api.URL = "https://api.whereat.io";

// (UserLocationRefresh) -> Promise[Array[UserLocation]]
api.update = (req) => post(req, 'update');

// (User) -> Promise[String]
api.remove = (req) => post(req, 'remove');

const post = (req, endpoint) => (new Promise(
  (rslv, rej) => http
    .post(`${api.URL}/locations/${endpoint}`)
    .send(req.toJS())
    .end((err, res) => err ? rej(err) : rslv(res.body))));

export default api;
