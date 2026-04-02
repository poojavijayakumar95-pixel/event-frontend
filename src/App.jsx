import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute, AdminRoute, GuestRoute } from './components/auth/ProtectedRoute'
import Navbar from './components/layout/Navbar'

// Pages
import Events      from './pages/Events'
import EventDetail from './pages/EventDetail'
import Login       from './pages/Login'
import Register    from './pages/Register'
import Dashboard   from './pages/Dashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import EventFormPage  from './pages/admin/EventFormPage'
import NotFound    from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          richColors
          theme="dark"
          toastOptions={{
            style: {
              background: '#111109',
              border: '1px solid rgba(232,168,0,0.15)',
              color: '#e8e8d8',
              fontFamily: "'Cabinet Grotesk', sans-serif",
              fontSize: '0.875rem',
              borderRadius: '12px',
            },
          }}
        />

        <Navbar />

        <Routes>
          {/* Public */}
          <Route path="/"           element={<Events />} />
          <Route path="/events"     element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />

          {/* Guest only */}
          <Route path="/login"    element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

          {/* Authenticated */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          {/* Admin only */}
          <Route path="/admin"                  element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/events/new"        element={<AdminRoute><EventFormPage /></AdminRoute>} />
          <Route path="/admin/events/:id/edit"   element={<AdminRoute><EventFormPage /></AdminRoute>} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
