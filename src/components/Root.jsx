const Marty = require('marty');
const BaseComponent = require('./BaseComponent.jsx');
const { Grid, Row } = require('react-bootstrap');
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
