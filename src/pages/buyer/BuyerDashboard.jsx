import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { StockBadge, FloodBadge } from '../../components/ui/Badge'
import { EmptyState } from '../../components/ui/EmptyState'
import { FloodMap } from '../../components/map/FloodMap'
import { TiltCard3D } from '../../components/ui/TiltCard3D'
import { ProductModal } from '../../components/buyer/ProductModal'
import { ReservationCard } from '../../components/buyer/ReservationCard'
import { ReviewSection } from '../../components/buyer/ReviewSection'
import { useCartStore } from '../../store/useCartStore'

import { shopService } from '../../api/shopService'
import { productService } from '../../api/productService'
import { reservationService } from '../../api/reservationService'
import { floodService } from '../../api/floodService'

import {
  Search, MapPin, Grid, Map as MapIcon, ShieldAlert, ShoppingBag,
  Sparkles, Store, Umbrella, Pill, Wrench, ShoppingBasket, X, Plus, Star,
  Terminal, Radio, Zap
} from 'lucide-react'

export const BuyerDashboard = () => {
  const location = useLocation()
  const [accessAlert, setAccessAlert] = useState(location.state?.message || null)
  const { addItem } = useCartStore()

  const [shops, setShops] = useState([])
  const [products, setProducts] = useState([])
  const [reservations, setReservations] = useState([])
  const [floodReports, setFloodReports] = useState([])
  const [selectedShopForReviews, setSelectedShopForReviews] = useState(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [activeTab, setActiveTab] = useState('grid')

  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const categories = [
    { id: 'All', label: 'All Items', icon: Sparkles },
    { id: 'Monsoon Essentials', label: 'Monsoon Essentials', icon: Umbrella },
    { id: 'Grocery', label: 'Groceries', icon: ShoppingBasket },
    { id: 'Pharmacy', label: 'Medicines', icon: Pill },
    { id: 'Hardware', label: 'Hardware', icon: Wrench },
  ]

  useEffect(() => {
    loadData()
  }, [selectedCategory, searchQuery])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [fetchedShops, fetchedProducts, fetchedRes, fetchedFloods] = await Promise.all([
        shopService.getShops(selectedCategory),
        productService.getProducts({ query: searchQuery, category: selectedCategory }),
        reservationService.getReservations(),
        floodService.getFloodReports(),
      ])
      setShops(fetchedShops)
      setProducts(fetchedProducts)
      setReservations(fetchedRes)
      setFloodReports(fetchedFloods)
    } catch (e) {
      console.error('Failed to load buyer data', e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenReserveModal = (product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleCreateReservation = async (product, quantity) => {
    await reservationService.createReservation({ product, quantity })
    const updatedRes = await reservationService.getReservations()
    setReservations(updatedRes)
  }

  return (
    <div className="min-h-screen bg-[#06060a] text-white px-4 py-8 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[350px] bg-primary-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-96 right-10 w-[450px] h-[400px] bg-teal-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">

        {/* Access Alert */}
        {accessAlert && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-950/70 border border-amber-500/50 p-4 rounded-2xl flex items-center justify-between text-amber-300 text-xs font-mono shadow-[0_0_20px_rgba(245,158,11,0.2)]"
          >
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
              <span>{accessAlert}</span>
            </div>
            <button onClick={() => setAccessAlert(null)} className="text-amber-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Cyber Hero Banner */}
        <div className="relative rounded-3xl p-[1px] bg-gradient-to-r from-primary-500/40 via-amber-500/40 to-teal-500/40 shadow-2xl">
          <div className="bg-[#0c0c14]/90 backdrop-blur-xl p-6 rounded-[23px] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <h1 className="text-2xl md:text-3xl font-extrabold font-display text-white tracking-tight">
                  Nearbuy Local Marketplace
                </h1>
                <FloodBadge level="safe" label="Monsoon Safe Route Active" />
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Real-time stock counts · 30-min pickup reservation · OpenStreetMap flood hazard radar
              </p>
            </div>

            {/* View Switcher: Grid vs Map */}
            <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-white/10 shrink-0">
              <button
                onClick={() => setActiveTab('grid')}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === 'grid'
                    ? 'bg-gradient-to-r from-primary-500 to-amber-500 text-white shadow-[0_0_15px_rgba(224,82,54,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Grid className="w-4 h-4" />
                Grid View
              </button>
              <button
                onClick={() => setActiveTab('map')}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === 'map'
                    ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-[0_0_15px_rgba(13,148,136,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <MapIcon className="w-4 h-4" />
                Monsoon Map
              </button>
            </div>
          </div>
        </div>

        {/* Search & Category Filter Section */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="w-5 h-5 text-slate-500 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Search products, umbrellas, rice, medicines, torches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0d0d16] border border-white/15 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-mono transition-all shadow-inner"
              />
            </div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300 bg-[#0d0d16] px-4 py-3 rounded-2xl border border-white/15">
              <MapPin className="w-4 h-4 text-primary-400 shrink-0 animate-bounce" />
              <span>RADIUS: <strong className="text-white">2.0 KM (WALKING RANGE)</strong></span>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2.5">
            {categories.map((cat) => {
              const Icon = cat.icon
              const isSelected = selectedCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
                    isSelected
                      ? 'bg-primary-600/30 text-primary-300 border-2 border-primary-500 shadow-[0_0_20px_rgba(224,82,54,0.4)] scale-105'
                      : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/10 hover:border-white/25'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Active Reservations Section */}
        {reservations.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary-400" /> Active Pickup Reservations ({reservations.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reservations.map((res) => (
                <div key={res.id} className="rounded-2xl p-[1px] bg-gradient-to-r from-primary-500/50 to-amber-500/50">
                  <div className="bg-[#0d0d18] p-5 rounded-[15px] border border-white/10 space-y-3">
                    <ReservationCard reservation={res} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Content Area: Grid View or Map View */}
        {activeTab === 'map' ? (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <MapIcon className="w-5 h-5 text-teal-400" /> Live Monsoon Hazard &amp; Shop Map
              </h2>
              <span className="text-xs font-mono text-slate-400">OpenStreetMap Telemetry</span>
            </div>
            <div className="rounded-3xl p-[1.5px] bg-gradient-to-r from-teal-500/40 via-sky-500/40 to-primary-500/40 shadow-2xl overflow-hidden">
              <div className="bg-[#0b0b14] p-4 rounded-[22px] border border-white/10">
                <FloodMap
                  shops={shops}
                  floodReports={floodReports}
                  onSelectShop={(shop) => handleOpenReserveModal(products.find(p => p.shopId === shop.id) || products[0])}
                />
              </div>
            </div>
          </section>
        ) : (
          <section className="space-y-8">
            {/* Products Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-amber-400" /> Live Store Products ({products.length})
                </h2>
                <span className="text-xs font-mono text-slate-400">Real-Time Stock Checked</span>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-64 rounded-2xl bg-white/5 animate-pulse border border-white/10" />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <EmptyState
                  icon={Package}
                  title="No items found"
                  description="Try adjusting your search query or selecting a different category."
                  actionLabel="Clear Filters"
                  onAction={() => { setSelectedCategory('All'); setSearchQuery('') }}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <TiltCard3D
                      key={product.id}
                      glowColor="primary"
                      maxTilt={14}
                      scale={1.03}
                      depth={25}
                      className="h-full"
                    >
                      <div className="bg-[#0d0d16] rounded-3xl p-5 space-y-4 border border-white/10 flex flex-col justify-between h-full shadow-2xl">
                        {/* Image & Stock Badge with 3D Pop */}
                        <div
                          style={{ transform: 'translateZ(20px)' }}
                          className="relative h-48 rounded-2xl overflow-hidden bg-slate-900 border border-white/10 group shadow-lg"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-3 right-3 shadow-md">
                            <StockBadge count={product.stockCount} />
                          </div>
                          <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[10px] font-mono text-amber-400">
                            {product.category}
                          </div>
                        </div>

                        {/* Title & Shop Details */}
                        <div style={{ transform: 'translateZ(15px)' }} className="space-y-1">
                          <h3 className="font-bold text-base font-display text-white truncate">
                            {product.name}
                          </h3>
                          <p className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
                            <Store className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                            <span className="truncate">{product.shopName}</span>
                          </p>
                        </div>

                        {/* Price & Actions with 3D Elevation */}
                        <div
                          style={{ transform: 'translateZ(20px)' }}
                          className="pt-3 border-t border-white/10 flex items-center justify-between gap-2"
                        >
                          <div>
                            <span className="text-[10px] font-mono text-slate-400 block">Price</span>
                            <span className="text-xl font-extrabold font-display text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                              ₹{product.price}
                            </span>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => addItem(product)}
                              disabled={product.stockCount <= 0}
                              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/15 text-white font-mono text-xs font-bold transition-all flex items-center gap-1 hover:scale-105 active:scale-95"
                              title="Add to Cart"
                            >
                              <Plus className="w-3.5 h-3.5 text-primary-400" />
                              Cart
                            </button>

                            <button
                              onClick={() => handleOpenReserveModal(product)}
                              disabled={product.stockCount <= 0}
                              className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-amber-500 text-white font-mono text-xs font-bold shadow-[0_0_15px_rgba(224,82,54,0.4)] hover:shadow-[0_0_25px_rgba(224,82,54,0.7)] transition-all hover:scale-105 active:scale-95"
                            >
                              Reserve
                            </button>
                          </div>
                        </div>
                      </div>
                    </TiltCard3D>
                  ))}
                </div>
              )}
            </div>

            {/* Verified Nearby Shops Section */}
            <div className="pt-8 border-t border-white/10 space-y-4">
              <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <Store className="w-5 h-5 text-teal-400" /> Verified Neighborhood Shops
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {shops.map((shop) => (
                  <TiltCard3D key={shop.id} glowColor="teal" maxTilt={10} scale={1.02} depth={15}>
                    <div className="rounded-3xl p-5 bg-[#0d0d16] border border-white/10 flex gap-4 items-center shadow-xl">
                      <img
                        src={shop.image}
                        alt={shop.name}
                        style={{ transform: 'translateZ(15px)' }}
                        className="w-24 h-24 rounded-2xl object-cover shrink-0 border border-white/10 shadow-md"
                      />
                      <div className="space-y-1.5 flex-1 min-w-0" style={{ transform: 'translateZ(10px)' }}>
                        <div className="flex items-center justify-between gap-1">
                          <h3 className="font-bold text-sm text-white font-display truncate">{shop.name}</h3>
                          <FloodBadge level={shop.floodStatus} />
                        </div>
                        <p className="text-xs text-slate-400 truncate font-mono">{shop.address}</p>
                        <div className="flex items-center gap-3 text-xs font-mono text-slate-300">
                          <span>📍 {shop.distanceKm} km</span>
                          <span className="text-amber-400 font-bold">★ {shop.rating} ({shop.reviewsCount})</span>
                          <span className={shop.isOpen ? 'text-emerald-400 font-bold' : 'text-rose-400'}>
                            {shop.isOpen ? '● Open Now' : '○ Closed'}
                          </span>
                        </div>
                        <button
                          onClick={() => setSelectedShopForReviews(selectedShopForReviews?.id === shop.id ? null : shop)}
                          className="text-xs font-mono font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 pt-1"
                        >
                          <Star className="w-3.5 h-3.5" />
                          {selectedShopForReviews?.id === shop.id ? 'Hide Reviews' : 'View & Write Reviews'}
                        </button>
                      </div>
                    </div>
                  </TiltCard3D>
                ))}
              </div>
            </div>

            {/* Expandable Reviews Section */}
            {selectedShopForReviews && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-6 border-t border-white/10 space-y-4"
              >
                <h3 className="text-lg font-bold font-display text-white">
                  Customer Reviews — {selectedShopForReviews.name}
                </h3>
                <div className="bg-[#0d0d18] p-6 rounded-3xl border border-white/10">
                  <ReviewSection shopId={selectedShopForReviews.id} />
                </div>
              </motion.div>
            )}
          </section>
        )}

        {/* Product Modal */}
        <ProductModal
          isOpen={isModalOpen}
          product={selectedProduct}
          onClose={() => setIsModalOpen(false)}
          onReserve={handleCreateReservation}
        />
      </div>
    </div>
  )
}
