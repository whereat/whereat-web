const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const should = chai.should();

const Application = require('../../app/application');
const { createStore, createApplication } = require('marty/test-utils');
const testTree = require('react-test-tree');
import { Map } from 'immutable';

import {
  shouldHaveBeenCalledWith
} from '../support/matchers';


import SettingsPage from '../../app/components/SettingsPage';
import Settings from '../../app/constants/Settings';
const { share } = Settings;


describe('SettingsPage component', () => {

  const s1 = Map({share: 1});
  const s2 = Map({share: 2});

  const setup = (state) => {

    const spies = {
      setShare: sinon.spy(),
      setTtl: sinon.spy()
    };

    const app = createApplication(Application, {
      include: ['settingsStore'],
      stub: { settingsActions: spies }
    });
    app.settingsStore.state = state;

    const component = propTree(app, state.get('share'));
    return [app, component, spies];
  };

  const propTree = (app, share) =>(
    testTree(<SettingsPage.InnerComponent curShare={share} />, specs(app)));

  const tree = (app) => testTree(<SettingsPage />, specs(app));

  const specs = (app) => ({
    context: { app: app }
  });

  const stateTree = (state) => testTree(<SettingsPage.InnerComponent />, stateOf(state));
  const stateOf = (state) => ({context: {state: state}});

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
  });

  describe('interactivity', () => {

    describe('#_handleShareSelect', () => {

      it('calls settingsActions#setShare', () => {
        const [app, comp, {setShare}] = setup(s1);

        comp.shareItems2.simulate.select();
        setShare.should.have.been.calledWith(2);

        comp.shareItems3.simulate.select();
        setShare.should.have.been.calledWith(3);
      });
    });
  });
});
