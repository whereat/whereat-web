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
