const Marty = require('marty');
const BaseComponent = require('./BaseComponent.jsx');
const Header = require('./Header.jsx');
const Display = require('./Display.jsx');

/*

Root
|
|- Header
|- Display
   |
   |- HomePage
   |  |- GoButton
   |
   |- MapPage
   |  |- MapContainer
   |  |- ClearButton
   |
   |- NotificationContainer

*/

class Root extends BaseComponent {
  constructor(){
    super();
  }

  render(){
    return (
      <div className="root">
        <Header />
        <Display />
      </div>
    );
  };
}

module.exports = Marty.createContainer(Root);
