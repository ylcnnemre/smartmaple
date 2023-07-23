import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const NavbarElement = () => {
  return (
    <Navbar bg="primary" data-bs-theme="dark" style={{paddingRight:"120px",paddingLeft:"120px"}} >
    
        <Navbar.Brand href="#home">Scraping App</Navbar.Brand>

    </Navbar>
  );
};

export default NavbarElement;
