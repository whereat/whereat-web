const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const Marty = require('marty');
const Application = require('../../src/application');
const ShareConstants = require('../../src/constants/ShareConstants');
const GoButtonConstants = require('../../src/constants/GoButtonConstants');
const { Map } = require('immutable');
const { RED, GREEN } = require('../../src/constants/Colors');
const { dispatch, hasDispatched, createApplication } = require('marty/test-utils');

const should = chai.should();
chai.use(sinonChai);

describe('GoButtonStore', () => {

  const redState = Map({ color: RED });
  const greenState = Map({ color: GREEN });

  const setup = (state) => {
    const app = createApplication(Application, { include: ['goButtonStore'] });
    app.goButtonStore.state = state;

    const listener = sinon.spy();
    app.goButtonStore.addChangeListener(listener);

    return [app, listener];
  };

  describe('#on', () => {

    it('turns go button green', () => {
      const [app, _] = setup(redState);
      app.goButtonStore.state.get('color').should.equal(RED);

      app.goButtonStore.on();
      app.goButtonStore.state.get('color').should.equal(GREEN);
    });

    it('handles GO_BUTTON_ON', () => {
      const [app, _] = setup(redState);
      app.goButtonStore.state.get('color').should.equal(RED);

      dispatch(app, GoButtonConstants.GO_BUTTON_ON);
      app.goButtonStore.state.get('color').should.equal(GREEN);

    });

    it('notifies listeners of state change', () => {
      const [app, listener] = setup(redState);
      dispatch(app, GoButtonConstants.GO_BUTTON_ON);

      listener.should.have.been.calledOnce;
      listener.getCall(0).args[0].equals(greenState).should.equal(true);
    });
  });

  describe('#off', () => {

    it('turns go button red', () => {
      const [app, _] = setup(greenState);
      app.goButtonStore.state.get('color').should.equal(GREEN);

      app.goButtonStore.off();
      app.goButtonStore.state.get('color').should.equal(RED);
    });

    it('handles GO_BUTTON_OFF', () => {
      const [app, _] = setup(greenState);
      app.goButtonStore.state.get('color').should.equal(GREEN);

      dispatch(app, GoButtonConstants.GO_BUTTON_OFF);
      app.goButtonStore.state.get('color').should.equal(RED);

    });

    it('notifies listeners of state change', () =>{
      const [app, listener] = setup(greenState);
      app.goButtonStore.off();

      listener.should.have.been.calledOnce;
      listener.getCall(0).args[0].equals(redState).should.equal(true);
    });
  });
});
