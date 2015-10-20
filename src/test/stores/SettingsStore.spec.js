import sinon from'sinon';
import chai from'chai';
import sinonChai from'sinon-chai';

const should = chai.should();
chai.use(sinonChai);

import Marty from'marty';
import Application from'../../app/application';

import { Map } from 'immutable';
import { dispatch, hasDispatched, createApplication } from 'marty/test-utils';
import {
  shouldHaveDispatched,
  shouldHaveDispatchedWith,
  shouldHaveDispatchedWithImmutable,
  shouldHaveBeenCalledWithImmutable,
  shouldHaveObjectEquality
} from '../support/matchers';
import { s1, s2 } from '../support/sampleSettings';

import SettingsConstants from '../../app/constants/SettingsConstants';

describe('Settings Store', () => {

  const setup = (state) => {
    const app = createApplication(Application, {include: ['settingsStore'] });
    app.settingsStore.state = state;
    const listener = sinon.spy();
    app.settingsStore.addChangeListener(listener);
    return [app, listener];
  };

  describe('handlers', () => {

    describe('#setShareFreq', () => {

      it('handles SHARE_INTERVAL_CHANGED', () =>{
        const [app] = setup(s1);
        const setShareFreq = sinon.spy(app.settingsStore, 'setShareFreq');
        dispatch(app, SettingsConstants.SHARE_INTERVAL_CHANGED, 2);

        setShareFreq.should.have.been.calledWith(2);

        setShareFreq.restore();
      });

      it('updates the `shareFreq` field', () => {
        const [app] = setup(s1);
        app.settingsStore.setShareFreq(2);

        shouldHaveObjectEquality(app.settingsStore.state, s2);
      });

      it('notifies listeners of state change', () =>{
        const [app, listener] = setup(s1);
        app.settingsStore.setShareFreq(2);

        shouldHaveBeenCalledWithImmutable(listener, s2);
      });
    });
  });

  describe('accessors', () => {

    describe('#getShareFreq', () => {

      it('gets value of `shareFreq` field', () => {
        const [app] = setup(s1);
        app.settingsStore.getShareFreq().should.equal(1);

        const [app2] = setup(s2);
        app2.settingsStore.getShareFreq().should.equal(2);
      });
    });
  });
});
