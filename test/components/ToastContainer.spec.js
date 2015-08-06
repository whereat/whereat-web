const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const should = chai.should();

const testTree = require('react-test-tree');
const { createApplication } = require('marty/test-utils');

const Application = require('../../src/application');
const ToastContainer = require('../../src/components/ToastContainer');
const { EMPTY, PING, POLL } = require('../../src/constants/ToastTypes');

describe('ToastContainer Component', () => {

  const defaultState = { visible: false, text: '' };
  const pingingState = { visible: true, text: 'Location shared.' };
  const pollingState = { visible: true, text: 'Location sharing toggled.' };

  const setup = (state) => {
    const app = createApplication(Application, {include: ['toastStore']}); //TODO: add locationPubStore once it exists!
    const component = propTree(app, state.visible, state.text);
    return [app, component];
  };

  const propTree = (app, visible, text) => (
    testTree(
      <ToastContainer.InnerComponent visible={visible} text={text}/>,
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

    describe('text', () => {

      it('displays text given by the `text` prop', () => {
        const [_, t] = setup(defaultState);
        t.getProp('text').should.equal('');
        t.innerText.trim().should.equal('');

        const [__, t1] = setup(pingingState);
        t1.getProp('text').should.equal(pingingState.text);
        t1.innerText.trim().should.equal(pingingState.text);

        const[___, t2] = setup(pollingState);
        t2.getProp('text').should.equal(pollingState.text);
        t2.innerText.trim().should.equal(pollingState.text);
      });
    });
  });

  describe('events', () =>{

    describe('when ToastStore visibility changes', () => {

      describe('from hidden to visible', () => {

        it('becomes visible', () => {
          const[app, t] = setup(defaultState);
          t.getProp('visible').should.equal(false);

          app.toastStore.show(PING);
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

    describe.only('when ToastStore type changes', () => {

      describe('from EMPTY to PING', () => {

        it('changes text from blank to ping notification', () => {
          const[app, t] = setup(defaultState);
          t.getProp('text').trim().should.equal('');

          app.toastStore.show(PING);
          const t1 = tree(app);

          t1.innerComponent.getProp('text').trim().should.equal('Location shared.');
        });
      });

      describe('from PING to EMPTY', () => {

        it('changes text from ping notification to blank', () => {
          const[app, t] = setup(pingingState);
          t.getProp('text').trim().should.equal('Location shared.');

          app.toastStore.hide();
          const t1 = tree(app);

          t1.innerComponent.getProp('text').trim().should.equal('');
        });
      });

      describe('from EMPTY to POLL', () => {

        it('changes text from ping notification to blank', () => {
          const[app, t] = setup(defaultState);
          t.getProp('text').trim().should.equal('');

          app.toastStore.show(POLL);
          const t1 = tree(app);

          t1.innerComponent.getProp('text').trim().should.equal('Location sharing toggled.');
        });
      });

      describe('from POLL to PING', () => {

        it('changes text from poll notification to ping notification', () => {
          const[app, t] = setup(pollingState);
          t.getProp('text').trim().should.equal('Location sharing toggled.');

          app.toastStore.show(PING);
          const t1 = tree(app);

          t1.innerComponent.getProp('text').trim().should.equal('Location shared.');
        });
      });
    });
  });
});
