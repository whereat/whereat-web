/**
 *
 * Copyright (c) 2015-present, Total Location Test Paragraph.
 * All rights reserved.
 *
 * This file is part of Where@. Where@ is free software:
 * you can redistribute it and/or modify it under the terms of
 * the GNU General Public License (GPL), either version 3
 * of the License, or (at your option) any later version.
 *
 * Where@ is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For more details,
 * see the full license at <http://www.gnu.org/licenses/gpl-3.0.en.html>
 *
 */

import BaseComponent from './BaseComponent.jsx';
import Marty from 'marty';
import { MAP, SET, SEC } from '../constants/Pages';
import { Navbar, Nav, NavItem } from 'react-bootstrap';

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
            {this._menuItems([MAP, SET, SEC])}
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

export default Marty.createContainer(Header, {
  listenTo: ['navStore'],
  fetch: {
    expanded(){
      return this.app.navStore.isExpanded();
    }
  }
});
