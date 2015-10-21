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
            title={locTtl.labels[1]}
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
          shareFreq.values[index]);
      }
      this.app.settingsActions.setShareFreq(index);
    };
  }

  _handleLocTtlSelect(index){
    return () => '';
  }
}

export default Marty.createContainer(SettingsPage, {
  listenTo: ['settingsStore', 'locPubStore'],
  fetch: {
    curShareFreq(){
      return this.app.settingsStore.getShareFreq();
    },
    isPolling(){
      return this.app.locPubStore.isPolling();
    },
    pollId(){
      return this.app.locPubStore.getPollId();
    },
  }
});
