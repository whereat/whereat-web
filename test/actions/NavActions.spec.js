const chai = require('chai');
const Application = require('../../src/application');
const NavConstants = require('../../src/constants/NavConstants');
const { HOME, MAP } = require('../../src/constants/Pages');
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



  });
});
