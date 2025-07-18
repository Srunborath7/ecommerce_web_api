import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Container,
  Badge,
  Spinner,
  Alert,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import Swal from "sweetalert2";

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    product_id: "",
    quantity: "",
    action: "IN",
    description: "",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = () => {
    axios
      .get("http://localhost:5000/api/inventory", { withCredentials: true })
      .then((res) => {
        setInventory(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("⚠️ Failed to load inventory data. Are you logged in?");
        setLoading(false);
      });
  };

  const handleOpen = () => {
    setFormData({ product_id: "", quantity: "", action: "IN", description: "" });
    setEditId(null);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setFormData({ product_id: "", quantity: "", action: "IN", description: "" });
    setEditId(null);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    const url = editId
      ? `http://localhost:5000/api/inventory/${editId}`
      : "http://localhost:5000/api/inventory";

    const method = editId ? "put" : "post";

    try {
      await axios[method](url, formData, { withCredentials: true });
      handleClose();
      fetchInventory();
      Swal.fire({
        icon: "success",
        title: editId ? "Updated!" : "Added!",
        text: `Inventory entry ${editId ? "updated" : "added"} successfully.`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Submit error:", err);
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "❌ Failed to submit data.",
      });
    }
  };

  const handleEdit = (item) => {
    setFormData({
      product_id: item.product_id,
      quantity: item.quantity,
      action: item.action,
      description: item.description,
    });
    setEditId(item.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this inventory entry?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/inventory/${id}`, {
          withCredentials: true,
        });
        fetchInventory();
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Inventory entry deleted successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error("Delete error:", err);
        Swal.fire({
          icon: "error",
          title: "Delete failed",
          text: "❌ Delete failed.",
        });
      }
    }
  };

  return (
    <Container className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>📦 Inventory History</h2>
        <Button onClick={handleOpen}>➕ Add Inventory</Button>
      </div>

      {loading && <Spinner animation="border" variant="primary" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Action</th>
              <th>Description</th>
              <th>User</th>
              <th>Date</th>
              <th>🛠️</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item, index) => (
              <tr
                key={item.id}
                onClick={() => handleEdit(item)}
                style={{ cursor: "pointer" }}
              >
                <td>{index + 1}</td>
                <td>{item.product_name}</td>
                <td>{item.quantity}</td>
                <td>
                  <Badge bg={item.action === "IN" ? "success" : "danger"}>
                    {item.action}
                  </Badge>
                </td>
                <td>{item.description || "N/A"}</td>
                <td>{item.user || "System"}</td>
                <td>{new Date(item.created_at).toLocaleString()}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                  >
                    🗑️
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Create/Edit Modal */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? "✏️ Edit Inventory" : "➕ Add Inventory"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Product ID</Form.Label>
              <Form.Control
                type="number"
                name="product_id"
                value={formData.product_id}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Action</Form.Label>
              <Form.Select name="action" value={formData.action} onChange={handleChange}>
                <option value="IN">IN (Add)</option>
                <option value="OUT">OUT (Remove)</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {editId ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
