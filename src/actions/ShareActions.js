const Marty = require('marty');
const ShareConstants = require('../constants/ShareConstants');
const { wait } = require('../modules/async');
const pingInteval = .1;


class ShareActions extends Marty.ActionCreators {

  ping(){
    return Promise.resolve()
      .then(() => this.dispatch(ShareConstants.PING_STARTING))
      .then(() => wait(pingInteval))
      .then(() => this.dispatch(ShareConstants.PING_DONE));
  }

  endPing(){
    this.dispatch(ShareConstants.PING_DONE);
  }

  togglePoll(){
    this.dispatch(ShareConstants.POLL_TOGGLED);
  }

};

module.exports = ShareActions;
