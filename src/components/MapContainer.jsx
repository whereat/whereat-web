const Marty = require('marty');
const BaseComponent = require('./BaseComponent.jsx');
const { TileLayer, Map, Marker, Popup } = require('react-leaflet');
const { Seq } = require('immutable');
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
          {this.props.locations.map((loc, i) => this._markerify(loc, i))}
        </Map>
      </div>
      );
    }

  // (Location) -> Array[Number]
  _positionify(loc) {
    debugger;
    return [loc.get('lat'), loc.get('lon')];
  }

  // (Location) -> Marker
  _markerify(loc, i){
    debugger;
    return (
      <Marker position={this._positionify(loc)} key={i} ref={`marker${i}`} >
        <Popup>
          <span>{this._pretty(loc.get('time'))}</span>
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
  listenTo: ['userLocationStore'],
  fetch: {
    locations(){
      const loc = this.app.userLocationStore.getLoc();
      return loc ? Seq.of(loc) : Seq();
    }
  }
});
