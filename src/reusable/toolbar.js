import React, { Component } from 'react';
import { Navbar, Nav, DropdownButton, NavDropdown, Dropdown } from 'react-bootstrap';

import './toolbar.css';

class Toolbar extends Component {
    render() {
        return (
          <>
            <Navbar bg="light" variant="light" className="sideBar">
            <Nav>
              <NavDropdown drop="right" variant="outline-info" title={<i class="fas fa-plus-circle"></i>}>
                <NavDropdown.Item>New Note</NavDropdown.Item>
                <NavDropdown.Item>New View</NavDropdown.Item>
                <NavDropdown.Item>New Community</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar>
          </>
        );
      }
      
}
export default Toolbar;