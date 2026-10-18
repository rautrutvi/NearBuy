import { axiosClient } from './axiosClient'

export const reviewService = {
  // Fetch reviews for a specific shop
  async getShopReviews(shopId) {
    try {
      const response = await axiosClient.get(`/shops/${shopId}/reviews`)
      return response.data
    } catch (e) {
      console.warn(`Failed to fetch reviews for shop ${shopId}`, e?.message)
      return []
    }
  },

  // Submit verified review
  async addReview({ shopId, rating, comment }) {
    try {
      const response = await axiosClient.post('/customer/reviews', {
        shopId,
        rating,
        comment,
      })
      return response.data
    } catch (e) {
      console.error('Failed to submit review', e)
      throw e
    }
  },
}
