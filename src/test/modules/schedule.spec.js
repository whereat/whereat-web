const chai = require('chai');
const should = chai.should();
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const sc = require('../../app/modules/scheduler');
const { wait } = require('../../app/modules/async');

describe('schedule module', () =>{

  describe('#schedule', () =>{

    it('calls a function every n milliseconds', done => {

      const fn = sinon.spy();
      const [millis, offset, times] = [10, 2, 3];

      sc.schedule(fn, millis);

      setTimeout(() => {
        fn.should.have.been.called.thrice;
        done();
      }, times * millis + offset);
    });
  });

  describe('#cancel', () =>{

    it.only('cancels a scheduled function', done => {

      const fn = sinon.spy();
      const [ms, s, wait] = [1000, 1, 10];

      const job = sc.schedule(fn, ms);

      setTimeout(() => {
        sc.cancel(job);
        setTimeout(() => {
          fn.should.not.have.been.called;
          done();
        }, wait);
      }, wait);
    });
  });
});
