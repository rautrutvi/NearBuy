import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { StockBadge, FloodBadge } from '../../components/ui/Badge'
import { EmptyState } from '../../components/ui/EmptyState'
import { FloodMap } from '../../components/map/FloodMap'
import { ProductModal } from '../../components/buyer/ProductModal'
import { ReservationCard } from '../../components/buyer/ReservationCard'

import { shopService } from '../../api/shopService'
import { productService } from '../../api/productService'
import { reservationService } from '../../api/reservationService'
import { floodService } from '../../api/floodService'

import {
  Search,
  MapPin,
  Grid,
  Map as MapIcon,
  ShieldAlert,
  ShoppingBag,
  Sparkles,
  Store,
  Umbrella,
  Pill,
  Wrench,
  ShoppingBasket,
  X,
} from 'lucide-react'

export const BuyerDashboard = () => {
  const location = useLocation()
  const [accessAlert, setAccessAlert] = useState(location.state?.message || null)

  const [shops, setShops] = useState([])
  const [products, setProducts] = useState([])
  const [reservations, setReservations] = useState([])
  const [floodReports, setFloodReports] = useState([])

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [activeTab, setActiveTab] = useState('grid') // 'grid' or 'map'

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

  // Load data on mount
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
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Access Denied Alert Banner */}
      {accessAlert && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex items-center justify-between text-rose-800 text-xs font-semibold shadow-soft"
        >
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{accessAlert}</span>
          </div>
          <button onClick={() => setAccessAlert(null)} className="text-rose-500 hover:text-rose-800">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-soft">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold font-display text-slate-900">Nearbuy Local Marketplace</h1>
            <FloodBadge level="safe" label="Monsoon Safe Route Active" />
          </div>
          <p className="text-xs text-slate-500">Find real-time stock at nearby shops with monsoon flood safety guidance.</p>
        </div>

        {/* View Switcher: Grid vs Map */}
        <div className="flex items-center gap-1 bg-surface-100 p-1.5 rounded-2xl self-start md:self-auto border border-slate-200">
          <button
            onClick={() => setActiveTab('grid')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'grid' ? 'bg-white shadow-soft text-primary-600 font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Grid className="w-4 h-4" />
            Grid View
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'map' ? 'bg-white shadow-soft text-safety-600 font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            Monsoon Map
          </button>
        </div>
      </div>

      {/* Search & Category Filter Section */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              icon={Search}
              placeholder="Search products, umbrellas, rice, medicines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white px-4 py-2.5 rounded-xl border border-slate-200">
            <MapPin className="w-4 h-4 text-primary-500 shrink-0" />
            <span>Search Radius: <strong className="text-slate-900">Within 2.0 km</strong></span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon
            const isSelected = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-primary-500 text-white shadow-lift'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
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
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-display text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary-500" /> Your Pickup Reservations ({reservations.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reservations.map((res) => (
              <ReservationCard key={res.id} reservation={res} />
            ))}
          </div>
        </section>
      )}

      {/* Main Content Area: Grid View or Map View */}
      {activeTab === 'map' ? (
        <section className="space-y-3">
          <h2 className="text-lg font-bold font-display text-slate-900 flex items-center gap-2">
            <MapIcon className="w-5 h-5 text-safety-600" /> Interactive Flood Safety & Shop Map
          </h2>
          <FloodMap shops={shops} floodReports={floodReports} />
        </section>
      ) : (
        <section className="space-y-6">
          {/* Product Inventory Grid */}
          <div>
            <h2 className="text-lg font-bold font-display text-slate-900 mb-4">Available Local Products</h2>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-64 rounded-2xl bg-slate-200 animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <EmptyState
                title="No Products Match Your Search"
                description="Try changing your search term or select 'All Items' from category filters."
                actionLabel="Reset Search"
                onAction={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map((product) => (
                  <Card key={product.id} className="flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      {/* Product Image & Stock Badge */}
                      <div className="h-44 w-full rounded-xl bg-slate-100 overflow-hidden relative">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        <div className="absolute top-2.5 left-2.5">
                          <StockBadge count={product.stockCount} />
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wider">{product.category}</span>
                        <h3 className="font-bold text-base font-display text-slate-900 leading-snug line-clamp-1">{product.name}</h3>
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                          <Store className="w-3.5 h-3.5 text-slate-400" /> {product.shopName}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Price</span>
                        <span className="text-xl font-extrabold font-display text-slate-900">₹{product.price}</span>
                      </div>

                      <Button
                        variant="primary"
                        size="sm"
                        icon={ShoppingBag}
                        disabled={product.stockCount <= 0}
                        onClick={() => handleOpenReserveModal(product)}
                      >
                        Reserve
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Nearby Shops Section */}
          <div className="pt-6 border-t border-slate-200">
            <h2 className="text-lg font-bold font-display text-slate-900 mb-4">Verified Nearby Shops</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shops.map((shop) => (
                <Card key={shop.id} className="flex gap-4 items-center">
                  <img src={shop.image} alt={shop.name} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-bold text-sm text-slate-900 font-display truncate">{shop.name}</h3>
                      <FloodBadge level={shop.floodStatus} />
                    </div>
                    <p className="text-xs text-slate-500 truncate">{shop.address}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-600 pt-1 font-medium">
                      <span>📍 {shop.distanceKm} km</span>
                      <span>★ {shop.rating} ({shop.reviewsCount})</span>
                      <span className={shop.isOpen ? 'text-emerald-600 font-bold' : 'text-rose-500'}>
                        {shop.isOpen ? 'Open Now' : 'Closed'}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Product Detail & Reservation Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onReserve={handleCreateReservation}
      />
    </div>
  )
}
