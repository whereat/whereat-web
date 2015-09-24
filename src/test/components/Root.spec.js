const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const should = chai.should();

const Application = require('../../app/application');
const testTree = require('react-test-tree');
const { createApplication } = require('marty/test-utils');

const MockComponent = require('../support/mocks/MockComponent');
const Root = require('../../app/components/Root');
import { HOME, SEC } from '../../app/constants/Pages';
const sc = require('../../app/modules/scheduler');

import { merge } from 'lodash';


describe('Root component', () => {

  const setup = (state) => {
    const spies = {
      locSub: { forget: sinon.spy() },
      nav: { goto: sinon.spy() }
    };
    const app = createApplication(Application, {
      include: ['locSubActions', 'navActions'],
      stub: {
        locSubActions: spies.locSub,
        navActions: spies.nav
      }
    });
    const component = propTree(app);

    return [app, component, merge({}, spies.locSub, spies.nav)];
  };
  const propTree = (app) =>testTree(<Root.InnerComponent />,settings(app));
  const tree = (app) => testTree(<Root />, settings(app));
  const settings = (app) => ({
    context: { app: app },
    stub: {
      header: <MockComponent />,
      display: <MockComponent />
    }
  });

  describe('contents', () => {

    it('renders header and display childredn', () => {
      const [app, comp] = setup();
      comp.root.should.exist;
      comp.header.should.exist;
      comp.display.should.exist;
    });
  });

  describe('events', () => {

    describe('#_forget', () =>{

      it('calls LocSubactions#forget', () => {

        const [app, comp, {forget}] = setup();
        comp.element._forget();

        forget.should.have.been.called.once;
      });
    });

    describe('_#scheduleForget', () => {

      it('schedules forgetting once and only once', () => {

        const schedule = sinon.spy(sc, 'schedule');
        schedule.should.not.have.been.called;

        const[app, comp] = setup();
        schedule.should.have.been.calledWith(
          comp.element._forget,
          60 * 1000
        );

        comp.element._scheduleForget();
        schedule.should.have.callCount(1);
      });
    });

    describe('#_alertSecurity', () => {

      it('shows security alert once and only once on load', () => {

        const [app, comp, {goto} ] = setup();

        goto.should.have.been.calledWith(SEC);

        comp.element._alertSecurity();
        goto.should.have.callCount(1);
      });
    });
  });
});
