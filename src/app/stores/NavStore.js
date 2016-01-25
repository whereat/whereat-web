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
import NavConstants from '../constants/NavConstants';
import { POWER, MAP, SEC, SET } from '../constants/Pages';
import { Map } from 'immutable';

class NavStore extends Marty.Store {

  constructor(options){
    super(options);
    this.state = Map({
      page: MAP,
      expanded: false
    });

    this.handlers = {
      goto: NavConstants.PAGE_REQUESTED,
      hide: NavConstants.PAGE_REQUESTED,
      toggle: NavConstants.NAV_TOGGLED
    };
  }

  //HANDLERS

  // (Page) -> Unit
  goto(page){
    this.replaceState(this.state.set('page', page ));
  }

  // () -> Unit
  hide(){
    this.replaceState(this.state.set('expanded', false));
  }

  // () -> Unit
  toggle(){
    this.replaceState(this.state.set('expanded', !this.state.get('expanded')));
  }


  //ACCESSORS

  // () -> Page
  getPage(){
    return this.state.get('page');
  }

  // () -> Boolean
  isExpanded(){
    return this.state.get('expanded');
  }
}

export default NavStore;
