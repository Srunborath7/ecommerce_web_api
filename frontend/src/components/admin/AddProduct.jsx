import { useState, useEffect } from "react";
import axios from "axios";

function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    stock_quantity: "",
    category_id: "",
    img_pro: null,
  });

  const [categories, setCategories] = useState([]);
  const [previewImg, setPreviewImg] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/categories").then((res) => {
      setCategories(res.data);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));

      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setPreviewImg(reader.result);
        reader.readAsDataURL(file);
      } else {
        setPreviewImg(null);
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    for (const key in form) {
      formData.append(key, form[key]);
    }

    // Add created_by from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.id) {
      formData.append("created_by", storedUser.id);
    }

    try {
      await axios.post("http://localhost:5000/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true, // Optional: if you're using sessions/cookies
      });

      alert("✅ Product created successfully!");
      // Reset form
      setForm({
        name: "",
        price: "",
        description: "",
        stock_quantity: "",
        category_id: "",
        img_pro: null,
      });
      setPreviewImg(null);

    } catch (err) {
      console.error("❌ Error creating product:", err.response?.data || err.message);

      // Optional: Show detailed error from server if available
      const message = err.response?.data?.message || "Failed to create product. Please try again.";
      alert(`❌ Error: ${message}`);
    }
  };

  return (
    <div className="container my-5">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white text-center">
          <h3>Add New Product</h3>
        </div>
        <form onSubmit={handleSubmit} className="card-body">
          <div className="row g-3">

            {/* Image Upload */}
            <div className="col-12">
              <label className="form-label">Product Image</label>
              <input
                type="file"
                name="img_pro"
                accept="image/*"
                onChange={handleChange}
                className="form-control"
              />
            </div>

            {/* Preview */}
            {previewImg && (
              <div className="col-12 text-center">
                <img
                  src={previewImg}
                  alt="Preview"
                  className="img-thumbnail mt-3"
                  style={{ maxHeight: "250px" }}
                />
              </div>
            )}

            {/* Name */}
            <div className="col-md-6">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            {/* Price */}
            <div className="col-md-6">
              <label className="form-label">Price ($)</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="form-control"
                min="0"
                step="0.01"
                required
              />
            </div>

            {/* Stock */}
            <div className="col-md-6">
              <label className="form-label">Stock Quantity</label>
              <input
                type="number"
                name="stock_quantity"
                value={form.stock_quantity}
                onChange={handleChange}
                className="form-control"
                min="0"
                required
              />
            </div>

            {/* Category */}
            <div className="col-md-6">
              <label className="form-label">Category</label>
              <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                className="form-select"
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

            {/* Description */}
            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="form-control"
                rows="3"
              />
            </div>
          </div>

          <div className="text-center mt-4">
            <button type="submit" className="btn btn-primary px-5">
              Create Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
