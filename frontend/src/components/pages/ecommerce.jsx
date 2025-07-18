import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../layout/Navbar";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  Form,
} from "react-bootstrap";
import HeroSection from "../layout/HeroSection";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Footer from "../layout/Footer";
import { useCart } from "../layout/CartContext";

function Ecommerce() {
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Fetch products and categories on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const resProducts = await fetch("http://localhost:5000/api/products");
        if (!resProducts.ok) throw new Error("Failed to fetch products");
        const dataProducts = await resProducts.json();

        // Fetch categories
        const resCategories = await fetch("http://localhost:5000/api/categories");
        if (!resCategories.ok) throw new Error("Failed to fetch categories");
        const dataCategories = await resCategories.json();

        setProducts(dataProducts);
        setCategories(dataCategories);
        setFilteredProducts(dataProducts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter products by category and search term
  useEffect(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (product) => product.category && product.category.name === selectedCategory
      );
    }

    // Filter by search term (name or description)
    if (searchTerm.trim() !== "") {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(lowerSearch) ||
          (product.description && product.description.toLowerCase().includes(lowerSearch))
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm]);

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15 },
    }),
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Container className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <Container className="text-center my-5">
          <Alert variant="danger">Error: {error}</Alert>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container>
        <HeroSection />
        <section id="about">
          <About />
        </section>

        {/* Search and Category Filters */}
        <section id="shop" className="my-4">
          <Form className="d-flex flex-wrap gap-3 justify-content-center">
            <Form.Control
              type="search"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ maxWidth: "300px" }}
            />

            <Form.Select
              style={{ maxWidth: "200px" }}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </Form.Select>

            <Button variant="secondary" onClick={() => {
              setSearchTerm("");
              setSelectedCategory("All");
            }}>
              Reset Filters
            </Button>
          </Form>
        </section>

        <section id="shop" className="my-5">
          <Row>
            <AnimatePresence>
              {filteredProducts.length === 0 ? (
                <Col>
                  <Alert variant="info" className="text-center">
                    No products match your criteria.
                  </Alert>
                </Col>
              ) : (
                filteredProducts.map((product, i) => (
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
                          src={
                            product.img_pro
                              ? `http://localhost:5000/api/uploads/${product.img_pro}`
                              : "https://via.placeholder.com/400x180?text=No+Image"
                          }
                          alt={product.name}
                          style={{ objectFit: "cover", height: "180px" }}
                        />
                        <Card.Body className="d-flex flex-column">
                          <Card.Title>{product.name}</Card.Title>
                          <Card.Text className="text-muted" style={{ flexGrow: 1, fontSize: "0.9rem" }}>
                            {product.description || "No description"}
                          </Card.Text>
                          <Card.Text className="mb-2 text-primary fw-bold" style={{ fontSize: "1.25rem" }}>
                            {`$${product.price}`}
                          </Card.Text>
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
                ))
              )}
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
