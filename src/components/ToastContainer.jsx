const Marty = require('marty');
const BaseComponent = require('./BaseComponent.jsx');
const cx = require('classname');
const { EMPTY, PING, POLL } = require('../constants/ToastTypes');

class ToastContainer extends BaseComponent {
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

module.exports = Marty.createContainer(ToastContainer, {
  listenTo: ['toastStore'],
  fetch: {
    visible(){
      return this.app.toastStore.isVisible();
    },
    msg(){
      return this.app.toastStore.getMsg();
    }
  }
});
