// reservationService.js – handles reservation API calls with mock fallback
import { INITIAL_RESERVATIONS } from './mockData';
import { axiosClient } from './axiosClient';

// In‑memory mock store used when the backend is unavailable.
let mockReservationsStore = [...INITIAL_RESERVATIONS];

/**
 * Normalise a backend reservation object to the shape used by the UI.
 */
const mapReservationFromBackend = (r) => {
  const firstItem = r.items && r.items[0];
  const statusLower = (r.status || 'PENDING').toLowerCase();
  return {
    id: r.id,
    productId: firstItem ? firstItem.productId : null,
    productName: firstItem
      ? firstItem.productName
      : r.items
        ? r.items.map((i) => i.productName).join(', ')
        : 'Reserved Items',
    shopName: r.shopName || 'Local Shop',
    shopAddress: r.shopAddress || '',
    quantity: firstItem ? firstItem.quantity : 1,
    totalPrice: r.totalAmount != null ? Number(r.totalAmount) : 0,
    status: statusLower, // 'pending' | 'ready' | 'picked_up' | 'cancelled' | 'paid'
    reservedAt: r.reservedAt || new Date().toISOString(),
    pickupDeadlineMinutes: 30,
    verificationCode: r.verificationCode || `NB-${r.id}`,
    paid: r.paid || false,
    items: r.items || [],
  };
};

export const reservationService = {
  /** Fetch reservations – falls back to the mock store on error */
  async getReservations(role = 'buyer') {
    try {
      const endpoint = role === 'vendor' ? '/shopkeeper/reservations' : '/customer/reservations';
      const response = await axiosClient.get(endpoint);
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data.map(mapReservationFromBackend);
      }
    } catch (e) {
      console.warn('Backend reservations unreachable, using local store', e?.message);
    }
    return [...mockReservationsStore];
  },

  /** Create a new 30‑minute pickup reservation */
  async createReservation({ product, quantity }) {
    try {
      const shopId = product.shopId || 1;
      const payload = {
        shopId: typeof shopId === 'string' ? parseInt(shopId.replace(/\\D/g, '') || '1') : shopId,
        items: [
          {
            productId: typeof product.id === 'string' ? parseInt(product.id.replace(/\\D/g, '') || '1') : product.id,
            quantity: quantity || 1,
          },
        ],
      };
      const response = await axiosClient.post('/customer/reservations', payload);
      const mapped = mapReservationFromBackend(response.data);
      mockReservationsStore = [mapped, ...mockReservationsStore];
      return mapped;
    } catch (e) {
      console.warn('Backend reservation create failed, using local store', e?.message);
    }

    // Local fallback creation
    const newReservation = {
      id: `res-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      shopName: product.shopName,
      quantity: quantity || 1,
      totalPrice: (product.price || 0) * (quantity || 1),
      status: 'pending',
      reservedAt: new Date().toISOString(),
      pickupDeadlineMinutes: 30,
      verificationCode: `NB-${Math.floor(1000 + Math.random() * 9000)}`,
      paid: false,
      items: [],
    };
    mockReservationsStore = [newReservation, ...mockReservationsStore];
    return newReservation;
  },

  /** Update reservation status – vendor flow */
  async updateReservationStatus(reservationId, newStatus) {
    try {
      const numericId = typeof reservationId === 'string' ? parseInt(reservationId.replace(/\\D/g, '') || '0') : reservationId;
      if (numericId > 0) {
        const response = await axiosClient.put(`/shopkeeper/reservations/${numericId}/status`, {
          status: newStatus.toUpperCase(),
        });
        return mapReservationFromBackend(response.data);
      }
    } catch (e) {
      console.warn('Backend reservation status update failed, updating local store', e?.message);
    }
    // Local fallback
    mockReservationsStore = mockReservationsStore.map((res) =>
      res.id === reservationId ? { ...res, status: newStatus } : res
    );
    return mockReservationsStore.find((r) => r.id === reservationId);
  },

  /** Pay for a reservation using a specific method (e.g., UPI) */
  async payReservationMethod(reservationId, method) {
    try {
      const numericId = typeof reservationId === 'string' ? parseInt(reservationId.replace(/\\D/g, '') || '0') : reservationId;
      const response = await axiosClient.post(`/customer/reservations/${numericId}/pay`, { method });
      // Backend is expected to return transaction details.
      return response.data;
    } catch (e) {
      console.warn('Backend payment failed, using mock payment', e?.message);
      // Mock fallback – mark reservation as paid in the local store.
      const reservation = mockReservationsStore.find(
        (r) => r.id === reservationId || r.id === `res-${reservationId}`
      );
      if (reservation) {
        reservation.paid = true;
        reservation.status = 'paid';
        return {
          transactionId: `mock-txn-${Date.now()}`,
          reservationId: reservation.id,
          method,
        };
      }
      throw e;
    }
  },

  /** Retrieve receipt PDF (or blob) for a paid reservation */
  async getReceipt(reservationId) {
    try {
      const numericId = typeof reservationId === 'string' ? parseInt(reservationId.replace(/\\D/g, '') || '0') : reservationId;
      const response = await axiosClient.get(`/customer/reservations/${numericId}/receipt`, {
        responseType: 'blob',
      });
      return response; // Blob response
    } catch (e) {
      console.error('Failed to fetch receipt', e);
      throw e;
    }
  },

  /** Simple payment simulation used elsewhere – kept for compatibility */
  async payReservation(reservationId) {
    try {
      const numericId = typeof reservationId === 'string' ? parseInt(reservationId.replace(/\\D/g, '') || '0') : reservationId;
      const response = await axiosClient.post(`/customer/reservations/${numericId}/pay`);
      return mapReservationFromBackend(response.data);
    } catch (e) {
      console.error('Failed payment simulation on backend', e);
      throw e;
    }
  },

  /** Shopkeeper stats – falls back to mock aggregation */
  async getShopkeeperStats() {
    try {
      const response = await axiosClient.get('/shopkeeper/stats');
      return response.data; // { pendingOrders, readyOrders, completedToday }
    } catch (e) {
      console.warn('Backend shopkeeper stats unavailable, using mock data', e?.message);
      return {
        pendingOrders: mockReservationsStore.filter((r) => r.status === 'pending').length,
        readyOrders: mockReservationsStore.filter((r) => r.status === 'ready').length,
        completedToday: mockReservationsStore.filter((r) => r.status === 'picked_up').length,
      };
    }
  },
};