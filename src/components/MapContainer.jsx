const Marty = require('marty');
const BaseComponent = require('./BaseComponent.jsx');
const { TileLayer, Map, Marker, Popup } = require('react-leaflet');
const { url, attribution, id, token } = require('../constants/MapSpecs');
const { s17 } = require('../../test/support/sampleLocations');
const pd = require('pretty-date');

class MapContainer extends BaseComponent {

    constructor(){
      super();
    }

  render(){

    return (
      <div id="map">
        <Map center={this._positionify(s17)} zoom={15} >
          <TileLayer url={url} attribution={attribution} accessToken={token} id={id}/>
          {this._markerify(s17)}
        </Map>
      </div>
      );
    }

  // (Location) -> Array[Number]
  _positionify(loc) {
    return [loc.lat, loc.lon];
  }

  // (Location) -> Marker
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
