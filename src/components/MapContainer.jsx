const Marty = require('marty');
const BaseComponent = require('./BaseComponent.jsx');
const { TileLayer, Map, Marker, Popup } = require('react-leaflet');
const { Seq } = require('immutable');
const { url, attribution, id, token } = require('../constants/MapSpecs');
const { s17, nyse2, nyse3 } = require('../../test/support/sampleLocations');
const Location = require('../models/Location');
const pd = require('pretty-date');

class MapContainer extends BaseComponent {

    constructor(){
      super();
      this.bindAll('_markerify', '_positionify');
    }

  render(){

    return (
      <div id="map" ref="map">
        <Map
          center={this._positionify(this.props.center)}
          zoom={15}
        >
          <TileLayer url={url} attribution={attribution} accessToken={token} id={id}/>
          {this.props.locations.map((loc, i) => this._markerify(loc, i))}
        </Map>
      </div>
      );
    }

  // (Location) -> Array[Number]
  _positionify(loc) {
    return [loc.get('lat'), loc.get('lon')];
  }

  // (Location) -> Marker
  _markerify(loc, i){
    return (
      <Marker position={this._positionify(loc)} key={i} ref={`marker${i}`} >
        <Popup>
          <span>{'Hi!'}</span>
        </Popup>
      </Marker>
    );
  }

  // (Number) -> String
  _pretty(millis){
    return pd.format(new Date(millis));
  }

}

module.exports = Marty.createContainer(MapContainer, {
  listenTo: ['locSubStore'],
  fetch: {
    center(){
      return this.app.locSubStore.getCenter();
    },
    locations(){
      return this.app.locSubStore.getLocs();
    }
  }
});
