import {Map} from 'immutable';
import { nyse3ULSeq as ls } from './sampleLocations';
import Location from '../../app/models/Location';
import UserLocation from '../../app/models/UserLocation';
import { s17, s17UL, s17_UL, nyse3Seq, nyse3ULSeq } from '../support/sampleLocations';

const nyse3State =  Map({
  center: Location(s17),
  locs: Map([
    [ls.get(0).id, ls.get(0)],
    [ls.get(1).id, ls.get(1)],
    [ls.get(2).id, ls.get(2)]
  ]),
  locTtl: 1,
  forgetJob: -1
});

export default {
  clearState: Map({
    center: Location(s17),
    locs: Map(),
    locTtl: 1,
    forgetJob: -1
  }),
  nyse3State: nyse3State,
  nyse3ModTimeState: nyse3State.setIn(['locs', ls.get(2).id], ls.get(2).time + 20),
  nyse3ModTtlState: nyse3State.set('locTtl', 0),
  nyse3ModForgetJobState: nyse3State.set('forgetJob', 1)
};
