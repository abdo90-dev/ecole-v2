import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { User } from './types/index';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/layout/Layout';
import { LoginForm } from './components/auth/LoginForm';
import { Dashboard } from './components/dashboard/Dashboard';
import { StudentList } from './components/students/StudentList';
import { SpecialtyList } from './components/specialties/SpecialtyList';
import { StudentProfile } from './components/profile/StudentProfile';

const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ 
  children, 
  adminOnly = false 
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
// console.log("user"+user);

  if (!user) {
    console.log("user"+user);
    return <Navigate to="/login" replace />;
    
  }

  if (adminOnly && user.role !== 'admin') {
    // console.log("user"+user);
    return <Navigate to="/dashboard" replace />;

  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

        <Route path="*" element={<Navigate to="/dashboard" replace />} />

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    // console.log("user"+user);
    return <LoginForm />;
  }

  return (
    <Layout>
      <Routes>
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/students" 
          element={
            <ProtectedRoute adminOnly>
              <StudentList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/specialties" 
          element={
            <ProtectedRoute adminOnly>
              <SpecialtyList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <StudentProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900">Paramètres</h2>
                <p className="text-gray-600 mt-2">Cette page est en cours de développement</p>
              </div>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/" 
          element={
            <Navigate to="/dashboard" replace />
          } 
        />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;