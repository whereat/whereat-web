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
        <h1 className="secHeader" ref="secHeader">YOU ARE BEING SPIED ON!!! </h1>
        <div className="secBlurb" ref="secBlurb">
          <p>
            We've done everything we can to ensure your privacy while using where@, but there are some forms of surveillance we can't protect you from. Not to fear: you can protect yourself! To learn how, visit our <a href="https//about.whereat.io/stay-safe">security best practices page.</a>
          </p>
          {/* <p className="secSignature">
              <strong><em>-- {'<3'}, where@</em></strong>
              </p> */}
        </div>
        <Button
          bsStyle="primary"
          bsSize="large"
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
