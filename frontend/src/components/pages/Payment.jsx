import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Spinner,
  Alert,
  Table,
  Row,
  Col,
  Image,
} from "react-bootstrap";
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

  // Load PayPal SDK
  useEffect(() => {
  if (!order) return;

  // Prevent multiple scripts
  if (document.getElementById("paypal-script")) return;

  const script = document.createElement("script");
  script.id = "paypal-script";
  script.src = "https://www.paypal.com/sdk/js?client-id=AXbpC-Yl25yW0KoVijCLD4MnL5bxwM24gcdJG2L-aW2QX20ocf8l6K3CLBtu06s4OvEPc-7tOAeYevD1&currency=USD";
  script.addEventListener("load", () => {
    if (window.paypal) {
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: order.total_price.toFixed(2),
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          const details = await actions.order.capture();
          try {
            await axios.post(
              `http://localhost:5000/api/payments/${order.id}/success`,
              { paypalInfo: details },
              { withCredentials: true }
            );
            alert("Payment successful!");
            window.location.reload();
          } catch (e) {
            alert("Error updating order status");
            console.error(e);
          }
        },
        onError: (err) => {
          alert("Payment failed");
          console.error(err);
        },
      }).render("#paypal-button");
    }
  });
  document.body.appendChild(script);
}, [order]);


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
      <h2 className="mb-4 text-center">Pay with PayPal</h2>

      <Row>
        <Col md={5}>
          <p>
            <strong>Order ID:</strong> {order.id}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
          <p>
            <strong>Total Price:</strong> ${order.total_price.toFixed(2)}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(order.created_at).toLocaleString()}
          </p>

          <div id="paypal-button" style={{ marginTop: "2rem" }}></div>
        </Col>

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
