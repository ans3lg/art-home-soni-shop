
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Paintbrush, Calendar as CalendarIcon, Users } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

// Mock data for workshops
const workshops = [
  {
    id: 1,
    title: "Акварельный пейзаж",
    description: "Научитесь создавать атмосферные пейзажи в технике акварельной живописи.",
    date: "2025-04-30T15:00:00",
    duration: "2 часа",
    level: "Начинающий",
    price: 1500,
    spots: 8,
    spotsAvailable: 3,
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b"
  },
  {
    id: 2,
    title: "Масляная живопись",
    description: "Классический мастер-класс по созданию натюрморта маслом на холсте.",
    date: "2025-05-02T18:00:00",
    duration: "3 часа",
    level: "Любой уровень",
    price: 2200,
    spots: 10,
    spotsAvailable: 5,
    image: "https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1"
  },
  {
    id: 3,
    title: "Графические техники",
    description: "Изучение основных техник графического искусства и создание своей работы.",
    date: "2025-05-05T17:00:00",
    duration: "2.5 часа",
    level: "Средний",
    price: 1800,
    spots: 12,
    spotsAvailable: 8,
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f"
  },
  {
    id: 4,
    title: "Портрет акрилом",
    description: "Мастер-класс по написанию портрета с использованием акриловых красок.",
    date: "2025-05-08T19:00:00",
    duration: "3 часа",
    level: "Продвинутый",
    price: 2500,
    spots: 8,
    spotsAvailable: 4,
    image: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7"
  }
];

export default function WorkshopsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState<typeof workshops[0] | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const { toast } = useToast();
  
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
  
  const handleRegisterClick = (workshop: typeof workshops[0]) => {
    setSelectedWorkshop(workshop);
    setIsRegisterDialogOpen(true);
  };
  
  const handleRegisterSubmit = () => {
    if (selectedWorkshop) {
      // In a real app, this would submit to a backend
      toast({
        title: "Заявка отправлена!",
        description: `Вы успешно записались на мастер-класс "${selectedWorkshop.title}". Мы свяжемся с вами для подтверждения.`,
        duration: 5000,
      });
      setIsRegisterDialogOpen(false);
      setFormData({ name: "", email: "", phone: "" });
    }
  };
  
  const getWorkshopDateDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "d MMMM, HH:mm", { locale: ru });
  };
  
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₽";
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
            <div className="space-y-8">
              {filteredWorkshops.length > 0 ? (
                filteredWorkshops.map((workshop) => (
                  <div key={workshop.id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row">
                    <div className="w-full md:w-1/3 aspect-video md:aspect-auto">
                      <img 
                        src={workshop.image} 
                        alt={workshop.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 flex-1">
                      <h3 className="font-display text-xl mb-2">{workshop.title}</h3>
                      <p className="text-gray-700 mb-4">{workshop.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center">
                          <CalendarIcon className="h-5 w-5 text-studio-600 mr-2" />
                          <span>{getWorkshopDateDisplay(workshop.date)}</span>
                        </div>
                        <div className="flex items-center">
                          <Paintbrush className="h-5 w-5 text-studio-600 mr-2" />
                          <span>{workshop.level}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-semibold mr-2">Длительность:</span>
                          <span>{workshop.duration}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-5 w-5 text-studio-600 mr-2" />
                          <span>{workshop.spotsAvailable} из {workshop.spots} мест</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-xl font-semibold">{formatPrice(workshop.price)}</span>
                        <Button 
                          onClick={() => handleRegisterClick(workshop)}
                          disabled={workshop.spotsAvailable === 0}
                        >
                          {workshop.spotsAvailable > 0 ? "Записаться" : "Мест нет"}
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
