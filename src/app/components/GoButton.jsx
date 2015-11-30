import Marty from 'marty';
import BaseComponent from './BaseComponent.jsx';
import Tappable from 'react-tappable';
import { wait } from '../modules/async';
import { RED, GREEN } from '../constants/Colors';
import { GO_RADIUS, GO_DIAMETER } from '../constants/Dimensions';
import { isSafari } from '../modules/system';

import Settings from '../constants/Settings'
const { shareFreq } = Settings;

class GoButton extends BaseComponent {

  constructor(){
    super();
    this.bindAll('_handleClick');
    this.events = { onClick: this._handleClick, onPress: this._handlePress };
  }

  render(){

    const msg = this.props.polling ? "ON" : "OFF";
    const fontSize = this.props.polling ? '6em' : '5.1em';
    const color = this.props.polling ? GREEN : RED;

    return (
      <Tappable ref="tappable" {...this.events} >
        <svg ref="svg" className="goButton" width={GO_DIAMETER} height={GO_DIAMETER} >
          <circle
           ref="circle"
           cx={GO_RADIUS}
           cy={GO_RADIUS}
           r={GO_RADIUS}
           fill={color}
          />
          <text
            x={GO_RADIUS * .20}
            y={GO_RADIUS * 1.33}
            fontSize={fontSize}
            ref="msg"
            >
            {msg}
          </text>
        </svg>
      </Tappable>
    );
  };

  _handleClick(){
    this.props.polling ?
      this.app.locPubActions.stopPolling(this.props.pollId) :
      this.app.locPubActions.poll(shareFreq.values[this.props.curShareFreq]);
  }
}

export default Marty.createContainer(GoButton, {
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
