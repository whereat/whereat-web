const Marty = require('marty');
const BaseComponent = require('./BaseComponent.jsx');
import { Button } from 'react-bootstrap';

class SecurityPage extends BaseComponent {
  render(){
    return (
      <div className='securityPage' ref='securityPage'>
        <h1 className="sec-header" ref="sec-header"> THEY'RE WATCHING YOU!!! </h1>
        <p className="sec-blurb" ref="sec-blurb">
          We've done everything we can to ensure your anonimity while using where@. But there are some forms of surveillance we can't protect you from. We HIGHLY RECOMMEND you visit our <a href="https//about.whereat.io/stay-safe">security best practices page</a> to learn what what you can do to stay as safe as possible while using this app! :)
        </p>
        <Button bsStyle="primary" ref='sec-button'>
          Okay, got it!
        </Button>
      </div>
    );
  };
}

module.exports = Marty.createContainer(SecurityPage);
