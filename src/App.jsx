import React from 'react'
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore'
import { ProtectedRoute } from './components/ProtectedRoute'
import { StylePreviewPage } from './pages/StylePreviewPage'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { BuyerDashboard } from './pages/buyer/BuyerDashboard'
import { VendorDashboard } from './pages/vendor/VendorDashboard'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { Store, UserCheck, ShieldCheck, LogOut, Palette, LogIn } from 'lucide-react'

export default function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, role, isAuthenticated, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface-50 text-slate-800">
      {/* Top Global Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-soft">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/style-preview" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-primary-500 text-white flex items-center justify-center shadow-lift group-hover:scale-105 transition-transform">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg font-display tracking-tight text-slate-900 group-hover:text-primary-600 transition-colors">
                Nearbuy
              </span>
              <span className="text-[10px] block font-semibold text-safety-600 -mt-1">
                Monsoon Safe Hyperlocal
              </span>
            </div>
          </Link>

          {/* Quick Route Links */}
          <nav className="hidden md:flex items-center gap-1 bg-surface-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
            <Link
              to="/style-preview"
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                location.pathname === '/style-preview' ? 'bg-white shadow-soft text-primary-600 font-bold' : 'hover:text-slate-900'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              Theme Preview
            </Link>
            <Link
              to="/buyer"
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                location.pathname === '/buyer' ? 'bg-white shadow-soft text-primary-600 font-bold' : 'hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              Buyer
            </Link>
            <Link
              to="/vendor"
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                location.pathname === '/vendor' ? 'bg-white shadow-soft text-primary-600 font-bold' : 'hover:text-slate-900'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              Vendor
            </Link>
            <Link
              to="/admin"
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                location.pathname === '/admin' ? 'bg-white shadow-soft text-primary-600 font-bold' : 'hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin
            </Link>
          </nav>

          {/* Auth State & User Pill */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-800">{user?.name}</p>
                  <p className="text-[10px] font-semibold text-primary-600 capitalize">Role: {role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-primary-500 text-white hover:bg-primary-600 shadow-lift transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Page Routing Body */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<StylePreviewPage />} />
          <Route path="/style-preview" element={<StylePreviewPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Role-Based Routes */}
          <Route
            path="/buyer"
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <BuyerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor"
            element={
              <ProtectedRoute allowedRoles={['vendor']}>
                <VendorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>© 2026 Nearbuy — Hyperlocal Inventory & Monsoon Flood Radar Platform.</p>
          <p className="font-semibold text-slate-600">Built with React, Vite, Tailwind CSS & Framer Motion</p>
        </div>
      </footer>
    </div>
  )
}
