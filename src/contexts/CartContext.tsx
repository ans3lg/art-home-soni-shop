import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface CartItem {
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
  totalItems: number;
  totalPrice: number;
  loading: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotal: () => number;
  updateQuantity: (itemId: string, quantity: number) => void;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, token } = useAuth();
  const { toast } = useToast();
  
  // Загрузка корзины с сервера при первоначальной загрузке
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchCart();
    } else {
      setLoading(false);
      setItems([]);
    }
  }, [isAuthenticated, token]);
  
  // Загружаем корзину с сервера
  const fetchCart = async () => {
    try {
      setLoading(true);
      const cartData = await api.getCart(token!);
      
      if (cartData && cartData.items) {
        const mappedItems: CartItem[] = cartData.items.map((item: any) => ({
          id: item._id,
          productId: item.productId,
          itemType: item.itemType,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        }));
        
        setItems(mappedItems);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить корзину",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Добавляем товар в корзину
  const addItem = async (item: CartItem) => {
    try {
      if (!isAuthenticated) {
        toast({
          title: "Ошибка",
          description: "Необходимо авторизоваться для добавления товаров в корзину",
          variant: "destructive"
        });
        return;
      }
      
      setLoading(true);
      
      // Проверяем, есть ли товар в корзине
      const existingItemIndex = items.findIndex(i => i.productId === item.productId && i.itemType === item.itemType);
      
      if (existingItemIndex >= 0) {
        // Если товар уже в корзине, увеличиваем количество
        const newQuantity = items[existingItemIndex].quantity + item.quantity;
        await api.updateCartItemQuantity(items[existingItemIndex].id, newQuantity, token!);
        
        // Обновляем локальное состояние
        const updatedItems = [...items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: newQuantity
        };
        setItems(updatedItems);
      } else {
        // Если товара нет в корзине, добавляем новый
        const response = await api.addToCart({
          productId: item.productId,
          itemType: item.itemType,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        }, token!);
        
        // Обновляем локальное состояние
        if (response && response.cart && response.cart.items) {
          fetchCart(); // Перезагружаем всю корзину для синхронизации
        }
      }
    } catch (error: any) {
      console.error('Error adding item to cart:', error);
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось добавить товар в корзину",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Изменяем количество товара
  const updateItemQuantity = async (itemId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        // Если количество меньше или равно нулю, удаляем товар
        await removeItem(itemId);
        return;
      }
      
      setLoading(true);
      await api.updateCartItemQuantity(itemId, quantity, token!);
      
      // Обновляем локальное состояние
      setItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating item quantity:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить количество товара",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Get item count - alias for Header component
  const getItemCount = () => {
    return totalItems;
  };
  
  // Get total price - alias for Cart page
  const getTotal = () => {
    return totalPrice;
  };
  
  // Alias for updateItemQuantity to match CartPage usage
  const updateQuantity = async (itemId: string, quantity: number) => {
    return updateItemQuantity(itemId, quantity);
  };
  
  // Удаляем товар из корзины
  const removeItem = async (itemId: string) => {
    try {
      setLoading(true);
      await api.removeFromCart(itemId, token!);
      
      // Обновляем локальное состояние
      setItems(prevItems => prevItems.filter(item => item.id !== itemId));
      
      toast({
        title: "Товар удален",
        description: "Товар успешно удален из корзины",
      });
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить товар из корзины",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Очищаем корзину
  const clearCart = async () => {
    try {
      setLoading(true);
      await api.clearCart(token!);
      
      // Обновляем локальное состояние
      setItems([]);
      
      toast({
        title: "Корзина очищена",
        description: "Все товары удалены из корзины",
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось очистить корзину",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Вычисляем общее количество товаров и общую стоимость
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        loading,
        addItem,
        removeItem,
        updateItemQuantity,
        clearCart,
        getItemCount,
        getTotal,
        updateQuantity,
        isLoading: loading
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
