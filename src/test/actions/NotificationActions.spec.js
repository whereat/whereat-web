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

import Application from '../../app/application';

import NotificationConstants from '../../app/constants/NotificationConstants';
import { shouldHaveDispatched, shouldHaveDispatchedWith } from '../support/matchers';
import { hasDispatched, createApplication } from 'marty/test-utils';

describe('NotificationActions', () => {

  const setup = () => {
    return createApplication(Application, { include: ['notificationActions'] });
  };

  describe('#notify', () => {

    it('dispatches a message, waits, then dispatches done', done => {
      const app = setup();

      app.notificationActions.notify("hello world!", .00001).should.be.fulfilled
        .then(() => {

          shouldHaveDispatchedWith(
            app, NotificationConstants.NOTIFICATION_STARTING, "hello world!");
          shouldHaveDispatched(
            app, NotificationConstants.NOTIFICATION_DONE);

        }).should.notify(done);
    });
  });
});
