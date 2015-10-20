import Marty from 'marty';
import cn from 'classnames';
import { DropdownButton, MenuItem } from 'react-bootstrap';

import BaseComponent from './BaseComponent';
import settings from '../constants/Settings';
const { share } = settings;

class SettingsPage extends BaseComponent {

  constructor(opts){
    super(opts);
    this.bindAll('_menuItems', '_handleShareSelect');
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
    return () => this.app.settingsActions.setShare(index);
  }
}

export default Marty.createContainer(SettingsPage, {
  listenTo: ['settingsStore'],
  fetch: {
    curShare(){
      return this.app.settingsStore.getShare();
    }
  }
});
