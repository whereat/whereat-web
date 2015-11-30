import Marty from 'marty';
import BaseComponent from './BaseComponent';
import { POWER, MAP, SEC, SET } from '../constants/Pages';
import HomePage from './HomePage';
import MapPage from './MapPage';
import SecurityPage from './SecurityPage';
import SettingsPage from './SettingsPage';
import NotificationContainer from './NotificationContainer';

class Display extends BaseComponent {
  render(){
    return (
      <div id="display">
        {{
          [POWER]: () => <HomePage ref='homePage' />,
          [MAP]: () => <MapPage ref='mapPage' />,
          [SEC]: () => <SecurityPage ref='securityPage' />,
          [SET]: () => <SettingsPage ref='settingsPage' />
         }[this.props.page]()}
        <NotificationContainer />
      </div>
    );
  };
}

export default Marty.createContainer(Display, {
  listenTo: ['navStore'],
  fetch: {
    page(){
      return this.app.navStore.getPage();
    }
  }
});
