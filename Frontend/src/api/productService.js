import { MOCK_PRODUCTS } from './mockData'

export const productService = {
  // Fetch all products or filter by category & query
  async getProducts({ query = '', category = 'All', shopId = null } = {}) {
    await new Promise((resolve) => setTimeout(resolve, 200))

    let result = [...MOCK_PRODUCTS]

    if (shopId) {
      result = result.filter((p) => p.shopId === shopId)
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
          p.shopName.toLowerCase().includes(q)
      )
    }

    return result
  },

  // Fetch product by barcode (for vendor scan-to-sell or buyer quick lookup)
  async getProductByBarcode(barcode) {
    await new Promise((resolve) => setTimeout(resolve, 150))
    return MOCK_PRODUCTS.find((p) => p.barcode === barcode) || null
  },
}
