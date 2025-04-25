
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

// Определяем перечисление для статусов бронирования
enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  COMPLETED = "completed",
  CANCELLED = "cancelled"
}

// Определяем интерфейс для типа бронирования
interface Booking {
  id: string;
  name: string;
  workshop: string;
  date: string;
  status: BookingStatus;
  paid: boolean;
}

export default function TrackingPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Проверяем, есть ли id в URL параметрах
    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    if (id) {
      setOrderNumber(id);
      handleTrack(id);
    }
  }, [location]);

  const handleTrack = (id: string = orderNumber) => {
    if (!id.trim()) {
      toast.error("Пожалуйста, введите номер заказа или бронирования");
      return;
    }

    setIsLoading(true);

    // Имитация API запроса
    setTimeout(() => {
      // Мок данные бронирования
      if (id === "WS123") {
        setBooking({
          id: "WS123",
          name: "Иванова Анна",
          workshop: "Масляная живопись для начинающих",
          date: "15 мая 2025, 18:00",
          status: BookingStatus.CONFIRMED,
          paid: true
        });
        toast.success("Информация о бронировании найдена");
      } else if (id === "WS124") {
        setBooking({
          id: "WS124",
          name: "Петров Сергей",
          workshop: "Акварельный скетчинг",
          date: "20 мая 2025, 16:00",
          status: BookingStatus.PENDING,
          paid: false
        });
        toast.success("Информация о бронировании найдена");
      } else {
        setBooking(null);
        toast.error("Бронирование не найдено");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="section-container">
      <h1 className="page-title">Отслеживание бронирования</h1>
      
      <div className="max-w-2xl mx-auto mb-10">
        <div className="flex gap-4">
          <Input
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="Введите номер бронирования"
            className="flex-1"
          />
          <Button onClick={() => handleTrack()} disabled={isLoading}>
            {isLoading ? "Поиск..." : "Проверить"}
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground mt-2">
          Введите номер бронирования, полученный при оформлении заказа или записи на мастер-класс.
        </p>
      </div>

      {booking && (
        <div className="max-w-3xl mx-auto bg-card rounded-xl p-6 shadow-md">
          <h2 className="text-2xl font-display mb-4">Информация о бронировании</h2>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Номер</TableHead>
                <TableHead>Имя</TableHead>
                <TableHead>Мастер-класс</TableHead>
                <TableHead>Дата и время</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Оплата</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">{booking.id}</TableCell>
                <TableCell>{booking.name}</TableCell>
                <TableCell>{booking.workshop}</TableCell>
                <TableCell>{booking.date}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    booking.status === BookingStatus.CONFIRMED ? 'bg-green-100 text-green-800' : 
                    booking.status === BookingStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                    booking.status === BookingStatus.COMPLETED ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {booking.status === BookingStatus.CONFIRMED ? 'Подтверждено' : 
                     booking.status === BookingStatus.PENDING ? 'Ожидает подтверждения' :
                     booking.status === BookingStatus.COMPLETED ? 'Завершено' : 
                     'Отменено'}
                  </span>
                </TableCell>
                <TableCell>
                  {booking.paid ? 
                    <span className="text-green-600 font-medium">Оплачено</span> : 
                    <span className="text-red-600 font-medium">Не оплачено</span>}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Статус вашего бронирования</h3>
            <div className="relative">
              <div className="flex justify-between mb-1">
                <div className="text-sm">Заявка</div>
                <div className="text-sm">Подтверждение</div>
                <div className="text-sm">Проведение</div>
                <div className="text-sm">Завершено</div>
              </div>
              <div className="h-2 bg-muted rounded overflow-hidden">
                <div 
                  className="h-full bg-primary" 
                  style={{ 
                    width: booking.status === BookingStatus.PENDING ? '25%' : 
                           booking.status === BookingStatus.CONFIRMED ? '50%' : 
                           booking.status === BookingStatus.COMPLETED ? '100%' : '0%' 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!booking && !isLoading && orderNumber && (
        <div className="max-w-md mx-auto text-center p-6 bg-muted rounded-lg">
          <h3 className="text-lg font-semibold">Бронирование не найдено</h3>
          <p className="mt-2">Проверьте правильность введенного номера или свяжитесь с нами для помощи.</p>
        </div>
      )}

      <div className="mt-16 max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-display mb-4">Нужна помощь?</h2>
        <p className="mb-6">Если у вас возникли вопросы по вашему бронированию, свяжитесь с нами:</p>
        <div className="flex justify-center space-x-6">
          <Button variant="outline">По телефону</Button>
          <Button variant="outline">По электронной почте</Button>
        </div>
      </div>
    </div>
  );
}
