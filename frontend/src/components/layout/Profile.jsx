import React, { useState, useEffect } from 'react';
import Picture from '../../assets/profile.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';

const Profile = ({ isLoggedIn, onLogin, onRegister, onProfile }) => {
    const [showDialog, setShowDialog] = useState(false);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);

    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    const userId = user?.id;
    const roleId = user?.role_id;

    useEffect(() => {
        if (!userId) return;

        fetch(`http://localhost:5000/api/profile/${userId}`, {
            method: 'GET',
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                if (data.message === 'Profile not found') {
                    setProfile(null);
                } else {
                    setProfile(data);
                }
            })
            .catch(err => {
                console.error('Error fetching profile:', err);
            })
            .finally(() => setLoading(false));
    }, [userId]);

    const handleProfileClick = () => {
        setShowDialog(true);
        if (onProfile) onProfile();
    };

    const handleClose = () => setShowDialog(false);

    return (
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {!user?.id && (
                <>
                <button onClick={onLogin}>Login</button>
                <button onClick={onRegister}>Register</button>
                </>
            )}

            <div onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
                <img
                    src={
                        profile && profile.profile_picture
                            ? `http://localhost:5000/uploads/${profile.profile_picture}`
                            : Picture
                    }
                    alt="Profile"
                    style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                    }}
                />

            </div>

            {showDialog && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#fff',
                            color: '#000',
                            padding: '20px',
                            borderRadius: '10px',
                            width: '300px',
                            textAlign: 'center',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                            zIndex: 10000,
                            animation: 'scaleIn 0.2s ease-in-out',
                        }}
                    >
                        <h5 className="mb-3">Profile Menu</h5>
                        {loading ? (
                            <p>Loading profile...</p>
                        ) : profile ? (
                            <>
                                <p><strong>Name:</strong> {profile.id} {profile.last_name}</p>
                                <p><strong>Phone:</strong> {profile.phone}</p>
                                <p><strong>Address:</strong> {profile.address}</p>
                                <p><strong>Created:</strong> {new Date(profile.created_at).toLocaleString()}</p>

                               {(roleId === 1 || roleId === 2) && (
                                    <div>
                                    <button><a href='/register'>Register</a></button>
                                    </div>
                                )}
                            </>
                            

                        ) : (
                            <p>Profile not found</p>
                        )}

                        <button className="btn btn-secondary mt-3" onClick={handleClose}>
                            Close
                        </button>
                    </div>

                    <style>
                        {`
              @keyframes scaleIn {
                from {
                  transform: scale(0.95);
                  opacity: 0;
                }
                to {
                  transform: scale(1);
                  opacity: 1;
                }
              }
            `}
                    </style>
                </div>
            )}
        </div>
    );
};

export default Profile;
