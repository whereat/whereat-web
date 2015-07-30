const Marty = require('marty');
const BaseComponent = require('./BaseComponent');

class Body extends BaseComponent {
  constructor(){
    super();
  }

  render(){
    return (
      <div className="body">HELLO WORLD!</div>
    );
  };
}

module.exports = Marty.createContainer(Body);
