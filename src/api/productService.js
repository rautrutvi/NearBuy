import { MOCK_PRODUCTS } from './mockData'
import { axiosClient } from './axiosClient'

const mapProductFromBackend = (p) => {
  const stockCount = p.quantity != null ? p.quantity : 10
  let status = 'in_stock'
  if (stockCount === 0 || p.stockLabel === 'OUT') status = 'out_of_stock'
  else if (stockCount <= (p.lowStockThreshold || 5) || p.stockLabel === 'LOW') status = 'low_stock'

  return {
    id: p.id,
    shopId: p.shopId,
    shopName: p.shopName || 'Local Shop',
    name: p.name,
    category: p.category || 'General',
    price: p.price != null ? Number(p.price) : 99,
    stockCount: stockCount,
    status: status,
    barcode: p.barcode || '',
    image: p.imageUrl || 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=500&auto=format&fit=crop&q=60',
    description: p.description || '',
    lowStockThreshold: p.lowStockThreshold || 5,
  }
}

export const productService = {
  // Fetch products with backend search and mock fallback
  async getProducts({ query = '', category = 'All', shopId = null } = {}) {
    try {
      let response
      if (shopId) {
        response = await axiosClient.get(`/shops/${shopId}/products`)
      } else {
        response = await axiosClient.get('/products/search', {
          params: {
            query: query.trim() || undefined,
            category: category !== 'All' ? category : undefined,
          },
        })
      }

      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data.map(mapProductFromBackend)
      }
    } catch (e) {
      console.warn('Backend /api/products unreachable, falling back to mock products', e?.message)
    }

    // Fallback to local mock data
    let result = [...MOCK_PRODUCTS]
    if (shopId) {
      result = result.filter((p) => String(p.shopId) === String(shopId))
    }
    if (category && category !== 'All') {
      result = result.filter((p) => p.category.toLowerCase() === category.toLowerCase())
    }
    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.shopName && p.shopName.toLowerCase().includes(q))
      )
    }
    return result
  },

  // Lookup product by barcode
  async getProductByBarcode(barcode) {
    try {
      const response = await axiosClient.get('/products/search', {
        params: { query: barcode }
      })
      if (Array.isArray(response.data) && response.data.length > 0) {
        const found = response.data.find(p => p.barcode === barcode)
        if (found) return mapProductFromBackend(found)
      }
    } catch (e) {
      console.warn('Barcode search via backend failed', e?.message)
    }
    return MOCK_PRODUCTS.find((p) => p.barcode === barcode) || null
  },

  // Shopkeeper: Get own inventory
  async getMyProducts() {
    try {
      const response = await axiosClient.get('/shopkeeper/products')
      return response.data.map(mapProductFromBackend)
    } catch (e) {
      console.warn('Backend /api/shopkeeper/products unreachable', e?.message)
      return MOCK_PRODUCTS
    }
  },

  // Shopkeeper: Add new product
  async createProduct(productData) {
    try {
      const response = await axiosClient.post('/shopkeeper/products', productData)
      return mapProductFromBackend(response.data)
    } catch (e) {
      console.error('Failed to create product on backend', e)
      throw e
    }
  },

  // Shopkeeper: Update product
  async updateProduct(id, productData) {
    try {
      const response = await axiosClient.put(`/shopkeeper/products/${id}`, productData)
      return mapProductFromBackend(response.data)
    } catch (e) {
      console.error('Failed to update product on backend', e)
      throw e
    }
  },

  // Shopkeeper: Delete product
  async deleteProduct(id) {
    try {
      await axiosClient.delete(`/shopkeeper/products/${id}`)
      return true
    } catch (e) {
      console.error('Failed to delete product on backend', e)
      throw e
    }
  },

  // Shopkeeper: Update stock quantity delta (+1, -1, etc.)
  async updateStock(id, delta) {
    try {
      const response = await axiosClient.patch(`/shopkeeper/products/${id}/stock`, { delta })
      return mapProductFromBackend(response.data)
    } catch (e) {
      console.error('Failed to update stock delta on backend', e)
      throw e
    }
  },

  // Shopkeeper: Barcode scan-to-sell
  async scanAndSell(barcode, quantity = 1) {
    try {
      const response = await axiosClient.post('/shopkeeper/scan-sell', { barcode, quantity })
      return mapProductFromBackend(response.data)
    } catch (e) {
      console.error('Failed scan and sell on backend', e)
      throw e
    }
  },
}
