import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function OrdersTable() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const rowsPerPage = 10;

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('http://localhost:5000/api/orders', {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order =>
    order.username?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const goToPage = page => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div style={{ padding: '20px', overflowX: 'auto' }}>
      <h2>Orders</h2>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search by username"
        value={search}
        onChange={e => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        style={{
          marginBottom: '15px',
          padding: '8px 12px',
          width: '250px',
          borderRadius: '5px',
          border: '1px solid #ccc',
        }}
      />

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#f0f0f0' }}>
          <tr>
            <th style={thStyle}>Order ID</th>
            <th style={thStyle}>User</th>
            <th style={thStyle}>Total Price</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Created At</th>
            <th style={thStyle}>Updated At</th>
            <th style={thStyle}>Payment</th>
          </tr>
        </thead>
        <tbody>
          {paginatedOrders.map(order => (
            <tr key={order.id} style={trStyle}>
              <td style={tdStyle}>{order.id}</td>
              <td style={tdStyle}>{order.username}</td>
              <td style={tdStyle}>${order.total_price.toFixed(2)}</td>
              <td style={tdStyle}>{order.status}</td>
              <td style={tdStyle}>{new Date(order.created_at).toLocaleString()}</td>
              <td style={tdStyle}>{new Date(order.updated_at).toLocaleString()}</td>
              <td style={tdStyle}>
                <button
                  style={buttonStyle}
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  Pay Now
                </button>
              </td>
            </tr>
          ))}
          {paginatedOrders.length === 0 && (
            <tr>
              <td colSpan={7} style={{ textAlign: 'center', padding: '10px' }}>
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          style={paginationBtn}
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => goToPage(i + 1)}
            style={{
              ...paginationBtn,
              backgroundColor: currentPage === i + 1 ? '#0d6efd' : '#f0f0f0',
              color: currentPage === i + 1 ? '#fff' : '#000',
            }}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={paginationBtn}
        >
          Next
        </button>
      </div>
    </div>
  );
}

// Styles
const thStyle = {
  border: '1px solid #ddd',
  padding: '12px 15px',
  textAlign: 'left',
};

const tdStyle = {
  border: '1px solid #ddd',
  padding: '12px 15px',
};

const trStyle = {
  backgroundColor: '#fff',
};

const buttonStyle = {
  padding: '6px 12px',
  backgroundColor: '#0d6efd',
  border: 'none',
  color: '#fff',
  borderRadius: '4px',
  cursor: 'pointer',
};

const paginationBtn = {
  margin: '0 5px',
  padding: '6px 12px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  cursor: 'pointer',
};

export default OrdersTable;
