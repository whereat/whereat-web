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
