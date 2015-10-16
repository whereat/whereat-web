const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const should = chai.should();

const Application = require('../../app/application');
const { createStore, createApplication } = require('marty/test-utils');
const testTree = require('react-test-tree');

import SettingsPage from '../../app/components/SettingsPage';
import Settings from '../../app/constants/Settings';
const { share } = Settings;


describe('SettingsPage component', () => {

  const setup = (state) => {
    const app = createApplication(Application, {include: ['settingsStore'] });
    app.settingsStore.state = state;
    const component = propTree(app, state.get('curShare'));
    return [app, component];
  };

  const propTree = (app, share, ttl) =>(
    testTree(<SettingsPage.InnerComponent share={share} />, settings(app)));

  const tree = (app) => testTree(<SettingsPage />, specs(app));

  const specs = (app) => ({
    context: { app: app }
  });

  const stateTree = (state) => testTree(<SettingsPage.InnerComponent />, stateOf(state));
  const stateOf = (state) => ({context: {state: state}});

  describe('contents', () => {

    describe('on first load', () => {

      it('displays correctly', () => {
        const comp = stateTree({curShare:2});

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
});
