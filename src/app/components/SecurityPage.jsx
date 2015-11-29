import Marty from 'marty';
import BaseComponent from './BaseComponent.jsx';
import md from '../modules/markdown';


class SecurityPage extends BaseComponent {

  render(){
    return (
      <div className='securityPage' ref='securityPage'>
        <div dangerouslySetInnerHTML={{__html: md.parse('SecurityWarning.md') }}>
        </div>
      </div>
    );
  }
}

export default Marty.createContainer(SecurityPage);
