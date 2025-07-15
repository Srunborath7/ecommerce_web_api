import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaBox, FaPlus, FaTags,FaShoppingCart } from 'react-icons/fa';
const Sidebar = () => {
  return (
    <aside style={sidebarStyle}>
      <h2 style={{ marginBottom: '30px', fontSize: '22px' }}>Admin Panel</h2>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        <SidebarItem to="/dashboard/" icon={<FaTachometerAlt />} label="Dashboard" />
        <SidebarItem to="/dashboard/category" icon={<FaTags />} label="Category" />
        <SidebarItem to="/dashboard/products" icon={<FaBox />} label="Products" />
        <SidebarItem to="/dashboard/add" icon={<FaPlus />} label="Add Product" />
        <SidebarItem to="/dashboard/inventory" icon={<FaTags />} label="Inventory" />
        <SidebarItem to="/ecommerce" icon={<FaShoppingCart />} label="eCommerce" />
      </ul>
    </aside>
  );
};

const SidebarItem = ({ to, icon, label }) => (
  <li style={{ marginBottom: '15px' }}>
    <NavLink
      to={to}
      style={({ isActive }) => ({
        ...linkStyle,
        background: isActive ? '#34495e' : 'transparent',
        borderRadius: '8px',
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        color: isActive ? '#fff' : '#ecf0f1',
        textDecoration: 'none'
      })}
    >
      {icon}
      {label}
    </NavLink>
  </li>
);

const sidebarStyle = {
  width: '220px',
  background: '#2c3e50',
  color: '#fff',
  height: '100vh',
  padding: '20px 15px',
  boxSizing: 'border-box',
};

const linkStyle = {
  fontSize: '16px',
  transition: '0.2s ease-in-out',
};

export default Sidebar;
