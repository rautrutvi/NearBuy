import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore'
import { useCartStore } from './store/useCartStore'
import { ProtectedRoute } from './components/ProtectedRoute'
import { CartDrawer } from './components/buyer/CartDrawer'
import { CustomCursor } from './components/ui/CustomCursor'
import { Shopping3DBackground } from './components/ui/Shopping3DBackground'
import { StylePreviewPage } from './pages/StylePreviewPage'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { BuyerDashboard } from './pages/buyer/BuyerDashboard'
import { BuyerProfile } from './pages/buyer/BuyerProfile'
import { VendorDashboard } from './pages/vendor/VendorDashboard'
import { BarcodeScanner } from './pages/vendor/BarcodeScanner'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { Store, UserCheck, ShieldCheck, LogOut, LogIn, ShoppingCart, QrCode, User, Home, Palette, Menu, X } from 'lucide-react'

export default function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, role, isAuthenticated, logout } = useAuthStore()
  const { items } = useCartStore()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const cartCount = items.reduce((s, i) => s + i.quantity, 0)

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#050508] text-white relative">
      <CustomCursor />
      <Shopping3DBackground />

      {/* Top Global Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#0b0b14]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-500 to-amber-500 text-white flex items-center justify-center shadow-[0_0_20px_rgba(224,82,54,0.4)] group-hover:scale-105 transition-transform duration-300">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl font-display tracking-tight text-white group-hover:text-primary-400 transition-colors">
                Nearbuy
              </span>
              <span className="text-[10px] block font-mono font-bold text-amber-400 -mt-1 tracking-wider uppercase">
                HYPERLOCAL &amp; RADAR
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl text-xs font-mono font-bold text-slate-300 border border-white/10">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                location.pathname === '/' ? 'bg-white/15 text-white shadow-md' : 'hover:text-white hover:bg-white/5'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              Home
            </Link>

            <Link
              to="/buyer"
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                location.pathname === '/buyer' ? 'bg-primary-600/30 text-primary-300 border border-primary-500/40 shadow-[0_0_15px_rgba(224,82,54,0.3)]' : 'hover:text-white hover:bg-white/5'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              Buyer Shop
            </Link>

            <Link
              to="/vendor"
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                location.pathname === '/vendor' ? 'bg-teal-600/30 text-teal-300 border border-teal-500/40 shadow-[0_0_15px_rgba(13,148,136,0.3)]' : 'hover:text-white hover:bg-white/5'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              Vendor Portal
            </Link>

            <Link
              to="/admin"
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                location.pathname === '/admin' ? 'bg-violet-600/30 text-violet-300 border border-violet-500/40 shadow-[0_0_15px_rgba(139,92,246,0.3)]' : 'hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin
            </Link>

            <Link
              to="/buyer/profile"
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                location.pathname === '/buyer/profile' ? 'bg-white/15 text-white shadow-md' : 'hover:text-white hover:bg-white/5'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Profile
            </Link>

            <Link
              to="/vendor/scan"
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                location.pathname === '/vendor/scan' ? 'bg-white/15 text-white shadow-md' : 'hover:text-white hover:bg-white/5'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              Scanner
            </Link>

            <Link
              to="/style-preview"
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                location.pathname === '/style-preview' ? 'bg-white/15 text-white shadow-md' : 'hover:text-white hover:bg-white/5'
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
              className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-primary-400 border border-white/10 transition-colors shadow-soft"
              title="View Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-primary-500 to-amber-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-md animate-pulse font-mono">
                  {cartCount}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-white font-mono leading-tight">{user?.name || 'Active User'}</p>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase border ${
                    role === 'admin'
                      ? 'bg-violet-950 text-violet-300 border-violet-500/40'
                      : role === 'vendor'
                      ? 'bg-teal-950 text-teal-300 border-teal-500/40'
                      : 'bg-primary-950 text-primary-400 border-primary-500/30'
                  }`}>
                    {role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:bg-rose-950/60 hover:text-rose-300 border border-white/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-amber-500 text-white hover:scale-105 shadow-[0_0_15px_rgba(224,82,54,0.4)] transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 border border-white/10 transition-colors"
              title="Toggle Menu"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-[#0c0c16]/98 backdrop-blur-2xl px-4 py-4 space-y-2 animate-fadeIn shadow-2xl">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-mono text-xs font-bold transition-all ${
                location.pathname === '/' ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <Home className="w-4 h-4 text-slate-400" />
              <span>Home</span>
            </Link>

            <Link
              to="/buyer"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-mono text-xs font-bold transition-all ${
                location.pathname === '/buyer' ? 'bg-primary-600/30 text-primary-300 border border-primary-500/40' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <UserCheck className="w-4 h-4 text-primary-400" />
              <span>Buyer Shop</span>
            </Link>

            <Link
              to="/vendor"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-mono text-xs font-bold transition-all ${
                location.pathname === '/vendor' ? 'bg-teal-600/30 text-teal-300 border border-teal-500/40' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <Store className="w-4 h-4 text-teal-400" />
              <span>Vendor Portal</span>
            </Link>

            <Link
              to="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-mono text-xs font-bold transition-all ${
                location.pathname === '/admin' ? 'bg-violet-600/30 text-violet-300 border border-violet-500/40' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-violet-400" />
              <span>Admin Panel</span>
            </Link>

            <Link
              to="/buyer/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-mono text-xs font-bold transition-all ${
                location.pathname === '/buyer/profile' ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <User className="w-4 h-4 text-amber-400" />
              <span>Profile</span>
            </Link>

            <Link
              to="/vendor/scan"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-mono text-xs font-bold transition-all ${
                location.pathname === '/vendor/scan' ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <QrCode className="w-4 h-4 text-teal-400" />
              <span>Barcode Scanner</span>
            </Link>

            <Link
              to="/style-preview"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-mono text-xs font-bold transition-all ${
                location.pathname === '/style-preview' ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <Palette className="w-4 h-4 text-pink-400" />
              <span>Theme / Design System</span>
            </Link>
          </div>
        )}
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
          <Route path="/" element={<LandingPage />} />
          <Route path="/style-preview" element={<StylePreviewPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Buyer routes */}
          <Route path="/buyer" element={<BuyerDashboard />} />
          <Route
            path="/buyer/profile"
            element={
              <ProtectedRoute allowedRoles={['buyer', 'vendor', 'admin']}>
                <BuyerProfile />
              </ProtectedRoute>
            }
          />

          {/* Vendor routes */}
          <Route
            path="/vendor"
            element={
              <ProtectedRoute allowedRoles={['vendor', 'admin']}>
                <VendorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor/scan"
            element={
              <ProtectedRoute allowedRoles={['vendor', 'admin']}>
                <BarcodeScanner />
              </ProtectedRoute>
            }
          />

          {/* Admin routes strictly locked to rautrutvi@gmail.com */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdminEmail allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {/* Global Footer */}
      <footer className="border-t border-white/10 bg-[#08080f] py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-400 gap-3">
          <div className="flex items-center gap-2 font-bold text-white">
            <div className="w-6 h-6 rounded-lg bg-primary-500 text-white flex items-center justify-center text-xs">
              N
            </div>
            Nearbuy 2026 · Hyperlocal Inventory &amp; Monsoon Radar Platform
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <Link to="/buyer" className="hover:text-primary-400">Buyer Shop</Link>
            <Link to="/vendor" className="hover:text-teal-400">Vendor Portal</Link>
            <Link to="/admin" className="hover:text-violet-400">Admin</Link>
            <Link to="/style-preview" className="hover:text-white">Design System</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
