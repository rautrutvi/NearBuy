import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../ui/Button'
import { StockBadge } from '../ui/Badge'
import { X, ShoppingBag, ShieldCheck, Clock, Check } from 'lucide-react'

export const ProductModal = ({ product, isOpen, onClose, onReserve }) => {
  const [quantity, setQuantity] = useState(1)
  const [isReserving, setIsReserving] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  if (!isOpen || !product) return null

  const handleConfirmReservation = async () => {
    setIsReserving(true)
    await onReserve(product, quantity)
    setIsReserving(false)
    setIsSuccess(true)
    setTimeout(() => {
      setIsSuccess(false)
      onClose()
    }, 1500)
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 relative"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors shadow-soft"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Product Image */}
          <div className="h-52 w-full bg-slate-100 relative overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4">
              <StockBadge count={product.stockCount} />
            </div>
          </div>

          {/* Product Details */}
          <div className="p-6 space-y-4">
            <div>
              <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider">{product.category}</span>
              <h3 className="text-xl font-bold font-display text-slate-900 leading-tight mt-0.5">{product.name}</h3>
              <p className="text-xs font-semibold text-slate-500 mt-1">Available at: <span className="text-slate-800">{product.shopName}</span></p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{product.description}</p>

            <div className="flex items-center justify-between border-t border-b border-slate-100 py-3">
              <div>
                <span className="text-xs text-slate-400 block">Unit Price</span>
                <span className="text-2xl font-extrabold font-display text-slate-900">₹{product.price}</span>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-3 bg-surface-100 px-3 py-1.5 rounded-xl border border-slate-200">
                <span className="text-xs font-semibold text-slate-600">Qty:</span>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-6 h-6 rounded-md bg-white text-slate-700 text-sm font-bold shadow-soft flex items-center justify-center hover:bg-slate-50"
                >
                  -
                </button>
                <span className="text-sm font-bold text-slate-900 min-w-[16px] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                  className="w-6 h-6 rounded-md bg-white text-slate-700 text-sm font-bold shadow-soft flex items-center justify-center hover:bg-slate-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Pickup Info Banner */}
            <div className="bg-safety-50 p-3 rounded-2xl border border-safety-200 flex items-start gap-2.5 text-xs text-safety-900">
              <Clock className="w-4 h-4 text-safety-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">30-Minute Free Shop Reservation</strong>
                <span>Reserving holds live stock for 30 minutes. Pay directly at shop upon pickup!</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                icon={isSuccess ? Check : ShoppingBag}
                isLoading={isReserving}
                disabled={product.stockCount <= 0 || isSuccess}
                onClick={handleConfirmReservation}
              >
                {isSuccess ? 'Reserved!' : `Reserve for ₹${product.price * quantity}`}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
