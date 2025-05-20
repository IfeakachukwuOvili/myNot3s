import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import TopBar from './components/TopBar';
import ForgotPassword from './pages/ForgotPassword';
import NotebookEditor from './pages/Notebook';
import NotebookList from './pages/Notebooks';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/notebooks" replace /> : <Navigate to="/login" replace />;
};

function AppContent() {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(location.pathname);

  return (
    <div className="min-h-screen pt-16 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {!isAuthPage && <TopBar />}
      <div className="container mx-auto px-4">
        <Routes>
          <Route path="/" element={<ProtectedRoute />} />
          <Route path="/login" element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/notebooks" element={<NotebookList />} />
          <Route path="/notebook/new" element={<NotebookEditor />} />
          <Route path="/notebook/:id" element={<NotebookEditor />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;