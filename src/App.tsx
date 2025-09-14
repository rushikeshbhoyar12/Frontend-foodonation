import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DonorDashboard from './pages/DonorDashboard';
import ReceiverDashboard from './pages/ReceiverDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DonationDetail from './pages/DonationDetail';
import Profile from './pages/Profile';
import CreateDonation from './pages/CreateDonation';
import LoadingSpinner from './components/LoadingSpinner';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
            <Route
              path="/dashboard"
              element={
                user ? (
                  user.role === 'donor' ? <DonorDashboard /> :
                    user.role === 'receiver' ? <ReceiverDashboard /> :
                      user.role === 'admin' ? <AdminDashboard /> :
                        <Navigate to="/" />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="/donation/:id" element={<DonationDetail />} />
            <Route
              path="/profile"
              element={user ? <Profile /> : <Navigate to="/login" />}
            />
            <Route
              path="/create-donation"
              element={user?.role === 'donor' ? <CreateDonation /> : <Navigate to="/login" />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;