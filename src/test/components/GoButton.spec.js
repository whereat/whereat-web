import sinon from 'sinon';
import chai from 'chai';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);
const should = chai.should();

import { createStore, createApplication } from 'marty/test-utils';
import testTree from 'react-test-tree';
import { Map } from 'immutable';

import Application from '../../app/application';
import GoButton from '../../app/components/GoButton';

import { wait } from '../../app/modules/async';
import { RED, GREEN } from '../../app/constants/Colors';
import { GO_RADIUS, GO_DIAMETER } from '../../app/constants/Dimensions';
import { s17, s17_, s17Nav, s17_Nav } from '../support/sampleLocations';
import { emptyState, ping1State, ping2State, pollState} from '../support/sampleLocPubStates';
import {s1, s2 } from '../support/sampleSettings';
import { share } from '../../app/constants/Settings';

describe('GoButton Component', () => {

  const setup = (locPubState = emptyState, stgState = s1) => {
    const spies = {
      ping: sinon.spy(),
      poll: sinon.spy(),
      stopPolling: sinon.spy()
    };
    const app = createApplication(Application, {
      include: ['goButtonStore', 'locPubStore', 'settingsStore'],
      stub: { locPubActions: spies }
    });
    app.locPubStore.state = locPubState;
    app.settingsStore.state = stgState;
    return [app, spies];
  };

  const propTree = (app, color) => (
    testTree(<GoButton.InnerComponent color={color}/>, settings(app)));
  const tree = (app) => testTree(<GoButton />, settings(app));
  const settings = (app) => ({context: { app: app }});


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

    describe('clicking go button', () => {

      describe('when polling is off', () => {

        it('calls locPubActions#poll with correct sharing interval', () => {
          const [app, {poll, stopPolling}] = setup(emptyState, s1);
          const gb = tree(app);
          gb.innerComponent.click();

          stopPolling.should.not.have.been.called;
          poll.should.have.been.calledWith(share[1]);

          app.settingsStore.setShare(2);
          const gb2 = tree(app);
          gb2.innerComponent.click();

          poll.should.have.been.calledWith(share[2]);
        });
      });

      describe('when polling is on', () => {

        it('calls locPubActions#stopPolling', () => {
          const [app, {poll, stopPolling}] = setup(pollState);
          const gb = tree(app);
          gb.innerComponent.click();

          stopPolling.should.have.been.calledWith(1);
          poll.should.not.have.been.called;
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
