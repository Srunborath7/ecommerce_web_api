import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function AppFooter() {
  const footerStyle = {
    backgroundColor: "#fef6f0",
    color: "#4b4b4b",
    padding: "40px 0",
    borderTop: "1px solid #e0e0e0",
    fontSize: "15px",
  };

  const headingStyle = {
    fontWeight: "600",
    marginBottom: "1rem",
    color: "#6d4c41",
  };

  const iconStyle = {
    color: "#6d4c41",
    fontSize: "18px",
    marginRight: "10px",
  };

  return (
    <footer style={footerStyle}>
      <Container>
        <Row>
          {/* About */}
          <Col md={4} className="mb-4">
            <h5 style={headingStyle}>About PureGlow</h5>
            <p>
              PureGlow is your trusted source for natural skincare products. We
              believe beauty starts with pure ingredients and radiant confidence.
            </p>
          </Col>

          {/* Contact */}
          <Col md={4} className="mb-4">
            <h5 style={headingStyle}>Contact Us</h5>
            <p>
              <FaMapMarkerAlt style={iconStyle} />
              123 Natural Beauty Ave, Phnom Penh, Cambodia
            </p>
            <p>
              <FaPhone style={iconStyle} />
              +855 123 456 789
            </p>
            <p>
              <FaEnvelope style={iconStyle} />
              support@pureglow.com
            </p>
          </Col>

          {/* Social Links */}
          <Col md={4} className="mb-4">
            <h5 style={headingStyle}>Follow Us</h5>
            <div className="d-flex gap-3">
              <a href="#" style={iconStyle}><FaFacebookF /></a>
              <a href="#" style={iconStyle}><FaInstagram /></a>
              <a href="#" style={iconStyle}><FaTwitter /></a>
            </div>
          </Col>
        </Row>

        <hr />

        <Row>
          <Col className="text-center pt-2" style={{ fontSize: "14px", color: "#777" }}>
            &copy; {new Date().getFullYear()} PureGlow. All rights reserved.
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
