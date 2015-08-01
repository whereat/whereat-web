const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const should = chai.should();

const React = require('react');
const Application = require('../../src/application');
const { RED, GREEN } = require('../../src/constants/Colors');
const { createStore, createApplication } = require('marty/test-utils');
const testTree = require('react-test-tree');

const GoButton = require('../../src/components/GoButton');

describe('GoButton Component', () => {

  const setup = (spy) => {
    const app = createApplication(Application, {
      stub: {
        goButtonStore: createStore({
          getColor: spy
        })
      }
    });
    return [app, spy];
  };

  describe('GoButton Component', () => {

    it('contains a tappable svg circle', () => {
      const spy = sinon.spy();
      const app = setup(spy)[0];
      const gb = testTree(<GoButton color={RED} />, { context: { app: app }});

      gb.svg.getAttribute('width').should.equal(220);
      gb.svg.getAttribute('height').should.equal(220);
      gb.circle.getAttribute('cx').should.equal(110);
      gb.circle.getAttribute('cy').should.equal(110);
      gb.circle.getAttribute('r').should.equal(110);
      gb.circle.getAttribute('fill').should.equal(RED);
    });
  });

  xdescribe('clicking go button', () => {

    it('flashes green', () => {

    });
  });

  xdescribe('pressing go button', () => {

    it('turns green, then turns red', () => {

    });
  });

});
