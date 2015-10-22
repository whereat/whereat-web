import chai from 'chai';
const should = chai.should();
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

import sc from '../../app/modules/scheduler';
import { wait } from '../../app/modules/async';

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

    it('cancels a scheduled function', done => {

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
