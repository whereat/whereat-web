const BaseComponent = require('./BaseComponent.jsx');
const Marty = require('marty');
const { HOME, MAP } = require('../constants/Pages');
const { Navbar, Nav, NavItem } = require('react-bootstrap');

class Header extends BaseComponent {

  constructor(options){
    super(options);
    this.bindAll('_handleSelect');
  }

  render() {
    return (

        <Navbar
          brand={<a href="" className="brand">where@</a>}
          className="navbar"
          fluid={true}
          fixedTop={true}
          inverse
          toggleNavKey={0} >

          <Nav right eventKey={0} ref="nav" refCollection="menuItems">
            {this._menuItems([HOME, MAP])}
          </Nav>
        </Navbar>

    );
  }

  _menuItems(pages){
    return pages.map((pg, i) => (
      <NavItem
        eventKey={i+1}
        target="#"
        className="menuItem"
        ref={`menuItem${i+1}`}
        onSelect={this._handleSelect(pg)}
      > {pg} </NavItem>
    ));
  }

  _handleSelect(page){
    return () => this.app.navActions.goto(page);
  }
}

module.exports = Marty.createContainer(Header);
