
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Paintbrush, Calendar as CalendarIcon, Users, User, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { api } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

interface Workshop {
  _id: string;
  title: string;
  description: string;
  date: string;
  duration: string;
  price: number;
  availableSpots: number;
  image: string;
  location: string;
  author: {
    _id: string;
    name: string;
  } | string;
  authorName: string;
  registeredParticipants: {
    userId: string;
    name: string;
    email: string;
    phone: string;
    registeredAt: string;
  }[];
}

export default function WorkshopsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, token, isAuthenticated } = useAuth();
  
  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        setLoading(true);
        const data = await api.getWorkshops();
        setWorkshops(data);
        setLoading(false);
      } catch (err) {
        setError("Не удалось загрузить мастер-классы");
        setLoading(false);
        console.error("Error fetching workshops:", err);
      }
    };

    fetchWorkshops();
  }, []);

  useEffect(() => {
    if (user && isAuthenticated) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
      });
    }
  }, [user, isAuthenticated]);
  
  // Filter workshops by selected date if any
  const filteredWorkshops = selectedDate
    ? workshops.filter(workshop => {
        const workshopDate = new Date(workshop.date);
        return (
          workshopDate.getDate() === selectedDate.getDate() &&
          workshopDate.getMonth() === selectedDate.getMonth() &&
          workshopDate.getFullYear() === selectedDate.getFullYear()
        );
      })
    : workshops;
  
  const handleRegisterClick = (workshop: Workshop) => {
    if (!isAuthenticated) {
      toast({
        title: "Требуется авторизация",
        description: "Пожалуйста, авторизуйтесь чтобы записаться на мастер-класс",
        duration: 3000,
      });
      return;
    }
    
    setSelectedWorkshop(workshop);
    setIsRegisterDialogOpen(true);
  };
  
  const handleRegisterSubmit = async () => {
    if (selectedWorkshop && token) {
      try {
        await api.bookWorkshop(
          selectedWorkshop._id,
          { 
            name: formData.name,
            email: formData.email,
            phone: formData.phone
          }, 
          token
        );
        
        toast({
          title: "Заявка отправлена!",
          description: `Вы успешно записались на мастер-класс "${selectedWorkshop.title}".`,
          duration: 5000,
        });
        
        // Обновляем список мастер-классов
        const updatedWorkshops = await api.getWorkshops();
        setWorkshops(updatedWorkshops);
        
        setIsRegisterDialogOpen(false);
        
      } catch (error: any) {
        toast({
          title: "Ошибка",
          description: error.message || "Не удалось записаться на мастер-класс",
          variant: "destructive",
        });
      }
    }
  };
  
  const getWorkshopDateDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "d MMMM, HH:mm", { locale: ru });
  };
  
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₽";
  };

  const getAuthorName = (workshop: Workshop): string => {
    if (typeof workshop.author === 'object' && workshop.author !== null) {
      return workshop.author.name;
    }
    return workshop.authorName || 'Неизвестный автор';
  };
  
  return (
    <>
      <div className="section-container">
        <h1 className="page-title">Мастер-классы</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm">
            <h2 className="font-display text-2xl mb-4">Выберите дату</h2>
            <div className="bg-studio-50 p-4 rounded-lg">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="border-none bg-transparent"
                locale={ru}
              />
            </div>
            {selectedDate && (
              <div className="mt-4 flex justify-end">
                <Button variant="outline" onClick={() => setSelectedDate(undefined)} size="sm">
                  Сбросить выбор
                </Button>
              </div>
            )}
          </div>
          
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p>Загрузка мастер-классов...</p>
              </div>
            ) : error ? (
              <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                <h3 className="text-lg text-red-500 font-medium mb-2">{error}</h3>
                <p className="mb-4">Пожалуйста, проверьте соединение или попробуйте позже.</p>
                <Button onClick={() => window.location.reload()}>Попробовать снова</Button>
              </div>
            ) : (
              <div className="space-y-8">
                {filteredWorkshops.length > 0 ? (
                  filteredWorkshops.map((workshop) => (
                    <div key={workshop._id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row">
                      <div className="w-full md:w-1/3 aspect-video md:aspect-auto">
                        <img 
                          src={workshop.image.includes('http') ? workshop.image : `${import.meta.env.VITE_API_URL}${workshop.image}`}
                          alt={workshop.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6 flex-1">
                        <h3 className="font-display text-xl mb-2">{workshop.title}</h3>
                        <div className="flex items-center text-gray-600 text-sm mb-3">
                          <User className="h-4 w-4 mr-1" />
                          <span>{getAuthorName(workshop)}</span>
                        </div>
                        <p className="text-gray-700 mb-4">{workshop.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center">
                            <CalendarIcon className="h-5 w-5 text-studio-600 mr-2" />
                            <span>{getWorkshopDateDisplay(workshop.date)}</span>
                          </div>
                          <div className="flex items-center">
                            <Paintbrush className="h-5 w-5 text-studio-600 mr-2" />
                            <span>{workshop.duration}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-semibold mr-2">Место:</span>
                            <span>{workshop.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-5 w-5 text-studio-600 mr-2" />
                            <span>{workshop.availableSpots} мест доступно</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-xl font-semibold">{formatPrice(workshop.price)}</span>
                          <Button 
                            onClick={() => handleRegisterClick(workshop)}
                            disabled={workshop.availableSpots === 0}
                          >
                            {workshop.availableSpots > 0 ? "Записаться" : "Мест нет"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                    <h3 className="text-xl font-medium mb-2">На выбранную дату нет мастер-классов</h3>
                    <p className="text-gray-600 mb-4">Пожалуйста, выберите другую дату или посмотрите все доступные мастер-классы</p>
                    <Button variant="outline" onClick={() => setSelectedDate(undefined)}>
                      Показать все мастер-классы
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Запись на мастер-класс</DialogTitle>
            <DialogDescription>
              {selectedWorkshop && (
                <>
                  <p className="font-semibold">{selectedWorkshop.title}</p>
                  <p>{getWorkshopDateDisplay(selectedWorkshop.date)}</p>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Имя и фамилия</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Введите ваше имя и фамилию"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email"
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="example@email.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Телефон</Label>
              <Input 
                id="phone" 
                value={formData.phone} 
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+7 (___) ___-__-__"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              onClick={handleRegisterSubmit}
              disabled={!formData.name || !formData.email || !formData.phone}
            >
              Отправить заявку
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
