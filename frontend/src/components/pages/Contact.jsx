import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

export default function ContactUs() {
  const sectionStyle = {
    backgroundColor: "#f8f9fa",
    padding: "60px 0",
    color: "#333",
  };

  const titleStyle = {
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "30px",
    color: "#5c3d2e", // soft brown
  };

  const formStyle = {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  };

  return (
    <section style={sectionStyle}>
      <Container>
        <Row className="align-items-center">
          <Col md={6}>
            <h2 style={titleStyle}>Contact Us</h2>
            <p style={{ fontSize: "1.1rem", lineHeight: "1.6", color: "#555" }}>
              Have a question about your order, our skincare products, or just want to say hello? We’d love to hear from you.
              Fill out the form and our support team will get back to you shortly.
            </p>
          </Col>

          <Col md={6}>
            <div style={formStyle}>
              <Form>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Your Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter your name" required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" placeholder="Enter your email" required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formMessage">
                  <Form.Label>Your Message</Form.Label>
                  <Form.Control as="textarea" rows={4} placeholder="Type your message..." required />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Send Message
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
