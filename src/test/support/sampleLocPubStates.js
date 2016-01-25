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

import { Map } from 'immutable';
import { s17, s17_ } from '../support/sampleLocations';

export default {
  emptyState: Map({ polling: false, pollId: -1, uid: s17.id, loc: Map() }),
  ping1State: Map({ polling: false, pollId: -1, uid: s17.id, loc: Map(s17) }),
  ping2State: Map({ polling: false, pollId: -1, uid: s17_.id, loc: Map(s17_) }),
  pollState: Map({ polling: true, pollId: 0, uid: s17.id, loc: Map()})
};
