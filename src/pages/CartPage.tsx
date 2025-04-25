
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

export default function CartPage() {
  const [deliveryMethod, setDeliveryMethod] = useState("courier");
  const [promoCode, setPromoCode] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [discount, setDiscount] = useState(0);
  const { toast } = useToast();
  const { items, updateQuantity, removeItem, getTotal } = useCart();
  
  const handleUpdateQuantity = (id: number, delta: number) => {
    const item = items.find(item => item.id === id);
    if (item) {
      updateQuantity(id, item.quantity + delta);
    }
  };
  
  const handleRemoveItem = (id: number, title: string) => {
    removeItem(id);
    toast({
      title: "Товар удален",
      description: `"${title}" удален из корзины.`,
    });
  };
  
  const handleApplyPromoCode = () => {
    if (!promoCode) {
      toast({
        title: "Ошибка",
        description: "Введите промокод",
        variant: "destructive",
      });
      return;
    }
    
    setIsApplyingPromo(true);
    
    // Simulate API call
    setTimeout(() => {
      if (promoCode.toLowerCase() === "art10") {
        const newDiscount = Math.round(subtotal * 0.1);
        setDiscount(newDiscount);
        toast({
          title: "Промокод применен",
          description: `Скидка ${formatPrice(newDiscount)} применена к заказу`,
        });
      } else {
        toast({
          title: "Неверный промокод",
          description: "Введенный промокод не найден или срок его действия истек",
          variant: "destructive",
        });
      }
      
      setIsApplyingPromo(false);
    }, 800);
  };
  
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₽";
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
                      <p className="text-gray-600 text-sm">Картина, холст</p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <button 
                        className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center"
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center"
                        onClick={() => handleUpdateQuantity(item.id, 1)}
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
                
                <Button className="w-full mt-4" size="lg">
                  Оформить заказ
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <div className="flex justify-center mb-4">
            <span className="h-20 w-20 rounded-full bg-studio-100 text-studio-600 flex items-center justify-center">
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
    </div>
  );
}
