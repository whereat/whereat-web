const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const should = chai.should();
chai.use(sinonChai);

const Marty = require('marty');
const Application = require('../../src/application');
const { dispatch, createApplication } = require('marty/test-utils');

const ToastConstants = require('../../src/constants/ToastConstants');
const { Map, Seq } = require('immutable');

describe('ToastStore', () => {

  const PING_MSG = 'Location shared.';
  const POLL_MSG = 'Location sharing on.';

  const defaultState = Map({ visible: false, msg: '' });
  const pingingState = Map({ visible: true, msg: PING_MSG });
  const pollingState = Map({ visible: true, msg: POLL_MSG });

  const setup = (state = defaultState) => {
    const app = createApplication(Application, { include: ['toastStore'] });
    app.toastStore.state = state;

    const listener = sinon.spy();
    app.toastStore.addChangeListener(listener);

    return [app, listener];
  };

  describe('handlers', () => {

    describe('#show', () => {

      it('sets `visible` to true', () => {
        const [app, _] = setup();
        app.toastStore.state.get('visible').should.equal(false);

        app.toastStore.show('');
        app.toastStore.state.get('visible').should.equal(true);
      });

      it('handles TOAST_STARTING', () => {
        const [app, _] = setup();
        dispatch(app, ToastConstants.TOAST_STARTING, 'hi');

        app.toastStore.state.get('visible').should.equal(true);
      });

      it('handles message passed with TOAST_STARTING', () => {
        const [app, _] = setup();

        dispatch(app, ToastConstants.TOAST_STARTING, PING_MSG);
        app.toastStore.state.get('msg').should.equal(PING_MSG);

        dispatch(app, ToastConstants.TOAST_STARTING, POLL_MSG);
        app.toastStore.state.get('msg').should.equal(POLL_MSG);
      });

      it('notifies listeners of a state change', () => {
        const [app, listener] = setup();
        app.toastStore.show(PING_MSG);

        listener.should.have.been.calledOnce;
        listener.getCall(0).args[0].equals(pingingState).should.equal(true);
      });
    });

    describe('#hide', () => {

      it('sets `visible` to false, `msg` to empty string', () => {
        const [app, _] = setup(pingingState);
        app.toastStore.state.get('visible').should.equal(true);
        app.toastStore.state.get('msg').should.equal(PING_MSG);

        app.toastStore.hide();
        app.toastStore.state.get('visible').should.equal(false);
        app.toastStore.state.get('msg').should.equal('');
      });

      it('handles TOAST_DONE', () => {
        const [app, _] = setup(pingingState);
        app.toastStore.state.get('visible').should.equal(true);
        app.toastStore.state.get('msg').should.equal(PING_MSG);

        dispatch(app, ToastConstants.TOAST_DONE);
        app.toastStore.state.get('visible').should.equal(false);
        app.toastStore.state.get('msg').should.equal('');
      });

      it('notifies listeners of a state change', () => {
        const [app, listener] = setup(pingingState);
        app.toastStore.hide();

        listener.should.have.been.calledOnce;
        listener.getCall(0).args[0].equals(defaultState).should.equal(true);
      });

      it("won't notify listener if state doesn't change", () => {
        const [app, listener] = setup(defaultState);
        app.toastStore.hide();

        listener.should.not.have.been.called;
      });
    });

  });

  describe('accessors', () => {

    describe('#isVisible', () => {

      it('returns current visibility state (Boolean)', ()=> {
        const [app, _] = setup(defaultState);
        app.toastStore.isVisible().should.equal(false);

        app.toastStore.state = pingingState;
        app.toastStore.isVisible().should.equal(true);

        app.toastStore.state = pollingState;
        app.toastStore.isVisible().should.equal(true);
      });
    });

    describe('#getMsg', () => {

      it('returns current message', ()=> {
        const [app, _] = setup(defaultState);
        app.toastStore.getMsg().should.equal('');

        app.toastStore.state = pingingState;
        app.toastStore.getMsg().should.equal(PING_MSG);

        app.toastStore.state = pollingState;
        app.toastStore.getMsg().should.equal(POLL_MSG);
      });
    });
  });
});
