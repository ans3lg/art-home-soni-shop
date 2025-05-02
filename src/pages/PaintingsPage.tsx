
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Tabs,
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { ShoppingCart, Heart, Loader2, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/CartContext";
import { api } from "@/services/api";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

interface Painting {
  _id: string;
  title: string;
  description: string;
  category: string;
  materials: string;
  size: string;
  price: number;
  image: string;
  author: {
    _id: string;
    name: string;
  } | string;
  authorName: string;
  inStock: boolean;
}

export default function PaintingsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    const fetchPaintings = async () => {
      try {
        setLoading(true);
        const data = await api.getPaintings();
        setPaintings(data);
        setLoading(false);
      } catch (err: any) {
        setError("Не удалось загрузить картины");
        setLoading(false);
        console.error("Error fetching paintings:", err);
      }
    };

    fetchPaintings();
  }, []);
  
  const filteredPaintings = activeCategory === "all" 
    ? paintings 
    : paintings.filter(painting => painting.category === activeCategory);
    
  const handleAddToCart = (painting: Painting) => {
    if (!isAuthenticated) {
      toast({
        title: "Требуется авторизация",
        description: "Пожалуйста, авторизуйтесь для добавления товаров в корзину",
        duration: 3000,
      });
      return;
    }

    addItem({
      id: painting._id,
      productId: painting._id,
      itemType: 'Painting',
      title: painting.title,
      price: painting.price,
      quantity: 1,
      image: painting.image,
    });
    
    toast({
      title: "Добавлено в корзину",
      description: `"${painting.title}" добавлена в вашу корзину.`,
      duration: 3000,
    });
  };
  
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₽";
  };

  const getAuthorName = (painting: Painting): string => {
    if (typeof painting.author === 'object' && painting.author !== null) {
      return painting.author.name;
    }
    return painting.authorName || 'Неизвестный автор';
  };
  
  return (
    <div className="section-container">
      <h1 className="page-title">Галерея картин</h1>
      
      <div className="mb-10">
        <Tabs defaultValue="all" onValueChange={setActiveCategory}>
          <TabsList className="w-full max-w-lg mx-auto grid grid-cols-4">
            <TabsTrigger value="all">Все</TabsTrigger>
            <TabsTrigger value="abstract">Абстракция</TabsTrigger>
            <TabsTrigger value="landscape">Пейзажи</TabsTrigger>
            <TabsTrigger value="stilllife">Натюрморты</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Загрузка...</span>
        </div>
      ) : error ? (
        <Card className="p-6 text-center">
          <h3 className="text-lg font-medium text-red-500">{error}</h3>
          <p className="mt-2">Пожалуйста, проверьте соединение или попробуйте позже.</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Попробовать снова
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPaintings.length > 0 ? (
            filteredPaintings.map((painting) => (
              <div key={painting._id} className="art-card group">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={painting.image.includes('http') ? painting.image : `${import.meta.env.VITE_API_URL}${painting.image}`}
                    alt={painting.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button 
                    className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 flex items-center justify-center text-gray-700 hover:text-red-500 transition-colors"
                    aria-label="Add to favorites"
                  >
                    <Heart className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-display text-xl">{painting.title}</h3>
                  <div className="flex items-center mt-1 text-sm text-gray-600">
                    <User className="h-3.5 w-3.5 mr-1" />
                    <span>{getAuthorName(painting)}</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">
                    {painting.materials} • {painting.size}
                  </p>
                  <p className="text-gray-700 mt-2 line-clamp-2">{painting.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-lg font-semibold">{formatPrice(painting.price)}</span>
                    <Button 
                      size="sm"
                      onClick={() => handleAddToCart(painting)}
                      disabled={!painting.inStock}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {painting.inStock ? 'В корзину' : 'Продано'}
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center p-10">
              <p className="text-lg">По вашему запросу ничего не найдено</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
