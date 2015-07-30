const Marty = require('marty');
const BaseComponent = require('./BaseComponent');
const Tappable = require('react-tappable');


class GoButton extends BaseComponent {

  constructor(){
    super();
    this.go = {
      radius: 110,
      diameter: () => this.go.radius * 2,
      color: {
        off: '#dd3b47',
        on: '#30ff40'
      }
    };
    this.events = {
      onClick: this._handleClick,
      onPress: this._handlePress
    };
  }

  render(){
    const { go, events } = this;
    return (
      <Tappable {...events} >
        <svg className="goButton" width={go.diameter()} height={go.diameter()}>
          <circle cx={go.radius} cy={go.radius} r={go.radius} fill={go.color.off} />
        </svg>
      </Tappable>
    );
  };

  _handleClick(){
    alert('I got clicked!');
  }

  _handlePress(){
    alert('I got pressed!');
  }

}

module.exports = Marty.createContainer(GoButton);
