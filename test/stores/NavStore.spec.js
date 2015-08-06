const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const Marty = require('marty');
const { Map } = require('immutable');
const Application = require('../../src/application');
const NavConstants = require('../../src/constants/NavConstants');
const { HOME, MAP } = require('../../src/constants/Pages');
const { dispatch, createApplication } = require('marty/test-utils');

const should = chai.should();
chai.use(sinonChai);

describe('NavStore', () => {

  const setup = (page) => {
    const app = createApplication(Application, { include: ['navStore'] });
    app.navStore.state = Map({ page: page , expanded: false });

    const listener = sinon.spy();
    app.navStore.addChangeListener(listener);

    return [app, listener];
  };

  describe('handlers', () => {

    describe('#goto', () => {

      describe('HOME', () => {

        it('sets page to HOME', () => {
          const app = setup(MAP)[0];
          dispatch(app, NavConstants.PAGE_REQUESTED, HOME);

          app.navStore.state.get('page').should.equal(HOME);
        });

        it('notifies listeners of state change', () => {
          const [app, listener] = setup(MAP);
          dispatch(app, NavConstants.PAGE_REQUESTED, HOME);

          listener.should.have.been.calledOnce;
          listener.should.have.been.calledWith(Map({ page: HOME, expanded: true }));
        });
      });

      describe('MAP', () => {

        it('sets page to MAP', () => {
          const app = setup(MAP)[0];
          dispatch(app, NavConstants.PAGE_REQUESTED, MAP);

          app.navStore.state.get('page').should.equal(MAP);
        });

        it('notifies listeners of state change', () => {
          const [app, listener] = setup(HOME);
          dispatch(app, NavConstants.PAGE_REQUESTED, MAP);

          listener.should.have.been.calledOnce;
          listener.should.have.been.calledWith(Map({ page: MAP, expanded: true }));
        });
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
        listener.should.have.been.calledWith(Map({ page: HOME, expanded: true}));

        dispatch(app, NavConstants.NAV_TOGGLED);
        listener.should.have.been.calledWith(Map({ page: HOME, expanded: false }));
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
