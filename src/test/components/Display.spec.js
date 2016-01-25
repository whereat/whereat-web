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

import testTree from 'react-test-tree';
import { createStore, createApplication } from 'marty/test-utils';

import Application from '../../app/application';
import { Map } from 'immutable';

import Display from '../../app/components/Display';
import MapPage from '../../app/components/MapPage';
import MockComponent from '../support/mocks/MockComponent';
import { MAP, SEC, SET } from '../../app/constants/Pages';

describe('Display Component', () => {

  const setup = (page) => {

    const app = createApplication(Application,{
      include: ['navStore', 'goButtonStore', 'notificationStore']
    });
    app.navStore.state = Map({page: page});

    const component = propTree(app, page);

    return [app, component];
  };

  const propTree = (app, page) =>(
    testTree(<Display.InnerComponent page={page} />, settings(app)));

  const tree = (app) => testTree(<Display />, settings(app));

  const settings = (app) => ({
    context: { app: app },
    stub: {
      homePage: <MockComponent />,
      mapPage: <MockComponent />,
      settingsPage: <MockComponent />,
      securityPage: <MockComponent />
    }
  });

  describe('contents', () => {

    describe('page', () => {

      describe('when `page` prop is MAP', () => {

        it('renders MapPage component', () => {
          const [app, d] = setup(MAP);

          d.getProp('page').should.equal(MAP);
          d.mapPage.should.exist;
        });
      });

      describe('when `page` prop is SEC', () => {

        it('renders SecurityPage component', () => {
          const [app, d] = setup(SEC);

          d.getProp('page').should.equal(SEC);
          d.securityPage.should.exist;
        });
      });

      describe('when `page` prop is SET', () => {

        it('renders SecurityPage component', () => {
          const [app, d] = setup(SET);

          d.getProp('page').should.equal(SET);
          d.settingsPage.should.exist;
        });
      });

    });
  });

  describe('events', () =>{
    describe('listening to NavStore', () => {

      it('changes page when store page changes', () => {
        const [app, d] = setup(MAP);
        d.getProp('page').should.equal(MAP);

        app.navStore.replaceState(Map({ page: SET }));
        const d2 = tree(app);
        d2.innerComponent.getProp('page').should.equal(SET);

        app.navStore.replaceState(Map({ page: SEC }));
        const d3 = tree(app);
        d3.innerComponent.getProp('page').should.equal(SEC);
      });
    });
  });
});
