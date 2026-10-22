import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '../../store/useCartStore'
import { EmptyState } from '../ui/EmptyState'
import { X, ShoppingCart, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'



export const CartDrawer = ({ isOpen, onClose, onCheckout }) => {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore()
  const totalItems = items.reduce((s, i) => s + i.quantity, 0)
  const totalPrice = items.reduce((s, i) => s + i.product.price * i.quantity, 0)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[99990]"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-[#0b0b14] border-l border-white/10 z-[99995] shadow-2xl flex flex-col text-white"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary-400" />
                <h2 className="font-bold text-lg font-display text-white">
                  Reserved Cart
                  {totalItems > 0 && (
                    <span className="ml-2 text-xs font-mono font-bold text-white bg-primary-500 rounded-full px-2 py-0.5 shadow-md">
                      {totalItems}
                    </span>
                  )}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs font-mono text-rose-400 hover:text-rose-300 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <EmptyState
                  icon={ShoppingCart}
                  title="Your cart is empty"
                  description="Add items from local store inventory to reserve them for express pickup."
                  actionLabel="Explore Stores"
                  onAction={onClose}
                  className="border-0 bg-transparent text-slate-400"
                />
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/10"
                  >
                    <img
                      src={item.product.image_url || item.product.image}
                      alt={item.product.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 border border-white/10"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-xs text-white truncate font-display">{item.product.name}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">{item.product.shopName}</p>
                      <p className="text-sm font-extrabold text-amber-400 mt-1 font-mono">₹{item.product.price * item.quantity}</p>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-slate-400 hover:text-rose-400 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <div className="flex items-center gap-1.5 bg-black/60 border border-white/15 rounded-lg px-2 py-0.5 font-mono text-xs">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-5 h-5 text-slate-400 hover:text-white flex items-center justify-center"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-white font-bold min-w-[16px] text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, Math.min(item.quantity + 1, item.product.stockCount))}
                          className="w-5 h-5 text-slate-400 hover:text-white flex items-center justify-center"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-5 border-t border-white/10 space-y-3 bg-[#0d0d18]">
                <div className="flex items-center justify-between text-sm font-mono font-bold text-slate-300">
                  <span>{totalItems} item{totalItems !== 1 ? 's' : ''} (Pay at Shop)</span>
                  <span className="text-2xl font-extrabold font-display text-white">₹{totalPrice}</span>
                </div>
                <button
                  onClick={onCheckout}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-500 via-amber-500 to-teal-500 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(224,82,54,0.4)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Reserve All for Counter Pickup</span>
                </button>
                <button
                  onClick={handlePayUPI}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,200,100,0.4)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <span>Pay with UPI</span>
                </button>
                <p className="text-[10px] text-center text-slate-500 font-mono">
                  30-min free reservation · Pay cash or UPI at store counter
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
