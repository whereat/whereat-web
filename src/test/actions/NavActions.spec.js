const chai = require('chai');
const Application = require('../../app/application');
const NavConstants = require('../../app/constants/NavConstants');
const { HOME, MAP } = require('../../app/constants/Pages');
const { hasDispatched, createApplication } = require('marty/test-utils');

const should = chai.should();

describe('NavActions', () => {

  const setup = () => {
    return createApplication(Application, { include: ['navActions'] });
  };

  describe('#goto', () => {

    describe('home', () =>{

      it('dispatches PAGE_REQUESTED, \'home\'', () =>{
        const app = setup();
        app.navActions.goto(HOME);

        hasDispatched(app, NavConstants.PAGE_REQUESTED, HOME).should.equal(true);
      });
    });

    describe('map', () =>{

      it('dispatches PAGE_REQUESTED, \'map\'', () =>{
        const app = setup();
        app.navActions.goto(MAP);

        hasDispatched(app, NavConstants.PAGE_REQUESTED, MAP).should.equal(true);
      });
    });

    describe('#alert', () => {

      it.only('dispatches SECURITY_ALERT_TRIGGERED', () => {
        const app = setup();
        app.navActions.alert();

        hasDispatched(app, NavConstants.SECURITY_ALERT_TRIGGERED).should.equal(true);
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
