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

export default {
  shareFreq: {
    labels: [
      '5 sec (most accurate)',
      '15 sec',
      '30 sec',
      '1 min',
      '5 min (most battery life)'
    ],
    values: [
      5000,
      15000,
      30000,
      60000,
      300000
    ]
  },
  locTtl: {
    labels: [
      "30 min (most secure)",
      "1 hr",
      "2 hr (most info)"
    ],
    values: [
      1800000,
      3600000,
      7200000
    ]
  }
};
