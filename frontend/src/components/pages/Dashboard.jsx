import { Outlet } from 'react-router-dom';
import Sidebar from '../layout/Sidebar'; // adjust path if needed


function Dashboard() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '20px' }}>
        <Outlet /> {/* This will render child route like Dashboard, Add, etc. */}
      </main>
    </div>
  );
}
export default Dashboard;