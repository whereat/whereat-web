const Marty = require('marty');
const BaseComponent = require('./BaseComponent');
const { Grid, Row } = require('react-bootstrap');
const Header = require('./Header');
const Display = require('./Display');

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
