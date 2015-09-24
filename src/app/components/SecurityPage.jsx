const Marty = require('marty');
const BaseComponent = require('./BaseComponent.jsx');
import { Button } from 'react-bootstrap';
import { HOME } from '../constants/Pages';

class SecurityPage extends BaseComponent {

  constructor(){
    super();
    this.bindAll('_handleClick');
  }

  render(){
    return (
      <div className='securityPage' ref='securityPage'>
        <h1 className="secHeader" ref="secHeader"> THEY'RE WATCHING YOU!!! </h1>
        <p className="secBlurb" ref="secBlurb">
          While we've done everything we can to ensure your anonimity while using where@, there are some forms of surveillance we can't protect you from. But not to fear! There are things you can do to protect yourself! To learn how, we HIGHLY RECOMMEND you visit our <a href="https//about.whereat.io/stay-safe">security best practices page</a>! :)
        </p>
        <Button
          bsStyle="primary"
          className="secButton"
          ref="secButton"
          onClick={this._handleClick}
          >
          Okay, got it!
        </Button>
      </div>
    );
  };

  _handleClick(){
    this.app.navActions.goto(HOME);
  }
}

module.exports = Marty.createContainer(SecurityPage);
