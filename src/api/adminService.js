import { axiosClient } from './axiosClient'
import { shopService } from './shopService'
import { floodService } from './floodService'

export const adminService = {
  // Fetch platform stats
  async getAdminStats() {
    try {
      const response = await axiosClient.get('/admin/stats')
      return response.data
    } catch (e) {
      console.warn('Backend /api/admin/stats unreachable, returning mock stats', e?.message)
      return {
        totalUsers: 1284,
        totalShops: 48,
        pendingShops: 2,
        activeFloodZones: 3,
        pendingFloodZones: 2,
        totalReservations: 237,
      }
    }
  },

  // Shop management
  getPendingShops: shopService.getPendingShops,
  verifyShop: shopService.verifyShop,

  // Flood zone management
  getPendingFloodZones: floodService.getPendingFloodZones,
  verifyFloodZone: floodService.verifyFloodZone,

  // User management
  async getUsers(page = 0, size = 10) {
    try {
      const response = await axiosClient.get('/admin/users', {
        params: { page, size }
      })
      return response.data
    } catch (e) {
      console.warn('Backend /api/admin/users unreachable', e?.message)
      return { content: [], totalElements: 0 }
    }
  },

  // Suspend / activate user
  async updateUserStatus(userId, active) {
    try {
      const response = await axiosClient.put(`/admin/users/${userId}/status`, { active })
      return response.data
    } catch (e) {
      console.error('Failed to update user status on backend', e)
      throw e
    }
  },
}
