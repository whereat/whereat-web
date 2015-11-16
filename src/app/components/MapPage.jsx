import Marty from 'marty';
import BaseComponent from './BaseComponent.jsx';
import MapContainer from './MapContainer';
import ClearButton from './ClearButton';
import RefreshButton from './RefreshButton';

class MapPage extends BaseComponent {
  render(){
    return (
      <div className="mapPage" ref="mapPage">
        <MapContainer ref="mapContainer"/>
        <div>
          <RefreshButton ref="refreshButton" className="refreshButton"/>
        </div>
      </div>
    );
  };
}

export default Marty.createContainer(MapPage);
