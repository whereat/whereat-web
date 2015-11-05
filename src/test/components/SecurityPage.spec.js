import sinon from 'sinon';
import chai from 'chai';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
const should = chai.should();

import Application from '../../app/application';
import { createApplication } from 'marty/test-utils';
import testTree from 'react-test-tree';
import { HOME } from '../../app/constants/Pages';

import SecurityPage from '../../app/components/SecurityPage';

describe('SecurityPage component', () => {

  const setup = () => {
    const spies = {goto: sinon.spy()};
    const app = createApplication(Application, { stub: { navActions: spies }});
    const comp = propTree(app);
    return [app, comp, spies];
  };

  const propTree = (app, color) => (
    testTree(<SecurityPage.InnerComponent />, settings(app)));
  const tree = (app) => testTree(<SecurityPage />, settings(app));
  const settings = (app) => ({context: { app: app }});

  describe('contents', () => {

    it('renders correct HTML elements', () => {

      const [_, sp] = setup();

      sp.secHeader.should.exist;
      sp.secHeader.getClassName().should.equal('secHeader');

      sp.secBlurb.should.exist;
      sp.secBlurb.getClassName().should.equal('secBlurb');

      sp.secNoButton.should.exist;
      sp.secNoButton.getClassName()
        .should.equal('secButton secNoButton btn btn-lg btn-primary');

      sp.secYesButton.should.exist;
      sp.secYesButton.getClassName()
        .should.equal('secButton secYesButton btn btn-lg btn-primary');

      sp.staySafeLink.should.exist;
      sp.staySafeLink.getAttribute('href').should.equal('https://about.whereat.io/stay-safe');
    });
  });

  describe('events', () => {

    describe('clicking dismissal button', () => {

      it('calls `navActions.goto(HOME)`', () => {

        const[app, sp, {goto}] = setup();
        sp.secNoButton.click();

        goto.should.have.been.calledWith(HOME);
      });
    });
  });
});
