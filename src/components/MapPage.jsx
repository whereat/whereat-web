const Marty = require('marty');
const BaseComponent = require('./BaseComponent.jsx');
const MapContainer = require('./MapContainer');

class MapPage extends BaseComponent {
  render(){
    return (
      <div className="mapPage" ref="mapPageContents">
        <MapContainer ref="mapContainer"/>
      </div>
    );
  };
}

module.exports = Marty.createContainer(MapPage);
