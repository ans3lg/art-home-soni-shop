
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Clock, CalendarDays } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Mock data for tracking
const mockBookings = [
  {
    id: "WS-2025-042",
    name: "Иванова Анна",
    workshop: "Акварельный пейзаж",
    date: "30 апреля, 15:00",
    status: "confirmed",
    paid: true
  },
  {
    id: "WS-2025-057",
    name: "Петров Сергей",
    workshop: "Масляная живопись",
    date: "2 мая, 18:00",
    status: "pending",
    paid: false
  }
];

type BookingStatus = "confirmed" | "pending" | "cancelled";

interface Booking {
  id: string;
  name: string;
  workshop: string;
  date: string;
  status: BookingStatus;
  paid: boolean;
}

export default function TrackingPage() {
  const [trackingId, setTrackingId] = useState("");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const handleTrackingSubmit = () => {
    if (!trackingId) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите номер заявки",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulating API call with timeout
    setTimeout(() => {
      const foundBooking = mockBookings.find(b => b.id === trackingId);
      
      if (foundBooking) {
        setBooking(foundBooking);
      } else {
        toast({
          title: "Заявка не найдена",
          description: "Проверьте правильность введенного номера",
          variant: "destructive",
        });
      }
      
      setIsLoading(false);
    }, 800);
  };
  
  const getStatusInfo = (status: BookingStatus) => {
    switch (status) {
      case "confirmed":
        return {
          label: "Подтверждена",
          color: "bg-green-100 text-green-800",
          icon: <Check className="h-4 w-4" />,
          description: "Ваша заявка подтверждена. Ждем вас на мастер-классе!"
        };
      case "pending":
        return {
          label: "В обработке",
          color: "bg-yellow-100 text-yellow-800",
          icon: <Clock className="h-4 w-4" />,
          description: "Ваша заявка находится в обработке. Мы свяжемся с вами в ближайшее время."
        };
      case "cancelled":
        return {
          label: "Отменена",
          color: "bg-red-100 text-red-800",
          icon: <X className="h-4 w-4" />,
          description: "Ваша заявка отменена."
        };
      default:
        return {
          label: "Неизвестно",
          color: "bg-gray-100 text-gray-800",
          icon: null,
          description: ""
        };
    }
  };
  
  const getPaymentStatus = (isPaid: boolean) => {
    return isPaid
      ? { label: "Оплачено", color: "bg-green-100 text-green-800" }
      : { label: "Не оплачено", color: "bg-gray-100 text-gray-800" };
  };

  return (
    <div className="section-container">
      <h1 className="page-title">Отслеживание заявки</h1>
      
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="mb-6">
            <p className="text-lg mb-4">
              Введите номер вашей заявки, чтобы проверить её статус
            </p>
            <div className="flex gap-4">
              <Input
                placeholder="Например: WS-2025-042"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
              />
              <Button onClick={handleTrackingSubmit} disabled={isLoading}>
                {isLoading ? "Проверка..." : "Проверить"}
              </Button>
            </div>
            <div className="text-sm text-gray-500 mt-2">
              * Номер заявки был отправлен на ваш email после оформления
            </div>
          </div>
          
          {/* Sample tracking numbers */}
          <div className="bg-studio-50 p-4 rounded-lg text-sm">
            <p className="font-medium mb-2">Тестовые номера заявок:</p>
            <p>WS-2025-042 - подтвержденная заявка</p>
            <p>WS-2025-057 - заявка в обработке</p>
          </div>
        </div>
        
        {booking && (
          <Card className="mt-8 animate-fade-in">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl">Заявка №{booking.id}</CardTitle>
                  <CardDescription>{booking.name}</CardDescription>
                </div>
                
                {booking.status && (
                  <Badge className={getStatusInfo(booking.status).color}>
                    <span className="flex items-center">
                      {getStatusInfo(booking.status).icon}
                      <span className="ml-1">{getStatusInfo(booking.status).label}</span>
                    </span>
                  </Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-lg">{booking.workshop}</h3>
                <div className="flex items-center mt-2 text-gray-700">
                  <CalendarDays className="h-5 w-5 mr-2" />
                  <span>{booking.date}</span>
                </div>
              </div>
              
              <div>
                <p className="text-gray-700">{getStatusInfo(booking.status).description}</p>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-medium">Статус оплаты:</span>
                <Badge className={getPaymentStatus(booking.paid).color}>
                  {getPaymentStatus(booking.paid).label}
                </Badge>
              </div>
            </CardContent>
            
            <CardFooter className="border-t pt-4">
              <div className="w-full flex justify-end space-x-2">
                <Button variant="outline">Распечатать</Button>
                {!booking.paid && <Button>Оплатить заявку</Button>}
              </div>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
