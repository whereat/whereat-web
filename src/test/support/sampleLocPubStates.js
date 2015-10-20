import { Map } from 'immutable';
import { s17, s17_ } from '../support/sampleLocations';

export default {
  emptyState: Map({ polling: false, pollId: -1, uid: s17.id, loc: Map() }),
  ping1State: Map({ polling: false, pollId: -1, uid: s17.id, loc: Map(s17) }),
  ping2State: Map({ polling: false, pollId: -1, uid: s17_.id, loc: Map(s17_) }),
  pollState: Map({ polling: true, pollId: 1, uid: s17.id, loc: Map()})
};
