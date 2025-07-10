import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../layout/Navbar";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: "$59.99",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80",
    },
    {
        id: 2,
        name: "Smart Watch",
        price: "$99.99",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80",
    },
    {
        id: 3,
        name: "Bluetooth Speaker",
        price: "$39.99",
        image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    },
    {
        id: 4,
        name: "VR Headset",
        price: "$149.99",
        image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    },
];

function Ecommerce() {
    const [clickedId, setClickedId] = useState(null);

    // Animation variants
    const cardVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.15 }
        }),
    };

    const handleAddToCart = (id) => {
        setClickedId(id);
        setTimeout(() => setClickedId(null), 500); // Reset after animation
    };

    return (
        <>
           
            <Navbar/>
            {/* Main Content */}
            <Container>
                <h2 className="mb-4 text-center">Featured Products</h2>
                <Row>
                    <AnimatePresence>
                        {products.map((product, i) => (
                            <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                                <motion.div
                                    custom={i}
                                    initial="hidden"
                                    animate="visible"
                                    variants={cardVariants}
                                >
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
                                            <motion.div
                                                animate={clickedId === product.id ? { scale: 1.15 } : { scale: 1 }}
                                                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                                            >
                                                <Button
                                                    variant="primary"
                                                    className="mt-auto"
                                                    onClick={() => handleAddToCart(product.id)}
                                                >
                                                    Add to Cart
                                                </Button>
                                            </motion.div>
                                        </Card.Body>
                                    </Card>
                                </motion.div>
                            </Col>
                        ))}
                    </AnimatePresence>
                </Row>

            </Container>

            {/* Footer */}
            <footer className="bg-dark text-light text-center py-3 mt-5">
                &copy; {new Date().getFullYear()} E-Shop. All rights reserved.
            </footer>
        </>
    );
}

export default Ecommerce;