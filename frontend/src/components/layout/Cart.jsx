// src/components/Cart.js
import React from "react";
import { useCart } from "./CartContext";
import { Container, ListGroup, Image, Button, Row, Col } from "react-bootstrap";

export default function Cart() {
  const { cartItems, removeFromCart, clearCart } = useCart();

  if (cartItems.length === 0)
    return (
      <Container className="my-5">
        <h2>Your Cart is Empty</h2>
        <p>Add some products to the cart.</p>
      </Container>
    );

  return (
    <Container className="my-5">
      <h2>Your Cart 🛒</h2>
      <ListGroup>
        {cartItems.map(({ id, name, quantity, price, image }) => (
          <ListGroup.Item key={id}>
            <Row className="align-items-center">
              <Col xs={2}>
                <Image src={image} alt={name} thumbnail />
              </Col>
              <Col xs={4}>{name}</Col>
              <Col xs={2}>Qty: {quantity}</Col>
              <Col xs={2}>${price}</Col>
              <Col xs={2}>
                <Button variant="danger" size="sm" onClick={() => removeFromCart(id)}>
                  Remove
                </Button>
              </Col>
            </Row>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Button variant="secondary" className="mt-3" onClick={clearCart}>
        Clear Cart
      </Button>
    </Container>
  );
}
