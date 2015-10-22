import sinon from 'sinon';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import Marty from 'marty';
import Application from '../../app/application';
import LocPubConstants from '../../app/constants/LocPubConstants';
import GoButtonConstants from '../../app/constants/GoButtonConstants';
import { Map } from 'immutable';
import { RED, GREEN } from '../../app/constants/Colors';
import { dispatch, hasDispatched, createApplication } from 'marty/test-utils';

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
