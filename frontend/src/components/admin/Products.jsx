import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Products() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newImage, setNewImage] = useState(null);

  // Fetch products on load
  useEffect(() => {
  fetch('http://localhost:5000/api/products')
    .then(res => res.json())
    .then(data => {
      console.log(data); // Check the shape here
      // If data is an object containing the array under "products"
      if (data.products) {
        setProducts(data.products);
      } else if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts([]); // fallback to empty array
      }
    })
    .catch(err => console.error('Fetch error:', err));
}, []);


  // Add new product
  const handleAddProduct = () => {
    const formData = new FormData();
    formData.append('name', newName);
    formData.append('price', newPrice);
    formData.append('image', newImage);

    fetch('http://localhost:5000/api/products', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        if (data.product) {
          setProducts(prev => [...prev, data.product]);
          setShowModal(false);
          setNewName('');
          setNewPrice('');
          setNewImage(null);
        } else {
          alert(data.message || 'Failed to add product');
        }
      })
      .catch(err => {
        console.error('Add error:', err);
        alert('An error occurred');
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center fw-bold text-primary">Product Management</h2>

      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-success" onClick={() => setShowModal(true)}>+ Add Product</button>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-muted">No products found.</p>
      ) : (
        <table className="table table-bordered table-striped shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Price ($)</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={p.id}>
                <td>{i + 1}</td>
                <td>{p.name}</td>
                <td>{p.price}</td>
                <td>
                  {p.image ? (
                    <img src={`http://localhost:5000/uploads/${p.image}`} alt="product" width="60" />
                  ) : (
                    'No Image'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Product</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Product Name</label>
                  <input type="text" className="form-control" value={newName} onChange={e => setNewName(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Price ($)</label>
                  <input type="number" className="form-control" value={newPrice} onChange={e => setNewPrice(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Image</label>
                  <input type="file" className="form-control" onChange={e => setNewImage(e.target.files[0])} />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleAddProduct} disabled={!newName.trim() || !newPrice || !newImage}>
                  Save Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;

