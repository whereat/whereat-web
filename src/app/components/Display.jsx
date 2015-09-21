const Marty = require('marty');
const BaseComponent = require('./BaseComponent');
const { HOME, MAP } = require('../constants/Pages');
const HomePage = require('./HomePage');
const MapPage = require('./MapPage');
const NotificationContainer = require('./NotificationContainer');

class Display extends BaseComponent {
  render(){
    return (
      <div id="display">
        {{
          [HOME]: () => <HomePage ref='homePage' />,
          [MAP]: () => <MapPage ref='mapPage' />
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