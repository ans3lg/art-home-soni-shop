
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LayoutDashboard, Package, UserCog } from "lucide-react";
import { useState } from "react";

const AdminPanelPage = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'workshops'>('orders');

  return (
    <div className="section-container">
      <h1 className="page-title">Панель администратора</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="dashboard-card">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-primary/10 rounded-lg">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Заказы</h3>
              <p className="text-muted-foreground">12 новых</p>
            </div>
          </div>
        </Card>
        
        <Card className="dashboard-card">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-primary/10 rounded-lg">
              <LayoutDashboard className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Товары</h3>
              <p className="text-muted-foreground">45 активных</p>
            </div>
          </div>
        </Card>
        
        <Card className="dashboard-card">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-primary/10 rounded-lg">
              <UserCog className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Пользователи</h3>
              <p className="text-muted-foreground">89 активных</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Управление</CardTitle>
            <div className="space-x-2">
              <Button
                variant={activeTab === 'orders' ? 'default' : 'outline'}
                onClick={() => setActiveTab('orders')}
              >
                Заказы
              </Button>
              <Button
                variant={activeTab === 'products' ? 'default' : 'outline'}
                onClick={() => setActiveTab('products')}
              >
                Товары
              </Button>
              <Button
                variant={activeTab === 'workshops' ? 'default' : 'outline'}
                onClick={() => setActiveTab('workshops')}
              >
                Мастер-классы
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === 'orders' && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Клиент</TableHead>
                  <TableHead>Сумма</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>ORD-001</TableCell>
                  <TableCell>Иван Иванов</TableCell>
                  <TableCell>25600 ₽</TableCell>
                  <TableCell>В обработке</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">Обработать</Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
          
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex justify-between">
                <Input placeholder="Поиск товаров..." className="max-w-sm" />
                <Button>Добавить товар</Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Название</TableHead>
                    <TableHead>Цена</TableHead>
                    <TableHead>Наличие</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>PRD-001</TableCell>
                    <TableCell>Пейзаж "Весна"</TableCell>
                    <TableCell>25600 ₽</TableCell>
                    <TableCell>В наличии</TableCell>
                    <TableCell className="space-x-2">
                      <Button variant="outline" size="sm">Изменить</Button>
                      <Button variant="destructive" size="sm">Удалить</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
          
          {activeTab === 'workshops' && (
            <div className="space-y-4">
              <div className="flex justify-between">
                <Input placeholder="Поиск мастер-классов..." className="max-w-sm" />
                <Button>Добавить мастер-класс</Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Название</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead>Мест</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>WS-001</TableCell>
                    <TableCell>Основы живописи</TableCell>
                    <TableCell>2024-05-01</TableCell>
                    <TableCell>8/10</TableCell>
                    <TableCell className="space-x-2">
                      <Button variant="outline" size="sm">Изменить</Button>
                      <Button variant="destructive" size="sm">Отменить</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanelPage;
