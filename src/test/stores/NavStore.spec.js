const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const Marty = require('marty');
const { Map } = require('immutable');
const Application = require('../../app/application');
const NavConstants = require('../../app/constants/NavConstants');
const { HOME, MAP, SEC } = require('../../app/constants/Pages');
const { dispatch, createApplication } = require('marty/test-utils');
import {
  shouldHaveBeenCalledWithImmutable,
  shouldHaveBeenCalledNthTimeWithImmutable
} from '../support/matchers';

const should = chai.should();
chai.use(sinonChai);

describe('NavStore', () => {

  const setup = (page) => {

    const app = createApplication(Application, { include: ['navStore'] });
    app.navStore.state = Map({ page: page, expanded: false });

    const listener = sinon.spy();
    app.navStore.addChangeListener(listener);

    return [app, listener];
  };

  describe('handlers', () => {

    describe('#goto', () => {

      it('handles PAGE_REQUESTED', () => {
        const [app] = setup(MAP);
        const goto = sinon.spy(app.navStore, 'goto');

        dispatch(app, NavConstants.PAGE_REQUESTED, HOME);
        goto.should.have.been.calledWith(HOME);

        dispatch(app, NavConstants.PAGE_REQUESTED, MAP);
        goto.should.have.been.calledWith(MAP);


        dispatch(app, NavConstants.PAGE_REQUESTED, SEC);
        goto.should.have.been.calledWith(SEC);

        goto.should.have.callCount(3);
      });

      it('records new page in store', () => {
        const [app] = setup(MAP);

        app.navStore.goto(HOME);
        app.navStore.state.get('page').should.equal(HOME);

        app.navStore.goto(MAP);
        app.navStore.state.get('page').should.equal(MAP);

        app.navStore.goto(SEC);
        app.navStore.state.get('page').should.equal(SEC);
      });

      it('notifies listener of state change', () => {
        const [app, listener] = setup(MAP);

        app.navStore.goto(HOME);
        shouldHaveBeenCalledNthTimeWithImmutable(
          listener, 0, Map({ page: HOME, expanded: false }));

        app.navStore.goto(MAP);
        shouldHaveBeenCalledNthTimeWithImmutable(
          listener, 1, Map({ page: MAP, expanded: false }));

        app.navStore.goto(SEC);
        shouldHaveBeenCalledNthTimeWithImmutable(
          listener, 2, Map({ page: SEC, expanded: false }));
      });
    });

    describe('#toggle()', () => {

      it('toggles `expanded` btw true and false', () => {
        const [app, listener] = setup(HOME);
        app.navStore.state.get('expanded').should.equal(false);

        dispatch(app, NavConstants.NAV_TOGGLED);
        app.navStore.state.get('expanded').should.equal(true);

        dispatch(app, NavConstants.NAV_TOGGLED);
        app.navStore.state.get('expanded').should.equal(false);
      });

      it('notifies listers of state change', () => {
        const [app, listener] = setup(HOME);

        dispatch(app, NavConstants.NAV_TOGGLED);
        //listener.should.have.been.calledWith(Map({ page: HOME, expanded: true}));

        dispatch(app, NavConstants.NAV_TOGGLED);
        //listener.should.have.been.calledWith(Map({ page: HOME, expanded: false }));
        listener.should.have.been.calledTwice;

      });

      it('responds to both NAV_TOGGLED and PAGE_SELECTED', () => {
        const [app, listener] = setup(HOME);

        dispatch(app, NavConstants.NAV_TOGGLED);
        app.navStore.state.get('expanded').should.equal(true);

        dispatch(app, NavConstants.PAGE_REQUESTED);
        app.navStore.state.get('expanded').should.equal(false);

        listener.should.have.been.calledTwice;
      });
    });
  });

  describe('accessors', () => {

    describe('#getPage', () => {

      it('returns current page', ()=> {
        const app = setup(HOME)[0];
        app.navStore.getPage().should.equal(HOME);

        app.navStore.goto(MAP);
        app.navStore.getPage().should.equal(MAP);
      });
    });

    describe('#isExpanded', () => {

      it('returns expanded state', () => {
        const app = setup(HOME)[0];
        app.navStore.isExpanded().should.equal(false);

        app.navStore.toggle();
        app.navStore.isExpanded().should.equal(true);
      });
    });
  });
});
