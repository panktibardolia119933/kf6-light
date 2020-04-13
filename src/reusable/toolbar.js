import React, { Component } from 'react';
import { Navbar, Nav, DropdownButton, Dropdown } from 'react-bootstrap';

import './toolbar.css';

class Toolbar extends Component {
    render() {
        return (
            <Navbar bg="light" variant="light" className="sideBar">
            <Nav className="mr-auto">
              <DropdownButton drop="right" variant="outline-info" title={<i class="fas fa-plus-circle"></i>}>
                <Dropdown.Item>New Note</Dropdown.Item>
                <Dropdown.Item>New View</Dropdown.Item>
                <Dropdown.Item>New Community</Dropdown.Item>
              </DropdownButton>
            </Nav>
          </Navbar>
        );
      }
      
}
export default Toolbar;