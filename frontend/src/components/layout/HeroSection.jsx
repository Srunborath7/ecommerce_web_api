import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Carousel } from "react-bootstrap";
import img1 from "../../assets/hero1.jpg";
import img2 from "../../assets/hero2.jpg";
import img3 from "../../assets/hero3.jpg";
import img4 from "../../assets/hero4.jpg";
import img5 from "../../assets/hero5.jpg";

export default function HeroSection() {
  const sectionStyle = {
    background: "linear-gradient(135deg, #ffffffff, #ffffffff)",
    height: "90vh",
    overflow: "hidden",
    paddingTop: "50px",
    color: "#333",
  };

  const textSlideStyle = {
    animation: "slideInLeft 1s ease-out forwards",
    opacity: 0,
  };

  const carouselSlideStyle = {
    animation: "slideInRight 1s ease-out forwards",
    opacity: 0,
  };

  return (
    <section className="d-flex align-items-center" style={sectionStyle}>
      <Container>
        <Row className="align-items-center">
          <Col md={6}>
            <div style={textSlideStyle}>
              <h1 className="display-4 fw-bold">Glow Naturally</h1>
              <p className="lead">
                Explore the best skincare products curated to reveal your natural beauty.
              </p>
              <Button variant="primary" size="lg" href="/shop">
                Shop Now
              </Button>
            </div>
          </Col>

          <Col md={6}>
            <div style={carouselSlideStyle}>
              <Carousel fade interval={3000} controls={false} indicators={false}>
                {[img1, img2, img3, img4, img5].map((img, i) => (
                  <Carousel.Item key={i}>
                    <img
                      src={img}
                      alt={`Slide ${i + 1}`}
                      className="d-block w-100 rounded-4 shadow"
                      style={{ maxHeight: "400px", objectFit: "cover" }}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>
          </Col>
        </Row>
      </Container>

      <style>{`
        @keyframes slideInLeft {
          0% {
            transform: translateX(-60px);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideInRight {
          0% {
            transform: translateX(60px);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}
