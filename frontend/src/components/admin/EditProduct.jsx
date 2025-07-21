import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Button } from "react-bootstrap";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Check if have change or not
  const [originalProduct, setOriginalProduct] = useState(null);
  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`).then((res) => {
      setProduct(res.data);
      setOriginalProduct(res.data);
    });
  }, [id]);
  const isProductChanged = () => {
    if (!originalProduct || !product) return false;

    return (
      product.name !== originalProduct.name ||
      product.price !== originalProduct.price ||
      product.description !== originalProduct.description ||
      product.category_id !== originalProduct.category_id ||
      selectedFile !== null
    );
  };
  // ---------------------------------------

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

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("description", product.description || "");
    formData.append("category_id", product.category_id || "");

    if (selectedFile) {
      formData.append("img_pro", selectedFile);
    } else {
      formData.append("img_pro", product.img_pro || "");
    }

    try {
      await axios.put(`http://localhost:5000/api/products/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Product updated successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/dashboard/products");
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
          <div className="col-md-4 text-center">

            {/* Image preview */}
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="img-fluid rounded mb-3 border"
                style={{ maxHeight: "250px", objectFit: "cover" }}
              />
            ) : product.img_pro ? (
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

            {/* Hidden file input */}
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              id="fileInput"
              onChange={(e) => {
                const file = e.target.files[0];
                setSelectedFile(file);
                if (file) {
                  setPreviewUrl(URL.createObjectURL(file));
                } else {
                  setPreviewUrl(null);
                }
              }}
            />

            {/* Button triggers hidden input click */}
            <Button
              variant="outline-primary"
              onClick={() => document.getElementById("fileInput").click()}
              className="w-100"
            >
              Choose Image
            </Button>
          </div>

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

            {/* Check if has change show save button if not show cancel button */}
            {isProductChanged() ? (
              <button type="submit" className="btn btn-primary w-100">
                Save Changes
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-secondary w-100"
                onClick={() => navigate("/dashboard/products")}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
