const Marty = require('marty');
const BaseComponent = require('./BaseComponent.jsx');
const Header = require('./Header.jsx');
const Display = require('./Display.jsx');

const sc = require('../modules/scheduler');
const everyMinute = 60 * 1000;

/*

Root
|
|- Header
|- Display
   |
   |- HomePage
   |  |- GoButton
   |
   |- MapPage
   |  |- MapContainer
   |  |- ClearButton
   |
   |- NotificationContainer

*/

class Root extends BaseComponent {
  constructor(){
    super();
    this.state = { hasScheduled: false };
    this.bindAll('_scheduleOnce', '_forget');
  }

  render(){
    return (
      <div className="root" ref="root">
        <Header key="header" ref="header"/>
        <Display key="display" ref="display"/>
      </div>
    );
  };

  componentDidMount(){
    this._scheduleOnce();
  }

  _scheduleOnce(){
    if (!this.state.hasScheduled) {
      sc.schedule(this._forget, everyMinute);
      this.setState({hasScheduled: true});
    }
  }

  _forget(){
    this.app.locSubActions.forget();
  }


}

module.exports = Marty.createContainer(Root);
