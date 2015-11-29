import Marty from 'marty';
import BaseComponent from './BaseComponent.jsx';
import Header from './Header.jsx';
import Display from './Display.jsx';
import { SEC } from '../constants/Pages';
import { locTtl } from '../constants/Settings';

import sc from '../modules/scheduler';
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
}

export default  Marty.createContainer(Root);
