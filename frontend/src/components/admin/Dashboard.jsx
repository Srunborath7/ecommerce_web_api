import { Outlet } from 'react-router-dom';
import Sidebar from '../layout/Sidebar';
import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Profile from '../layout/Profile';
import { FaBars, FaTimes } from 'react-icons/fa';

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const sidebarRef = useRef();

  // Set document title
  useEffect(() => {
    const path = location.pathname;
    const titles = {
      '/dashboard': 'Dashboard | eCommerce',
      '/dashboard/category': 'Category | eCommerce',
      '/dashboard/products': 'Product | eCommerce',
    };
    document.title = titles[path] || 'eCommerce Dashboard';
  }, [location]);

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 1000) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on outside click (only for mobile)
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        windowWidth < 1000 &&
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [sidebarOpen, windowWidth]);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/dashboard/category') return 'Category';
    if (path === '/dashboard/products') return 'Product';
    return 'Dashboard';
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      {/* Sidebar */}
      {sidebarOpen && (
        <>
          {/* Backdrop */}
          {windowWidth < 1000 && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                zIndex: 999,
              }}
            />
          )}

          <div
            ref={sidebarRef}
            style={{
              position: windowWidth < 1000 ? 'fixed' : 'relative',
              zIndex: 1000,
              height: '100vh',
              backgroundColor: '#2c3e50',
              width: '240px',
              padding: '20px 15px',
              boxSizing: 'border-box',
            }}
          >
            {/* Close button only on small screen */}
            {windowWidth < 1000 && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    fontSize: '24px',
                    cursor: 'pointer',
                  }}
                  aria-label="Close Sidebar"
                >
                  <FaTimes />
                </button>
              </div>
            )}
            <Sidebar />
          </div>
        </>
      )}

      {/* Main content */}
      <main style={{ flex: 1, padding: '20px' }}>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <div className="d-flex align-items-center gap-3">
            {/* Hamburger icon on small screen */}
            {windowWidth < 1000 && (
              <button
                onClick={() => setSidebarOpen(true)}
                style={{
                  fontSize: '24px',
                  background: 'none',
                  border: 'none',
                  color: '#2c3e50',
                  cursor: 'pointer',
                }}
                aria-label="Open Sidebar"
              >
                <FaBars />
              </button>
            )}
            <h3>{getPageTitle()} | eCommerce</h3>
          </div>

          <div className="d-flex align-items-center justify-content-center gap-3">
            <Profile user={user} />
            <div>
              <p>UserName: {user.username}</p>
              <p>Permission: {user.role}</p>
            </div>
          </div>
        </div>

        <Outlet />
      </main>
    </div>
  );
}

export default Dashboard;
