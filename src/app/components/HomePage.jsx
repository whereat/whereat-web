import Marty from 'marty';
import BaseComponent from './BaseComponent.jsx';
import GoButton from './GoButton';

class HomePage extends BaseComponent {
  render(){
    return (
      <div className='homePage' ref='homePage'>
        <GoButton />
      </div>
    );
  };
}

export default Marty.createContainer(HomePage);
