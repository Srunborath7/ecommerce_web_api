import React, { useEffect, useState } from 'react';

function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('http://localhost:5000/api/all-users', { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!users.length) return <p>No users found.</p>;

  return (
    <div style={{ padding: '1rem', maxWidth: '100%', overflowX: 'auto' }}>
      <h2 style={{ marginBottom: '1rem', color: '#2c3e50' }}>User List</h2>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          minWidth: '600px',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          backgroundColor: '#fff',
        }}
      >
        <thead>
          <tr style={{ backgroundColor: '#0d6efd', color: 'white' }}>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Username</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Role</th>
            <th style={thStyle}>Created At</th>
          </tr>
        </thead>
        <tbody>
          {users.map(({ id, username, email, role, created_at }) => (
            <tr
              key={id}
              style={{
                borderBottom: '1px solid #ddd',
                cursor: 'default',
                transition: 'background-color 0.3s',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f1f7ff')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <td style={tdStyle}>{id}</td>
              <td style={tdStyle}>{username}</td>
              <td style={tdStyle}>{email}</td>
              <td style={tdStyle}>{role || 'N/A'}</td>
              <td style={tdStyle}>{new Date(created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  textAlign: 'left',
  padding: '12px 15px',
  fontWeight: '600',
  fontSize: '1rem',
  userSelect: 'none',
};

const tdStyle = {
  padding: '12px 15px',
  fontSize: '0.95rem',
  color: '#444',
  verticalAlign: 'middle',
};

export default UsersList;
