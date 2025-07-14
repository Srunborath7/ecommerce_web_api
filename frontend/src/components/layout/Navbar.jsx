// src/layout/Navbar.js
import React, { useState } from "react";
import { Navbar, Nav, Container, Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaShoppingCart } from "react-icons/fa";
import Profile from "./Profile"; // Your profile component
import { useCart } from "../layout/CartContext"; // Adjust path if needed
import { Link } from "react-router-dom";
export default function AppNavbar() {
  const [showCartModal, setShowCartModal] = useState(false);
  const { cartItems, removeFromCart } = useCart();

  const handleCartClick = () => setShowCartModal(true);
  const handleCartClose = () => setShowCartModal(false);

  const navStyle = {
    backgroundColor: "#fef6f0",
    borderBottom: "1px solid #eee",
  };

  const linkStyle = {
    fontSize: "20px",
    fontWeight: "500",
    color: "#4b4b4b",
    marginLeft: "15px",
  };

  const brandStyle = {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#6d4c41",
  };

  const modalStyle = {
    backgroundColor: "#fffaf6",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
    padding: "20px",
  };

  return (
    <>
      <Navbar expand="md" sticky="top" style={navStyle} className="mb-4 py-3 shadow-sm">
        <Container>
          <Navbar.Brand href="/ecommerce" style={brandStyle}>
            🌿 PureGlow
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="ms-auto me-3 align-items-center">
              <Nav.Link href="/ecommerce" style={linkStyle}>
                Home
              </Nav.Link>
              <Nav.Link href="#about" style={linkStyle}>
                About
              </Nav.Link>
              <Nav.Link href="#shop" style={linkStyle}>
                Shop
              </Nav.Link>

              <Nav.Link onClick={handleCartClick} style={linkStyle}>
                <FaShoppingCart className="me-1" />
                Cart ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
              </Nav.Link>
            </Nav>

            <Profile
              isLoggedIn={true}
              onLogin={() => {}}
              onRegister={() => {}}
              onProfile={() => {}}
            />
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Cart Modal */}
      <Modal show={showCartModal} onHide={handleCartClose} centered>
        <div style={modalStyle}>
          <Modal.Header closeButton style={{ borderBottom: "none" }}>
            <Modal.Title style={{ color: "#6d4c41" }}>🛒 Your Cart</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {cartItems.length === 0 ? (
              <p style={{ color: "#555" }}>Your cart is currently empty.</p>
            ) : (
              <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                {cartItems.map((item) => (
                  <li key={item.id} style={{ marginBottom: "15px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <strong>{item.name}</strong> - {item.price} x {item.quantity}
                      </div>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Modal.Body>
          <Modal.Footer style={{ borderTop: "none" }}>
            <Button variant="outline-secondary" onClick={handleCartClose}>
              Close
            </Button>
           
            <Button variant="success" as={Link} to="/checkout" onClick={handleCartClose}>
  Proceed to Checkout
</Button>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
}
