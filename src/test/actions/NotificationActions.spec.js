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
