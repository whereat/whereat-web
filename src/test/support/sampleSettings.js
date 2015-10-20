import { Map } from 'immutable';

export default {
  s1: Map({share: 1}),
  s2: Map({share: 2}),
  s1t1: Map({share: 1, ttl: 1}),
  s1t2: Map({share: 1, ttl: 2}),
  s2t1: Map({share: 2, ttl: 1}),
  s2t2: Map({share: 2, ttl: 2})
};
