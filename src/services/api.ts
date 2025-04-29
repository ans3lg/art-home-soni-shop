
import { CartItem } from "@/contexts/CartContext";

// Используем переменную окружения или дефолтное значение
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

console.log("Using API URL:", API_URL); // Для отладки

export interface OrderData {
  items: CartItem[];
  total: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  promoCode?: string;
  deliveryMethod: string;
}

export const api = {
  // Auth
  async register(name: string, email: string, password: string) {
    console.log("Registering user:", { name, email });
    console.log("API URL:", API_URL);
    
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Ошибка регистрации');
      }
      
      return data;
    } catch (error) {
      console.error("Registration error details:", error);
      throw error;
    }
  },

  async login(email: string, password: string) {
    console.log("Logging in user:", { email });
    console.log("API URL:", API_URL);
    
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Неверный email или пароль');
      }
      
      return data;
    } catch (error) {
      console.error("Login error details:", error);
      throw error;
    }
  },

  async getCurrentUser(token: string) {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Ошибка получения данных пользователя');
    }
    
    return data;
  },

  async updateProfile(profileData: any, token: string) {
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Ошибка обновления профиля');
    }
    
    return data;
  },

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

  async createPainting(paintingData: FormData, token: string) {
    const response = await fetch(`${API_URL}/paintings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: paintingData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Не удалось создать картину');
    }
    
    return await response.json();
  },

  async updatePainting(id: string, paintingData: FormData, token: string) {
    const response = await fetch(`${API_URL}/paintings/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: paintingData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Не удалось обновить картину');
    }
    
    return await response.json();
  },

  async deletePainting(id: string, token: string) {
    const response = await fetch(`${API_URL}/paintings/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Не удалось удалить картину');
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

  async createWorkshop(workshopData: FormData, token: string) {
    const response = await fetch(`${API_URL}/workshops`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: workshopData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Не удалось создать мастер-класс');
    }
    
    return await response.json();
  },

  async updateWorkshop(id: string, workshopData: FormData, token: string) {
    const response = await fetch(`${API_URL}/workshops/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: workshopData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Не удалось обновить мастер-класс');
    }
    
    return await response.json();
  },

  async deleteWorkshop(id: string, token: string) {
    const response = await fetch(`${API_URL}/workshops/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Не удалось удалить мастер-класс');
    }
    
    return await response.json();
  },

  async bookWorkshop(workshopId: string, data: any, token: string) {
    const response = await fetch(`${API_URL}/workshops/${workshopId}/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Не удалось забронировать мастер-класс');
    }
    return await response.json();
  },

  // Промокоды
  async getPromoCodes(token: string) {
    const response = await fetch(`${API_URL}/promocodes`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Не удалось загрузить промокоды');
    }
    
    return await response.json();
  },

  async createPromoCode(data: any, token: string) {
    const response = await fetch(`${API_URL}/promocodes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Не удалось создать промокод');
    }
    
    return await response.json();
  },

  async verifyPromoCode(code: string) {
    try {
      const response = await fetch(`${API_URL}/promocodes/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Недействительный промокод');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error verifying promo code:', error);
      throw error;
    }
  },

  async updatePromoCode(id: string, data: any, token: string) {
    const response = await fetch(`${API_URL}/promocodes/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Не удалось обновить промокод');
    }
    
    return await response.json();
  },

  async deletePromoCode(id: string, token: string) {
    const response = await fetch(`${API_URL}/promocodes/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Не удалось удалить промокод');
    }
    
    return await response.json();
  },

  // Корзина и заказы
  async addToCart(item: CartItem, token?: string) {
    try {
      const response = await fetch(`${API_URL}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(item),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Не удалось добавить товар в корзину');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },
  
  async getCart(token: string) {
    try {
      const response = await fetch(`${API_URL}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Не удалось загрузить корзину');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting cart:', error);
      throw error;
    }
  },
  
  async updateCartItem(itemId: string, quantity: number, token: string) {
    try {
      const response = await fetch(`${API_URL}/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Не удалось обновить товар в корзине');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  },
  
  async removeFromCart(itemId: string, token: string) {
    try {
      const response = await fetch(`${API_URL}/cart/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Не удалось удалить товар из корзины');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },

  // Заказы
  async createOrder(orderData: OrderData, token?: string) {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Не удалось создать заказ');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  async getOrderById(id: string, token: string) {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Не удалось загрузить информацию о заказе');
    }
    
    return await response.json();
  },

  async getUserOrders(token: string) {
    const response = await fetch(`${API_URL}/orders/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Не удалось загрузить историю заказов');
    }
    
    return await response.json();
  },
  
  async getAllOrders(token: string) {
    const response = await fetch(`${API_URL}/orders`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Не удалось загрузить заказы');
    }
    
    return await response.json();
  },
  
  async updateOrderStatus(id: string, status: string, token: string) {
    const response = await fetch(`${API_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    
    if (!response.ok) {
      throw new Error('Не удалось обновить статус заказа');
    }
    
    return await response.json();
  },

  // Статистика и отчеты
  async getSalesReport(period: string, token: string) {
    try {
      const response = await fetch(`${API_URL}/reports/sales?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Не удалось загрузить отчет по продажам');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting sales report:', error);
      throw error;
    }
  },
  
  async getWorkshopsReport(period: string, token: string) {
    try {
      const response = await fetch(`${API_URL}/reports/workshops?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Не удалось загрузить отчет по мастер-классам');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting workshops report:', error);
      throw error;
    }
  },
  
  async exportReport(reportType: 'sales' | 'workshops', period: string, token: string) {
    try {
      const response = await fetch(`${API_URL}/reports/export?type=${reportType}&period=${period}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Не удалось экспортировать отчет');
      }
      
      // Возвращаем блоб для создания файла
      return await response.blob();
    } catch (error) {
      console.error('Error exporting report:', error);
      throw error;
    }
  }
};
