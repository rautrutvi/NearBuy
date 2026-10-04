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
      <div className="fixed inset-0 z-[99990] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-[#0c0c16] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-white/15 relative text-white"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Product Image */}
          <div className="h-56 w-full bg-slate-900 relative overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4">
              <StockBadge count={product.stockCount} />
            </div>
            <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-xs font-mono text-amber-400">
              {product.category}
            </div>
          </div>

          {/* Product Details */}
          <div className="p-6 space-y-4">
            <div>
              <h3 className="text-xl font-bold font-display text-white leading-tight">{product.name}</h3>
              <p className="text-xs font-mono text-slate-400 mt-1">Available at: <span className="text-teal-400 font-bold">{product.shopName}</span></p>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-mono">{product.description}</p>

            <div className="flex items-center justify-between border-t border-b border-white/10 py-3">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400">Price per unit</span>
                <p className="text-2xl font-extrabold font-display text-amber-400">₹{product.price}</p>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-400">Quantity:</span>
                <div className="flex items-center gap-2 bg-slate-900 border border-white/15 rounded-xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 text-white flex items-center justify-center font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-mono font-bold text-sm text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 text-white flex items-center justify-center font-bold text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Total and 30-min guarantee notice */}
            <div className="flex items-center justify-between text-xs font-mono bg-white/5 p-3 rounded-xl border border-white/10">
              <span className="text-slate-400">Total payable at counter:</span>
              <span className="font-extrabold text-lg text-white font-display">₹{product.price * quantity}</span>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-mono text-teal-400">
              <Clock className="w-4 h-4 shrink-0 animate-pulse" />
              <span>Free 30-minute hold: Stock is reserved for you to collect and pay in cash/UPI.</span>
            </div>

            {/* Action Button */}
            <button
              onClick={handleConfirmReservation}
              disabled={isReserving || isSuccess || product.stockCount <= 0}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-500 via-amber-500 to-teal-500 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(224,82,54,0.4)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Reservation Confirmed!</span>
                </>
              ) : isReserving ? (
                <span>Generating Verification Code...</span>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Confirm Free 30-Min Reservation</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
