import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Spinner, Alert, Table, Row, Col, Image } from "react-bootstrap";
import axios from "axios";

export default function PaymentPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrder() {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/orders/${orderId}`, {
          withCredentials: true,
        });
        setOrder(res.data.order);
        setItems(res.data.items);
      } catch (err) {
        setError("Failed to fetch order details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center">Order Payment</h2>

      <Row>
        {/* Left side: Order info + QR */}
        <Col md={5}>
          <div className="mb-4">
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Total Price:</strong> ${order.total_price.toFixed(2)}</p>
            <p><strong>Created At:</strong> {new Date(order.created_at).toLocaleString()}</p>
          </div>

          <div className="text-center mt-4">
            <h5>Scan ABA QR code to pay:</h5>
            <Image
              src="http://localhost:5000/api/payments/aba-qr-code.png"
              alt="ABA QR Code"
              fluid
              style={{ maxWidth: "250px", marginTop: "1rem" }}
            />
          </div>
        </Col>

        {/* Right side: Order Items */}
        <Col md={7}>
          <h4 className="mb-3">Order Items</h4>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.map(({ id, name, quantity, price, img_pro }) => (
                <tr key={id}>
                  <td>
                    <Image
                      src={`http://localhost:5000/uploads/${img_pro}`}
                      alt={name}
                      thumbnail
                      style={{ width: "60px", height: "60px", objectFit: "cover" }}
                    />
                  </td>
                  <td>{name}</td>
                  <td>{quantity}</td>
                  <td>${price.toFixed(2)}</td>
                  <td>${(price * quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}
