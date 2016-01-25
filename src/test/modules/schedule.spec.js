/**
 *
 * Copyright (c) 2015-present, Total Location Test Paragraph.
 * All rights reserved.
 *
 * This file is part of Where@. Where@ is free software:
 * you can redistribute it and/or modify it under the terms of
 * the GNU General Public License (GPL), either version 3
 * of the License, or (at your option) any later version.
 *
 * Where@ is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For more details,
 * see the full license at <http://www.gnu.org/licenses/gpl-3.0.en.html>
 *
 */

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
