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
