import React, { useState, useEffect } from 'react';
import Picture from '../../assets/profile.jpg'; // fallback image
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const Profile = ({ isLoggedIn, onLogin, onRegister, onProfile }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [previewImg, setPreviewImg] = useState(null);

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?.id;
  const roleId = user?.role_id;
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(`http://localhost:5000/api/profile/${userId}`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === 'Profile not found') {
          setProfile(null);
        } else {
          setProfile(data);
          setForm({
            firstName: data.first_name || '',
            lastName: data.last_name || '',
            phone: data.phone || '',
            address: data.address || '',
          });
          setPreviewImg(null);
        }
      })
      .catch((err) => {
        console.error('Error fetching profile:', err);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const handleProfileClick = () => {
    setShowDialog(true);
    if (onProfile) onProfile();
  };

  const handleClose = () => {
    setShowDialog(false);
    setEditMode(false);
    setPreviewImg(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setProfile(null);
    handleClose();
    window.location.href = '/';
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setForm((prev) => ({ ...prev, profile_picture: files[0] }));
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImg(reader.result);
      reader.readAsDataURL(files[0]);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('firstName', form.firstName);
    formData.append('lastName', form.lastName);
    formData.append('phone', form.phone);
    formData.append('address', form.address);
    if (form.profile_picture) {
      formData.append('profile_picture', form.profile_picture);
    }

    try {
      const res = await fetch('http://localhost:5000/api/profile/update', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert('Profile updated successfully!');
        // Refresh profile data
        setProfile((prev) => ({
          ...prev,
          first_name: form.firstName,
          last_name: form.lastName,
          phone: form.phone,
          address: form.address,
          profile_picture: data.profile?.profile_picture || prev.profile_picture,
        }));
        setEditMode(false);
        setPreviewImg(null);
      } else {
        alert(data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Server error');
    }
  };

  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      {!user?.id && (
        <>
          <button onClick={onLogin}>Login</button>
          <button onClick={onRegister}>Register</button>
        </>
      )}

      {user?.id && (
        <div onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
          <img
            src={
              previewImg ||
              (profile?.profile_picture
                ? `http://localhost:5000/uploads/profiles/${profile.profile_picture}`
                : Picture)
            }
            alt="Profile"
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
        </div>
      )}

      {showDialog && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h5 className="mb-3">Profile Menu</h5>

            {loading ? (
              <p>Loading profile...</p>
            ) : profile ? (
              <>
                {editMode ? (
                  <>
                    <input
                      className="form-control mb-2"
                      name="firstName"
                      value={form.firstName || ''}
                      onChange={handleChange}
                      placeholder="First name"
                    />
                    <input
                      className="form-control mb-2"
                      name="lastName"
                      value={form.lastName || ''}
                      onChange={handleChange}
                      placeholder="Last name"
                    />
                    <input
                      className="form-control mb-2"
                      name="phone"
                      value={form.phone || ''}
                      onChange={handleChange}
                      placeholder="Phone"
                    />
                    <input
                      className="form-control mb-2"
                      name="address"
                      value={form.address || ''}
                      onChange={handleChange}
                      placeholder="Address"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control mb-2"
                      onChange={handleChange}
                    />

                    {previewImg && (
                      <img
                        src={previewImg}
                        alt="Preview"
                        className="img-thumbnail mb-2"
                        style={{ height: '100px' }}
                      />
                    )}

                    <button onClick={handleSubmit} className="btn btn-primary w-100 mb-2">
                      Save Changes
                    </button>
                  </>
                ) : (
                  <>
                    {user?.id && (
                      <div className="d-flex justify-content-center mb-3" style={{ cursor: 'pointer' }} onClick={handleProfileClick}>
                        <img
                          src={
                            previewImg ||
                            (profile?.profile_picture
                              ? `http://localhost:5000/uploads/profiles/${profile.profile_picture}`
                              : Picture)
                          }
                          alt="Profile"
                          style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                          }}
                        />
                      </div>
                    )}
                    <p>
                      <strong>Name:</strong> {profile.first_name} {profile.last_name}
                    </p>
                    <p>
                      <strong>Phone:</strong> {profile.phone}
                    </p>
                    <p>
                      <strong>Address:</strong> {profile.address}
                    </p>
                    <p>
                      <strong>Created:</strong> {new Date(profile.created_at).toLocaleString()}
                    </p>
                    <button className="btn btn-warning w-100 mb-2" onClick={() => setEditMode(true)}>
                      Edit Profile
                    </button>
                  </>

                )}

                {(roleId === 1 || roleId === 2) && (
                  <button className="btn btn-success w-100 mb-2" onClick={() => navigate('/register')}>
                    Register User
                  </button>
                )}

                <button onClick={handleLogout} className="btn btn-danger w-100">
                  Logout
                </button>
              </>
            ) : (
              <p>Profile not found</p>
            )}

            <button className="btn btn-secondary w-100 mt-2" onClick={handleClose}>
              Close
            </button>
          </div>

          <style>{`
            .modal-overlay {
              position: fixed;
              top: 0; left: 0;
              width: 100vw; height: 100vh;
              background: rgba(0, 0, 0, 0.5);
              display: flex; align-items: center; justify-content: center;
              z-index: 9999;
            }
            .modal-box {
              background: #fff;
              padding: 20px;
              border-radius: 8px;
              width: 320px;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
              animation: scaleIn 0.2s ease-in-out;
            }
            @keyframes scaleIn {
              from { transform: scale(0.95); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default Profile;
