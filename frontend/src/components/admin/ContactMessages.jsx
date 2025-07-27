import React, { useEffect, useState } from "react";
import { Container, Table, Spinner, Alert } from "react-bootstrap";
import axios from "axios";

export default function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);

        const storedUser = localStorage.getItem("user");
        if (!storedUser) throw new Error("Unauthorized");

        const token = JSON.parse(storedUser).token;

        const res = await axios.get("http://localhost:5000/api/contact", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setMessages(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "Failed to load messages"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading)
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" />
      </Container>
    );

  if (error)
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  return (
    <Container className="my-5">
      {messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {messages.map(({ id, name, email, message, created_at }) => (
              <tr key={id}>
                <td>{id}</td>
                <td>{name}</td>
                <td>{email}</td>
                <td>{message}</td>
                <td>{new Date(created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
