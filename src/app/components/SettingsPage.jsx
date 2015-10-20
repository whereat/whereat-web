import Marty from 'marty';
import cn from 'classnames';
import { DropdownButton, MenuItem } from 'react-bootstrap';

import BaseComponent from './BaseComponent';
import settings from '../constants/Settings';
const { share } = settings;

class SettingsPage extends BaseComponent {

  constructor(opts){
    super(opts);
    this.bindAll('_menuItems', '_handleShareSelect', '_resetPolling');
    this.state = {
      curShare: 2
    };
  }

  render(){
    return (
      <div className='settingsPage' ref='settingsPage'>
        <div className='shareContainer' ref='shareContainer' >
          <div className='shareLabel' ref='shareLabel'>
            Share location every:
          </div>
          <DropdownButton
            ref='shareMenu'
            className='shareMenu'
            title={share.labels[this.props.curShare]}
            bsStyle='default'
            >
            {this._menuItems('share', this.props.curShare, this._handleShareSelect)}
          </DropdownButton>
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

  _handleShareSelect(index){
    return () => {
      if (this.props.isPolling) this._resetPolling(share[index]);
      this.app.settingsActions.setShare(index);
    };
  }

  _resetPolling(freq){
    this.app.locPubActions.stopPolling(this.props.pollId);
    this.app.locPubActions.poll(freq);
  }
}

export default Marty.createContainer(SettingsPage, {
  listenTo: ['settingsStore', 'locPubStore'],
  fetch: {
    curShare(){
      return this.app.settingsStore.getShare();
    },
    isPolling(){
      return this.app.locPubStore.isPolling();
    },
    pollId(){
      return this.app.locPubStore.getPollId();
    },
  }
});
