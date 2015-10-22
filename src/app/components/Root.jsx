const Marty = require('marty');
const BaseComponent = require('./BaseComponent.jsx');
const Header = require('./Header.jsx');
const Display = require('./Display.jsx');
import { SEC } from '../constants/Pages';
import { locTtl } from '../constants/Settings';

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
    this.state = {
      forgetScheduled: false,
      securityAlerted: false
    };
    this.bindAll('_scheduleForget', '_forget');
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
    this._scheduleForget();
    this._alertSecurity();
  }

  _scheduleForget(){
    if (!this.state.forgetScheduled) {
      this.app.locSubActions.scheduleForget(locTtl.values[1]);
      this.setState({forgetScheduled: true});
    }
  }

  _forget(){
    this.app.locSubActions.forget();
  }

  _alertSecurity(){
    if(!this.state.securityAlerted){
      this.app.navActions.goto(SEC);
      this.setState({securityAlerted: true});
    }
  }
}

export default  Marty.createContainer(Root);
