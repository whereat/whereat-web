const Marty = require('marty');
const BaseComponent = require('./BaseComponent');
const GoButton = require('./GoButton');

class Display extends BaseComponent {
  render(){
    return (
      <GoButton />
    );
  };
}

module.exports = Marty.createContainer(Display);
