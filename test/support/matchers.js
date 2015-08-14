const { hasDispatched, getDispatchedActionsWithType } = require('marty/test-utils');

const matchers = {};

matchers.shouldHaveDispatched = (app, type) => (
  hasDispatched(app, type).should.equal(true));

matchers.shouldHaveDispatchedWith = (app, type, arg) => (
  hasDispatched(app, type, arg).should.equal(true));

matchers.shouldHaveDispatchedWithImmutable = (app, type, arg) => (
  getDispatchedActionsWithType(app, type)[0].arguments[0]
    .equals(arg).should.equal(true));

matchers.shouldHaveObjectEquality = (obj1, obj2) => (
  obj1.equals(obj1).should.equal(true));

matchers.shouldHaveNotifiedWith = (listener, state) => (
  listener.getCall(0).args[0].equals(state).should.equal(true));

module.exports = matchers;
