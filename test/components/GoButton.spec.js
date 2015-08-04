const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const should = chai.should();

const {wait} = require('../../src/modules/async');
const { Map } = require('immutable');

const Application = require('../../src/application');
const { RED, GREEN } = require('../../src/constants/Colors');
const { GO_RADIUS, GO_DIAMETER } = require('../../src/constants/Dimensions');
const { createStore, createApplication } = require('marty/test-utils');
const testTree = require('react-test-tree');

const GoButton = require('../../src/components/GoButton');

describe('GoButton Component', () => {

  describe('contents', () => {

    describe('tappable', () => {

      it('is rendered with correct state', () => {
        const gb = testTree(<GoButton.InnerComponent />);

        gb.tappable.getClassName().should.equal('Tappable-inactive');
      });
    });

    describe('svg', () => {

      it('is rendered with correct dimensions', () => {
        const gb = testTree(<GoButton.InnerComponent />);

        gb.svg.getAttribute('width').should.equal(GO_DIAMETER);
        gb.svg.getAttribute('height').should.equal(GO_DIAMETER);
      });
    });

    describe('circle', () => {

      it('is rendered with correct dimensions', () => {
        const gb = testTree(<GoButton.InnerComponent />);

        gb.circle.getAttribute('cx').should.equal(GO_RADIUS);
        gb.circle.getAttribute('cy').should.equal(GO_RADIUS);
        gb.circle.getAttribute('r').should.equal(GO_RADIUS);
      });
    });

    it('is rendered with correct color based on prop', () => {
      const gb = testTree(<GoButton.InnerComponent color={RED} />);
      gb.circle.getAttribute('fill').should.equal(RED);

      const gb2 = testTree(<GoButton.InnerComponent color={GREEN} />);
      gb2.circle.getAttribute('fill').should.equal(GREEN);
    });
  });

  describe('events', () =>{

    const setup = (color) => {

      const spies = {
        ping: sinon.spy(),
        togglePoll: sinon.spy()
      };

      const app = createApplication(Application, {
        include: [
          'goButtonStore'
        ],
        stub: {
          shareActions: {
            ping: spies.ping,
            togglePoll: spies.togglePoll
          }
        }
      });

      return [app, spies];
    };

    describe('clicking go button', () => {

      it('calls shareActions#ping', () => {
        const [app, {ping}] = setup(RED);
        const gb = testTree(<GoButton/>, { context: { app: app }});
        gb.click();

        ping.should.have.been.calledOnce;
      });
    });

    xdescribe('pressing go button', () => {

      const press = (node) => (
        Promise.resolve()
          .then(() => node.simulate.touchStart)
          .then(() => wait(1))
          .then(() => node.simulate.touchEnd)
      );

      it('calls shareActions#poll', (done) => {
        const [app, {togglePoll}] = setup(RED);
        const gb = testTree(<GoButton />, {context: {app: app}});

        press(gb).should.be.fulfilled
          .then(() => togglePoll.should.have.been.calledOnce)
          .should.notify(done);

        // TODO: how to simulate a long press?
      });
    });

    describe('listening to GoButtonStore', () => {

      it('changes color when store color changes', () => {
        const app = setup(RED)[0];
        const gb = testTree(<GoButton />, { context: { app: app }});

        gb.innerComponent.getProp('color').should.equal(RED);

        app.goButtonStore.replaceState(Map({ color: GREEN }));
        const gb2 = testTree(<GoButton />, { context: { app: app}});

        gb2.innerComponent.getProp('color').should.equal(GREEN);
      });
    });
  });
});
