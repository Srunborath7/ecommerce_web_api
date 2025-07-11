import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Profile from "./Profile"; 
export default function AppNavbar() {
    return (
        <Navbar bg="dark" variant="dark" expand="md" sticky="top" className="mb-4">
            <Container>
                <Navbar.Brand href="/">E-Shop</Navbar.Brand>
                <Navbar.Toggle aria-controls="main-navbar" />
                <Navbar.Collapse id="main-navbar">
                    <Nav className="ms-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/shop">Shop</Nav.Link>
                        <Nav.Link href="/cart">Cart</Nav.Link>
                        <Nav.Link href="/profile">Profile</Nav.Link>
                    </Nav>
                    <Profile/>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
