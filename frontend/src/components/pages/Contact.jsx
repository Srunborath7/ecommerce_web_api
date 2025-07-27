import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

const sectionStyle = {
  backgroundColor: "#f8f9fa",
  padding: "60px 0",
  color: "#333",
};

const titleStyle = {
  fontSize: "2.5rem",
  fontWeight: "bold",
  marginBottom: "30px",
  color: "#5c3d2e",
};

const formStyle = {
  backgroundColor: "#fff",
  padding: "30px",
  borderRadius: "10px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      Swal.fire({
        icon: "warning",
        title: "Unauthorized",
        text: "Please log in first to send a message.",
      });
      return;
    }

    const token = JSON.parse(storedUser).token;

    try {
      const res = await axios.post("http://localhost:5000/api/contact", formData, {
        headers: {
          Authorization: `Bearer ${token}`, // send token in header
        },
        withCredentials: true, // if you use cookies/session too
      });

      Swal.fire({
        icon: "success",
        title: "Message Sent",
        text: res.data.message || "Your message has been sent successfully.",
      });

      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text:
          error.response?.data?.message ||
          "Failed to send message. Please try again later.",
      });
    }
  };

  return (
    <section style={sectionStyle}>
      <Container>
        <Row className="align-items-center">
          <Col md={6}>
            <h2 style={titleStyle}>Contact Us</h2>
            <p style={{ fontSize: "1.1rem", lineHeight: "1.6", color: "#555" }}>
              Have a question about your order, our skincare products, or just
              want to say hello? We’d love to hear from you. Fill out the form
              and our support team will get back to you shortly.
            </p>
          </Col>

          <Col md={6}>
            <div style={formStyle}>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Your Name</Form.Label>
                  <Form.Control
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formMessage">
                  <Form.Label>Your Message</Form.Label>
                  <Form.Control
                    name="message"
                    as="textarea"
                    rows={4}
                    placeholder="Type your message..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
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
