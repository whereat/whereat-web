const Marty = require('marty');
const BaseComponent = require('./BaseComponent.jsx');
const { HOME, MAP } = require('../constants/Pages');
const HomePage = require('./HomePage');
const MapPage = require('./MapPage');

class Display extends BaseComponent {
  render(){
    return (
      {
        [HOME]: () => <HomePage ref='page'/>,
        [MAP]: () => <MapPage ref='page'/>
      }[this.props.page]()

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
