'use strict';

const Marty = require('marty');
const Root = require('./components/Root.jsx');
const React = require('react');
const Application = require('./application.js');
const sc = require('./modules/scheduler');
const hourly = 60 * 60 * 1000;
const everyMinute = 60 * 1000;
const every10Sec = 10 * 1000;

require('./styles/main.less');

window.React = React;
window.Marty = Marty;

const app = new Application();
const { ApplicationContainer } = require('marty');

sc.schedule(app.locSubActions.forget, every10Sec);

let rootInstance = React.render((
  <ApplicationContainer app={app}>
    <Root className="root"/>
  </ApplicationContainer>
), document.getElementById('content'));

if (module.hot) {
  require('react-hot-loader/Injection').RootInstanceProvider.injectProvider({
    getRootInstances: () => [rootInstance]
  });
}
