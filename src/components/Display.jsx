const Marty = require('marty');
const BaseComponent = require('./BaseComponent.jsx');
const GoButton = require('./GoButton.jsx');

class Display extends BaseComponent {
  render(){
    return (
      <GoButton />
    );
  };
}

module.exports = Marty.createContainer(Display);
