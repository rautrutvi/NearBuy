import React, { useState } from 'react'
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore'
import { useCartStore } from './store/useCartStore'
import { ProtectedRoute } from './components/ProtectedRoute'
import { CartDrawer } from './components/buyer/CartDrawer'
import { CustomCursor } from './components/ui/CustomCursor'
import { StylePreviewPage } from './pages/StylePreviewPage'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { BuyerDashboard } from './pages/buyer/BuyerDashboard'
import { BuyerProfile } from './pages/buyer/BuyerProfile'
import { VendorDashboard } from './pages/vendor/VendorDashboard'
import { BarcodeScanner } from './pages/vendor/BarcodeScanner'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { Store, UserCheck, ShieldCheck, LogOut, LogIn, ShoppingCart, QrCode, User, Home, Palette } from 'lucide-react'

export default function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, role, isAuthenticated, login, logout } = useAuthStore()
  const { items } = useCartStore()
  const [isCartOpen, setIsCartOpen] = useState(false)

  const cartCount = items.reduce((s, i) => s + i.quantity, 0)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleQuickRole = (newRole) => {
    login({ name: `Demo ${newRole.toUpperCase()}`, email: `${newRole}@nearbuy.in` }, newRole)
    if (newRole === 'buyer') navigate('/buyer')
    else if (newRole === 'vendor') navigate('/vendor')
    else if (newRole === 'admin') navigate('/admin')
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <CustomCursor />

      {/* Top Global Navigation Bar - Always visible & accessible */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-500 to-amber-500 text-white flex items-center justify-center shadow-lift group-hover:scale-105 transition-transform duration-300">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl font-display tracking-tight text-slate-900 group-hover:text-primary-600 transition-colors">
                Nearbuy
              </span>
              <span className="text-[10px] block font-semibold text-safety-600 -mt-1 tracking-wider uppercase">
                Hyperlocal &amp; Safety
              </span>
            </div>
          </Link>

          {/* Navigation Links - Always Accessible */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl text-xs font-semibold text-slate-600 border border-slate-200/60">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                location.pathname === '/' ? 'bg-white shadow-soft text-primary-600 font-bold' : 'hover:text-slate-900'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              Home
            </Link>

            <Link
              to="/buyer"
              onClick={() => handleQuickRole('buyer')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                location.pathname === '/buyer' ? 'bg-white shadow-soft text-primary-600 font-bold' : 'hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              Buyer Shop
            </Link>

            <Link
              to="/vendor"
              onClick={() => handleQuickRole('vendor')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                location.pathname === '/vendor' ? 'bg-white shadow-soft text-safety-600 font-bold' : 'hover:text-slate-900'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              Vendor Portal
            </Link>

            <Link
              to="/admin"
              onClick={() => handleQuickRole('admin')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                location.pathname === '/admin' ? 'bg-white shadow-soft text-violet-600 font-bold' : 'hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin
            </Link>

            <Link
              to="/buyer/profile"
              onClick={() => handleQuickRole('buyer')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                location.pathname === '/buyer/profile' ? 'bg-white shadow-soft text-primary-600 font-bold' : 'hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Profile
            </Link>

            <Link
              to="/vendor/scan"
              onClick={() => handleQuickRole('vendor')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                location.pathname === '/vendor/scan' ? 'bg-white shadow-soft text-safety-600 font-bold' : 'hover:text-slate-900'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              Scanner
            </Link>

            <Link
              to="/style-preview"
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                location.pathname === '/style-preview' ? 'bg-white shadow-soft text-slate-900 font-bold' : 'hover:text-slate-900'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              Theme
            </Link>
          </nav>

          {/* Right Action Icons: Cart, Role Switcher, Auth */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors shadow-soft"
              title="View Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-primary-500 to-amber-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-800 leading-tight">{user?.name || 'Active User'}</p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-primary-100 text-primary-700">
                    {role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-primary-500 text-white hover:bg-primary-600 shadow-lift transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Cart Drawer Panel */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => {
          setIsCartOpen(false)
          navigate('/buyer')
        }}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/style-preview" element={<StylePreviewPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Buyer routes */}
          <Route path="/buyer" element={<ProtectedRoute allowedRoles={['buyer']}><BuyerDashboard /></ProtectedRoute>} />
          <Route path="/buyer/profile" element={<ProtectedRoute allowedRoles={['buyer']}><BuyerProfile /></ProtectedRoute>} />

          {/* Vendor routes */}
          <Route path="/vendor" element={<ProtectedRoute allowedRoles={['vendor']}><VendorDashboard /></ProtectedRoute>} />
          <Route path="/vendor/scan" element={<ProtectedRoute allowedRoles={['vendor']}><BarcodeScanner /></ProtectedRoute>} />

          {/* Admin routes */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </main>

      {/* Global Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center gap-2 font-display font-bold text-slate-800">
            <div className="w-6 h-6 rounded-lg bg-primary-500 text-white flex items-center justify-center text-xs">
              N
            </div>
            Nearbuy 2026 · Hyperlocal Inventory &amp; Monsoon Radar Platform
          </div>
          <div className="flex items-center gap-4 font-medium text-slate-500">
            <Link to="/buyer" onClick={() => handleQuickRole('buyer')} className="hover:text-primary-600">Buyer Shop</Link>
            <Link to="/vendor" onClick={() => handleQuickRole('vendor')} className="hover:text-safety-600">Vendor Portal</Link>
            <Link to="/admin" onClick={() => handleQuickRole('admin')} className="hover:text-violet-600">Admin</Link>
            <Link to="/style-preview" className="hover:text-slate-800">Design System</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
