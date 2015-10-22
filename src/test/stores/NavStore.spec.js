import sinon from 'sinon';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import Marty from 'marty';
import { Map } from 'immutable';
import Application from '../../app/application';
import NavConstants from '../../app/constants/NavConstants';
import { HOME, MAP, SEC } from '../../app/constants/Pages';
import { dispatch, createApplication } from 'marty/test-utils';
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

    describe('#hide', () => {

      it('handles PAGE_REQUESTED', () => {
        const [app] = setup();
        const hide = sinon.spy(app.navStore, 'hide');
        dispatch(app, NavConstants.PAGE_REQUESTED, HOME);

        hide.should.have.been.calledOnce;
      });

      it('sets state.expanded to false', () => {
        const[app] = setup(HOME);
        app.navStore.state.set('expanded', true);
        app.navStore.hide();

        app.navStore.state.get('expanded').should.equal(false);
      });

      it('notifies listeners of state change', () => {
        const [app, listener] = setup(HOME);
        app.navStore.replaceState(app.navStore.state.set('expanded', true));
        app.navStore.hide();

        shouldHaveBeenCalledNthTimeWithImmutable(
          listener, 1, Map({ page: HOME, expanded: false })
        );
      });
    });

    describe('#toggle()', () => {

      it('handles NAV_TOGGLED', () => {
        const [app] = setup(HOME);
        const toggle = sinon.spy(app.navStore, 'toggle');
        dispatch(app, NavConstants.NAV_TOGGLED);

        toggle.should.have.been.calledOnce;
      });

      it('toggles `expanded` btw true and false', () => {
        const [app] = setup(HOME);
        app.navStore.state.get('expanded').should.equal(false);

        app.navStore.toggle();
        app.navStore.state.get('expanded').should.equal(true);

        app.navStore.toggle();
        app.navStore.state.get('expanded').should.equal(false);
      });

      it('notifies listers of state change', () => {
        const [app, listener] = setup(HOME);

        app.navStore.toggle();
        shouldHaveBeenCalledNthTimeWithImmutable(
          listener, 0, Map({ page: HOME, expanded: true }));

        app.navStore.toggle();
        shouldHaveBeenCalledNthTimeWithImmutable(
          listener, 1, Map({ page: HOME, expanded: false }));
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
