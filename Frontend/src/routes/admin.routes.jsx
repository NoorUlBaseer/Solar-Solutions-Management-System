import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/admin/Dashboard';
import Analytics from '../pages/admin/Analytics';
import Orders from '../pages/admin/orders/Orders';
import Installations from '../pages/admin/Installations';
import Services from '../pages/admin/Services';
import UsersPage from '../pages/admin/users/UsersPage';
import SellersPage from '../pages/admin/sellers/SellersPage';
import ProductPage from '../pages/admin/verifyProduct/ProductPage';
import SurveyPage from '../pages/admin/survey/SurveyPage';
import Support from '../pages/admin/Support';
import Security from '../pages/admin/Security';
import Settings from '../pages/admin/Settings.jsx';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="analytics" element={<Analytics />} />
      <Route path="users" element={<UsersPage />} />
      <Route path="sellers" element={<SellersPage />} />
      <Route path="orders" element={<Orders />} />
      <Route path="installations" element={<Installations />} />
      <Route path="services" element={<Services />} />
      <Route path="verifyProduct" element={<ProductPage />} />
      <Route path="survey" element={<SurveyPage />} />
      <Route path="support" element={<Support />} />
      <Route path="security" element={<Security />} />
      <Route path="settings" element={<Settings />} />
    </Routes>
  );
};

export default AdminRoutes;