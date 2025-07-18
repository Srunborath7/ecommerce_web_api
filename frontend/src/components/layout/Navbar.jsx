import React, { useState } from "react";
import { Navbar, Nav, Container, Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaShoppingCart } from "react-icons/fa";
import Profile from "./Profile"; // Your profile component
import { useCart } from "../layout/CartContext";
import { Link } from "react-router-dom";

export default function AppNavbar() {
  const [showCartModal, setShowCartModal] = useState(false);
  const { cartItems, removeFromCart } = useCart();

  const handleCartClick = () => setShowCartModal(true);
  const handleCartClose = () => setShowCartModal(false);

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  return (
    <>
      <Navbar expand="md" sticky="top" className="mb-4 py-3 shadow-sm" style={{ backgroundColor: "#fef6f0", borderBottom: "1px solid #eee" }}>
        <Container>
          <Navbar.Brand href="/ecommerce" style={{ fontSize: "28px", fontWeight: "bold", color: "#6d4c41" }}>
            🌿 PureGlow
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="ms-auto me-3 align-items-center">
              <Nav.Link href="/ecommerce" style={{ fontSize: "20px", fontWeight: "500", color: "#4b4b4b", marginLeft: "15px" }}>
                Home
              </Nav.Link>
              <Nav.Link href="#about" style={{ fontSize: "20px", fontWeight: "500", color: "#4b4b4b", marginLeft: "15px" }}>
                About
              </Nav.Link>
              <Nav.Link href="#shop" style={{ fontSize: "20px", fontWeight: "500", color: "#4b4b4b", marginLeft: "15px" }}>
                Shop
              </Nav.Link>
              <Nav.Link onClick={handleCartClick} style={{ fontSize: "20px", fontWeight: "500", color: "#4b4b4b", marginLeft: "15px" }}>
                <FaShoppingCart className="me-1" />
                Cart ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
              </Nav.Link>
            </Nav>

            <Profile isLoggedIn={true} onLogin={() => {}} onRegister={() => {}} onProfile={() => {}} />
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Cart Modal */}
      <Modal show={showCartModal} onHide={handleCartClose} centered>
        <div style={{
          backgroundColor: "#fffaf6",
          borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          padding: "20px"
        }}>
          <Modal.Header closeButton style={{ borderBottom: "none" }}>
            <Modal.Title style={{ color: "#6d4c41" }}>🛒 Your Cart</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {cartItems.length === 0 ? (
              <p style={{ color: "#555" }}>Your cart is currently empty.</p>
            ) : (
              <>
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="d-flex align-items-center justify-content-between mb-3 p-2 rounded"
                    style={{
                      border: "1px solid #ddd",
                      backgroundColor: "#fff",
                      gap: "15px"
                    }}
                  >
                    <img
                      src={
                        item.img_pro
                          ? `http://localhost:5000/api/uploads/${item.img_pro}`
                          : item.image || "https://via.placeholder.com/60"
                      }
                      alt={item.name}
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "cover",
                        borderRadius: "8px"
                      }}
                    />

                    <div className="flex-grow-1 ms-2">
                      <h6 className="mb-1 fw-bold">{item.name}</h6>
                      <div style={{ fontSize: "14px", color: "#777" }}>
                        {item.description || "No description"}
                      </div>
                      <div className="mt-1">
                        <span className="text-success fw-bold">${item.price}</span> × {item.quantity}
                      </div>
                    </div>

                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}

                <div className="text-end mt-3 fw-bold fs-5">
                  Total: ${total.toFixed(2)}
                </div>
              </>
            )}
          </Modal.Body>
          <Modal.Footer style={{ borderTop: "none" }}>
            <Button variant="outline-secondary" onClick={handleCartClose}>
              Close
            </Button>
            {cartItems.length > 0 && (
              <Button variant="success" as={Link} to="/checkout" onClick={handleCartClose}>
                Proceed to Checkout
              </Button>
            )}
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
}
