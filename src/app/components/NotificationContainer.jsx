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
