const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const should = chai.should();

const Application = require('../../app/application');
const { createStore, createApplication } = require('marty/test-utils');
const testTree = require('react-test-tree');
import { Map } from 'immutable';
import { merge } from 'lodash';

import {
  shouldHaveBeenCalledWith
} from '../support/matchers';
import {
  emptyState,
  ping1State,
  ping2State,
  pollState
} from '../support/sampleLocPubStates';
import { s1, s2 } from '../support/sampleSettings';


import SettingsPage from '../../app/components/SettingsPage';
import { share } from '../../app/constants/Settings';


describe('SettingsPage component', () => {

  const setup = (stgState = s1, locPubState = emptyState) => {

    const stgSpies = {
      setShare: sinon.spy(),
      setTtl: sinon.spy()
    };

    const locPubSpies = {
      poll: sinon.spy(),
      stopPolling: sinon.spy()
    };
    const spies = merge({}, stgSpies, locPubSpies);

    const app = createApplication(Application, {
      include: ['settingsStore', 'locPubStore'],
      stub: {
        settingsActions: stgSpies,
        locPubActions: locPubSpies
      }
    });
    app.settingsStore.state = stgState;
    app.locPubStore.state = locPubState;

    const component = propTree(
      app,
      stgState.get('share'),
      locPubState.get('isPolling'),
      locPubState.get('pollId')
    );

    return [app, component, spies];
  };

  const propTree = (app, share, isPolling, pollId) =>
    testTree(<SettingsPage.InnerComponent
               curShare={share}
               isPolling={isPolling}
               pollId={pollId}
             />, specs(app));

  const tree = (app) => testTree(<SettingsPage />, specs(app));
  const specs = (app) => ({context: { app: app }});

  describe('contents', () => {

    describe('on first load', () => {

      it('displays correctly', () => {
        const [app, comp] = setup(s2);

        comp.settingsPage.should.exist;
        comp.settingsPage.getClassName().should.equal('settingsPage');

        comp.shareContainer.should.exist;
        comp.shareContainer.getClassName().should.equal('shareContainer');
        comp.shareContainer.innerText.should.contain('Share location every:');

        comp.shareMenu.should.exist;
        comp.shareMenu.getClassName().should.equal('shareMenu btn-group');
        comp.shareMenu.getProp('title').should.equal(share.labels[2]);
        [0,1,2,3,4].map(i => {
          const item = comp[`shareItems${i}`];
          item.should.exist;
          i === 2 ?
            item.getClassName().should.equal('shareItem active') :
            item.getClassName().should.equal('shareItem');
        });
      });
    });
  });

  describe('reactivity', () => {

    describe('curShare prop', () =>{

      it('reacts to SettingsStore#getShare', () => {
        const [app, comp] = setup(s1);
        comp.getProp('curShare').should.equal(1);

        app.settingsStore.setShare(2);
        const comp2 = tree(app);
        comp2.innerComponent.getProp('curShare').should.equal(2);
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

    describe('#_handleShareSelect', () => {

      describe('when not polling', () => {

        it('calls settingsActions#setShare but not reset polling', () => {
          const [app, _, {poll, stopPolling, setShare}] = setup(s1);
          const comp = tree(app).innerComponent;

          comp.shareItems2.simulate.select();
          setShare.should.have.been.calledWith(2);

          comp.shareItems3.simulate.select();
          setShare.should.have.been.calledWith(3);

          stopPolling.should.not.have.beenCalled;
          poll.should.not.have.beenCalled;
        });

        it('calls settingsActions#setShare and resets polling', () => {
          const [app, _, {poll, stopPolling, setShare}] = setup(s1, pollState);
          const comp = tree(app).innerComponent;
          comp.getProp('isPolling').should.beTrue;

          comp.shareItems2.simulate.select();

          setShare.should.have.been.calledWith(2);
          stopPolling.should.have.been.calledWith(1);
          poll.should.have.been.calledWith(share.values[2]);

          comp.shareItems3.simulate.select();
          stopPolling.should.have.been.calledWith(1);
          poll.should.have.been.calledWith(share.values[3]);
        });
      });
    });
  });
});
