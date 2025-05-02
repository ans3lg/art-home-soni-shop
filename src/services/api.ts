
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
    address?: string;
  };
}

interface RegisterResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

class ApiService {
  async register(name: string, email: string, password: string): Promise<RegisterResponse> {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при регистрации');
      }

      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка при регистрации');
    }
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при входе');
      }

      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка при входе');
    }
  }

  async getCurrentUser(token: string): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Ошибка получения данных пользователя');
      }

      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка получения данных пользователя');
    }
  }

  async updateProfile(profileData: any, token: string): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при обновлении профиля');
      }

      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка при обновлении профиля');
    }
  }

  // Users
  async getAllUsers(token: string): Promise<any[]> {
    try {
      const response = await fetch(`${API_URL}/api/auth/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при получении пользователей');
      }

      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка при получении пользователей');
    }
  }

  async updateUserRole(userId: string, role: string, token: string): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/auth/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при обновлении роли пользователя');
      }

      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка при обновлении роли пользователя');
    }
  }

  // Paintings
  async getPaintings(): Promise<any[]> {
    try {
      const response = await fetch(`${API_URL}/api/paintings`);
      
      if (!response.ok) {
        throw new Error('Ошибка получения картин');
      }
      
      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка получения картин');
    }
  }

  async getPainting(id: string): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/paintings/${id}`);
      
      if (!response.ok) {
        throw new Error('Ошибка получения информации о картине');
      }
      
      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка получения информации о картине');
    }
  }

  async getArtistPaintings(token: string): Promise<any[]> {
    try {
      const response = await fetch(`${API_URL}/api/paintings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Ошибка получения картин');
      }
      
      const allPaintings = await response.json();
      
      // Парсим токен для получения ID художника
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) throw new Error('Неверный формат токена');
      
      const payload = JSON.parse(atob(tokenParts[1]));
      const artistId = payload.id;
      
      // Фильтруем картины по автору
      return allPaintings.filter((painting: any) => 
        painting.author === artistId || (typeof painting.author === 'object' && painting.author?._id === artistId)
      );
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка получения картин');
    }
  }

  async createPainting(data: FormData, token: string): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/paintings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: data,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при создании картины');
      }
      
      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка при создании картины');
    }
  }

  async updatePainting(id: string, data: FormData, token: string): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/paintings/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: data,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при обновлении картины');
      }
      
      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка при обновлении картины');
    }
  }

  async deletePainting(id: string, token: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/api/paintings/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при удалении картины');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка при удалении картины');
    }
  }

  // Workshops
  async getWorkshops(): Promise<any[]> {
    try {
      const response = await fetch(`${API_URL}/api/workshops`);
      
      if (!response.ok) {
        throw new Error('Ошибка получения мастер-классов');
      }
      
      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка получения мастер-классов');
    }
  }

  async getWorkshop(id: string): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/workshops/${id}`);
      
      if (!response.ok) {
        throw new Error('Ошибка получения информации о мастер-классе');
      }
      
      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка получения информации о мастер-классе');
    }
  }

  async getArtistWorkshops(token: string): Promise<any[]> {
    try {
      const response = await fetch(`${API_URL}/api/workshops`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Ошибка получения мастер-классов');
      }
      
      const allWorkshops = await response.json();
      
      // Парсим токен для получения ID художника
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) throw new Error('Неверный формат токена');
      
      const payload = JSON.parse(atob(tokenParts[1]));
      const artistId = payload.id;
      
      // Фильтруем мастер-классы по автору
      return allWorkshops.filter((workshop: any) => 
        workshop.author === artistId || (typeof workshop.author === 'object' && workshop.author?._id === artistId)
      );
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка получения мастер-классов');
    }
  }

  async createWorkshop(data: FormData, token: string): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/workshops`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: data,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при создании мастер-класса');
      }
      
      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка при создании мастер-класса');
    }
  }

  async updateWorkshop(id: string, data: FormData, token: string): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/workshops/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: data,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при обновлении мастер-класса');
      }
      
      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка при обновлении мастер-класса');
    }
  }

  async deleteWorkshop(id: string, token: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/api/workshops/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при удалении мастер-класса');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка при удалении мастер-класса');
    }
  }

  async bookWorkshop(id: string, data: any, token: string): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/workshops/${id}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при записи на мастер-класс');
      }
      
      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка при записи на мастер-класс');
    }
  }

  // Cart
  async getCart(token: string): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Ошибка получения корзины');
      }
      
      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка получения корзины');
    }
  }
  
  async addToCart(item: any, token: string): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(item),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при добавлении товара в корзину');
      }
      
      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка при добавлении товара в корзину');
    }
  }
  
  async updateCartItemQuantity(itemId: string, quantity: number, token: string): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/cart/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ itemId, quantity }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при обновлении количества товара в корзине');
      }
      
      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка при обновлении количества товара в корзине');
    }
  }
  
  async removeFromCart(itemId: string, token: string): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/cart/remove/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при удалении товара из корзины');
      }
      
      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка при удалении товара из корзины');
    }
  }
  
  async clearCart(token: string): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/cart/clear`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при очистке корзины');
      }
      
      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка при очистке корзины');
    }
  }

  // Orders
  async createOrder(orderData: any, token: string): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при создании заказа');
      }
      
      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка при создании заказа');
    }
  }

  async getUserOrders(token: string): Promise<any[]> {
    try {
      const response = await fetch(`${API_URL}/api/orders/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Ошибка получения заказов пользователя');
      }
      
      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка получения заказов пользователя');
    }
  }

  async getOrder(id: string, token: string): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/orders/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Ошибка получения информации о заказе');
      }
      
      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка получения информации о заказе');
    }
  }

  async getAllOrders(token: string): Promise<any[]> {
    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Ошибка получения всех заказов');
      }
      
      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка получения всех заказов');
    }
  }

  async updateOrderStatus(id: string, status: string, token: string): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при обновлении статуса заказа');
      }
      
      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка при обновлении статуса заказа');
    }
  }

  // Promo codes
  async getPromoCodes(token: string): Promise<any[]> {
    try {
      const response = await fetch(`${API_URL}/api/promocodes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Ошибка получения промокодов');
      }
      
      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка получения промокодов');
    }
  }

  async createPromoCode(data: any, token: string): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/promocodes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при создании промокода');
      }
      
      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка при создании промокода');
    }
  }

  async updatePromoCode(id: string, data: any, token: string): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/promocodes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при обновлении промокода');
      }
      
      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка при обновлении промокода');
    }
  }

  async deletePromoCode(id: string, token: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/api/promocodes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при удалении промокода');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка при удалении промокода');
    }
  }

  async verifyPromoCode(code: string, token: string): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/promocodes/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ code }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Промокод недействителен');
      }
      
      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Промокод недействителен');
    }
  }
  
  // Отчеты
  async getSalesReport(period: string, token: string): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/reports/sales?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Ошибка получения отчета по продажам');
      }
      
      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка получения отчета по продажам');
    }
  }

  async getWorkshopsReport(period: string, token: string): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/reports/workshops?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Ошибка получения отчета по мастер-классам');
      }
      
      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка получения отчета по мастер-классам');
    }
  }

  async exportReport(reportType: 'sales' | 'workshops', period: string, token: string): Promise<Blob> {
    try {
      const response = await fetch(`${API_URL}/api/reports/export/${reportType}?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Ошибка экспорта отчета');
      }
      
      return await response.blob();
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка экспорта отчета');
    }
  }
}

export const api = new ApiService();
