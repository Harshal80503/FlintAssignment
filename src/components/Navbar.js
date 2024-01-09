import React from 'react';
import { Navbar} from 'react-bootstrap';

const MyNavbar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand href="#home" className="mx-auto">Native Balance Checker</Navbar.Brand>
    </Navbar>
  );
};

export default MyNavbar;
