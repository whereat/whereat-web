import { Map } from 'immutable';

export default {
  s1: Map({shareFreq: 1}),
  s2: Map({shareFreq: 2}),
  s1t1: Map({shareFreq: 1, locTtl: 1}),
  s1t2: Map({shareFreq: 1, locTtl: 2}),
  s2t1: Map({shareFreq: 2, locTtl: 1}),
  s2t2: Map({shareFreq: 2, locTtl: 2})
};
