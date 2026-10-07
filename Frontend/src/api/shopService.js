import { MOCK_SHOPS } from './mockData'
// import { axiosClient } from './axiosClient' // Ready to swap with real Spring Boot endpoints!

export const shopService = {
  // Fetch all nearby shops
  async getShops(category = 'All') {
    // Simulated network delay
    await new Promise((resolve) => setTimeout(resolve, 200))
    if (!category || category === 'All') {
      return MOCK_SHOPS
    }
    return MOCK_SHOPS.filter((shop) => shop.category.toLowerCase() === category.toLowerCase())
  },

  // Fetch shop by ID
  async getShopById(shopId) {
    await new Promise((resolve) => setTimeout(resolve, 150))
    return MOCK_SHOPS.find((shop) => shop.id === shopId) || null
  },
}
