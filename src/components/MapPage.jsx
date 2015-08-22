const Marty = require('marty');
const BaseComponent = require('./BaseComponent.jsx');
const MapContainer = require('./MapContainer');
const ClearButton = require('./ClearButton');

class MapPage extends BaseComponent {
  render(){
    return (
      <div className="mapPage" ref="mapPageContents">
        <MapContainer ref="mapContainer"/>
        <ClearButton ref="clearButton" />
      </div>
    );
  };
}

module.exports = Marty.createContainer(MapPage);
