
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";

export interface CartItem {
  id: string;
  productId: string;
  itemType: 'Painting' | 'Workshop';
  title: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getItemCount: () => number;
  getTotal: () => number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, token } = useAuth();
  const { toast } = useToast();
  
  // Загружаем корзину с сервера при авторизации
  useEffect(() => {
    const loadCart = async () => {
      if (isAuthenticated && token) {
        try {
          setIsLoading(true);
          const cartItems = await api.getCart(token);
          setItems(cartItems);
        } catch (error) {
          console.error('Failed to load cart:', error);
          toast({
            title: "Ошибка",
            description: "Не удалось загрузить корзину",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadCart();
  }, [isAuthenticated, token]);
  
  const addItem = async (newItem: CartItem) => {
    try {
      setIsLoading(true);
      
      if (isAuthenticated && token) {
        // Добавление в корзину на сервере
        const cartItem = {
          productId: newItem.productId,
          itemType: newItem.itemType,
          title: newItem.title,
          price: newItem.price,
          quantity: newItem.quantity,
          image: newItem.image
        };
        
        const updatedCart = await api.addToCart(cartItem, token);
        setItems(updatedCart);
      } else {
        // Локальное добавление для неавторизованных пользователей
        setItems(currentItems => {
          const existingItem = currentItems.find(item => 
            item.productId === newItem.productId && item.itemType === newItem.itemType
          );
          
          if (existingItem) {
            return currentItems.map(item =>
              item.productId === newItem.productId && item.itemType === newItem.itemType
                ? { ...item, quantity: item.quantity + (newItem.quantity || 1) }
                : item
            );
          } else {
            return [...currentItems, { ...newItem, quantity: newItem.quantity || 1 }];
          }
        });
      }
      
      toast({
        title: "Товар добавлен",
        description: `"${newItem.title}" добавлен в корзину`,
      });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить товар в корзину",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const removeItem = async (id: string) => {
    try {
      setIsLoading(true);
      
      if (isAuthenticated && token) {
        // Удаление с сервера
        const updatedCart = await api.removeFromCart(id, token);
        setItems(updatedCart);
      } else {
        // Локальное удаление
        setItems(currentItems => currentItems.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить товар из корзины",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateQuantity = async (id: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        await removeItem(id);
        return;
      }
      
      setIsLoading(true);
      
      if (isAuthenticated && token) {
        // Обновление на сервере
        const updatedCart = await api.updateCartItem(id, quantity, token);
        setItems(updatedCart);
      } else {
        // Локальное обновление
        setItems(currentItems =>
          currentItems.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
        );
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить количество товара",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearCart = async () => {
    try {
      setIsLoading(true);
      
      if (isAuthenticated && token) {
        // Очистка на сервере
        await api.clearCart(token);
      }
      
      // Локальная очистка
      setItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось очистить корзину",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };
  
  const getTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getItemCount,
        getTotal,
        isLoading
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
