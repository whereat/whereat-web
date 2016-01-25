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

import chai from 'chai';
const should = chai.should();

import testTree from 'react-test-tree';
import { createStore, createApplication } from 'marty/test-utils';

import Application from '../../app/application';


import MapPage from '../../app/components/MapPage';
import MapContainer from '../../app/components/MapContainer';
import PowerButton from '../../app/components/PowerButton';
import MockComponent from '../support/mocks/MockComponent';


describe('MapPage Component', () => {

  describe('contents', () => {

    it('renders MapPage component', () => {
      const comp = testTree(<MapPage.InnerComponent />, {
        stub: {
          mapContainer: <MockComponent />,
          powerButton: <MockComponent />,
          refreshButton: <MockComponent />
        }
      });

      comp.mapPage.should.exist;
      comp.mapContainer.should.exist;
      comp.powerButton.should.exist;
      comp.refreshButton.should.exist;
    });
  });
});
