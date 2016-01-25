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

import { hasDispatched, getDispatchedActionsWithType } from 'marty/test-utils';

const matchers = {};

matchers.shouldHaveDispatched = (app, type) => (
  hasDispatched(app, type).should.equal(true));

matchers.shouldHaveDispatchedWith = (app, type, arg) => (
  getDispatchedActionsWithType(app, type)[0].arguments[0].should.eql(arg));

matchers.shouldHaveDispatchedNthTimeWith = (app, n, type, arg) => (
  getDispatchedActionsWithType(app, type)[n].arguments[0].should.eql(arg));

matchers.shouldHaveDispatchedWithImmutable = (app, type, arg) => (
  getDispatchedActionsWithType(app, type)[0].arguments[0]
    .equals(arg).should.equal(true));

matchers.shouldHaveDispatchedNthTimeWithImmutable = (app, n, type, arg) => (
  getDispatchedActionsWithType(app, type)[n].arguments[0]
    .equals(arg).should.equal(true));

matchers.shouldHaveObjectEquality = (obj1, obj2) => (
  obj1.equals(obj2).should.equal(true));

matchers.shouldHaveBeenCalledWithImmutable = (listener, state) => (
  listener.getCall(0).args[0].equals(state).should.equal(true));


matchers.shouldHaveBeenCalledNthTimeWithImmutable = (listener, n, state) => (
  listener.getCall(n).args[0].equals(state).should.equal(true));

module.exports = matchers;
