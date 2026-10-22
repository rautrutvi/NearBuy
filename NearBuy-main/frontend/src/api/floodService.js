import { MOCK_FLOOD_REPORTS } from './mockData'
import { axiosClient } from './axiosClient'

const mapFloodFromBackend = (f) => {
  const sev = (f.severity || 'MODERATE').toUpperCase()
  const status = sev === 'SEVERE' ? 'alert' : sev === 'LOW' ? 'safe' : 'watch'
  return {
    id: f.id,
    area: f.areaName,
    areaName: f.areaName,
    waterLevel: f.waterDepthCm ? `${f.waterDepthCm} cm` : 'Moderate (20 cm)',
    waterDepthCm: f.waterDepthCm || 20,
    severity: sev.toLowerCase(),
    status: status,
    location: { lat: f.latitude || 19.076, lng: f.longitude || 72.8777 },
    radiusMeters: f.radiusKm ? Math.round(f.radiusKm * 1000) : 500,
    reportedAt: f.reportedAt || 'Just now',
    verified: f.status === 'ACTIVE',
    verifiedByAdmin: f.status === 'ACTIVE',
    reportedBy: f.reportedByName || 'Community Member',
  }
}

export const floodService = {
  // Fetch active flood & waterlogging reports
  async getFloodReports() {
    try {
      const response = await axiosClient.get('/flood-zones/active')
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data.map(mapFloodFromBackend)
      }
    } catch (e) {
      console.warn('Backend /api/flood-zones/active unreachable, using mock reports', e?.message)
    }
    return MOCK_FLOOD_REPORTS
  },

  // Submit flood report
  async reportFlood(reportData) {
    try {
      const response = await axiosClient.post('/reports/flood', {
        areaName: reportData.areaName || reportData.area,
        latitude: reportData.latitude || reportData.lat || 19.076,
        longitude: reportData.longitude || reportData.lng || 72.8777,
        radiusKm: reportData.radiusKm || 0.5,
        severity: (reportData.severity || 'MODERATE').toUpperCase(),
        waterDepthCm: reportData.waterDepthCm || 25,
        description: reportData.description || 'Waterlogging report',
      })
      return mapFloodFromBackend(response.data)
    } catch (e) {
      console.error('Failed to submit flood report on backend', e)
      throw e
    }
  },

  // Admin: Get pending flood zone verifications
  async getPendingFloodZones() {
    try {
      const response = await axiosClient.get('/admin/flood-zones/pending')
      return response.data.map(mapFloodFromBackend)
    } catch (e) {
      console.warn('Backend /api/admin/flood-zones/pending unreachable', e?.message)
      return []
    }
  },

  // Admin: Verify or reject flood zone
  async verifyFloodZone(id, status = 'ACTIVE') {
    try {
      const response = await axiosClient.put(`/admin/flood-zones/${id}/verify`, { status })
      return mapFloodFromBackend(response.data)
    } catch (e) {
      console.error('Failed to verify flood zone on backend', e)
      throw e
    }
  },
}
