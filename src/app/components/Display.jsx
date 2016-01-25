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

import Marty from 'marty';
import BaseComponent from './BaseComponent';
import { POWER, MAP, SEC, SET } from '../constants/Pages';
import MapPage from './MapPage';
import SecurityPage from './SecurityPage';
import SettingsPage from './SettingsPage';
import NotificationContainer from './NotificationContainer';

class Display extends BaseComponent {
  render(){
    return (
      <div id="display">
        {{
          [MAP]: () => <MapPage ref='mapPage' />,
          [SEC]: () => <SecurityPage ref='securityPage' />,
          [SET]: () => <SettingsPage ref='settingsPage' />
         }[this.props.page]()}
        <NotificationContainer />
      </div>
    );
  };
}

export default Marty.createContainer(Display, {
  listenTo: ['navStore'],
  fetch: {
    page(){
      return this.app.navStore.getPage();
    }
  }
});
