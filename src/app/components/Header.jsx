const BaseComponent = require('./BaseComponent.jsx');
const Marty = require('marty');
const { HOME, MAP, SET } = require('../constants/Pages');
const { Navbar, Nav, NavItem } = require('react-bootstrap');

class Header extends BaseComponent {

  constructor(options){
    super(options);
    this.bindAll('_handleSelect', '_handleToggle');
    this.state = { expanded: false };
  }

  render() {
    return (
      <div id="header">
        <Navbar
          brand={<a href="" className="brand">where@</a>}
          inverse
          className="navbar"
          fluid={true}
          fixedTop={true}
          toggleNavKey={0}
          navExpanded={this.props.expanded}
          onToggle={this._handleToggle}
        >
          <Nav right eventKey={0} ref="nav">
            {this._menuItems([HOME, MAP, SET])}
          </Nav>

        </Navbar>
      </div>
    );
  }

  _menuItems(pages){
    return (
      pages.map((pg, i) => (
        <NavItem
          eventKey={i+1}
          className="navItem"
          ref={`navItem${i+1}`}
          key={`navItems${i+1}`}
          onSelect={this._handleSelect(pg)}
        > {pg}
        </NavItem>
      )));
  }

  _handleSelect(page){
    return () => this.app.navActions.goto(page);
  }

  _handleToggle(){
    this.app.navActions.toggle();
  }
}

module.exports = Marty.createContainer(Header, {
  listenTo: ['navStore'],
  fetch: {
    expanded(){
      return this.app.navStore.isExpanded();
    }
  }
});
