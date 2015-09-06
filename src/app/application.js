const Marty = require('marty');

class Application extends Marty.Application {
  constructor(options){
    super(options);

    this.register(require('./stores'));
    this.register(require('./actions'));
    this.register(require('./queries'));
  }
}

module.exports = Application;
