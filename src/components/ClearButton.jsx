const Marty = require('marty');
const BaseComponent = require('./BaseComponent.jsx');
const { Button } = require('react-bootstrap');
const User = require('../models/User');

class ClearButton extends BaseComponent {

  constructor(){
    super();
    this.bindAll('_handleClick');
  }

  render(){
    return (
      <Button
        ref="button"
        className="clearButton"
        onClick={this._handleClick}
      >
        <span
          ref="glyphicon"
          className="glyphicon glyphicon-remove"
        >
        </span>
      </Button>
    );
  };

  _handleClick(){
    this.app.locSubActions.remove(User());
  }
}

module.exports = Marty.createContainer(ClearButton);
