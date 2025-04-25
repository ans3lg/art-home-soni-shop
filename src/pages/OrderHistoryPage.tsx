
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

const OrderHistoryPage = () => {
  const orders = [
    {
      id: "ORD-001",
      date: "2024-04-20",
      items: ["Пейзаж 'Весна'", "Натюрморт 'Цветы'"],
      total: "25600",
      status: "Доставлен"
    },
    {
      id: "ORD-002",
      date: "2024-04-15",
      items: ["Мастер-класс 'Основы живописи'"],
      total: "5000",
      status: "Завершен"
    },
    {
      id: "ORD-003",
      date: "2024-04-10",
      items: ["Портрет 'Незнакомка'"],
      total: "15000",
      status: "В обработке"
    }
  ];

  return (
    <div className="section-container">
      <h1 className="page-title">История заказов</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-6 w-6" />
            Ваши заказы
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Номер заказа</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Товары</TableHead>
                <TableHead>Сумма</TableHead>
                <TableHead>Статус</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.items.join(", ")}</TableCell>
                  <TableCell>{order.total} ₽</TableCell>
                  <TableCell>{order.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderHistoryPage;
