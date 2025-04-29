
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Tabs,
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { ShoppingCart, Heart, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/CartContext";
import { api } from "@/services/api";
import { Card } from "@/components/ui/card";

interface Painting {
  _id: string;
  id: number;
  title: string;
  description: string;
  category: string;
  materials: string;
  size: string;
  price: number;
  image: string;
}

export default function PaintingsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { addItem } = useCart();
  
  useEffect(() => {
    const fetchPaintings = async () => {
      try {
        setLoading(true);
        // Пока API не готов, будем использовать моковые данные
        // const data = await api.getPaintings();
        // setPaintings(data);
        
        // Временные моковые данные
        const mockData = [
          {
            _id: "1",
            id: 1,
            title: "Летний бриз",
            description: "Яркая летняя композиция с элементами природы и цветов.",
            category: "abstract",
            materials: "Холст, масло",
            size: "60×80 см",
            price: 14500,
            image: "https://images.unsplash.com/photo-1549887552-cb1071d3e5ca"
          },
          {
            _id: "2",
            id: 2,
            title: "Горное озеро",
            description: "Умиротворяющий пейзаж с отражением гор в кристально чистой воде.",
            category: "landscape",
            materials: "Холст, акрил",
            size: "50×70 см",
            price: 12800,
            image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9"
          },
          {
            _id: "3",
            id: 3,
            title: "Весеннее настроение",
            description: "Нежный натюрморт с весенними цветами и декоративными элементами.",
            category: "stilllife",
            materials: "Холст, масло",
            size: "40×50 см",
            price: 8900,
            image: "https://images.unsplash.com/photo-1574182245530-967d9b3831af"
          },
          {
            _id: "4",
            id: 4,
            title: "Городская осень",
            description: "Уютная городская улица в осенних красках и теплом солнечном свете.",
            category: "landscape",
            materials: "Холст, акрил",
            size: "60×90 см",
            price: 16200,
            image: "https://images.unsplash.com/photo-1572883454114-1cf0031ede2a"
          },
          {
            _id: "5",
            id: 5,
            title: "Абстрактная гармония",
            description: "Динамичная композиция с глубоким смыслом и интересными цветовыми решениями.",
            category: "abstract",
            materials: "Холст, акрил",
            size: "80×100 см",
            price: 18500,
            image: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5"
          },
          {
            _id: "6",
            id: 6,
            title: "Магнолия в цвету",
            description: "Нежный и воздушный натюрморт с ветками магнолии в керамической вазе.",
            category: "stilllife",
            materials: "Холст, масло",
            size: "50×60 см",
            price: 11300,
            image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5"
          }
        ];
        
        setPaintings(mockData);
        setLoading(false);
      } catch (err) {
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
    addItem({
      id: painting.id,
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
                    src={painting.image} 
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
                  <p className="text-gray-600 text-sm mt-1">
                    {painting.materials} • {painting.size}
                  </p>
                  <p className="text-gray-700 mt-2 line-clamp-2">{painting.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-lg font-semibold">{formatPrice(painting.price)}</span>
                    <Button 
                      size="sm"
                      onClick={() => handleAddToCart(painting)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      В корзину
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
