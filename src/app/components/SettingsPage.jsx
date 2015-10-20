import Marty from 'marty';
import cn from 'classnames';
import {
  DropdownButton, MenuItem, Panel, SplitButton
} from 'react-bootstrap';

import BaseComponent from './BaseComponent';
import settings from '../constants/Settings';
const { shareFreq } = settings;


class SettingsPage extends BaseComponent {

  constructor(opts){
    super(opts);
    this.bindAll('_menuItems', '_handleShareFreqSelect');
    this.state = {
      curShareFreq: 2
    };
  }

  render(){
    return (
      <div className='settingsPage' ref='settingsPage'>
        <div className='shareFreqContainer' ref='shareFreqContainer' >
          <Panel header={<h1>Share location every:</h1>}>
            <SplitButton
              ref='shareFreqMenu'
              id='shareFreqMenu'
              className='settingsMenu'
              title={shareFreq.labels[this.props.curShareFreq]}
              bsStyle='default'
              >
              {this._menuItems('shareFreq', this.props.curShareFreq, this._handleShareFreqSelect)}
            </SplitButton>
          </Panel>
        </div>
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
