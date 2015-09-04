const Marty = require('marty');
const BaseComponent = require('./BaseComponent.jsx');
const Tappable = require('react-tappable');
const { wait } = require('../modules/async');
const { RED, GREEN } = require('../constants/Colors');
const { GO_RADIUS, GO_DIAMETER } = require('../constants/Dimensions');
const { isSafari } = require('../modules/system');
const cn = require('classname');

class GoButton extends BaseComponent {

  constructor(){
    super();
    this.bindAll('_handlePress', '_handleClick');
    this.events = { onClick: this._handleClick, onPress: this._handlePress };
  }

  /* <div className={
     cn(
     'funGoButton', {
     red: this.props.color === RED,
     green: this.props.color === GREEN
     })
     }>
     </div> */

  render(){
    return (
      <Tappable ref="tappable" {...this.events} >
        <svg
         ref="svg"
         className={ isSafari() ? 'goButtonSafari' : 'goButton' }
         width={GO_DIAMETER}
         height={GO_DIAMETER}
        >
          <circle ref="circle" cx={GO_RADIUS} cy={GO_RADIUS} r={GO_RADIUS} fill={this.props.color} />
        </svg>

      </Tappable>
    );
  };

  _goButtonClass(){
    console.log(isSafari());
    return isSafari() ? 'goButtonSafari' : 'goButton';
  }

  _handleClick(){
    if (!this.props.polling) {
      this.app.locPubActions.ping();
    }
  }

  _handlePress(){
    this.props.polling ?
      this.app.locPubActions.stopPolling(this.props.pollId) :
      this.app.locPubActions.poll();
  }

}

module.exports = Marty.createContainer(GoButton, {
  listenTo: ['goButtonStore', 'locPubStore'],
  fetch: {
    color() {
      return this.app.goButtonStore.getColor();
    },
    polling(){
      return this.app.locPubStore.isPolling();
    },
    pollId(){
      return this.app.locPubStore.getPollId();
    }
  }
});
