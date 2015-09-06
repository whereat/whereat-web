'use strict';

const Marty = require('marty');
const Root = require('./components/Root.jsx');
const React = require('react');
const Application = require('./application.js');
require('./styles/main.less');

window.React = React;
window.Marty = Marty;

if (process.env.NODE_ENV !== 'test'){

  const app = new Application();
  const { ApplicationContainer } = require('marty');

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
}
