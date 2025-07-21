import React, { useState } from "react";
import { useCart } from "../layout/CartContext";
import { Container, Table, Button, Image, Form, Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const navigate = useNavigate();
  const {
    cartItems,
    clearCart,
    updateCartItemQuantity,
    removeFromCart,
  } = useCart();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePayment = async () => {
    setIsLoading(true);
    setError("");
    try {
      // Validate quantities
      const isValid = cartItems.every(
        (item) => item.quantity && item.quantity > 0
      );
      if (!isValid) {
        setError("Please make sure all product quantities are valid.");
        setIsLoading(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/checkout",
        {
          cartItems: cartItems.map((item) => ({
            id: item.id, // change to product_id if backend expects that
            quantity: item.quantity,
            price: item.price,
          })),
        },
        { withCredentials: true }
      );

      setSuccessMessage(`Order successful! Order ID: ${response.data.orderId}`);
      clearCart();

      // Delay redirect to show success message
      setTimeout(() => {
        navigate(`/orders/${response.data.orderId}`);
      }, 1500);
    } catch (err) {
      console.error("Order error:", err);
      setError("Checkout failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container className="my-5">
        <h2>Checkout</h2>
        <p>Your cart is empty. Please add some products before checking out.</p>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2>Checkout</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Image</th>
            <th>Product</th>
            <th>Price (each)</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map(({ id, name, price, quantity, image }) => (
            <tr key={id}>
              <td>
                <Image
                  src={image}
                  alt={name}
                  thumbnail
                  style={{ maxWidth: "80px", height: "auto" }}
                />
              </td>
              <td>{name}</td>
              <td>${price.toFixed(2)}</td>
              <td>
                <Form.Control
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    updateCartItemQuantity(id, parseInt(e.target.value))
                  }
                  style={{ width: "80px" }}
                />
              </td>
              <td>${(price * quantity).toFixed(2)}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeFromCart(id)}
                >
                  Remove
                </Button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={4} style={{ textAlign: "right", fontWeight: "bold" }}>
              Total:
            </td>
            <td style={{ fontWeight: "bold" }}>${total.toFixed(2)}</td>
            <td></td>
          </tr>
        </tbody>
      </Table>

      <Button variant="success" onClick={handlePayment} disabled={isLoading}>
        {isLoading ? "Processing..." : "Pay Now"}
      </Button>
    </Container>
  );
}
