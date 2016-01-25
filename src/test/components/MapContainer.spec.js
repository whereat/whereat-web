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
chai.use(sinonChai);
const should = chai.should();

import Application from '../../app/application';
import testTree from 'react-test-tree';
import { createStore, createApplication } from 'marty/test-utils';
import { shouldHaveObjectEquality } from '../support/matchers';

import MapContainer from '../../app/components/MapContainer';
import MockComponent from '../support/mocks/MockComponent';

import Location from '../../app/models/Location';
import UserLocation from '../../app/models/UserLocation';

import { Map, Seq } from 'immutable';
import { s17, s17UL, nyse3Seq, nyse3ULSeq } from '../support/sampleLocations';

describe('MapContainer Component', () => {

  const emptyState = Map({
    center: Location(s17),
    locs: Map()
  });

  const ls = nyse3ULSeq;

  const nyse3State = Map({
    center: Location(s17),
    locs: Map([
      [ls.get(0).id, ls.get(0)],
      [ls.get(1).id, ls.get(1)],
      [ls.get(2).id, ls.get(2)]
    ])
  });

  const setup = (state) => {

    const stubs = {
      getCenter: sinon.stub().returns(Location(s17)),
      getLocs: sinon.stub()
    };

    const app = createApplication(Application, {
      stub: {
        locSubStore: createStore(stubs)
      }
    });

    const component = propTree(app, state.get('locs').valueSeq(), state.get('center'));

    return [app, component, stubs];
  };


  const propTree = (app, locs, ctr) =>(
    testTree(
      <MapContainer.InnerComponent locations={locs} center={ctr}/>,
      settings(app)));

  const tree = (app) => testTree(<MapContainer />, settings(app));

  const settings = (app) => ({
    context: { app: app },
    stub: {
      map: <MockComponent />
    }
  });

  describe('contents', () => {

    it('renders a map with correct set of markers', () => {
      const [app, mc, _] = setup(nyse3State);

      mc.map.should.exist;
      mc.getProp('locations').count().should.equal(3);
      shouldHaveObjectEquality(mc.getProp('locations'), nyse3ULSeq);
    });
  });

  describe('events', () =>{

    describe('listening to LocSubStore', () => {

      it('updates props when store state changes', () => {
        const [app, _, {getLocs}] = setup(emptyState);

        getLocs.returns(Seq())
        const mc = tree(app);
        shouldHaveObjectEquality(
          mc.innerComponent.getProp('locations'), Seq());


        getLocs.returns(nyse3ULSeq);
        const mc2 = tree(app);
        shouldHaveObjectEquality(
          mc2.innerComponent.getProp('locations'), nyse3ULSeq);
      });
    });
  });
});
