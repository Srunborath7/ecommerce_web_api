import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
        Swal.fire("Error", "Failed to fetch product", "error");
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/categories`);
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchProduct();
    fetchCategories();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/products/${id}`,
        {
          name: product.name,
          price: product.price,
          description: product.description,
          category_id: product.category_id,
          img_pro: product.img_pro,
        },
        { withCredentials: true }
      );

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Product updated successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/products");
    } catch (err) {
      console.error("Update failed:", err);
      Swal.fire("Error", err.response?.data?.message || "Update failed", "error");
    }
  };

  if (!product) return <div className="text-center mt-5">Loading product...</div>;

  return (
    <div className="container my-5">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white text-center">
          <h3>Edit Product</h3>
        </div>
        <form onSubmit={handleSubmit} className="row g-3 p-4">
          {/* Image preview + filename input */}
          <div className="col-md-4 text-center">
            {product.img_pro ? (
              <img
                src={`http://localhost:5000/api/uploads/${product.img_pro}`}
                alt={product.name}
                className="img-fluid rounded mb-3 border"
                style={{ maxHeight: "250px", objectFit: "cover" }}
              />
            ) : (
              <div
                className="d-flex align-items-center justify-content-center bg-light rounded mb-3 border"
                style={{ height: "250px" }}
              >
                <span className="text-muted">No Image</span>
              </div>
            )}
            <input
              type="text"
              className="form-control"
              placeholder="Image filename"
              value={product.img_pro || ""}
              onChange={(e) => setProduct({ ...product, img_pro: e.target.value })}
            />
          </div>

          {/* Form inputs */}
          <div className="col-md-8">
            <div className="mb-3">
              <label htmlFor="nameInput" className="form-label">
                Product Name
              </label>
              <input
                id="nameInput"
                type="text"
                className="form-control"
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="priceInput" className="form-label">
                Price ($)
              </label>
              <input
                id="priceInput"
                type="number"
                step="0.01"
                className="form-control"
                value={product.price}
                onChange={(e) => setProduct({ ...product, price: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="descInput" className="form-label">
                Description
              </label>
              <textarea
                id="descInput"
                className="form-control"
                rows="4"
                value={product.description || ""}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="categorySelect" className="form-label">
                Category
              </label>
              <select
                id="categorySelect"
                className="form-select"
                value={product.category_id || ""}
                onChange={(e) => setProduct({ ...product, category_id: e.target.value })}
                required
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
