import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
// Use card
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography
} from '@mui/material';
// install to use this card : npm install @mui/material @emotion/react @emotion/styled
// Alert | npm install sweetalert2
import Swal from 'sweetalert2';



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
        className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        style={{ display: "flex", justifyContent: "center", marginTop: 50 }}
      >
        {products.length === 0 ? (
          <div style={{ textAlign: "center", color: "#888", fontSize: "18px" }}>
            Not yet have product!
          </div>
        ) : (
          products.map((product) => (
            <Card key={product.id} sx={{ maxWidth: 345, mx: 'auto' }}>
              <CardActionArea>
                {/* Make the image taller */}
                <CardMedia
                  component="img"
                  height="180" // increased from 140
                  image={`http://localhost:5000/api/uploads/${product.img_pro}`}
                  alt={product.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {product.name}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    ${product.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {product.description}
                  </Typography>
                </CardContent>
              </CardActionArea>

              {/* Buttons container aligned right */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '10px',
                  padding: '8px 16px 16px 16px',
                }}
              >
                <button
                  onClick={() => handleEdit(product.id)}
                  style={{
                    width: "90px",
                    padding: "8px",
                    backgroundColor: "#facc15",
                    color: "#000",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  style={{
                    width: "90px",
                    padding: "8px",
                    backgroundColor: "#ef4444",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  ❌ Delete
                </button>
              </div>
            </Card>

          ))
        )}
      </div>




    </div>

  );
}

export default ProductPage;


