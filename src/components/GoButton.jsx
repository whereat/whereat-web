const Marty = require('marty');
const BaseComponent = require('./BaseComponent.jsx');
const Tappable = require('react-tappable');
const { wait } = require('../modules/async');


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
        <svg ref="svg" className="goButton" width={go.diameter()} height={go.diameter()}>
          <circle ref="circle" cx={go.radius} cy={go.radius} r={go.radius} fill={this.props.color} />
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
