import { Outlet } from 'react-router-dom';
import Sidebar from '../layout/Sidebar'; // adjust path if needed
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const location = useLocation();

  // Set page title dynamically based on route
  useEffect(() => {
    const path = location.pathname;

    const titles = {
      '/dashboard': 'Dashboard | eCommerce',
      '/dashboard/category': 'Category | eCommerce',
      '/dashboard/products': 'Product | eCommerce',
    };

    document.title = titles[path] || 'eCommerce Dashboard';
  }, [location]);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/dashboard/category') return 'Category';
    if (path === '/dashboard/products') return 'Product';
    return 'Dashboard';
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '20px' }}>
        <h1>{getPageTitle()} | eCommerce</h1>
        <Outlet /> {/* This will render child route like Dashboard, Add, etc. */}
      </main>
    </div>
  );
}
export default Dashboard;