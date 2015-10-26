import Marty from 'marty';
import BaseComponent from './BaseComponent.jsx';
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

        <h1 className="secHeader" ref="secHeader">YOU'RE BEING SPIED ON!!! </h1>

        <div className="secBlurb" ref="secBlurb">
          <p>
            We've done everything we can to ensure your privacy while using where@, but there are some forms of surveillance we can't protect you from. Not to fear: you can protect yourself! To learn how, visit our security best practices page.
          </p>
        </div>

        <div ref="secButtons" className="secButtons" >

          <Button
            bsStyle="primary"
            bsSize="large"
            className="secButton secNoButton"
            ref="secNoButton"
            onClick={this._handleClick}
            >
            Stay exposed
          </Button>

          <Button
            bsStyle="primary"
            bsSize="large"
            className="secButton secYesButton"
            ref="secYesButton"
            >
            <a ref="staySafeLink" href="https://about.whereat.io/stay-safe">
              Get protection
            </a>
          </Button>

        </div>

      </div>
    );
  };

  _handleClick(){
    this.app.navActions.goto(HOME);
  }
}

export default Marty.createContainer(SecurityPage);
