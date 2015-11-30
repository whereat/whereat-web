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
import { s1t1, s1t2, s2t1, s2t2 } from '../support/sampleSettings';

import SettingsConstants from '../../app/constants/SettingsConstants';

describe('Settings Store', () => {

  const setup = (state) => {
    const app = createApplication(Application, {include: ['settingsStore'] });
    app.settingsStore.state = state;
    const listener = sinon.spy();
    app.settingsStore.addChangeListener(listener);
    return [app, listener];
  };

  describe('initial state', () => {

    it('has correct defaults', () =>{
      const app = createApplication(Application, {include: ['settingsStore'] });

      app.settingsStore.state.get('shareFreq').should.equal(0);
      app.settingsStore.state.get('locTtl').should.equal(1);
    });
  });

  describe('handlers', () => {

    describe('#setShareFreq', () => {

      it('handles SHARE_FREQUENCY_CHANGED', () =>{
        const [app] = setup(s1t1);
        const setShareFreq = sinon.spy(app.settingsStore, 'setShareFreq');
        dispatch(app, SettingsConstants.SHARE_FREQUENCY_CHANGED, 2);

        setShareFreq.should.have.been.calledWith(2);

        setShareFreq.restore();
      });

      it('updates the `shareFreq` field', () => {
        const [app] = setup(s1t1);
        app.settingsStore.setShareFreq(2);

        shouldHaveObjectEquality(app.settingsStore.state, s2t1);
      });

      it('notifies listeners of state change', () =>{
        const [app, listener] = setup(s1t1);
        app.settingsStore.setShareFreq(2);

        shouldHaveBeenCalledWithImmutable(listener, s2t1);
      });
    });

    describe('#setLocTtl', () => {

      it('handles LOC_TTL_CHANGED', () =>{
        const [app] = setup(s1t1);
        const setLocTtl = sinon.spy(app.settingsStore, 'setLocTtl');
        dispatch(app, SettingsConstants.LOC_TTL_CHANGED, 2);

        setLocTtl.should.have.been.calledWith(2);

        setLocTtl.restore();
      });

      it('updates the `locTtl` field', () => {
        const [app] = setup(s1t1);
        app.settingsStore.setLocTtl(2);

        shouldHaveObjectEquality(app.settingsStore.state, s1t2);
      });

      it('notifies listeners of state change', () =>{
        const [app, listener] = setup(s1t1);
        app.settingsStore.setLocTtl(2);

        shouldHaveBeenCalledWithImmutable(listener, s1t2);
      });
    });
  });

  describe('accessors', () => {

    describe('#getShareFreq', () => {

      it('gets value of `shareFreq` field', () => {
        const [app] = setup(s1t1);
        app.settingsStore.getShareFreq().should.equal(1);

        const [app2] = setup(s2t1);
        app2.settingsStore.getShareFreq().should.equal(2);
      });
    });

    describe('#getLocTtl', () => {

      it('gets value of `shareFreq` field', () => {
        const [app] = setup(s1t1);
        app.settingsStore.getLocTtl().should.equal(1);

        const [app2] = setup(s1t2);
        app2.settingsStore.getLocTtl().should.equal(2);
      });
    });


  });
});
