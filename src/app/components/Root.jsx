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
import BaseComponent from './BaseComponent.jsx';
import Header from './Header.jsx';
import Display from './Display.jsx';
import { SEC } from '../constants/Pages';
import { locTtl } from '../constants/Settings';

import sc from '../modules/scheduler';
const everyMinute = 60 * 1000;

/*

Root
|
|- Header
|- Display
   |
   |- HomePage
   |  |- GoButton
   |
   |- MapPage
   |  |- MapContainer
   |  |- ClearButton
   |
   |- NotificationContainer

*/

class Root extends BaseComponent {
  constructor(){
    super();
    this.state = { firstLoad: true };
    this.bindAll('_onFirstLoad', '_forget');
  }

  render(){
    return (
      <div className="root" ref="root">
        <Header key="header" ref="header"/>
        <Display key="display" ref="display"/>
      </div>
    );
  };

  componentDidMount(){
    if(this.state.firstLoad) this._onFirstLoad();
  }

  _onFirstLoad(){
    this.app.locSubActions.scheduleForget(locTtl.values[1]);
    this.app.locPubActions.poll(5000);
    this.state.firstLoad = false;
  }

  _forget(){
    this.app.locSubActions.forget();
  }
}

export default  Marty.createContainer(Root);
