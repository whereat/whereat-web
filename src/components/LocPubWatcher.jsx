const Marty = require('marty');
const BaseComponent = require('./BaseComponent.jsx');

class LocPubWatcher extends BaseComponent {
  constructor(){
    super();
  }

  componentDidMount(){
    if (this.props.hasLoc){
      this.props.firstPing ?
        this.app.locSubActions.init(this.props.loc)
        this.app.locSubActions.refresh(this.props.locRefresh)
    }
  }
}

module.exports = Marty.createContainer(LocPubWatcher, {
  listenTo: ['locPubStore'],
  fetch: {

  }
});
