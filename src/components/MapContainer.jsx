const Marty = require('marty');
const BaseComponent = require('./BaseComponent.jsx');
const { TileLayer, Map, Marker, Popup } = require('react-leaflet');
const { url, attribution, id, token } = require('../constants/MapSpecs');
const { s17, nyse2, nyse3 } = require('../../test/support/sampleLocations');
const pd = require('pretty-date');

class MapContainer extends BaseComponent {

    constructor(){
      super();
      this.bindAll('_markerify', '_positionify');
    }

  render(){

    return (
      <div id="map" ref="map">
        <Map center={this._positionify(s17)} zoom={15} >
          <TileLayer url={url} attribution={attribution} accessToken={token} id={id}/>
          {nyse2.map((loc, i) => this._markerify(loc, i))}
        </Map>
      </div>
      );
    }

  // (Location) -> Array[Number]
  _positionify(loc) {
    return [loc.lat, loc.lon];
  }

  // (Location) -> Marker
  _markerify(loc, i){
    return (
      <Marker position={this._positionify(loc)} key={i} ref={`marker${i}`} >
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
