const Application = require('../../src/application');

const Header = require('../../src/components/Header');
const { HOME, MAP } = require('../../src/constants/Pages');

const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const should = chai.should();

const testTree = require('react-test-tree');
const { createApplication } = require('marty/test-utils');

describe('Header Component', () => {

  const setup = () => {

    const spies = {
      goto: sinon.spy(),
      toggle: sinon.spy()
    };

    const app = createApplication(Application, {
      stub: { navActions: spies }
    });

    const component = testTree(<Header.InnerComponent />, { context: { app: app }});

    return [app, component, spies];
  };

  describe('contents', () => {

    describe('dropdown menu', () => {

      it('contains correctly ordered list of pages', () => {
        const [_, hdr, __] = setup();

        hdr.navItem1.innerText.trim().should.equal(HOME);
        hdr.navItem2.innerText.trim().should.equal(MAP);
      });
    });
  });

  describe('events', () =>{

    describe('selecting nav elements', () => {

      describe('HOME', () => {

        it('calls navAction#goto(HOME)', () => {
          const[_, hdr, {goto}] = setup();
          hdr.navItem1.simulate.select();

          goto.should.have.been.calledWith(HOME);
        });
      });

      describe('MAP', () => {

        it('calls navAction#goto(MAP)', () => {
          const[_, hdr, {goto}] = setup();
          hdr.navItem2.simulate.select();

          goto.should.have.been.calledWith(MAP);
        });
      });
    });
  });
});