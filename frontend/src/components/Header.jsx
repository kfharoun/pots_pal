import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import { useEffect, useState } from 'react';

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('loggedInUser');
    setLoggedIn(!!user); // Set loggedIn to true if user exists
  }, []);

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="/"><img src='https://i.imgur.com/QpaCVKn.png' width={40} alt="Logo" /></Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          {loggedIn ? (
            <Nav.Link as={Link} to="/logout">Logout</Nav.Link>
          ) : (
            <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
