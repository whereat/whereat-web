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
import cx from 'classnames';

class NotificationContainer extends BaseComponent {
  render(){
    return (
      <div
        ref="notification"
        className={ cx( ['notification'], {
          visible: this.props.visible,
          hidden: !this.props.visible
        })}
      >
        {this.props.msg}
      </div>
    );
  };
}

export default Marty.createContainer(NotificationContainer, {
  listenTo: ['notificationStore'],
  fetch: {
    visible(){
      return this.app.notificationStore.isVisible();
    },
    msg(){
      return this.app.notificationStore.getMsg();
    }
  }
});
