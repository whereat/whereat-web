const Marty = require('marty');
const BaseComponent = require('./BaseComponent.jsx');
const Tappable = require('react-tappable');
const { wait } = require('../modules/async');
const { RED, GREEN } = require('../constants/Colors');
const { GO_RADIUS, GO_DIAMETER } = require('../constants/Dimensions');


class GoButton extends BaseComponent {

  constructor(){
    super();
    this.bindAll('_handlePress', '_handleClick');
    this.go = { radius: 110, diameter: () => this.go.radius * 2 };
    this.events = { onClick: this._handleClick, onPress: this._handlePress };
  }

  render(){
    const { go, events } = this;
    return (
      <Tappable ref="tappable" {...events} >
        <svg ref="svg" className="goButton" width={GO_DIAMETER} height={GO_DIAMETER}>
          <circle ref="circle" cx={GO_RADIUS} cy={GO_RADIUS} r={GO_RADIUS} fill={this.props.color} />
        </svg>
      </Tappable>
    );
  };

  _handleClick(){
    this.app.shareActions.ping();
  }

  _handlePress(){
    this.app.shareActions.togglePoll();
  }

}

module.exports = Marty.createContainer(GoButton, {
  listenTo: ['goButtonStore'],
  fetch: {
    color() {
      return this.app.goButtonStore.getColor();
    }
  }
});
