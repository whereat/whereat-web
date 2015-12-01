import sinon from 'sinon';
import chai from 'chai';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
const should = chai.should();

import Application from '../../app/application';

import { createApplication } from 'marty/test-utils';
import testTree from 'react-test-tree';
import { shouldHaveBeenCalledWithImmutable } from '../support/matchers';

import User from '../../app/models/User';
import PowerButton from '../../app/components/PowerButton';
import { emptyState, ping1State, ping2State, pollState} from '../support/sampleLocPubStates';
import {s0t1} from '../support/sampleSettings';
import { shareFreq } from '../../app/constants/Settings';


describe('PowerButton Component', () => {

  const setup = (lpState = pollState, stgState = s0t1) => {

    const spies = {
      poll: sinon.spy(),
      stopPolling: sinon.spy()
    };
    const app = createApplication(Application, {
      include: ['locPubStore', 'settingsStore'],
      stub: { locPubActions: spies }
    });
    app.locPubStore.state = lpState;
    app.settingsStore.state = stgState;

    const comp =tree(app);

    return [app, comp, spies];
  };

  const propTree = (app, polling) =>
          testTree(<PowerButton.InnerComponent polling={polling}/>, settings(app));
  const tree = (app) => testTree(<PowerButton />, settings(app));
  const settings = (app) => ({context: { app: app }});

  describe('contents', () => {

    describe('when polling on', () => {

      it('has correct text and color', () => {
        const comp = testTree(<PowerButton.InnerComponent polling={true}/>);
        comp.button.getClassName().should.equal('powerButton powerOn btn btn-default');
        comp.button.innerText.should.equal('ON');
      });
    });


    describe('when polling off', () => {

      it('has correct text and color', () => {
        const comp = testTree(<PowerButton.InnerComponent polling={false}/>);
        comp.button.getClassName().should.equal('powerButton powerOff btn btn-default');
        comp.button.innerText.should.equal('OFF');
      });
    });
  });

  describe('events', () =>{


    describe('clicking power button', () => {

      describe('when polling is on', () => {

        it('turns polling off', () => {
          const [app, comp, {poll, stopPolling}] = setup(pollState);
          comp.innerComponent.click();

          stopPolling.should.have.been.calledWith(0);
          poll.should.not.have.been.called;
        });
      });

      describe('when polling is off', () => {

        it('turns polling on', () => {
          const [app, comp, {poll, stopPolling}] = setup(emptyState);
          comp.innerComponent.click();

          poll.should.have.been.calledWith(shareFreq.values[0]);
          stopPolling.should.not.have.been.called;
        });
      });
    });

    describe('listening to LocPubStore', () => {

      it('updates props when polling state changes', () => {
        const [app, comp] = setup(emptyState);

        comp.innerComponent.getProp('polling').should.equal(false);
        comp.innerComponent.getProp('pollId').should.equal(-1);

        app.locPubStore.pollingOn(1);

        comp.innerComponent.getProp('polling').should.equal(true);
        comp.innerComponent.getProp('pollId').should.equal(1);
      });
    });

    describe('listening to SettingsStore', () => {

      it('updates props when shareFreq changes', () => {
        const [app, comp] = setup();
        comp.innerComponent.getProp('curShareFreq').should.equal(0);

        app.settingsStore.setShareFreq(1);
        tree(app).innerComponent.getProp('curShareFreq').should.equal(1);
      });
    });
  });
});
