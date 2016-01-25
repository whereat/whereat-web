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

import {  keys, isEqual, isNumber, isString } from 'lodash';

const h = {};

h.isUserLocation = (data) =>
  isEqual(keys(data), ['id', 'lat', 'lon', 'time']) &&
  isString(data.id) === true &&
  isNumber(data.lat) === true &&
  isNumber(data.lon) === true &&
  isNumber(data.time) === true;

h.isUserLocationRefresh = (data) =>
  isEqual(keys(data), ['lastPing', 'location']) &&
  isNumber(data.lastPing) &&
  h.isUserLocation(data.location);

h.isUser = (data) => isEqual(keys(data), ['id']) && isString(data.id);

module.exports = h;
