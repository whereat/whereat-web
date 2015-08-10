const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const should = chai.should();

const testTree = require('react-test-tree');
const { createApplication } = require('marty/test-utils');

const Application = require('../../src/application');
const ToastContainer = require('../../src/components/ToastContainer');

describe.only('ToastContainer Component', () => {

  const PING_MSG = 'Location shared.';
  const POLL_MSG = 'Location sharing toggled.';

  const defaultState = { visible: false, msg: '' };
  const pingingState = { visible: true, msg:  PING_MSG };
  const pollingState = { visible: true, msg:  POLL_MSG };

  const setup = (state) => {
    const app = createApplication(Application, {include: ['toastStore']}); //TODO: add locationPubStore once it exists!
    const component = propTree(app, state.visible, state.msg);
    return [app, component];
  };

  const propTree = (app, visible, msg) => (
    testTree(
      <ToastContainer.InnerComponent visible={visible} msg={msg}/>,
      settings(app)));

  const tree = (app) => testTree(<ToastContainer />, settings(app));

  const settings = (app) => ({context: { app: app }});

  describe('contents', () => {

    describe('visibility', () => {

      it('is hidden when `visible` prop is false', () => {
        const [_, t] = setup(defaultState);

        t.getProp('visible').should.equal(false);
        t.getClassName().should.equal('toast hidden');
      });

      it('is visible when `visible` prop is true', () => {
        const [_, t] = setup(pingingState);

        t.getProp('visible').should.equal(true);
        t.getClassName().should.equal('toast visible');
      });
    });

    describe('msg', () => {

      it('displays message given by the `msg` prop', () => {
        const [_, t] = setup(defaultState);
        t.getProp('msg').should.equal('');
        t.innerText.trim().should.equal('');

        const [__, t1] = setup(pingingState);
        t1.getProp('msg').should.equal(PING_MSG);
        t1.innerText.trim().should.equal(PING_MSG);

        const[___, t2] = setup(pollingState);
        t2.getProp('msg').should.equal(POLL_MSG);
        t2.innerText.trim().should.equal(POLL_MSG);
      });
    });
  });

  describe('events', () =>{

    describe('when ToastStore visibility changes', () => {

      describe('from hidden to visible', () => {

        it('becomes visible', () => {
          const[app, t] = setup(defaultState);
          t.getProp('visible').should.equal(false);

          app.toastStore.show(PING_MSG);
          const t2 = tree(app);
          t2.innerComponent.getProp('visible').should.equal(true);
        });
      });

      describe('from visible to hidden', () => {

        it('becomes hidden', () => {
          const[app, t] = setup(pingingState);
          t.getProp('visible').should.equal(true);

          app.toastStore.hide();
          const t2 = tree(app);
          t2.innerComponent.getProp('visible').should.equal(false);
        });
      });
    });

    describe('when ToastStore msg changes', () => {

      describe('from empty to ping message', () => {

        it('changes msg from blank to ping notification', () => {
          const[app, t] = setup(defaultState);
          t.getProp('msg').trim().should.equal('');

          app.toastStore.show(PING_MSG);
          const t1 = tree(app);

          t1.innerComponent.getProp('msg').trim().should.equal(PING_MSG);
        });
      });

      describe('from ping message to empty', () => {

        it('changes msg from ping notification to blank', () => {
          const[app, t] = setup(pingingState);
          t.getProp('msg').trim().should.equal('Location shared.');

          app.toastStore.hide();
          const t1 = tree(app);

          t1.innerComponent.getProp('msg').trim().should.equal('');
        });
      });

      describe('from empty to polling message', () => {

        it('changes msg from ping notification to blank', () => {
          const[app, t] = setup(defaultState);
          t.getProp('msg').trim().should.equal('');

          app.toastStore.show(POLL_MSG);
          const t1 = tree(app);

          t1.innerComponent.getProp('msg').trim().should.equal(POLL_MSG);
        });
      });

      describe('from poll msg to ping msg', () => {

        it('changes msg from poll notification to ping notification', () => {
          const[app, t] = setup(pollingState);
          t.getProp('msg').trim().should.equal(POLL_MSG);

          app.toastStore.show(PING_MSG);
          const t1 = tree(app);

          t1.innerComponent.getProp('msg').trim().should.equal(PING_MSG);
        });
      });
    });
  });
});
