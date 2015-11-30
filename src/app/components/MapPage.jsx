import Marty from 'marty';
import BaseComponent from './BaseComponent.jsx';
import MapContainer from './MapContainer';
import RefreshButton from './RefreshButton';
import PowerButton from './PowerButton';

class MapPage extends BaseComponent {
  render(){
    return (
      <div className="mapPage" ref="mapPage" >
          <MapContainer ref="mapContainer"/>
        <div>
          <PowerButton ref="powerButton" className="powerButton" />
        </div>
        <div>
          <RefreshButton ref="refreshButton" className="refreshButton"/>
        </div>
      </div>
    );
  };
}

export default Marty.createContainer(MapPage);
