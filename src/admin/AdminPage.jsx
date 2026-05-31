// src/admin/AdminPage.jsx
import { useAdminAuth } from '../hooks/useAdminAuth';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

export default function AdminPage({
  products, heroImg, storyImg, logoImg,
  onUpdateProduct, onAddProduct, onDeleteProduct, onProductImageChange,
  onSetHeroImg, onSetStoryImg, onSetLogoImg, onResetDefaults,
}) {
  const { authed, login, logout, error } = useAdminAuth();

  if (!authed) return <AdminLogin onLogin={login} error={error} />;

  return (
    <AdminDashboard
      products={products} heroImg={heroImg} storyImg={storyImg} logoImg={logoImg}
      onUpdateProduct={onUpdateProduct} onAddProduct={onAddProduct}
      onDeleteProduct={onDeleteProduct} onProductImageChange={onProductImageChange}
      onSetHeroImg={onSetHeroImg} onSetStoryImg={onSetStoryImg} onSetLogoImg={onSetLogoImg}
      onResetDefaults={onResetDefaults} onLogout={logout}
    />
  );
}
