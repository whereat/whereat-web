const Marty = require('marty');
const BaseComponent = require('./BaseComponent');
const { HOME, MAP, SEC, SET } = require('../constants/Pages');
const HomePage = require('./HomePage');
const MapPage = require('./MapPage');
const SecurityPage = require('./SecurityPage');
const SettingsPage = require('./SettingsPage');
const NotificationContainer = require('./NotificationContainer');

class Display extends BaseComponent {
  render(){
    return (
      <div id="display">
        {{
          [HOME]: () => <HomePage ref='homePage' />,
          [MAP]: () => <MapPage ref='mapPage' />,
          [SEC]: () => <SecurityPage ref='securityPage' />,
          [SET]: () => <SettingsPage ref='settingsPage' />
         }[this.props.page]()}
        <NotificationContainer />
      </div>
    );
  };
}

module.exports = Marty.createContainer(Display, {
  listenTo: ['navStore'],
  fetch: {
    page(){
      return this.app.navStore.getPage();
    }
  }
});
