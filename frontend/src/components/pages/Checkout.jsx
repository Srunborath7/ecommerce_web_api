import React from "react";
import { useCart } from "../layout/CartContext";
import { Container, Table, Button, Image } from "react-bootstrap";

export default function Checkout() {
  const { cartItems, clearCart } = useCart();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePayment = () => {
    alert(`Payment of $${total.toFixed(2)} successful!`);
    clearCart(); // empty cart after payment
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
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Image</th>
            <th>Product</th>
            <th>Price (each)</th>
            <th>Quantity</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map(({ id, name, price, quantity, image }) => {
            const subtotal = price * quantity;
            return (
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
                <td>{quantity}</td>
                <td>${subtotal.toFixed(2)}</td>
              </tr>
            );
          })}
          <tr>
            <td colSpan={4} style={{ textAlign: "right", fontWeight: "bold" }}>
              Total:
            </td>
            <td style={{ fontWeight: "bold" }}>${total.toFixed(2)}</td>
          </tr>
        </tbody>
      </Table>
      <Button variant="success" onClick={handlePayment}>
        Pay Now
      </Button>
    </Container>
  );
}
