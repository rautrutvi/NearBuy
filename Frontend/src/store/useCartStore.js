import { create } from 'zustand'

export const useCartStore = create((set, get) => ({
  items: [], // { product, quantity }

  addItem: (product, quantity = 1) => {
    const existing = get().items.find((i) => i.product.id === product.id)
    if (existing) {
      set({
        items: get().items.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: Math.min(i.quantity + quantity, product.stockCount) }
            : i
        ),
      })
    } else {
      set({ items: [...get().items, { product, quantity }] })
    }
  },

  removeItem: (productId) => {
    set({ items: get().items.filter((i) => i.product.id !== productId) })
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId)
      return
    }
    set({
      items: get().items.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i
      ),
    })
  },

  clearCart: () => set({ items: [] }),

  get totalItems() {
    return get().items.reduce((sum, i) => sum + i.quantity, 0)
  },

  get totalPrice() {
    return get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  },
}))
