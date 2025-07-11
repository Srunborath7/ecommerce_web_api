import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Category() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // Fetch categories
  useEffect(() => {
    fetch('http://localhost:5000/api/categories', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Fetch error:', err));
  }, []);

  const handleSave = () => {
    const method = editMode ? 'PUT' : 'POST';
    const url = editMode
      ? `http://localhost:5000/api/categories/${editId}`
      : 'http://localhost:5000/api/categories';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name: newName, description: newDescription })
    })
      .then(res => res.json())
      .then(data => {
        if (data.category || data.success) {
          if (editMode) {
            setCategories(prev =>
              prev.map(cat => (cat.id === editId ? { ...cat, name: newName, description: newDescription } : cat))
            );
          } else {
            setCategories(prev => [...prev, data.category]);
          }
          closeModal();
        } else {
          alert(data.message || 'Failed to save category');
        }
      })
      .catch(err => {
        console.error('Save error:', err);
        alert('An error occurred');
      });
  };

  const handleDelete = id => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      fetch(`http://localhost:5000/api/categories/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setCategories(prev => prev.filter(c => c.id !== id));
          } else {
            alert(data.message || 'Failed to delete category');
          }
        })
        .catch(err => console.error('Delete error:', err));
    }
  };

  const openEditModal = category => {
    setNewName(category.name);
    setNewDescription(category.description);
    setEditId(category.id);
    setEditMode(true);
    setShowModal(true);
  };

  const openAddModal = () => {
    setNewName('');
    setNewDescription('');
    setEditMode(false);
    setEditId(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setNewName('');
    setNewDescription('');
    setEditMode(false);
    setEditId(null);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center fw-bold text-primary">Category Management</h2>

      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-success fw-semibold" onClick={openAddModal}>
          + Add Category
        </button>
      </div>

      {categories.length === 0 ? (
        <p className="text-center text-muted">No categories found.</p>
      ) : (
        <table className="table table-bordered table-striped shadow-sm">
          <thead className="table-primary">
            <tr>
              <th>#</th>
              <th>Category Name</th>
              <th>Description</th>
              <th>Created By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, index) => (
              <tr key={cat.id}>
                <td>{index + 1}</td>
                <td>{cat.name}</td>
                <td>{cat.description}</td>
                <td>{cat.creator_name}</td>
                <td className="d-flex justify-content-center">
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(cat.id)}>
                    Delete
                  </button>
                  <button className="btn btn-warning btn-sm ms-2" onClick={() => openEditModal(cat)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editMode ? 'Edit Category' : 'Add New Category'}</h5>
                <button className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-3"
                  value={newName}
                  placeholder="Category name"
                  onChange={e => setNewName(e.target.value)}
                />
                <textarea
                  className="form-control"
                  rows="3"
                  value={newDescription}
                  placeholder="Description"
                  onChange={e => setNewDescription(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSave} disabled={!newName.trim()}>
                  {editMode ? 'Update Category' : 'Save Category'}
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
