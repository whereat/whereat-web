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
   |- GoButton
   |- Map

*/

class Root extends BaseComponent {
  constructor(){
    super();
  }

  render(){
    return (
      <div className="root">
        <div className="header">
          <Header />
        </div>
        <div className="display">
          <Display />
        </div>
      </div>
    );
  };
}

module.exports = Marty.createContainer(Root);
