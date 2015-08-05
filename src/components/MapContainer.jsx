const Marty = require('marty');
const BaseComponent = require('./BaseComponent.jsx');
const { TileLayer, Map, Marker, Popup } = require('react-leaflet');
const { s17 } = require('../../test/support/sampleLocations');
const pd = require('pretty-date');

class MapContainer extends BaseComponent {

    constructor(){
      super();
    }

  render(){
    const url = "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
    const attribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    return (
      /* <div>
         "I'm a map!"
         </div> */
      <Map center={this._positionify(s17)} zoom={13} >
        <TileLayer url={url} attribution={attribution} />
        {this._markerify(s17)}
      </Map>
      );
    }

  // (Location) -> Array[Number]
  _positionify(loc) {
    return [loc.lat, loc.lon];
  }

  _markerify(loc){
    return (
      <Marker position={this._positionify(loc)} >
        <Popup>
          <span>{this._pretty(loc.time)}</span>
        </Popup>
      </Marker>
    );
  }

  // (Number) -> String
  _pretty(millis){
    return pd.format(new Date(millis));
  }

}

module.exports = Marty.createContainer(MapContainer);
