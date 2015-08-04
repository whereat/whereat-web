const Marty = require('marty');
const BaseComponent = require('./BaseComponent.jsx');

class MapPage extends BaseComponent {
  render(){
    return (
      <div className="mapPage">'THIS IS A MAP!''</div>
    );
  };
}

module.exports = Marty.createContainer(MapPage);
