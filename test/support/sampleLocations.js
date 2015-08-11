const Location = require('../../src/models/Location');

const l = {};

//TODO make immutable sample locs...

l.s17 = {
  id: "75782cd4-1a42-4af1-9130-05c63b2aa9ff",
  lat: 40.7092529,
  lon: -74.0112551,
  time: 1505606400000
};

l.s17NoId = {
  lat: 40.7092529,
  lon: -74.0112551,
  time: 1505606400000
};

l.s17_ = {
  id: "75782cd4-1a42-4af1-9130-05c63b2aa9ff",
  lat: 40.7092528,
  lon: -74.0112550,
  time: 1505606400000
};

l.s17Nav = {
  coords: {
    latitude: 40.7092529,
    longitude: -74.0112551
  },
  timestamp: 1505606400000
};

l.s17Location = Location(l.s17);

l.s17_Nav = {
  coords: {
    latitude: 40.7092528,
    longitude: -74.0112550
  },
  timestamp: 1505606400000
};

l.nyse2 = [{
  "id": "75782cd4-1a42-4af1-9130-05c63b2aa9fa",
  "lat": 40.704715,
  "lon": -74.013685,
  "time": 2505606400000
}, {
  "id": "75782cd4-1a42-4af1-9130-05c63b2aa9fb",
  "lat": 40.703084,
  "lon": -74.010126,
  "time": 2505606400000
}];



l.nyse3 = [{
  id: "75782cd4-1a42-4af1-9130-05c63b2aa9ff",
  lat: 40.7092529,
  lon: -74.0112551,
  time: 2505606400000
},{
  "id": "75782cd4-1a42-4af1-9130-05c63b2aa9fa",
  "lat": 40.704715,
  "lon": -74.013685,
  "time": 2505606400000
}, {
  "id": "75782cd4-1a42-4af1-9130-05c63b2aa9fb",
  "lat": 40.703084,
  "lon": -74.010126,
  "time": 2505606400000
}];


module.exports = l;
