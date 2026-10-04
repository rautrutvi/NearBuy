import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '../../store/useCartStore'
import { Button } from '../ui/Button'
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
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary-500" />
                <h2 className="font-bold text-lg font-display text-slate-900">
                  Your Cart
                  {totalItems > 0 && (
                    <span className="ml-2 text-sm font-bold text-white bg-primary-500 rounded-full px-2 py-0.5">{totalItems}</span>
                  )}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button onClick={clearCart}
                    className="text-xs text-rose-500 font-semibold hover:text-rose-700 flex items-center gap-1">
                    <Trash2 className="w-3.5 h-3.5" /> Clear
                  </button>
                )}
                <button onClick={onClose}
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors">
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
                  description="Add items from nearby shops to reserve them for pickup."
                  actionLabel="Browse Local Shops"
                  onAction={onClose}
                  className="border-0 bg-transparent"
                />
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    className="flex items-center gap-3 p-3 bg-surface-50 rounded-2xl border border-slate-100"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-xs text-slate-900 truncate font-display">{item.product.name}</h4>
                      <p className="text-[10px] text-slate-500">{item.product.shopName}</p>
                      <p className="text-sm font-extrabold text-slate-900 mt-1">₹{item.product.price * item.quantity}</p>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <button onClick={() => removeItem(item.product.id)}
                        className="text-slate-300 hover:text-rose-500 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-1.5 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-5 h-5 text-slate-600 hover:text-slate-900 flex items-center justify-center"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-slate-900 min-w-[16px] text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, Math.min(item.quantity + 1, item.product.stockCount))}
                          className="w-5 h-5 text-slate-600 hover:text-slate-900 flex items-center justify-center"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer: Total + Checkout */}
            {items.length > 0 && (
              <div className="p-5 border-t border-slate-100 space-y-3 bg-white">
                <div className="flex items-center justify-between text-sm font-bold text-slate-800">
                  <span>{totalItems} item{totalItems !== 1 ? 's' : ''} · Payable at Shop</span>
                  <span className="text-xl font-extrabold font-display text-slate-900">₹{totalPrice}</span>
                </div>
                <Button variant="primary" className="w-full py-3" icon={ShoppingBag} onClick={onCheckout}>
                  Reserve All Items for Pickup
                </Button>
                <p className="text-[10px] text-center text-slate-400 font-medium">
                  30-minute free pickup reservation · Pay cash at counter
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
