import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Category() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleAddCategory = () => {
    const newCategory = {
      id: Date.now(),
      name: newName,
      description: newDescription,
    };
    setCategories([...categories, newCategory]);
    setNewName('');
    setNewDescription('');
    setShowModal(false);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center fw-bold text-primary">Category Management</h2>

      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-success fw-semibold" onClick={() => setShowModal(true)}>
          + Add Category
        </button>
      </div>

      {/* Category Table */}
      {categories.length === 0 ? (
        <p className="text-center text-muted">No categories added yet.</p>
      ) : (
        <table className="table table-bordered table-striped shadow-sm">
          <thead className="table-primary">
            <tr>
              <th>#</th>
              <th>Category Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, index) => (
              <tr key={cat.id}>
                <td>{index + 1}</td>
                <td>{cat.name}</td>
                <td>{cat.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Category</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Category Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Enter category name"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Description</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Enter category description"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleAddCategory} disabled={!newName.trim()}>
                  Save Category
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Category;
