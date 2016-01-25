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
import cn from 'classnames';
import {
  DropdownButton, MenuItem, Panel, SplitButton
} from 'react-bootstrap';

import BaseComponent from './BaseComponent';
import settings from '../constants/Settings';
const { shareFreq, locTtl } = settings;


class SettingsPage extends BaseComponent {

  constructor(opts){
    super(opts);
    this.bindAll('_menuItems', '_handleShareFreqSelect', '_handleLocTtlSelect');
    this.state = {
      curShareFreq: 2
    };
  }

  render(){
    return (
      <div ref='settingsPage'>

        <Panel
          header={<h1>Share location every:</h1>}
          className="settingsPanel"
          ref="shareFreqPanel"
          >
          <SplitButton
            title={shareFreq.labels[this.props.curShareFreq]}
            className='settingsMenu'
            ref='shareFreqMenu'
            refCollection='shareFreqMenuChildren'
            >
            {this._menuItems(
              'shareFreq', this.props.curShareFreq, this._handleShareFreqSelect)}
          </SplitButton>
        </Panel>

        <Panel
          header={<h1>Delete locations after:</h1>}
          className="settingsPanel"
          ref="locTtlPanel"
          >
          <SplitButton
            title={locTtl.labels[this.props.curLocTtl]}
            className='settingsMenu'
            ref='locTtlMenu'
            >
            {this._menuItems(
              'locTtl', this.props.curLocTtl, this._handleLocTtlSelect)}
          </SplitButton>
        </Panel>

      </div>
    );
  }

  _menuItems(setting, cur, onSelect){
    return settings[setting].labels.map((lbl, i) =>
      <MenuItem
        eventKey={i}
        ref={`${setting}Items${i}`}
        key={`${setting}Items${i}`}
        className={cn(`${setting}Item`, { active: i === cur })}
        onSelect={onSelect(i)}
        >
        {lbl}
      </MenuItem>
    );
  }

  _handleShareFreqSelect(index){
    return () => {
      if (this.props.isPolling) {
        this.app.locPubActions.resetPolling(
          this.props.pollId,
          shareFreq.values[index]
        );
      }
      this.app.settingsActions.setShareFreq(index);
    };
  }

  _handleLocTtlSelect(index){
    return () => {
      this.app.locSubActions.rescheduleForget(
        this.props.curForgetJob,
        locTtl.values[index]
      );
      this.app.settingsActions.setLocTtl(index);
    };
  }
}

export default Marty.createContainer(SettingsPage, {
  listenTo: ['settingsStore', 'locPubStore', 'locSubStore'],
  fetch: {
    curLocTtl(){
      return this.app.settingsStore.getLocTtl();
    },
    curShareFreq(){
      return this.app.settingsStore.getShareFreq();
    },
    curForgetJob(){
      return this.app.locSubStore.getForgetJob();
    },
    isPolling(){
      return this.app.locPubStore.isPolling();
    },
    pollId(){
      return this.app.locPubStore.getPollId();
    }
  }
});
