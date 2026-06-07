import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import CollabRoom from './pages/CollabRoom';
import Explore from './pages/Explore';
import Layout from './components/layout/Layout';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-cream">
      <div className="text-muted font-dm">Loading...</div>
    </div>
  );
  return user ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={
        <PrivateRoute>
          <Layout>
            <Feed />
          </Layout>
        </PrivateRoute>
      } />
      <Route path="/explore" element={
        <PrivateRoute>
          <Layout>
            <Explore />
          </Layout>
        </PrivateRoute>
      } />
      <Route path="/profile/:id" element={
        <PrivateRoute>
          <Layout>
            <Profile />
          </Layout>
        </PrivateRoute>
      } />
      <Route path="/collab/:id" element={
        <PrivateRoute>
          <Layout>
            <CollabRoom />
          </Layout>
        </PrivateRoute>
      } />
    </Routes>
  );
}