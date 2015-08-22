const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const should = chai.should();


const Application = require('../../src/application');

const { createApplication } = require('marty/test-utils');
const testTree = require('react-test-tree');
const { shouldHaveBeenCalledWithImmutable } = require('../support/matchers');

const User = require('../../src/models/User');
const ClearButton = require('../../src/components/ClearButton');

describe('ClearButton Component', () => {

  const setup = () => {

    const spies = { remove: sinon.spy() };
    const app = createApplication(Application, {
      stub: { locSubActions: spies }
    });
    return [app, spies];
  };

  const propTree = (app, color) => testTree(<ClearButton.InnerComponent />, settings(app));
  const tree = (app) => testTree(<ClearButton />, settings(app));
  const settings = (app) => ({context: { app: app }});

  describe('contents', () => {

    describe('button', () => {

      it('is rendered with correct styling', () => {
        const [app] = setup();
        const cb = propTree(app);

        cb.button.getClassName().should.equal('clearButton btn btn-default');
        cb.glyphicon.getClassName().should.equal('glyphicon glyphicon-remove');
      });
    });
  });

  describe('events', () =>{


    describe('clicking clear button', () => {

      it.only('calls locPubActions#remove', () => {
        const [app, {remove}] = setup();
        const cb = tree(app);
        cb.innerComponent.click();

        shouldHaveBeenCalledWithImmutable(remove, User());
      });
    });

  });
});
