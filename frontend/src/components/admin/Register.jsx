import 'bootstrap/dist/css/bootstrap.min.css';
import React , { useEffect } from 'react';
import '../../style/Form.css'; // Same style as login but with minor tweaks
import logo from '../../assets/logo.png'; // Adjust the path to your logo'
function Register() {
    useEffect(() => {
            document.title = 'Register | eCommerce';
    }, []);
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    const role_id = user?.role_id;
    function submitForm() {
      const username = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const roleSelect = document.getElementById('role'); // May not exist
      const role_id = roleSelect ? parseInt(roleSelect.value) : undefined;

      if (username && email && password) {
        const payload = { username, email, password };
        if (role_id !== undefined) payload.role_id = role_id;

        fetch('http://localhost:5000/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
          .then(response => response.json())
          .then(data => {
            if (data.success || data.message === 'Registration successful') {
              alert('Registration successful! Please login.');
              window.location.href = '/';
            } else {
              alert(data.message || 'Registration failed');
            }
          })
          .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
          });
      }
    }

  return (
    <div className="register-bg-cartoon d-flex align-items-center justify-content-center">
      <div className="register-card-cartoon animate-pop-in">
        <div className="text-center mb-4">
          <img src={logo} alt="Logo" className="logo-cartoon" />
          <h2 className="register-title-cartoon">🎈 Create an Account</h2>
          <p className="register-subtitle-cartoon">Join us and book your events 🎫</p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); submitForm(); }}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Username</label>
            <input type="text" className="form-control rounded-pill cartoon-input" id="name" name="name" required />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input type="email" className="form-control rounded-pill cartoon-input" id="email" name="email" required />
          </div>
          {(role_id === 1 || role_id === 2) && (
            <div className="mb-3">
              <label htmlFor="role" className="form-label">Select Role</label>
              <select className="form-control rounded-pill cartoon-input" id="role" name="role">
                <option value="1">Admin</option>
                <option value="2">Manager</option>
                <option value="3" selected>User</option>
              </select>
            </div>
          )}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control rounded-pill cartoon-input" id="password" name="password" required />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-cartoon">🎉 Register</button>
          </div>
        </form>
        <div className="text-center mt-3">
          <small>Already have an account? <a href="/">Login here 🚪</a></small>
        </div>
      </div>
    </div>
  );
}

export default Register;
