import sinon from 'sinon';
import chai from 'chai';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
const should = chai.should();

import Application from '../../app/application';
import { createStore, createApplication } from 'marty/test-utils';
import testTree from 'react-test-tree';
import { Map } from 'immutable';
import { merge } from 'lodash';

import {
  shouldHaveBeenCalledWith
} from '../support/matchers';
import { s1, s2, s1t1, s1t2, s2t1, s2t2 } from '../support/sampleSettings';
import {
  emptyState,
  ping1State,
  ping2State,
  pollState
} from '../support/sampleLocPubStates';
import {
  clearState,
  nys3State,
  nyse3ModTimeState,
  nyse3ModTtlState,
  nyse3ModForgetJobState
} from '../support/sampleLocSubStates';


import SettingsPage from '../../app/components/SettingsPage';
import { shareFreq, locTtl } from '../../app/constants/Settings';
const { values: ttls } = locTtl;


describe('SettingsPage component', () => {

  const setup = (stgState = s2t1, locsSubState = clearState, locPubState = emptyState) => {

    // const stgSpies = {
    //   setShareFreq: sinon.spy(),
    //   setLocTtl: sinon.spy()
    // };

    // const locPubSpies = {
    //   resetPolling: sinon.spy()
    // };


    const spies = {
      stg: {
        setShareFreq: sinon.spy(),
        setLocTtl: sinon.spy()
      },
      locPub: {
        resetPolling: sinon.spy()
      },
      locSub: {
        rescheduleForget: sinon.spy()
      }
    };

    // const stubs = {
    //   locPub: { getPollId: sinon.stub() }
    // };

    const app = createApplication(Application, {
      include: ['settingsStore', 'locSubStore', 'locPubStore'],
      stub: {
        settingsActions: spies.stg,
        locPubActions: spies.locPub,
        locSubActions: spies.locSub
      }
    });
    app.settingsStore.state = stgState;
    app.locPubStore.state = locPubState;

    const component = propTree(
      app,
      stgState.get('shareFreq'),
      stgState.get('locTtl'),
      locPubState.get('isPolling'),
      locPubState.get('pollId')
    );

    return [app, component, merge({}, spies.stg, spies.locPub, spies.locSub)];
  };

  const propTree = (app, shareFreq, locTtl, isPolling, pollId) => (
          testTree(<SettingsPage.InnerComponent
                   curShareFreq={shareFreq}
                   curLocTtl={locTtl}
                   isPolling={isPolling}
                   pollId={pollId}
                   />, specs(app)));

  const tree = (app) => testTree(<SettingsPage />, specs(app));
  const specs = (app) => ({context: { app: app }});

  describe('content', () => {

    const [app, comp] = setup(s2t1);

    it('displays wrapping div', () => {
      comp.settingsPage.should.exist;
    });

    it('displays share frequency menu', () => {
      comp.shareFreqPanel.should.exist;
      comp.shareFreqPanel.getClassName().should.equal('settingsPanel panel panel-default');
      comp.shareFreqPanel.innerText.should.contain('Share location every:');

      comp.shareFreqMenu.should.exist;
      comp.shareFreqMenu.getClassName().should.equal('btn-group');
      comp.shareFreqMenu.button.getClassName().should.equal('settingsMenu btn btn-default');

      comp.shareFreqMenu.getProp('title').should.equal(shareFreq.labels[2]);
      [0,1,2,3,4].map(i => {
        const item = comp[`shareFreqItems${i}`];
        item.should.exist;
        i === 2 ?
          item.getClassName().should.equal('shareFreqItem active') :
          item.getClassName().should.equal('shareFreqItem');
      });
    });

    it('displays location ttl menu', () => {
      comp.locTtlPanel.should.exist;
      comp.locTtlPanel.getClassName().should.equal('settingsPanel panel panel-default');
      comp.locTtlPanel.innerText.should.contain('Delete locations after:');

      comp.locTtlMenu.should.exist;
      comp.locTtlMenu.getClassName().should.equal('btn-group');
      comp.locTtlMenu.button.getClassName().should.equal('settingsMenu btn btn-default');

      comp.locTtlMenu.getProp('title').should.equal(locTtl.labels[1]);
      [0,1,2].map(i => {
        const item = comp[`locTtlItems${i}`];
        item.should.exist;
        i === 1 ?
          item.getClassName().should.equal('locTtlItem active') :
          item.getClassName().should.equal('locTtlItem');
      });
    });
  });

  describe('reactivity', () => {

    describe('curLocTtl prop', () =>{

      it('reacts to SettingsStore#getLocTtl', () => {
        const [app, comp] = setup(s1t1);
        comp.getProp('curLocTtl').should.equal(1);

        app.settingsStore.setLocTtl(2);
        const comp2 = tree(app);
        comp2.innerComponent.getProp('curLocTtl').should.equal(2);
      });
    });

    describe('curShareFreq prop', () =>{

      it('reacts to SettingsStore#getShareFreq', () => {
        const [app, comp] = setup(s1t1);
        comp.getProp('curShareFreq').should.equal(1);

        app.settingsStore.setShareFreq(2);
        const comp2 = tree(app);
        comp2.innerComponent.getProp('curShareFreq').should.equal(2);
      });
    });

    describe('isPolling prop', () => {

      it('reacts to LocPubStore#getIsPolling()', () =>{
        const [app] = setup(s1, emptyState);
        const comp = tree(app);
        comp.innerComponent.getProp('isPolling').should.be.false;

        app.locPubStore.pollingOn(1);
        const comp2 = tree(app);
        comp2.innerComponent.getProp('isPolling').should.be.true;
      });

      it('reacts to LocPubStore#getPollId', () => {
        const [app] = setup(s1, emptyState);
        const comp = tree(app);
        comp.innerComponent.getProp('pollId').should.equal(-1);

        app.locPubStore.pollingOn(1);
        const comp2 = tree(app);
        comp2.innerComponent.getProp('pollId').should.equal(1);
      });
    });
  });

  describe('interactivity', () => {

    describe('selecting new share frequency', () => {

      describe('when not polling', () => {

        it('calls settingsActions#setShareFreq but not reset polling', () => {
          const [app, _, {resetPolling, setShareFreq}] = setup(s1t1);
          const comp = tree(app).innerComponent;

          comp.shareFreqItems2.simulate.select();
          setShareFreq.should.have.been.calledWith(2);

          comp.shareFreqItems3.simulate.select();
          setShareFreq.should.have.been.calledWith(3);

          resetPolling.should.not.have.beenCalled;
        });
      });

      describe('when polling', () => {

        it('calls settingsActions#setShareFreq and resets polling', () => {
          const [app, _, { resetPolling, setShareFreq } ] = setup(s1t1, clearState, pollState);
          const comp = tree(app).innerComponent;

          comp.getProp('isPolling').should.equal(true);

          comp.shareFreqItems2.simulate.select();

          setShareFreq.should.have.been.calledWith(2);
          resetPolling.should.have.been.calledWith(0, shareFreq.values[2]);

          app.locPubStore.pollingReset(1);
          comp.shareFreqItems3.simulate.select();
          setShareFreq.should.have.been.calledWith(3);
          resetPolling.should.have.been.calledWith(1, shareFreq.values[3]);
        });
      });
    });

    describe('selecting new ttl', () => {

      it('calls settingsActions#setLocTtl', () => {
        const [app, _, {setLocTtl, rescheduleForget}] = setup(s1t1);
        const comp = tree(app).innerComponent;

        comp.locTtlItems0.simulate.select();
        setLocTtl.should.have.been.calledWith(0);
        rescheduleForget.should.have.been.calledWith(-1, ttls[0]);

        comp.locTtlItems2.simulate.select();
        setLocTtl.should.have.been.calledWith(2);
        rescheduleForget.should.have.been.calledWith(-1, ttls[2]);
      });
    });
  });
});
