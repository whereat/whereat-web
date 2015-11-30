import Marty from 'marty';
import BaseComponent from './BaseComponent.jsx';
import { Button } from 'react-bootstrap';
import User from '../models/User';
import Settings from '../constants/Settings'
const { shareFreq } = Settings;
import cn from 'classnames';


class PowerButton extends BaseComponent {

  constructor(){
    super();
    this.bindAll('_handleClick');
  }

  render(){
    return (
      <Button
        ref="button"
        className={`powerButton ${this.props.polling ? 'powerOn' : 'powerOff'}`}
        onClick={this._handleClick}
        >
        {this.props.polling ? "ON" : "OFF"}
      </Button>
    );
  };

  _handleClick(){
    this.props.polling ?
      this.app.locPubActions.stopPolling(this.props.pollId) :
      this.app.locPubActions.poll(shareFreq.values[this.props.curShareFreq]);
  }
}

export default Marty.createContainer(PowerButton, {
  listenTo: ['locPubStore', 'settingsStore'],
  fetch: {
    curShareFreq(){
      return this.app.settingsStore.getShareFreq();
    },
    polling(){
      return this.app.locPubStore.isPolling();
    },
    pollId(){
      return this.app.locPubStore.getPollId();
    }
  }
});
