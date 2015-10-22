'use strict';

import Marty from 'marty';
import Root from './components/Root.jsx';
import React from 'react';
import Application from './application.js';

require('./styles/main.less');

window.React = React;
window.Marty = Marty;

const app = new Application();
import { ApplicationContainer } from 'marty';

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
