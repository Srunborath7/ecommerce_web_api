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
  const [products, setProducts] = useState([]);
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
  const [currentStock, setCurrentStock] = useState(0);

  useEffect(() => {
    fetchInventory();
    fetchProducts();
  }, []);

  const fetchInventory = () => {
    axios
      .get("http://localhost:5000/api/inventory", { withCredentials: true })
      .then((res) => {
        setInventory(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load inventory data.");
        setLoading(false);
      });
  };

  const fetchProducts = () => {
    axios
      .get("http://localhost:5000/api/products", { withCredentials: true })
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Fetch products failed:", err));
  };

  const handleOpen = () => {
    setFormData({ product_id: "", quantity: "", action: "IN", description: "" });
    setEditId(null);
    setCurrentStock(0);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setFormData({ product_id: "", quantity: "", action: "IN", description: "" });
    setEditId(null);
    setCurrentStock(0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "product_id") {
      const product = products.find((p) => p.id.toString() === value);
      setCurrentStock(product ? product.stock_quantity : 0);
      setFormData((prev) => ({ ...prev, [name]: value, quantity: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.product_id || !formData.quantity || !formData.action) {
      return Swal.fire("Missing fields", "Please fill in all fields", "error");
    }
    if (parseInt(formData.quantity) <= 0) {
      return Swal.fire("Invalid quantity", "Quantity must be > 0", "error");
    }
    if (formData.action === "OUT" && parseInt(formData.quantity) > currentStock) {
      return Swal.fire("Invalid quantity", `Max allowed is ${currentStock}`, "error");
    }

    const url = editId
      ? `http://localhost:5000/api/inventory/${editId}`
      : "http://localhost:5000/api/inventory";
    const method = editId ? "put" : "post";

    try {
      await axios[method](url, formData, { withCredentials: true });
      handleClose();
      fetchInventory();
      fetchProducts();
      Swal.fire("Success", `Inventory ${editId ? "updated" : "added"}`, "success");
    } catch (err) {
      Swal.fire("Error", "Submission failed", "error");
    }
  };

  const handleEdit = (item) => {
    setFormData({
      product_id: item.product_id.toString(),
      quantity: item.quantity.toString(),
      action: item.action,
      description: item.description || "",
    });
    setEditId(item.id);
    const product = products.find((p) => p.id === item.product_id);
    setCurrentStock(product ? product.stock_quantity : 0);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Delete this inventory entry?",
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
        fetchProducts();
        Swal.fire("Deleted", "Inventory entry deleted", "success");
      } catch {
        Swal.fire("Failed", "Could not delete entry", "error");
      }
    }
  };

  return (
    <Container className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Inventory</h2>
        <Button onClick={handleOpen}>Add Inventory</Button>
      </div>

      {loading && <Spinner animation="border" />} {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Name</th>
              <th>Stock</th>
              <th>Action</th>
              <th>Price</th>
              <th>Total</th>
              <th>Description</th>
              <th>User</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item, i) => (
              <tr key={item.id} onClick={() => handleEdit(item)} style={{ cursor: "pointer" }}>
                <td>{i + 1}</td>
                <td>
                  <img
                    src={`http://localhost:5000/uploads/${item.img_pro}`}
                    alt="Product"
                    width="50"
                  />
                </td>
                <td>{item.product_name}</td>
                <td>{item.stock_quantity}</td>
                <td>
                  <Badge bg={item.action === "IN" ? "success" : "danger"}>{item.action}</Badge>
                </td>
                <td>${item.price}</td>
                <td>${(item.stock_quantity * item.price).toFixed(2)}</td>
                <td>{item.description || "-"}</td>
                <td>{item.user || "System"}</td>
                <td>{new Date(item.created_at).toLocaleString()}</td>
                <td>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? "Edit Inventory" : "Add Inventory"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Product</Form.Label>
              <Form.Select name="product_id" value={formData.product_id} onChange={handleChange}>
                <option value="">-- Select Product --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Stock: {p.stock_quantity})
                  </option>
                ))}
              </Form.Select>
              <Form.Text>Stock: {currentStock}</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Action</Form.Label>
              <Form.Select name="action" value={formData.action} onChange={handleChange}>
                <option value="IN">IN</option>
                <option value="OUT" disabled={currentStock <= 0}>OUT</option>
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
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>{editId ? "Update" : "Save"}</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
