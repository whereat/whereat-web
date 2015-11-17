import chai from 'chai';
const should = chai.should();

import testTree from 'react-test-tree';
import { createStore, createApplication } from 'marty/test-utils';

import Application from '../../app/application';


import MapPage from '../../app/components/MapPage';
import MapContainer from '../../app/components/MapContainer';
import ClearButton from '../../app/components/ClearButton';
import MockComponent from '../support/mocks/MockComponent';


describe('MapPage Component', () => {

  describe('contents', () => {

    it('renders HomePage component', () => {
      const comp = testTree(<MapPage.InnerComponent />, {
        stub: {
          mapContainer: <MockComponent />
        }
      });

      comp.mapPage.should.exist;
      comp.mapContainer.should.exist;
      comp.refreshButton.should.exist;
      comp.refreshButton.getClassName()
        .should.equal('refreshButton btn btn-default');

    });
  });
});
