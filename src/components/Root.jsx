const Marty = require('marty');
const BaseComponent = require('./BaseComponent');
const { Grid, Row } = require('react-bootstrap');
const Header = require('./Header');
const Body = require('./Body');

class Root extends BaseComponent {
  constructor(){
    super();
  }

  render(){
    return (
      <Grid >
        <Row>
          <Header className="header"/>
        </Row>
        <Row>
          <Body />
        </Row>
      </Grid>
    );
  };
}

module.exports = Marty.createContainer(Root);
