const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const Marty = require('marty');
const { Map } = require('immutable');
const Application = require('../../src/application');
const NavConstants = require('../../src/constants/NavConstants');
const { HOME, MAP } = require('../../src/constants/Pages');
const { dispatch, hasDispatched, createApplication } = require('marty/test-utils');

const should = chai.should();
chai.use(sinonChai);

describe('NavStore', () => {

  const setup = (page) => {
    const app = createApplication(Application, { include: ['navStore'] });
    app.navStore.state = Map({ page: page });
    const listener = sinon.spy();
    app.navStore.addChangeListener(listener);
    return [app, listener];
  };

  describe('#goto', () => {

    describe('HOME', () => {

      it('sets page to HOME', () => {
        const app = setup(HOME)[0];
        dispatch(app, NavConstants.PAGE_REQUESTED, HOME);

        app.navStore.state.get('page').should.equal(HOME);
      });

      it('notifies listeners of state change', () => {
        const [app, listener] = setup(HOME);
        dispatch(app, NavConstants.PAGE_REQUESTED, HOME);

        return listener.should.have.been.calledWith(Map({ page: HOME}), app.navStore);
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

        return listener.should.have.been.calledWith(Map({ page: MAP }), app.navStore);
      });
    });
  });

  describe('#getPage', () => {

    it('returns current page', ()=> {
      const app = setup(HOME)[0];
      app.navStore.getPage().should.equal(HOME);

      const app2 = setup(MAP)[0];
      app2.navStore.getPage().should.equal(MAP);
    });
  });
});
