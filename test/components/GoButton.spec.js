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
const { s17, s17_, s17Nav, s17_Nav } = require('../support/sampleLocations');

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

    const emptyState = Map({ polling: false, pollId: -1, uid: s17.id, loc: Map() });
    const ping1State = Map({ polling: false, pollId: -1, uid: s17.id, loc: Map(s17) });
    const ping2State = Map({ polling: false, pollId: -1, uid: s17_.id, loc: Map(s17_) });
    const pollState = Map({ polling: true, pollId: 1, uid: s17.id, loc: Map() });

    const setup = (state) => {

      const spies = {
        ping: sinon.spy(),
        poll: sinon.spy(),
        stopPolling: sinon.spy()
      };

      const app = createApplication(Application, {
        include: ['goButtonStore', 'locPubStore'],
        stub: { locPubActions: spies }
      });

      app.locPubStore.state = state;

      return [app, spies];
    };

    const propTree = (app, color) => (
      testTree(<GoButton.InnerComponent color={color}/>, settings(app)));

    const tree = (app) => testTree(<GoButton />, settings(app));

    const settings = (app) => ({
      context: { app: app }
    });

    describe('clicking go button', () => {

      describe('when polling is off', () => {

        it('calls locPubActions#ping', () => {
          const [app, {ping}] = setup(emptyState);
          const gb = tree(app);
          gb.innerComponent.click();

          ping.should.have.been.calledOnce;
        });
      });

      describe('when polling is on', () => {

        it('does nothing', () => {
          const [app, {ping}] = setup(pollState);
          const gb = tree(app);
          gb.innerComponent.click();

          ping.should.not.have.been.called;
        });
      });
    });

    describe('pressing go button', () => {

      const press = (node) => (
        Promise.resolve()
          .then(() => node.simulate.mouseDown())
          .then(() => wait(1))
          .then(() => node.simulate.mouseUp())
      );

      describe('when polling is off', () => {

        it('calls locPubActions#poll', done => {
          const [app, {poll, stopPolling}] = setup(emptyState);
          const gb = tree(app);

          press(gb).should.be.fulfilled
            .then(() => {
              poll.should.have.been.calledOnce;
              stopPolling.should.not.have.been.called;
            }).should.notify(done);
        });
      });

      describe('when polling is on', () => {

        it('calls locPubActions#stopPolling', done => {
          const [app, {poll, stopPolling}] = setup(pollState);
          const gb = tree(app);

          press(gb).should.be.fulfilled
            .then(() => {
              stopPolling.should.have.been.calledWith(1);
              poll.should.not.have.been.called;
            }).should.notify(done);
        });
      });
    });

    describe('listening to GoButtonStore', () => {

      it('changes color when store color changes', () => {
        const [app, _] = setup(emptyState);
        app.goButtonStore.replaceState(Map({ color: RED }));
        const gb = tree(app);

        gb.innerComponent.getProp('color').should.equal(RED);

        app.goButtonStore.replaceState(Map({ color: GREEN }));
        const gb2 = tree(app);

        gb2.innerComponent.getProp('color').should.equal(GREEN);
      });
    });

    describe('listening to LocPubStore', () => {

      it('changes when polling state changes', () => {
        const [app, _] = setup(emptyState);
        const gb = tree(app);

        gb.innerComponent.getProp('polling').should.equal(false);
        gb.innerComponent.getProp('pollId').should.equal(-1);

        app.locPubStore.pollingOn(1);
        const gb2 = tree(app);

        gb.innerComponent.getProp('polling').should.equal(true);
        gb.innerComponent.getProp('pollId').should.equal(1);
      });
    });
  });
});
