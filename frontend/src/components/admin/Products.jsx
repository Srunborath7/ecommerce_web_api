import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
// Use card
// install to use this card : npm install @mui/material @emotion/react @emotion/styled
// Alert | npm install sweetalert2
import Swal from 'sweetalert2';
import { Row, Col, Card, Button, Alert } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";



function ProductPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();




  // Load categories from backend
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
    }),
  };

  // Run on component load
  useEffect(() => {
    fetchCategories();
  }, []);


  // Load product
  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then((res) => {
        console.log("Fetched products:", res.data);
        setProducts(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err.response ? err.response.data : err.message);
      });
  }, []);

  // Use for get products | Show Product base on Category | Search Product
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = "http://localhost:5000/api/products";

        const params = [];
        if (category !== "All") params.push(`category=${category}`);
        if (search) params.push(`search=${search}`);
        if (params.length > 0) url += "?" + params.join("&");

        const res = await axios.get(url);
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    fetchProducts();
  }, [category, search]);


  // Edit Product
  const handleEdit = (id) => {
    navigate(`/edit-product/${id}`);
  };


  // Handle Delete
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This product will be deleted permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        withCredentials: true,
      });

      setProducts(products.filter((p) => p.id !== id));

      // Show success toast
      Swal.fire({
        title: 'Deleted!',
        text: 'The product has been deleted.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Delete failed:", err.response?.data || err.message);
      Swal.fire({
        title: 'Error',
        text: err.response?.data?.message || 'Failed to delete product.',
        icon: 'error',
      });
    }
  };


  return (
    <div className="flex flex-col items-center mt-10 w-full">
      {/* Search Input */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          width: "100%",
        }}
      >
        <input
          type="text"
          value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          style={{
            width: "50%",
            padding: "8px",
            textAlign: "center",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />


        <button
          onClick={() => setSearch(searchQuery)}
          style={{
            padding: "8px 16px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Search
        </button>

        <button
          onClick={() => {
            setCategory("All");
            setSearch("");        // clear the actual search trigger
            setSearchQuery("");   // clear the input field too
          }} style={{
            padding: "8px 16px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}>Reset</button>
      </div>


      {/* Category Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          width: "100%",
          marginTop: "35px",
          flexWrap: "wrap",
        }}
      >
        {/* All Button */}
        <button
          onClick={() => setCategory("All")}
          style={{
            width: "5%",
            padding: "8px",
            textAlign: "center",
            backgroundColor: category === "All" ? "#2563eb" : "#e5e7eb",
            color: category === "All" ? "#fff" : "#000",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          All
        </button>

        {/* Dynamic Buttons from DB */}
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.name)}
            style={{
              width: "8%",
              padding: "8px",
              textAlign: "center",
              backgroundColor: category === cat.name ? "#2563eb" : "#e5e7eb",
              color: category === cat.name ? "#fff" : "#000",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>


      {/* Product */}
      <div
        style={{
          height: '70vh',
          overflowY: 'auto',
          padding: '0 1rem',
        }}
      >
        <Row className="mt-5 px-4">
          <AnimatePresence>
            {products.length === 0 ? (
              <Col>
                <Alert variant="info" className="text-center">
                  Not yet have product!
                </Alert>
              </Col>
            ) : (
              products.map((product, i) => (
                <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                  <motion.div
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={cardVariants}
                  >
                    <Card className="h-100 shadow-sm d-flex flex-column">
                      <Card.Img
                        variant="top"
                        src={
                          product.img_pro
                            ? `http://localhost:5000/api/uploads/${product.img_pro}`
                            : "https://source.unsplash.com/400x180/?product,store"
                        }
                        alt={product.name}
                        style={{
                          height: "180px",
                          width: "100%",
                          objectFit: "contain", // <-- changed
                          backgroundColor: "#f3f4f6", // light gray background
                          borderTopLeftRadius: "0.5rem",
                          borderTopRightRadius: "0.5rem",
                          padding: "10px", // optional: gives space around the image
                          transition: "transform 0.3s ease-in-out",
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                        onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                      />

                      <Card.Body className="d-flex flex-column flex-grow-1">
                        <Card.Title>{product.name}</Card.Title>
                        <Card.Text
                          className="text-muted"
                          style={{
                            fontSize: "0.9rem",
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                            marginBottom: "auto",
                          }}
                        >
                          {product.description || "No description"}
                        </Card.Text>
                        <Card.Text className="mb-2 text-primary fw-bold" style={{ fontSize: "1.25rem" }}>
                          ${product.price}
                        </Card.Text>
                        <div className="d-flex justify-content-end gap-2 mt-auto">
                          <Button variant="warning" size="sm" onClick={() => handleEdit(product.id)}>
                            ✏️ Edit
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => handleDelete(product.id)}>
                            ❌ Delete
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))
            )}
          </AnimatePresence>
        </Row>
      </div>

    </div>

  );
}

export default ProductPage;


