const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const Marty = require('marty');
const Application = require('../../src/application');
const ShareConstants = require('../../src/constants/ShareConstants');
const { RED, GREEN } = require('../../src/constants/Colors');
const { dispatch, hasDispatched, createApplication } = require('marty/test-utils');

const should = chai.should();
chai.use(sinonChai);

describe('GoButtonStore', () => {

  const setup = (color) => {
    const app = createApplication(Application, { include: ['goButtonStore'] });
    app.goButtonStore.state = app.goButtonStore.state.set('color', color);
    const listener = sinon.spy();
    app.goButtonStore.addChangeListener(listener);
    return [app, listener];
  };

  describe('#on', () => {

    it('turns go button green', () => {
      const app = setup(RED)[0];
      dispatch(app, ShareConstants.PING_STARTING);

      app.goButtonStore.state.get('color').should.equal(GREEN);
    });

    it('notifies listeners of state change', () => {
      const [app, listener] = setup(RED);
      dispatch(app, ShareConstants.PING_STARTING);

      return listener.should.have.been.calledOnce;
    });
  });

  describe('#off', () => {

    it('turns go button red', () => {
      const app = setup(GREEN)[0];
      dispatch(app, ShareConstants.PING_DONE);

      app.goButtonStore.state.get('color').should.equal(RED);
    });

    it('notifies listeners of state change', () =>{
      const [app, listener] = setup(GREEN);
      dispatch(app, ShareConstants.PING_DONE);

      return listener.should.have.been.calledOnce;
    });
  });

  describe('#toggle', () => {

    it('toggles go button between red and green', () => {
      const [app, listener] = setup(RED);

      dispatch(app, ShareConstants.POLL_TOGGLED);
      app.goButtonStore.state.get('color').should.equal(GREEN);

      dispatch(app, ShareConstants.POLL_TOGGLED);
      app.goButtonStore.state.get('color').should.equal(RED);
    });

    it('notifies listeners of state change', () => {
      const [app, listener] = setup(RED);
      dispatch(app, ShareConstants.POLL_TOGGLED);
      dispatch(app, ShareConstants.POLL_TOGGLED);

      return listener.should.have.been.calledTwice;
    });
  });

});
