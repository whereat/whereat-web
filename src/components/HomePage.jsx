const Marty = require('marty');
const BaseComponent = require('./BaseComponent.jsx');
const GoButton = require('./GoButton');

class HomePage extends BaseComponent {
  render(){
    return (
      <div className='homePage' ref='homePage'>
        <GoButton />
      </div>
    );
  };
}

module.exports = Marty.createContainer(HomePage);
