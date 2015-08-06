const BaseComponent = require('../../../src/components/BaseComponent');

class MockComponent extends BaseComponent {
  render(){
    return (
      <div className="mockComponent">
      </div>
    );
  }
}

module.exports = MockComponent;
