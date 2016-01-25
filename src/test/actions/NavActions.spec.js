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
import Application from '../../app/application';
import NavConstants from '../../app/constants/NavConstants';
import { hasDispatched, createApplication } from 'marty/test-utils';
import { POWER, MAP, SEC } from '../../app/constants/Pages';

const should = chai.should();

describe('NavActions', () => {

  const setup = () => {
    return createApplication(Application, { include: ['navActions'] });
  };

  describe('#goto', () => {

    describe('home', () =>{

      it('dispatches PAGE_REQUESTED, \'home\'', () =>{
        const app = setup();
        app.navActions.goto(POWER);

        hasDispatched(app, NavConstants.PAGE_REQUESTED, POWER).should.equal(true);
      });
    });

    describe('map', () =>{

      it('dispatches PAGE_REQUESTED, \'map\'', () =>{
        const app = setup();
        app.navActions.goto(MAP);

        hasDispatched(app, NavConstants.PAGE_REQUESTED, MAP).should.equal(true);
      });
    });

    describe('sec', () => {

      it("dispatched PAGE_REQUESTED 'sec'", () => {
        const app = setup();
        app.navActions.goto(SEC);

        hasDispatched(app, NavConstants.PAGE_REQUESTED, SEC).should.equal(true);
      });
    });

    describe('#toggle', () => {

      it('toggles nav between expanded and collapsed states', () => {

        const app = setup();
        app.navActions.toggle();

        hasDispatched(app, NavConstants.NAV_TOGGLED).should.equal(true);
      });
    });
  });
});
