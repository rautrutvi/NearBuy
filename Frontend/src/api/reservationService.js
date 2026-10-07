import { INITIAL_RESERVATIONS } from './mockData'

let mockReservationsStore = [...INITIAL_RESERVATIONS]

export const reservationService = {
  // Fetch active reservations
  async getReservations() {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return [...mockReservationsStore]
  },

  // Create new 30-min pickup reservation
  async createReservation({ product, quantity }) {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const newReservation = {
      id: `res-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      shopName: product.shopName,
      quantity: quantity,
      totalPrice: product.price * quantity,
      status: 'pending', // 'pending' -> 'ready' -> 'picked_up'
      reservedAt: new Date().toISOString(),
      pickupDeadlineMinutes: 30,
      verificationCode: `NB-${Math.floor(1000 + Math.random() * 9000)}`,
    }

    mockReservationsStore = [newReservation, ...mockReservationsStore]
    return newReservation
  },

  // Update reservation status (Vendor action)
  async updateReservationStatus(reservationId, newStatus) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    mockReservationsStore = mockReservationsStore.map((res) =>
      res.id === reservationId ? { ...res, status: newStatus } : res
    )
    return mockReservationsStore.find((r) => r.id === reservationId)
  },
}
