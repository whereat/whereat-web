const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const should = chai.should();
chai.use(sinonChai);

const Marty = require('marty');
const Application = require('../../src/application');
const { dispatch, createApplication } = require('marty/test-utils');

const ToastConstants = require('../../src/constants/ToastConstants');
const { EMPTY, PING, POLL } = require('../../src/constants/ToastTypes');
const { Map, Seq } = require('immutable');

describe('ToastStore', () => {

  const defaultState = Map({ visible: false, type: EMPTY });
  const pingingState = Map({ visible: true, type: PING });
  const pollingState = Map({ visible: true, type: POLL });

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

        app.toastStore.show(EMPTY);
        app.toastStore.state.get('visible').should.equal(true);
      });

      it('handles TOAST_STARTING', () => {
        const [app, _] = setup();
        dispatch(app, ToastConstants.TOAST_STARTING, EMPTY);

        app.toastStore.state.get('visible').should.equal(true);
      });

      it('handles params passed with TOAST_STARTING', () => {
        const [app, _] = setup();

        dispatch(app, ToastConstants.TOAST_STARTING, EMPTY);
        app.toastStore.state.get('type').should.equal(EMPTY);

        dispatch(app, ToastConstants.TOAST_STARTING, PING);
        app.toastStore.state.get('type').should.equal(PING);

        dispatch(app, ToastConstants.TOAST_STARTING, POLL);
        app.toastStore.state.get('type').should.equal(POLL);
      });

      it('notifies listeners of a state change', () => {
        const [app, listener] = setup();
        app.toastStore.show(EMPTY);

        listener.should.have.been.calledOnce;
      });
    });

    describe('#hide', () => {

      it('sets `visible` to false, `type` to EMPTY', () => {
        const [app, _] = setup(pingingState);
        app.toastStore.state.get('visible').should.equal(true);
        app.toastStore.state.get('type').should.equal(PING);

        app.toastStore.hide();
        app.toastStore.state.get('visible').should.equal(false);
        app.toastStore.state.get('type').should.equal(EMPTY);
      });

      it('handles TOAST_DONE', () => {
        const [app, _] = setup(pingingState);
        app.toastStore.state.get('visible').should.equal(true);
        app.toastStore.state.get('type').should.equal(PING);

        dispatch(app, ToastConstants.TOAST_DONE);
        app.toastStore.state.get('visible').should.equal(false);
        app.toastStore.state.get('type').should.equal(EMPTY);
      });

      it('notifies listeners of a state change', () => {
        const [app, listener] = setup(pingingState);
        app.toastStore.hide();

        listener.should.have.been.calledOnce;
      });

      it("won't notify listener if state doesn't change", () => {
        const [app, listener] = setup(defaultState);
        app.toastStore.hide();

        listener.should.not.have.been.called;
      });
    });

  });

  describe('accessors', () => {

    describe('#getType', () => {

      it('returns current ToastType', ()=> {
        const [app, _] = setup(defaultState);
        app.toastStore.getType().should.equal(EMPTY);

        app.toastStore.state = pingingState;
        app.toastStore.getType().should.equal(PING);

        app.toastStore.state = pollingState;
        app.toastStore.getType().should.equal(POLL);
      });
    });
  });
});
