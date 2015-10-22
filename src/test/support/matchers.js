const { hasDispatched, getDispatchedActionsWithType } = require('marty/test-utils');

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
