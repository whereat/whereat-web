const Marty = require('marty');
const BaseComponent = require('./BaseComponent.jsx');
const Tappable = require('react-tappable');
const { wait } = require('../modules/async');
const { RED, GREEN } = require('../constants/Colors');
const { GO_RADIUS, GO_DIAMETER } = require('../constants/Dimensions');
const { isSafari } = require('../modules/system');
const cn = require('classname');

import Settings from '../constants/Settings'
const { share } = Settings;

class GoButton extends BaseComponent {

  constructor(){
    super();
    this.bindAll('_handleClick');
    this.events = { onClick: this._handleClick, onPress: this._handlePress };
  }

  render(){
    return (
      <Tappable ref="tappable" {...this.events} >
        <svg ref="svg" className="goButton" width={GO_DIAMETER} height={GO_DIAMETER} >
          <circle ref="circle" cx={GO_RADIUS} cy={GO_RADIUS} r={GO_RADIUS} fill={this.props.color} />
        </svg>
      </Tappable>
    );
  };

  _handleClick(){
    this.props.polling ?
      this.app.locPubActions.stopPolling(this.props.pollId) :
      this.app.locPubActions.poll(share[this.props.curShare]);
  }
}

module.exports = Marty.createContainer(GoButton, {
  listenTo: ['goButtonStore', 'locPubStore', 'settingsStore'],
  fetch: {
    color(){
      return this.app.goButtonStore.getColor();
    },
    curShare(){
      return this.app.settingsStore.getShare();
    },
    polling(){
      return this.app.locPubStore.isPolling();
    },
    pollId(){
      return this.app.locPubStore.getPollId();
    }
  }
});
