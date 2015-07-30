const Marty = require('marty');
const BaseComponent = require('./BaseComponent');
const Header = require('./Header');

class Root extends BaseComponent {
  constructor(){
    super();
  }

  render(){
    return (
      <Header />
    );
  };
}

module.exports = Marty.createContainer(Root);
