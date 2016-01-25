/**
 *
 * Copyright (c) 2015-present, Total Location Test Paragraph.
 * All rights reserved.
 *
 * This file is part of Where@. Where@ is free software:
 * you can redistribute it and/or modify it under the terms of
 * the GNU General Public License (GPL), either version 3
 * of the License, or (at your option) any later version.
 *
 * Where@ is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For more details,
 * see the full license at <http://www.gnu.org/licenses/gpl-3.0.en.html>
 *
 */

import sinon from 'sinon';
import chai from 'chai';
import sinonChai from 'sinon-chai';
const should = chai.should();
chai.use(sinonChai);

import Marty from 'marty';
import Application from '../../app/application';
import { Map } from 'immutable';
import { dispatch, hasDispatched, createApplication } from 'marty/test-utils';
import { shouldHaveObjectEquality, shouldHaveBeenCalledWithImmutable } from '../support/matchers';

import LocPubConstants from '../../app/constants/LocPubConstants';
import LocSubConstants from '../../app/constants/LocSubConstants';

import Location from '../../app/models/Location';
import UserLocation from '../../app/models/UserLocation';
import UserLocationRefresh from '../../app/models/UserLocationRefresh';
import { s17, s17_, s17Nav, s17_Nav } from '../support/sampleLocations';
import { emptyState, ping1State, ping2State, pollState } from '../support/samplePingStates';

describe('LocPubStore', () => {

  const setup = (state) => {

    const actions = {
      init: sinon.spy(),
      refresh: sinon.spy()
    };

    const app = createApplication(Application, {
      include: ['locPubStore'],
      stub: { locationSubscriptionActions: actions }
    });
    app.locPubStore.state = state;

    const listener = sinon.spy();
    app.locPubStore.addChangeListener(listener);

    return [app, listener, actions];
  };

  const restore = (fn) => fn.restore();

  describe('handlers', () => {

    describe('#setLoc', () => {

      it('stores UserLocation value', () => {
        const [app] = setup(emptyState);
        app.locPubStore.state.get('loc').equals(UserLocation()).should.equal(true);

        app.locPubStore.setLoc(Location(s17));

        shouldHaveObjectEquality(app.locPubStore.state.get('loc'), UserLocation(s17));
      });

      it('handles USER_LOCATION_ACQUIRED', () => {
        const [app] = setup(emptyState);
        sinon.spy(app.locPubStore, 'setLoc');

        dispatch(app, LocPubConstants.USER_LOCATION_ACQUIRED, Location(s17));

        app.locPubStore.setLoc.should.have.been.calledWith(Location(s17));
        app.locPubStore.setLoc.restore();
      });

      it('notifies listeners of state change', () => {
        const [app, listener] = setup(emptyState);
        dispatch(app, LocPubConstants.USER_LOCATION_ACQUIRED, Location(s17));

        listener.should.have.been.calledOnce;
        shouldHaveBeenCalledWithImmutable(listener, ping1State);
      });
    });

    describe('#setLastPing', () => {

      it('stores lastPing', () => {
        const [app] = setup(emptyState);
        app.locPubStore.state.get('lastPing').should.equal(-1);

        app.locPubStore.setLastPing(1);

        app.locPubStore.state.get('lastPing').should.equal(1);

      });

      it('handles UPDATE_STARTING, and REMOVE_STARTING', () => {
        const [app] = setup(emptyState);
        sinon.spy(app.locPubStore, 'setLastPing');

        dispatch(app, LocSubConstants.UPDATE_STARTING, 1);
        app.locPubStore.setLastPing.should.have.been.calledWith(1);

        dispatch(app, LocSubConstants.REMOVE_STARTING, 2);
        app.locPubStore.setLastPing.should.have.been.calledWith(2);

        app.locPubStore.setLastPing.restore();
      });

      it('notifies listerns of state change', () => {
        const [app, listener] = setup(ping1State);
        app.locPubStore.setLastPing(1);

        shouldHaveBeenCalledWithImmutable(listener, ping1State.set('lastPing', 1));
      });

    });

    describe('#pollingOn', () => {

      it('turns polling on and stores pollId', () => {
        const [app, _] = setup(emptyState);
        app.locPubStore.state.get('polling').should.equal(false);
        app.locPubStore.state.get('pollId').should.equal(-1);

        app.locPubStore.pollingOn(1);

        app.locPubStore.state.get('polling').should.equal(true);
        app.locPubStore.state.get('pollId').should.equal(1);
      });

      it('handles POLLING_ON', () => {
        const [app, _] = setup(emptyState);
        app.locPubStore.state.get('polling').should.equal(false);
        app.locPubStore.state.get('pollId').should.equal(-1);
        sinon.spy(app.locPubStore, 'pollingOn');

        dispatch(app, LocPubConstants.POLLING_ON, 1);

        app.locPubStore.pollingOn.should.have.been.calledWith(1);
        app.locPubStore.pollingOn.restore();
      });

      it('notifies listeners of state changes', () => {
        const [app, listener] = setup(emptyState);
        app.locPubStore.pollingOn(1);

        listener.should.have.been.calledOnce;
        shouldHaveBeenCalledWithImmutable(listener, pollState);
      });
    });

    describe('#pollingOff', () => {

      it('turns polling off and sets pollId to -1', () => {
        const [app, _] = setup(pollState);
        app.locPubStore.state.get('polling').should.equal(true);
        app.locPubStore.state.get('pollId').should.equal(1);

        app.locPubStore.pollingOff();

        app.locPubStore.state.get('polling').should.equal(false);
        app.locPubStore.state.get('pollId').should.equal(-1);
      });

      it('handles POLLING_OFF', () => {
        const [app, _] = setup(pollState);
        app.locPubStore.state.get('polling').should.equal(true);
        app.locPubStore.state.get('pollId').should.equal(1);
        sinon.spy(app.locPubStore, 'pollingOff');

        dispatch(app, LocPubConstants.POLLING_OFF);

        app.locPubStore.pollingOff.should.have.been.calledOnce;
        app.locPubStore.pollingOff.restore();
      });

      it('notifies listeners of state changes', () => {
        const [app, listener] = setup(pollState);
        app.locPubStore.pollingOff();

        listener.should.have.been.calledOnce;
        shouldHaveBeenCalledWithImmutable(listener, emptyState);
      });
    });

    describe('#pollingReset', () => {

      it('resets pollId field without resetting polling', () => {
        const [app] = setup(pollState);
        app.locPubStore.state.get('polling').should.beTrue;
        app.locPubStore.state.get('pollId').should.equal(1);

        app.locPubStore.pollingReset(2);

        app.locPubStore.state.get('polling').should.beTrue;
        app.locPubStore.state.get('pollId').should.equal(2);
      });

      it('handles POLLING_OFF', () => {
        const [app, _] = setup(pollState);
        app.locPubStore.state.get('polling').should.equal(true);
        app.locPubStore.state.get('pollId').should.equal(1);
        sinon.spy(app.locPubStore, 'pollingOff');

        dispatch(app, LocPubConstants.POLLING_OFF);

        app.locPubStore.pollingOff.should.have.been.calledOnce;
        app.locPubStore.pollingOff.restore();
      });

      it('notifies listeners of state changes', () => {
        const [app, listener] = setup(pollState);
        app.locPubStore.pollingOff();

        listener.should.have.been.calledOnce;
        shouldHaveBeenCalledWithImmutable(listener, emptyState);
      });
    });
  });

  describe('accessors', () => {


    describe('#hasLoc', () => {

      it('returns false when `loc` is empty, true otherwise', () => {
        const [app] = setup(emptyState);
        app.locPubStore.hasLoc().should.equal(false);

        app.locPubStore.setLoc(UserLocation(s17));
        app.locPubStore.hasLoc().should.equal(true);
      });
    });

    describe('#getLoc', () => {

      it('returns current user location', () => {
        const [app, _] = setup(ping1State);
        app.locPubStore.getLoc().equals(UserLocation(s17)).should.equal(true);

        app.locPubStore.setLoc(Location(s17_));
        app.locPubStore.getLoc().equals(UserLocation(s17_)).should.equal(true);
      });
    });

    describe('#getLocRefresh', () => {

      it('returns current user location wrapped with `lastPing` value', () => {
        const [app, _] = setup(ping1State);

        shouldHaveObjectEquality(
          app.locPubStore.getLocRefresh(),
          UserLocationRefresh({ lastPing: -1, location: UserLocation(s17) })
        );

        app.locPubStore.setLastPing(s17.time);

        shouldHaveObjectEquality(
          app.locPubStore.getLocRefresh(),
          UserLocationRefresh({ lastPing: s17.time, location: UserLocation(s17) })
        );
      });
    });

    describe('#isPolling', () => {

      it('returns polling state (Boolean)', () => {
        const [app, _] = setup(emptyState);
        app.locPubStore.isPolling().should.equal(false);

        app.locPubStore.pollingOn(1);
        app.locPubStore.isPolling().should.equal(true);
      });
    });

    describe('#getPollId', () => {

      it('returns ID of current Navigator Watch process', () => {
        const [app, _] = setup(emptyState);
        app.locPubStore.getPollId().should.equal(-1);

        app.locPubStore.pollingOn(1);
        app.locPubStore.getPollId().should.equal(1);
      });
    });

    describe('#getLastPing', () => {

      it('returns time of last location update', () => {
        const [app, _] = setup(ping1State);
        app.locPubStore.getLastPing().should.equal(-1);

        app.locPubStore.setLastPing(1);
        app.locPubStore.getLastPing().should.equal(1);
      });
    });
  });
});
