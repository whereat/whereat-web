import Marty from 'marty';
import BaseComponent from './BaseComponent.jsx';
import { Button } from 'react-bootstrap';
import User from '../models/User';

class RefreshButton extends BaseComponent {

  constructor(){
    super();
    this.bindAll('_handleClick');
  }

  render(){
    return (
      <Button
        ref="button"
        className="refreshButton"
        onClick={this._handleClick}
      >
        <span
          ref="glyphicon"
          className="glyphicon glyphicon-refresh"
        >
        </span>
      </Button>
    );
  };

  _handleClick(){
    this.app.locSubActions.refresh();
  }
}

export default Marty.createContainer(RefreshButton);
