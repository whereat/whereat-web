import Marty from 'marty';
import BaseComponent from './BaseComponent.jsx';
import { Button } from 'react-bootstrap';
import User from '../models/User';

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

export default Marty.createContainer(ClearButton);
