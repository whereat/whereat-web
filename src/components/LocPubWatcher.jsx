const Marty = require('marty');
const BaseComponent = require('./BaseComponent.jsx');

//TODO: use pure render mixin so won't re-render when lastPing changes

class LocPubWatcher extends BaseComponent {
  constructor(){
    super();
  }

  render(){
    if(this.props.hasLoc) {
      this.props.firstPing ?
        this.app.locSubActions.init(this.props.loc) :
        this.app.locSubActions.refresh(this.props.locRefresh);
    }
    return (<div></div>);
  }
}

module.exports = Marty.createContainer(LocPubWatcher, {
  listenTo: ['locPubStore'],
  fetch: {
    firstPing(){ return this.app.locPubStore.firstPing(); },
    hasLoc(){ return this.app.locPubStore.hasLoc(); },
    loc(){ return this.app.locPubStore.getLoc(); },
    locRefresh() { return this.app.locPubStore.getLocRefresh(); }
  }
});
