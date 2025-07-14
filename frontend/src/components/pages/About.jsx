import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import img from "../../assets/about.jpg"; // Adjust the path to your image
export default function AboutUs() {
  const sectionStyle = {
    backgroundColor: "#fdfdfd",
    padding: "60px 0",
    color: "#333",
  };

  const textStyle = {
    maxWidth: "600px",
    margin: "0 auto 0 0",
  };

  const headingStyle = {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "#5c3d2e", // soft brown (cosmetic feel)
    marginBottom: "20px",
  };

  const paragraphStyle = {
    fontSize: "1.1rem",
    lineHeight: "1.8",
    color: "#555",
  };

  const imageStyle = {
    borderRadius: "12px",
    maxWidth: "100%",
    height: "auto",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  };

  return (
    <section style={sectionStyle}>
      <Container>
        <Row className="align-items-center">
          <Col md={6}>
            <div style={textStyle}>
              <h2 style={headingStyle}>About Us</h2>
              <p style={paragraphStyle}>
                At <strong>E-Shop Skin Care</strong>, we believe in enhancing your natural beauty through clean, nourishing, and effective products.
                Our mission is to provide affordable skincare without compromising on quality — because every skin deserves to glow.
              </p>
              <p style={paragraphStyle}>
                From moisturizers to serums, each product is carefully curated to suit every skin type and tone. Join our community and experience skincare that loves you back.
              </p>
            </div>
          </Col>
          <Col md={6}>
            <img
              src={img}
              alt="About Skincare"
              style={imageStyle}
            />
          </Col>
        </Row>
      </Container>
    </section>
  );
}
