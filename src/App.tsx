
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

// Core components
import AppLayout from './components/AppLayout';
import AuthGuard from './components/authGuard';

// Pages
import Index from './pages/Index';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Credits from './pages/Credits';
import AdminDashboard from './pages/AdminDashboard';
import AdminReports from './pages/AdminReports';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <AuthGuard>
            <AppLayout />
          </AuthGuard>
        }>
          <Route index element={<Home />} />
          <Route path="profile" element={
            <AuthGuard requireAuth>
              <Profile />
            </AuthGuard>
          } />
          <Route path="credits" element={
            <AuthGuard requireAuth>
              <Credits />
            </AuthGuard>
          } />
          <Route path="admin" element={
            <AuthGuard requireAuth requireAdmin>
              <AdminDashboard />
            </AuthGuard>
          } />
          <Route path="admin/reports" element={
            <AuthGuard requireAuth requireModerator>
              <AdminReports />
            </AuthGuard>
          } />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/login" element={
          <AuthGuard>
            <Login />
          </AuthGuard>
        } />
        <Route path="/register" element={
          <AuthGuard>
            <Register />
          </AuthGuard>
        } />
      </Routes>
      <Toaster position="top-right" richColors />
    </Router>
  );
}

export default App;