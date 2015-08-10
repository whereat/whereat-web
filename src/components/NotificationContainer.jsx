const Marty = require('marty');
const BaseComponent = require('./BaseComponent.jsx');
const cx = require('classname');

class NotificationContainer extends BaseComponent {
  render(){
    return (
      <div
        ref="toast"
        className={ cx( ['toast'], {
          visible: this.props.visible,
          hidden: !this.props.visible
        })}
      >
        {this.props.msg}
      </div>
    );
  };
}

module.exports = Marty.createContainer(NotificationContainer, {
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
