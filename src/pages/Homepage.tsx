import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Paintbrush, Users, Image, ShoppingCart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/CartContext";

// Mock data for featured paintings
const featuredPaintings = [
  {
    id: "1",
    title: "Летний бриз",
    materials: "Холст, масло",
    size: "60×80 см",
    price: 14500,
    image: "https://images.unsplash.com/photo-1549887552-cb1071d3e5ca"
  },
  {
    id: "2",
    title: "Горное озеро",
    materials: "Холст, акрил",
    size: "50×70 см",
    price: 12800,
    image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9"
  },
  {
    id: "3",
    title: "Весеннее настроение",
    materials: "Холст, масло",
    size: "40×50 см",
    price: 8900,
    image: "https://images.unsplash.com/photo-1574182245530-967d9b3831af"
  }
];

export default function Homepage() {
  const { addItem } = useCart();
  const { toast } = useToast();
  
  const handleAddToCart = (painting: typeof featuredPaintings[0]) => {
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
  
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-studio-100 to-peach-100 py-16">
        <div className="section-container">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 animate-fade-in">
              Добро пожаловать в Art Home Soni
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mb-8 animate-slide-up">
              Откройте для себя уникальные произведения искусства и творческие мастер-классы, 
              которые вдохновят вас на творчество и наполнят вашу жизнь красотой.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <Button asChild size="lg" className="bg-studio-600 hover:bg-studio-700">
                <Link to="/paintings">Смотреть галерею</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-studio-600 text-studio-600 hover:bg-studio-50">
                <Link to="/workshops">Записаться на мастер-класс</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Paintings */}
      <section className="py-16 bg-white">
        <div className="section-container">
          <h2 className="section-title text-center">Популярные картины</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {featuredPaintings.map((painting) => (
              <div key={painting.id} className="art-card">
                <div className="aspect-[4/3] bg-gray-200">
                  <img 
                    src={painting.image} 
                    alt={painting.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-display text-xl">{painting.title}</h3>
                  <p className="text-gray-600 mt-1">{painting.materials} • {painting.size}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-lg font-semibold">
                      {painting.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₽
                    </span>
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
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Button asChild variant="outline" size="lg">
              <Link to="/paintings">Посмотреть все картины</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Workshops Section */}
      <section className="py-16 bg-studio-50">
        <div className="section-container">
          <h2 className="section-title text-center">Ближайшие мастер-классы</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {/* Workshop 1 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-16 w-16 bg-studio-100 rounded-lg text-studio-600 flex items-center justify-center">
                  <Paintbrush className="h-8 w-8" />
                </div>
                <div className="ml-6">
                  <h3 className="font-display text-xl mb-2">Акварельный пейзаж</h3>
                  <p className="text-gray-600 mb-3">
                    Научитесь создавать атмосферные пейзажи в технике акварельной живописи.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-studio-100 text-studio-700 px-2 py-1 rounded-md text-sm">
                      30 апреля, 15:00
                    </span>
                    <span className="bg-peach-100 text-peach-700 px-2 py-1 rounded-md text-sm">
                      2 часа
                    </span>
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm">
                      Начинающий
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">1 500 ₽</span>
                    <Button asChild size="sm">
                      <Link to="/workshops/1">Записаться</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Workshop 2 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-16 w-16 bg-peach-100 rounded-lg text-peach-600 flex items-center justify-center">
                  <Paintbrush className="h-8 w-8" />
                </div>
                <div className="ml-6">
                  <h3 className="font-display text-xl mb-2">Масляная живопись</h3>
                  <p className="text-gray-600 mb-3">
                    Классический мастер-класс по созданию натюрморта маслом на холсте.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-studio-100 text-studio-700 px-2 py-1 rounded-md text-sm">
                      2 мая, 18:00
                    </span>
                    <span className="bg-peach-100 text-peach-700 px-2 py-1 rounded-md text-sm">
                      3 часа
                    </span>
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm">
                      Любой уровень
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">2 200 ₽</span>
                    <Button asChild size="sm">
                      <Link to="/workshops/2">Записаться</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Button asChild variant="outline" size="lg">
              <Link to="/workshops">Все мастер-классы</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title">О студии Art Home Soni</h2>
              <p className="text-lg mb-4">
                Art Home Soni — это творческое пространство для всех, кто любит искусство. 
                Наша студия была основана в 2018 году талантливой художницей Софией Александровой.
              </p>
              <p className="text-lg mb-6">
                Мы предлагаем уникальные оригинальные картины, созданные нашими художниками, 
                а также проводим мастер-классы для начинающих и опытных творцов.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="flex flex-col items-center p-4 bg-studio-50 rounded-lg">
                  <Paintbrush className="h-8 w-8 text-studio-600 mb-2" />
                  <h3 className="text-lg font-semibold">50+</h3>
                  <p className="text-gray-600 text-sm text-center">Уникальных картин</p>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-peach-50 rounded-lg">
                  <Users className="h-8 w-8 text-peach-600 mb-2" />
                  <h3 className="text-lg font-semibold">500+</h3>
                  <p className="text-gray-600 text-sm text-center">Счастливых клиентов</p>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
                  <Image className="h-8 w-8 text-blue-600 mb-2" />
                  <h3 className="text-lg font-semibold">20+</h3>
                  <p className="text-gray-600 text-sm text-center">Мастер-классов</p>
                </div>
              </div>
              
              <Button asChild size="lg">
                <Link to="/about">Узнать больше</Link>
              </Button>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/3] bg-gray-200 rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1"
                  alt="Художественная студия"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-studio-100 rounded-xl -z-10"></div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-peach-100 rounded-xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
