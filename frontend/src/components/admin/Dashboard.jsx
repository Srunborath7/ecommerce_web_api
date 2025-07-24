import { Outlet } from 'react-router-dom';
import Sidebar from '../layout/Sidebar';
import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Profile from '../layout/Profile';
import { FaBars, FaTimes } from 'react-icons/fa';
import UsersList from './UsersList';
import OrdersTable from './OrdersTable';

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 1200);
  const sidebarRef = useRef();

  // Summary states
  const [productCount, setProductCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [userCount, setUserCount] = useState(0);

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

  // Handle screen resize for sidebar and layout
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setIsSmallScreen(window.innerWidth <= 1200);
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

  // Fetch inventory summary for product count and total price
  useEffect(() => {
    async function fetchSummary() {
      try {
        const res = await fetch('http://localhost:5000/api/inventory', {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch inventory');
        const data = await res.json();

        let count = 0;
        let priceSum = 0;

        data.forEach(item => {
          count += Number(item.quantity);
          priceSum += Number(item.quantity) * Number(item.price);
        });

        setProductCount(count);
        setTotalPrice(priceSum);
      } catch (err) {
        console.error('Failed to fetch inventory summary:', err);
      }
    }

    fetchSummary();
  }, []);

  // Fetch user count (e.g., role_id = 3 users)
  useEffect(() => {
    async function fetchUserCount() {
      try {
        const res = await fetch('http://localhost:5000/api/count-role-3', {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch user count');
        const data = await res.json();
        setUserCount(data.count || 0);
      } catch (err) {
        console.error('Failed to fetch user count:', err);
      }
    }
    fetchUserCount();
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/dashboard/category') return 'Category';
    if (path === '/dashboard/products') return 'Product';
    return 'Dashboard';
  };

  // Inline styles for summary boxes container and boxes
  const summaryContainerStyle = {
    display: 'flex',
    gap: '50px',
    marginBottom: '15px',
    width: '100%',
    flexDirection: isSmallScreen ? 'column' : 'row',
  };

  const summaryBoxBaseStyle = {
    flex: 1,
    borderRadius: '8px',
    padding: '40px 20px',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: isSmallScreen ? '20px' : '0',
  };

  const productsBoxStyle = {
    ...summaryBoxBaseStyle,
    backgroundColor: '#e7f1ff',
    border: '1px solid #0d6efd',
    color: '#0d6efd',
    boxShadow: '0 2px 6px rgba(13, 110, 253, 0.3)',
  };

  const totalPriceBoxStyle = {
    ...summaryBoxBaseStyle,
    backgroundColor: '#d1e7dd',
    border: '1px solid #198754',
    color: '#198754',
    boxShadow: '0 2px 6px rgba(25, 135, 84, 0.3)',
  };

  const usersBoxStyle = {
    ...summaryBoxBaseStyle,
    backgroundColor: '#fff3cd',
    border: '1px solid #ffc107',
    color: '#ffc107',
    boxShadow: '0 2px 6px rgba(255, 193, 7, 0.3)',
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
      <main style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
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

          <div className="d-flex justify-content-center gap-4 p-3 border rounded shadow-sm bg-light align-items-center">
            <Profile user={user} />
            <div>
              <p className="mb-1 fw-semibold" style={{ fontSize: '1.1rem' }}>
                Username: <span className="text-primary">{user.username}</span>
              </p>
              <p className="mb-0 text-muted" style={{ fontSize: '0.9rem' }}>
                Permission: <span className="text-capitalize">{user.role}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Only show summary and users list on main /dashboard path */}
        {location.pathname === '/dashboard' && (
          <>
            <div style={summaryContainerStyle}>
              <div style={productsBoxStyle}>
                Products Count
                <div style={{ fontSize: '2rem', marginTop: '8px' }}>{productCount}</div>
              </div>

              <div style={totalPriceBoxStyle}>
                Total Price
                <div style={{ fontSize: '2rem', marginTop: '8px' }}>
                  ${totalPrice.toFixed(2)}
                </div>
              </div>

              <div style={usersBoxStyle}>
                Users Count
                <div style={{ fontSize: '2rem', marginTop: '8px' }}>{userCount}</div>
              </div>
            </div>
            <div>
              <OrdersTable />
            </div>
            <div>
              <UsersList />
            </div>
          </>
        )}

        <Outlet />
      </main>
    </div>
  );
}

export default Dashboard;
