import { MOCK_SHOPS } from './mockData'
import { axiosClient } from './axiosClient'

const mapShopFromBackend = (s) => ({
  id: s.id,
  name: s.name,
  category: s.category || 'General',
  address: s.address || '',
  distanceKm: s.distanceKm != null ? Number(s.distanceKm.toFixed(1)) : 0.8,
  phone: s.phone || '+91 98221 44556',
  rating: s.avgRating || 4.8,
  reviewsCount: s.reviewCount || 10,
  isOpen: s.isOpen ?? true,
  floodStatus: (s.floodStatus || 'safe').toLowerCase() === 'severe' ? 'alert' : (s.floodStatus || 'safe').toLowerCase(),
  location: { lat: s.latitude || 19.076, lng: s.longitude || 72.8777 },
  image: s.imageUrl || 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500&auto=format&fit=crop&q=60',
  verified: s.verifiedStatus === 'VERIFIED',
  openingHours: s.openingHours || '8:00 AM - 10:00 PM',
})

export const shopService = {
  // Fetch all approved shops with smart backend integration & fallback
  async getShops(category = 'All') {
    try {
      const response = await axiosClient.get('/shops')
      if (Array.isArray(response.data) && response.data.length > 0) {
        let mapped = response.data.map(mapShopFromBackend)
        if (category && category !== 'All') {
          mapped = mapped.filter((s) => s.category.toLowerCase() === category.toLowerCase())
        }
        return mapped
      }
    } catch (e) {
      console.warn('Backend /api/shops unreachable, falling back to mock shops', e?.message)
    }

    if (!category || category === 'All') {
      return MOCK_SHOPS
    }
    return MOCK_SHOPS.filter((shop) => shop.category.toLowerCase() === category.toLowerCase())
  },

  // Fetch shop by ID
  async getShopById(shopId) {
    try {
      const response = await axiosClient.get(`/shops/${shopId}`)
      if (response.data) {
        return mapShopFromBackend(response.data)
      }
    } catch (e) {
      console.warn(`Backend /api/shops/${shopId} unreachable, falling back to mock`, e?.message)
    }
    return MOCK_SHOPS.find((shop) => String(shop.id) === String(shopId)) || null
  },

  // Fetch nearby shops with coordinates
  async getNearbyShops(lat = 19.076, lng = 72.8777, radiusKm = 10.0) {
    try {
      const response = await axiosClient.get('/shops/nearby', {
        params: { lat, lng, radiusKm }
      })
      if (Array.isArray(response.data)) {
        return response.data.map(mapShopFromBackend)
      }
    } catch (e) {
      console.warn('Backend /api/shops/nearby unreachable', e?.message)
    }
    return MOCK_SHOPS
  },

  // Shopkeeper: Fetch own shops
  async getMyShops() {
    try {
      const response = await axiosClient.get('/shopkeeper/shops/mine')
      return response.data.map(mapShopFromBackend)
    } catch (e) {
      console.warn('Failed to fetch shopkeeper shops', e?.message)
      return []
    }
  },

  // Shopkeeper: Register new shop
  async createShop(shopData) {
    try {
      const response = await axiosClient.post('/shopkeeper/shops', shopData)
      return mapShopFromBackend(response.data)
    } catch (e) {
      console.error('Failed to create shop on backend', e)
      throw e
    }
  },

  // Admin: Get pending shop applications
  async getPendingShops() {
    try {
      const response = await axiosClient.get('/admin/shops/pending')
      return response.data.map(mapShopFromBackend)
    } catch (e) {
      console.warn('Backend /api/admin/shops/pending unreachable', e?.message)
      return []
    }
  },

  // Admin: Verify or reject shop
  async verifyShop(shopId, status = 'VERIFIED') {
    try {
      const response = await axiosClient.put(`/admin/shops/${shopId}/verify`, { status })
      return mapShopFromBackend(response.data)
    } catch (e) {
      console.error('Failed to verify shop on backend', e)
      throw e
    }
  },
}
