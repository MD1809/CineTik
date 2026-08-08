import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import MainLayout from '../components/layout/MainLayout';
import AdminLayout from '../components/layout/AdminLayout';
import StaffLayout from '../components/layout/StaffLayout';
import ProtectedRoute from './ProtectedRoute';

import HomePage from '../pages/HomePage';
import MovieDetailPage from '../pages/MovieDetailPage';
import BookingSeatPage from '../pages/BookingSeatPage';
import CheckoutPage from '../pages/CheckoutPage';
import VNPayMockPage from '../pages/VNPayMockPage';
import PaymentResultPage from '../pages/PaymentResultPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import MyTicketsPage from '../pages/MyTicketsPage';
import StaffCheckinPage from '../pages/StaffCheckinPage';

export default function AppRoutes() {
  return (
    <AuthProvider>
      <Routes>
        {/* Customer Public Routes wrapped in MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<HomePage />} />
          <Route path="/movies/:id" element={<MovieDetailPage />} />
          <Route path="/showtimes" element={<HomePage />} />
          <Route path="/booking/showtime/:showtimeId" element={<BookingSeatPage />} />
          <Route path="/booking/checkout" element={<CheckoutPage />} />
          <Route path="/payments/vnpay/mock-pay-page" element={<VNPayMockPage />} />
          <Route path="/payment/result" element={<PaymentResultPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Customer Protected Route */}
          <Route
            path="/my-tickets"
            element={
              <ProtectedRoute>
                <MyTicketsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Staff Protected Routes wrapped in StaffLayout */}
        <Route
          element={
            <ProtectedRoute allowedRoles={['STAFF', 'ADMIN']}>
              <StaffLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/staff/checkin" element={<StaffCheckinPage />} />
        </Route>

        {/* Catch-all fallback */}
        <Route path="*" element={<MainLayout><HomePage /></MainLayout>} />
      </Routes>
    </AuthProvider>
  );
}
