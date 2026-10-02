import { MOCK_FLOOD_REPORTS } from './mockData'

export const floodService = {
  // Fetch active flood & waterlogging reports
  async getFloodReports() {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return MOCK_FLOOD_REPORTS
  },
}
