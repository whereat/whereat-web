const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const should = chai.should();

const React = require('react');
const Application = require('../../src/application');
const { RED, GREEN } = require('../../src/constants/Colors');
const { GO_RADIUS, GO_DIAMETER } = require('../../src/constants/Dimensions');
const { createStore, createApplication } = require('marty/test-utils');
const testTree = require('react-test-tree');

const GoButton = require('../../src/components/GoButton');

describe('GoButton Component', () => {

  const setup = (spy) => {
    return [createApplication(Application, {
      stub: {
        goButtonStore: createStore({
          getColor: spy
        })
      }
    }), spy];
  };

  describe('Inner Component', () => {

    it('contains a tappable svg circle with correct dimensions and color', () => {
      const app = setup({})[0];
      const gb = testTree(<GoButton.InnerComponent color={RED} />);

      gb.tappable.getClassName().should.equal('Tappable-inactive');
      gb.svg.getAttribute('width').should.equal(GO_DIAMETER.toString());
      gb.svg.getAttribute('height').should.equal(GO_DIAMETER.toString());
      gb.circle.getAttribute('cx').should.equal(GO_RADIUS.toString());
      gb.circle.getAttribute('cy').should.equal(GO_RADIUS.toString());
      gb.circle.getAttribute('r').should.equal(GO_RADIUS.toString());
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
