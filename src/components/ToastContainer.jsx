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
        {this.props.text}
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
    text(){
      const type = this.app.toastStore.getType();
      return {
        [EMPTY]: '',
        [PING]: 'Location shared.',
        [POLL]: 'Location sharing toggled.'
      }[type];
    }
  }
});
