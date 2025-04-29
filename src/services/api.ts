
import { CartItem } from "@/contexts/CartContext";

const API_URL = "http://localhost:5000/api";

interface OrderData {
  items: CartItem[];
  total: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  address?: string;
}

export const api = {
  // Картины
  async getPaintings() {
    const response = await fetch(`${API_URL}/paintings`);
    if (!response.ok) {
      throw new Error('Не удалось загрузить картины');
    }
    return await response.json();
  },

  async getPaintingById(id: string) {
    const response = await fetch(`${API_URL}/paintings/${id}`);
    if (!response.ok) {
      throw new Error('Не удалось загрузить информацию о картине');
    }
    return await response.json();
  },

  // Мастер-классы
  async getWorkshops() {
    const response = await fetch(`${API_URL}/workshops`);
    if (!response.ok) {
      throw new Error('Не удалось загрузить мастер-классы');
    }
    return await response.json();
  },

  async getWorkshopById(id: string) {
    const response = await fetch(`${API_URL}/workshops/${id}`);
    if (!response.ok) {
      throw new Error('Не удалось загрузить информацию о мастер-классе');
    }
    return await response.json();
  },

  async bookWorkshop(workshopId: string, data: any) {
    const response = await fetch(`${API_URL}/workshops/${workshopId}/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Не удалось забронировать мастер-класс');
    }
    return await response.json();
  },

  // Заказы
  async createOrder(orderData: OrderData) {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) {
      throw new Error('Не удалось создать заказ');
    }
    return await response.json();
  },

  async getOrderById(id: string) {
    const response = await fetch(`${API_URL}/orders/${id}`);
    if (!response.ok) {
      throw new Error('Не удалось загрузить информацию о заказе');
    }
    return await response.json();
  },

  async getOrdersByEmail(email: string) {
    const response = await fetch(`${API_URL}/orders?email=${email}`);
    if (!response.ok) {
      throw new Error('Не удалось загрузить историю заказов');
    }
    return await response.json();
  }
};
