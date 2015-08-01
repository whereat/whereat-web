const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
const Application = require('../../src/application');
const ShareConstants = require('../../src/constants/ShareConstants');
const { hasDispatched, createApplication } = require('marty/test-utils');

const should = chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('GoButtonStore', () => {

  const setup = () => {
    return createApplication(Application, { include: ['shareActions'] });
  };

  describe('#ping', () => {

    it('dispatches PING_STARTING then PING_DONE', (done) => {
      const app = setup();
      app.shareActions.ping().should.be.fulfilled
        .then(() => {
          hasDispatched(app, ShareConstants.PING_STARTING).should.equal(true);
          hasDispatched(app, ShareConstants.PING_DONE).should.equal(true);
        }).should.notify(done);
    });
  });

  describe('#poll', () => {

    it('dispatches POLL_TOGGLED', () => {
      const app = setup();
      app.shareActions.togglePoll();

      hasDispatched(app, ShareConstants.POLL_TOGGLED).should.equal(true);
    });
  });
});
