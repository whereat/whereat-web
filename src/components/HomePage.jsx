const Marty = require('marty');
const BaseComponent = require('./BaseComponent.jsx');
const GoButton = require('./GoButton');

class HomePage extends BaseComponent {
  render(){
    return (
      <div className='HomePage'>
        <GoButton />
      </div>
    );
  };
}

module.exports = Marty.createContainer(HomePage);
