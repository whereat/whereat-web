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
import NotificationConstants from '../constants/NotificationConstants';
import { Map } from 'immutable';

class NotificationStore extends Marty.Store {

  constructor(options){
    super(options);
    this.state = Map({
      visible: false,
      msg: ''
    });

    this.handlers = {
      show: NotificationConstants.NOTIFICATION_STARTING,
      hide: NotificationConstants.NOTIFICATION_DONE
    };
  }

  //HANDLERS

  // (String) -> Unit
  show(msg){
    this.replaceState(this.state.set('visible', true).set('msg', msg));
  }

  // () -> Unit
  hide(){
    this.replaceState(this.state.set('visible', false).set('msg', ''));
  }

  //ACCESSORS

  isVisible(){
    return this.state.get('visible');
  }

  getMsg(){
    return this.state.get('msg');
  }
}
export default NotificationStore;
