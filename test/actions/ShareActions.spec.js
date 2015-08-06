const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
const should = chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);

const Application = require('../../src/application');
const { hasDispatched, createApplication } = require('marty/test-utils');

const ShareConstants = require('../../src/constants/ShareConstants');
const ToastConstants = require('../../src/constants/ToastConstants');
const { PING, POLL } = require('../../src/constants/ToastTypes');

describe.only('ShareActions', () => {

  const setup = () => {
    return createApplication(Application, { include: ['shareActions'] });
  };

  describe('#ping', () => {

    it('dispatches PING/TOAST _STARTING then _DONE', (done) => {
      const app = setup();
      app.shareActions.ping(.0001, .0001).should.be.fulfilled
        .then(() => {
          hasDispatched(app, ShareConstants.PING_STARTING).should.equal(true);
          hasDispatched(app, ShareConstants.PING_DONE).should.equal(true);
          hasDispatched(app, ToastConstants.TOAST_STARTING, PING).should.equal(true);
          hasDispatched(app, ToastConstants.TOAST_DONE).should.equal(true);
        }).should.notify(done);
    });
  });

  describe('#poll', () => {

    it('dispatches POLL_TOGGLED', (done) => {
      const app = setup();
      app.shareActions.togglePoll(.0001).should.be.fulfilled
        .then(() => {
          hasDispatched(app, ShareConstants.POLL_TOGGLED).should.equal(true);
          hasDispatched(app, ToastConstants.TOAST_STARTING, POLL).should.equal(true);
          hasDispatched(app, ToastConstants.TOAST_DONE).should.equal(true);
        }).should.notify(done);

    });
  });
});
