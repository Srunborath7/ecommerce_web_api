// src/components/Ecommerce.js
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../layout/Navbar";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import HeroSection from "../layout/HeroSection";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Footer from "../layout/Footer";
import { useCart } from "../layout/CartContext";

const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: "$59.99",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    name: "Smart Watch",
    price: "$99.99",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    name: "Bluetooth Speaker",
    price: "$39.99",
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 4,
    name: "VR Headset",
    price: "$149.99",
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
  },
];

function Ecommerce() {
  const { addToCart } = useCart();

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15 },
    }),
  };

  return (
    <>
      <Navbar />
      <Container>
        <HeroSection />
        <section id="about">
          <About />
        </section>
        <section id="shop" className="my-5">
          <Row>
            <AnimatePresence>
              {products.map((product, i) => (
                <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                  <motion.div custom={i} initial="hidden" animate="visible" variants={cardVariants}>
                    <Card className="h-100 shadow-sm">
                      <Card.Img
                        variant="top"
                        src={product.image}
                        alt={product.name}
                        style={{ objectFit: "cover", height: "180px" }}
                      />
                      <Card.Body className="d-flex flex-column">
                        <Card.Title>{product.name}</Card.Title>
                        <Card.Text className="mb-2 text-primary fw-bold">{product.price}</Card.Text>
                        <Button
                          variant="primary"
                          className="mt-auto"
                          onClick={() => addToCart(product)}
                        >
                          Add to Cart
                        </Button>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </AnimatePresence>
          </Row>
        </section>
        <Contact />
      </Container>
      <Footer />
    </>
  );
}

export default Ecommerce;
