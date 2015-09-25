const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const should = chai.should();

const Application = require('../../app/application');
const { createApplication } = require('marty/test-utils');
const testTree = require('react-test-tree');
import { HOME } from '../../app/constants/Pages';

const SecurityPage = require('../../app/components/SecurityPage');

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
      sp.secButton.should.exist;
      sp.secButton.getClassName().should.equal('secButton btn btn-lg btn-primary');
    });
  });

  describe('events', () => {

    describe('clicking dismissal button', () => {

      it('calls `navActions.goto(HOME)`', () => {

        const[app, sp, {goto}] = setup();
        sp.secButton.click();

        goto.should.have.been.calledWith(HOME);
      });
    });
  });
});
