// src/admin/AdminPage.jsx
// This is the /admin route. It shows the login screen first,
// then the dashboard after successful authentication.
// The route is never linked in the public navbar or footer.
import { useAdminAuth } from '../hooks/useAdminAuth';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

export default function AdminPage({
  products, heroImg, storyImg,
  onUpdateProduct, onAddProduct, onDeleteProduct, onProductImageChange,
  onSetHeroImg, onSetStoryImg, onResetDefaults,
}) {
  const { authed, login, logout, error } = useAdminAuth();

  if (!authed) {
    return <AdminLogin onLogin={login} error={error} />;
  }

  return (
    <AdminDashboard
      products={products}
      heroImg={heroImg}
      storyImg={storyImg}
      onUpdateProduct={onUpdateProduct}
      onAddProduct={onAddProduct}
      onDeleteProduct={onDeleteProduct}
      onProductImageChange={onProductImageChange}
      onSetHeroImg={onSetHeroImg}
      onSetStoryImg={onSetStoryImg}
      onResetDefaults={onResetDefaults}
      onLogout={logout}
    />
  );
}
