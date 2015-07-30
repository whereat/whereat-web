const Marty = require('marty');
const BaseComponent = require('./BaseComponent');

const go = {
  radius: 110,
  color: {
    off: '#dd3b47',
    on: '#30ff40'
  }
};

class GoButton extends BaseComponent {
  render(){
    return (
          <svg className="goButton" width={go.radius*2} height={go.radius*2}>
            <circle cx={go.radius} cy={go.radius} r={go.radius} fill={go.color.off} />
          </svg>

    );
  };
}

module.exports = Marty.createContainer(GoButton);
