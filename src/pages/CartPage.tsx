import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function CartPage() {
  const [deliveryMethod, setDeliveryMethod] = useState("courier");
  const [promoCode, setPromoCode] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutInfo, setCheckoutInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    comment: ""
  });
  
  const { toast } = useToast();
  const { items, updateQuantity, removeItem, getTotal, clearCart, isLoading } = useCart();
  const { user, isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  
  const handleUpdateQuantity = (id: string, delta: number) => {
    const item = items.find(item => item.id === id);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + delta);
      updateQuantity(id, newQuantity);
    }
  };
  
  const handleRemoveItem = (id: string, title: string) => {
    removeItem(id);
    toast({
      title: "Товар удален",
      description: `"${title}" удален из корзины.`,
    });
  };
  
  const handleApplyPromoCode = async () => {
    if (!promoCode) {
      toast({
        title: "Ошибка",
        description: "Введите промокод",
        variant: "destructive",
      });
      return;
    }
    
    setIsApplyingPromo(true);
    
    try {
      const result = await api.verifyPromoCode(promoCode);
      const newDiscount = Math.round(subtotal * (result.discountPercent / 100));
      setDiscount(newDiscount);
      
      toast({
        title: "Промокод применен",
        description: `Скидка ${formatPrice(newDiscount)} (${result.discountPercent}%) применена к заказу`,
      });
    } catch (error) {
      toast({
        title: "Неверный промокод",
        description: "Введенный промокод не найден или срок его действия истек",
        variant: "destructive",
      });
    } finally {
      setIsApplyingPromo(false);
    }
  };
  
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₽";
  };
  
  const openCheckoutDialog = () => {
    if (!isAuthenticated) {
      toast({
        title: "Необходима авторизация",
        description: "Для оформления заказа необходимо войти в систему",
        variant: "destructive",
      });
      navigate('/auth', { state: { from: '/cart' } });
      return;
    }
    
    if (user) {
      setCheckoutInfo({
        ...checkoutInfo,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || ""
      });
    }
    
    setCheckoutDialogOpen(true);
  };
  
  const handleSubmitOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!isAuthenticated || !user || !token) {
      toast({
        title: "Требуется авторизация",
        description: "Пожалуйста, авторизуйтесь для оформления заказа",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }
    
    try {
      const { name, email, phone, address, city, postalCode, comment } = checkoutInfo;
      
      if (!name || !email || !phone || !address) {
        toast({
          title: "Заполните обязательные поля",
          description: "Имя, email, телефон и адрес обязательны для заполнения",
          variant: "destructive",
        });
        return;
      }
      
      const orderData = {
        items: items.map(item => ({
          ...item,
          productId: item.productId,
          itemType: item.itemType
        })),
        total: total,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        address,
        city,
        postalCode,
        comment,
        promoCode: discount > 0 ? promoCode : undefined,
        deliveryMethod
      };
      
      // Создаем заказ
      await api.createOrder(orderData, token);
      
      // Очищаем корзину
      await clearCart();
      
      toast({
        title: "Заказ оформлен",
        description: "Спасибо за заказ! Мы свяжемся с вами в ближайшее время.",
      });
      
      setCheckoutDialogOpen(false);
      navigate('/');
    } catch (error: any) {
      console.error('Error creating order:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось оформить заказ. Пожалуйста, попробуйте еще раз.",
        variant: "destructive",
      });
    }
  };
  
  // Calculate totals
  const subtotal = getTotal();
  const deliveryCost = deliveryMethod === "courier" ? 500 : 0;
  const total = subtotal + deliveryCost - discount;
  
  return (
    <div className="section-container">
      <h1 className="page-title">Корзина</h1>
      
      {items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-display mb-4">Ваши товары</h2>
              
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 py-4 border-b last:border-0">
                    <div className="h-24 w-24 rounded-md overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-gray-600 text-sm">
                        {item.itemType === 'Painting' ? 'Картина, холст' : 'Мастер-класс'}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <button 
                        className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center"
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                        disabled={isLoading}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center"
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                        disabled={isLoading}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="w-24 text-right">
                      <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                    
                    <button 
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      onClick={() => handleRemoveItem(item.id, item.title)}
                      aria-label="Удалить"
                      disabled={isLoading}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-2xl font-display mb-4">Итого</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Сумма заказа</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                
                <div className="space-y-2">
                  <p className="text-gray-600">Доставка</p>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="delivery-courier" 
                        name="delivery" 
                        checked={deliveryMethod === "courier"}
                        onChange={() => setDeliveryMethod("courier")}
                        className="mr-2"
                      />
                      <label htmlFor="delivery-courier" className="flex justify-between w-full">
                        <span>Курьер</span>
                        <span>500 ₽</span>
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="delivery-pickup" 
                        name="delivery" 
                        checked={deliveryMethod === "pickup"}
                        onChange={() => setDeliveryMethod("pickup")}
                        className="mr-2"
                      />
                      <label htmlFor="delivery-pickup" className="flex justify-between w-full">
                        <span>Самовывоз</span>
                        <span>Бесплатно</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Промокод"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      disabled={isApplyingPromo}
                    />
                    <Button 
                      variant="outline" 
                      onClick={handleApplyPromoCode}
                      disabled={isApplyingPromo}
                    >
                      {isApplyingPromo ? "..." : "Применить"}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Например: ART10 для скидки 10%</p>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Скидка</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Итоговая стоимость</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-4" 
                  size="lg"
                  onClick={openCheckoutDialog}
                  disabled={isLoading}
                >
                  Оформить заказ
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <div className="flex justify-center mb-4">
            <span className="h-20 w-20 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center">
              <ShoppingBag className="h-10 w-10" />
            </span>
          </div>
          <h2 className="text-2xl font-display mb-2">Ваша корзина пуста</h2>
          <p className="text-gray-600 mb-8">Добавьте товары из нашего каталога, чтобы оформить заказ</p>
          <Button asChild size="lg">
            <Link to="/paintings">Перейти в галерею</Link>
          </Button>
        </div>
      )}
      
      {/* Checkout Dialog */}
      <Dialog open={checkoutDialogOpen} onOpenChange={setCheckoutDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Оформление заказа</DialogTitle>
            <DialogDescription>
              Заполните информацию для доставки заказа
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Имя*
                </label>
                <Input
                  id="name"
                  value={checkoutInfo.name}
                  onChange={(e) => setCheckoutInfo({ ...checkoutInfo, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email*
                </label>
                <Input
                  id="email"
                  type="email"
                  value={checkoutInfo.email}
                  onChange={(e) => setCheckoutInfo({ ...checkoutInfo, email: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Телефон*
                </label>
                <Input
                  id="phone"
                  value={checkoutInfo.phone}
                  onChange={(e) => setCheckoutInfo({ ...checkoutInfo, phone: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium">
                  Город
                </label>
                <Input
                  id="city"
                  value={checkoutInfo.city}
                  onChange={(e) => setCheckoutInfo({ ...checkoutInfo, city: e.target.value })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium">
                  Адрес*
                </label>
                <Input
                  id="address"
                  value={checkoutInfo.address}
                  onChange={(e) => setCheckoutInfo({ ...checkoutInfo, address: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="postalCode" className="text-sm font-medium">
                  Почтовый индекс
                </label>
                <Input
                  id="postalCode"
                  value={checkoutInfo.postalCode}
                  onChange={(e) => setCheckoutInfo({ ...checkoutInfo, postalCode: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="comment" className="text-sm font-medium">
                Комментарий к заказу
              </label>
              <Textarea
                id="comment"
                value={checkoutInfo.comment}
                onChange={(e) => setCheckoutInfo({ ...checkoutInfo, comment: e.target.value })}
                placeholder="Дополнительная информация для доставки"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setCheckoutDialogOpen(false)}
              disabled={isCheckingOut}
            >
              Отмена
            </Button>
            <Button 
              onClick={handleSubmitOrder}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? "Обработка..." : "Подтвердить заказ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
