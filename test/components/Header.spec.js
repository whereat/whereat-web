var React = require('react');
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

    const spy = sinon.spy();

    const app = createApplication(Application, {
      stub: {
        navActions: {
          goto: spy
        }
      }
    });

    const component = testTree(<Header.InnerComponent />, { context: { app: app }});

    return [app, component, spy];
  };

  describe('contents', () => {

    describe('dropdown menu', () => {

      it('contains correctly ordered list of pages', () => {
        const [app, hdr, goto] = setup();

        hdr.menuItems.length.should.equal(2);
        hdr.menuItems[0].innerText.trim().should.equal(HOME);
        hdr.menuItems[1].innerText.trim().should.equal(MAP);
      });
    });
  });

  describe('events', () =>{

    describe('clicking on nav bar', () => {

      describe('when clicking HOME', () => {

        it('calls navAction#goto(HOME)', () => {
          const[app, hdr, goto] = setup();
          hdr.menuItems[0].simulate.select();

          goto.should.have.been.calledWith(HOME);
        });
      });

      describe('when clicking MAP', () => {

        it('calls navAction#goto(MAP)', () => {
          const[app, hdr, goto] = setup();
          hdr.menuItems[1].simulate.select();

          goto.should.have.been.calledWith(MAP);
        });
      });
    });
  });
});
