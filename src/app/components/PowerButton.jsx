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
import { Button } from 'react-bootstrap';
import User from '../models/User';
import Settings from '../constants/Settings'
const { shareFreq } = Settings;
import cn from 'classnames';


class PowerButton extends BaseComponent {

  constructor(){
    super();
    this.bindAll('_handleClick');
  }

  render(){
    return (
      <Button
        ref="button"
        className={`powerButton ${this.props.polling ? 'powerOn' : 'powerOff'}`}
        onClick={this._handleClick}
        >
        {this.props.polling ? "ON" : "OFF"}
      </Button>
    );
  };

  _handleClick(){
    this.props.polling ?
      this.app.locPubActions.stopPolling(this.props.pollId) :
      this.app.locPubActions.poll(shareFreq.values[this.props.curShareFreq]);
  }
}

export default Marty.createContainer(PowerButton, {
  listenTo: ['locPubStore', 'settingsStore'],
  fetch: {
    curShareFreq(){
      return this.app.settingsStore.getShareFreq();
    },
    polling(){
      return this.app.locPubStore.isPolling();
    },
    pollId(){
      return this.app.locPubStore.getPollId();
    }
  }
});
