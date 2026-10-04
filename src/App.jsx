import React, { useState } from 'react'
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore'
import { useCartStore } from './store/useCartStore'
import { ProtectedRoute } from './components/ProtectedRoute'
import { CartDrawer } from './components/buyer/CartDrawer'
import { PageTransition } from './components/ui/PageTransition'
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
import { Store, UserCheck, ShieldCheck, LogOut, LogIn, ShoppingCart, QrCode, User } from 'lucide-react'

export default function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, role, isAuthenticated, logout } = useAuthStore()
  const { items } = useCartStore()
  const [isCartOpen, setIsCartOpen] = useState(false)

  const cartCount = items.reduce((s, i) => s + i.quantity, 0)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Hide global header/footer on the landing page (has its own)
  const isLanding = location.pathname === '/'

  return (
    <div className="min-h-screen flex flex-col bg-surface-50 text-slate-800">
      <CustomCursor />
      {/* Top Global Navigation Bar */}
      {!isLanding && (
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-soft">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
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

            {/* Role-based nav links */}
            {isAuthenticated && (
              <nav className="hidden md:flex items-center gap-1 bg-surface-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
                {role === 'buyer' && (
                  <>
                    <Link to="/buyer" className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${location.pathname === '/buyer' ? 'bg-white shadow-soft text-primary-600 font-bold' : 'hover:text-slate-900'}`}>
                      <UserCheck className="w-3.5 h-3.5" /> Shop
                    </Link>
                    <Link to="/buyer/profile" className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${location.pathname === '/buyer/profile' ? 'bg-white shadow-soft text-primary-600 font-bold' : 'hover:text-slate-900'}`}>
                      <User className="w-3.5 h-3.5" /> Profile
                    </Link>
                  </>
                )}
                {role === 'vendor' && (
                  <>
                    <Link to="/vendor" className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${location.pathname === '/vendor' ? 'bg-white shadow-soft text-safety-600 font-bold' : 'hover:text-slate-900'}`}>
                      <Store className="w-3.5 h-3.5" /> Dashboard
                    </Link>
                    <Link to="/vendor/scan" className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${location.pathname === '/vendor/scan' ? 'bg-white shadow-soft text-safety-600 font-bold' : 'hover:text-slate-900'}`}>
                      <QrCode className="w-3.5 h-3.5" /> Barcode Scan
                    </Link>
                  </>
                )}
                {role === 'admin' && (
                  <Link to="/admin" className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${location.pathname === '/admin' ? 'bg-white shadow-soft text-slate-900 font-bold' : 'hover:text-slate-900'}`}>
                    <ShieldCheck className="w-3.5 h-3.5" /> Admin Panel
                  </Link>
                )}
              </nav>
            )}

            {/* Auth area */}
            <div className="flex items-center gap-2">
              {/* Cart — buyers only */}
              {isAuthenticated && role === 'buyer' && (
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2 rounded-xl bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
                  title="View Cart"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
              )}

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
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => { setIsCartOpen(false); navigate('/buyer') }}
      />

      {/* Main Content with Page Transitions */}
      <main className="flex-1">
        <PageTransition>
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
        </PageTransition>
      </main>

      {/* Global footer — only on inner pages */}
      {!isLanding && (
        <footer className="border-t border-slate-200 bg-white py-5 mt-auto">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <p>© 2026 Nearbuy — Hyperlocal Inventory & Monsoon Safety Platform.</p>
            <p className="font-semibold text-slate-600">React · Vite · Tailwind CSS · Framer Motion</p>
          </div>
        </footer>
      )}
    </div>
  )
}
