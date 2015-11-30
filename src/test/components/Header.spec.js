import sinon from 'sinon';
import chai from 'chai';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
const should = chai.should();

import testTree from 'react-test-tree';
import { createApplication } from 'marty/test-utils';

import Application from '../../app/application';
import Header from '../../app/components/Header';
import { POWER, MAP, SET, SEC } from '../../app/constants/Pages';

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

        hdr.navItem1.innerText.trim().should.equal(MAP);
        hdr.navItem2.innerText.trim().should.equal(SET);
        hdr.navItem3.innerText.trim().should.equal(SEC);
      });
    });
  });

  describe('events', () =>{

    describe('selecting menu items', () => {

      describe('first item', () => {

        it('calls navAction#goto(MAP)', () => {
          const[_, hdr, {goto}] = setup();
          hdr.navItem1.simulate.select();

          goto.should.have.been.calledWith(MAP);
        });
      });

      describe('second item', () => {

        it('calls navAction#goto(SET)', () => {
          const[_, hdr, {goto}] = setup();
          hdr.navItem2.simulate.select();
          goto.should.have.been.calledWith(SET);
        });
      });

      describe('third item', () => {

        it('calls navAction#goto(SEC)', () => {
          const[_, hdr, {goto}] = setup();
          hdr.navItem3.simulate.select();
          goto.should.have.been.calledWith(SEC);
        });
      });
    });
  });
});
