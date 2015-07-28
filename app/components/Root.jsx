const Marty = require('marty');
const BaseComponent = require('./BaseComponent');

class Root extends BaseComponent {
  constructor(){
    super();
  }

  render(){
    return (<h1>Hello World!</h1>);
  };
}

module.exports = Marty.createContainer(Root);
