// src/admin/AdminPage.jsx
import { useAdminAuth } from '../hooks/useAdminAuth';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

export default function AdminPage({ products, onRefresh, site, onSiteChange }) {
  const { authed, login, logout, error } = useAdminAuth();

  if (!authed) return <AdminLogin onLogin={login} error={error} />;

  return (
    <AdminDashboard
      products={products}
      site={site}
      onRefresh={onRefresh}
      onSiteChange={onSiteChange}
      onLogout={logout}
    />
  );
}
