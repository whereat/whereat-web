const chai = require('chai');
const should = chai.should();

const Application = require('../../app/application');

const NotificationConstants = require('../../app/constants/NotificationConstants');
const { shouldHaveDispatched, shouldHaveDispatchedWith } = require('../support/matchers');
const { hasDispatched, createApplication } = require('marty/test-utils');

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
