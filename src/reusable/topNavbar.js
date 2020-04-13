import React, { Component } from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';

class TopNavbar extends Component {
    logout(){
        sessionStorage.removeItem('token');
    }
    render() {
        return (
            <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="#community-manager">Knowledge Forum Light</Navbar.Brand>
            <Nav className="mr-auto">
              <Nav.Link href="#community-manager">Home</Nav.Link>
              <Nav.Link href="#signup">Signup</Nav.Link>
              <Nav.Link href="/">Login</Nav.Link>
            </Nav>
              <Button variant="outline-secondary" href="/" onClick={this.logout}>Logout</Button>
          </Navbar>
        );
    }
}

export default TopNavbar;