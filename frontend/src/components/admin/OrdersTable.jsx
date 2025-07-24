import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function OrdersTable() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

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

  return (
    <div style={{ padding: '20px', overflowX: 'auto' }}>
      <h2>Orders</h2>
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
          {orders.map(order => (
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
          {orders.length === 0 && (
            <tr>
              <td colSpan={7} style={{ textAlign: 'center', padding: '10px' }}>
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
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

export default OrdersTable;
