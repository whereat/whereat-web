const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const should = chai.should();
chai.use(sinonChai);

const Marty = require('marty');
const Application = require('../../app/application');
const { dispatch, createApplication } = require('marty/test-utils');

const NotificationConstants = require('../../app/constants/NotificationConstants');
const { Map, Seq } = require('immutable');

describe('NotificationStore', () => {

  const PING_MSG = 'Location shared.';
  const POLL_MSG = 'Location sharing on.';

  const defaultState = Map({ visible: false, msg: '' });
  const pingingState = Map({ visible: true, msg: PING_MSG });
  const pollingState = Map({ visible: true, msg: POLL_MSG });

  const setup = (state = defaultState) => {
    const app = createApplication(Application, { include: ['notificationStore'] });
    app.notificationStore.state = state;

    const listener = sinon.spy();
    app.notificationStore.addChangeListener(listener);

    return [app, listener];
  };

  describe('handlers', () => {

    describe('#show', () => {

      it('sets `visible` to true', () => {
        const [app, _] = setup();
        app.notificationStore.state.get('visible').should.equal(false);

        app.notificationStore.show('');
        app.notificationStore.state.get('visible').should.equal(true);
      });

      it('handles NOTIFICATION_STARTING', () => {
        const [app, _] = setup();
        dispatch(app, NotificationConstants.NOTIFICATION_STARTING, 'hi');

        app.notificationStore.state.get('visible').should.equal(true);
      });

      it('handles message passed with NOTIFICATION_STARTING', () => {
        const [app, _] = setup();

        dispatch(app, NotificationConstants.NOTIFICATION_STARTING, PING_MSG);
        app.notificationStore.state.get('msg').should.equal(PING_MSG);

        dispatch(app, NotificationConstants.NOTIFICATION_STARTING, POLL_MSG);
        app.notificationStore.state.get('msg').should.equal(POLL_MSG);
      });

      it('notifies listeners of a state change', () => {
        const [app, listener] = setup();
        app.notificationStore.show(PING_MSG);

        listener.should.have.been.calledOnce;
        listener.getCall(0).args[0].equals(pingingState).should.equal(true);
      });
    });

    describe('#hide', () => {

      it('sets `visible` to false, `msg` to empty string', () => {
        const [app, _] = setup(pingingState);
        app.notificationStore.state.get('visible').should.equal(true);
        app.notificationStore.state.get('msg').should.equal(PING_MSG);

        app.notificationStore.hide();
        app.notificationStore.state.get('visible').should.equal(false);
        app.notificationStore.state.get('msg').should.equal('');
      });

      it('handles NOTIFICATION_DONE', () => {
        const [app, _] = setup(pingingState);
        app.notificationStore.state.get('visible').should.equal(true);
        app.notificationStore.state.get('msg').should.equal(PING_MSG);

        dispatch(app, NotificationConstants.NOTIFICATION_DONE);
        app.notificationStore.state.get('visible').should.equal(false);
        app.notificationStore.state.get('msg').should.equal('');
      });

      it('notifies listeners of a state change', () => {
        const [app, listener] = setup(pingingState);
        app.notificationStore.hide();

        listener.should.have.been.calledOnce;
        listener.getCall(0).args[0].equals(defaultState).should.equal(true);
      });

      it("won't notify listener if state doesn't change", () => {
        const [app, listener] = setup(defaultState);
        app.notificationStore.hide();

        listener.should.not.have.been.called;
      });
    });

  });

  describe('accessors', () => {

    describe('#isVisible', () => {

      it('returns current visibility state (Boolean)', ()=> {
        const [app, _] = setup(defaultState);
        app.notificationStore.isVisible().should.equal(false);

        app.notificationStore.state = pingingState;
        app.notificationStore.isVisible().should.equal(true);

        app.notificationStore.state = pollingState;
        app.notificationStore.isVisible().should.equal(true);
      });
    });

    describe('#getMsg', () => {

      it('returns current message', ()=> {
        const [app, _] = setup(defaultState);
        app.notificationStore.getMsg().should.equal('');

        app.notificationStore.state = pingingState;
        app.notificationStore.getMsg().should.equal(PING_MSG);

        app.notificationStore.state = pollingState;
        app.notificationStore.getMsg().should.equal(POLL_MSG);
      });
    });
  });
});
