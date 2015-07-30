const BaseComponent = require('./BaseComponent');
const Marty = require('marty');
const { Grid, Row, Col, Navbar, Nav, NavItem, DropdownButton, MenuItem } = require('react-bootstrap');

class Header extends BaseComponent {
  constructor(options){
    super(options);
  }
  render() {
    const items = [];
    return (

        <Navbar
          brand={<a href="" className="brand">where@</a>}
          className="navbar"
          fluid={true}
          fixedTop={true}
          inverse toggleNavKey={0}
          >
          <Nav eventKey={0} right className="nav">
              <MenuItem eventKey={1}>
                Hi!
              </MenuItem>
          </Nav>
        </Navbar>

    );
  }
}

module.exports = Marty.createContainer(Header);
