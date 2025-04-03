import { Navigate, Route, Routes } from 'react-router-dom';
import MyOrders from '../pages/MyOrders';
import OrderForm from '../pages/OrderForm';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/my-orders" />} />
      <Route path="/my-orders" element={<MyOrders />} />
      <Route path="/add-order" element={<OrderForm />} />
      <Route path="/add-order/:id" element={<OrderForm />} />
    </Routes>
  );
}
