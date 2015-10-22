import Marty from 'marty';
import BaseComponent from './BaseComponent.jsx';
import MapContainer from './MapContainer';
import ClearButton from './ClearButton';

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

export default Marty.createContainer(MapPage);
