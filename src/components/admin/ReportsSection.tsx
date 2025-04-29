
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, LineChart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import {
  BarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ReportsSection = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [salesPeriod, setSalesPeriod] = useState("month");
  const [workshopsPeriod, setWorkshopsPeriod] = useState("month");
  
  // Запросы для получения отчетов
  const salesReport = useQuery({
    queryKey: ['sales-report', salesPeriod],
    queryFn: () => token ? api.getSalesReport(salesPeriod, token) : Promise.resolve(null),
    enabled: !!token,
  });
  
  const workshopsReport = useQuery({
    queryKey: ['workshops-report', workshopsPeriod],
    queryFn: () => token ? api.getWorkshopsReport(workshopsPeriod, token) : Promise.resolve(null),
    enabled: !!token,
  });
  
  // Функция для экспорта отчетов
  const handleExportReport = async (type: 'sales' | 'workshops', period: string) => {
    try {
      if (!token) return;
      
      const blob = await api.exportReport(type, period, token);
      
      // Создаем ссылку для скачивания файла
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-report-${period}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      
      toast({
        title: "Отчет создан",
        description: "Файл Excel был успешно загружен",
      });
    } catch (error) {
      console.error('Error exporting report:', error);
      toast({ 
        title: "Ошибка", 
        description: "Не удалось экспортировать отчет",
        variant: "destructive" 
      });
    }
  };
  
  // Форматирование данных для графика продаж
  const formatSalesChartData = () => {
    if (!salesReport.data?.chartData) return [];
    return salesReport.data.chartData.map((item: any) => ({
      date: item.date,
      выручка: item.amount
    }));
  };
  
  // Форматирование данных для графика мастер-классов
  const formatWorkshopsChartData = () => {
    if (!workshopsReport.data?.chartData) return [];
    return workshopsReport.data.chartData.map((item: any) => ({
      date: item.date,
      участники: item.participants
    }));
  };
  
  // Форматирование суммы в рубли
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(value);
  };
  
  return (
    <Tabs defaultValue="sales" className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="sales">Отчет по продажам</TabsTrigger>
          <TabsTrigger value="workshops">Отчет по мастер-классам</TabsTrigger>
        </TabsList>
      </div>
      
      {/* Отчет по продажам */}
      <TabsContent value="sales">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-medium">Период:</h3>
              <Select
                value={salesPeriod}
                onValueChange={setSalesPeriod}
              >
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Неделя</SelectItem>
                  <SelectItem value="month">Месяц</SelectItem>
                  <SelectItem value="quarter">Квартал</SelectItem>
                  <SelectItem value="year">Год</SelectItem>
                  <SelectItem value="all">Все время</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button variant="outline" onClick={() => handleExportReport('sales', salesPeriod)}>
              <Download className="mr-2 h-4 w-4" />
              Экспорт в Excel
            </Button>
          </div>
          
          {salesReport.isLoading ? (
            <div className="flex justify-center py-8">Загрузка отчета...</div>
          ) : salesReport.error ? (
            <div className="text-center py-8 text-red-500">Ошибка при загрузке отчета</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Общая выручка
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(salesReport.data?.totalSales || 0)}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Количество заказов
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {salesReport.data?.totalOrders || 0}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Средний чек
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(salesReport.data?.averageOrderValue || 0)}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LineChart className="mr-2 h-5 w-5" />
                    Динамика продаж
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart
                        data={formatSalesChartData()}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="выручка" 
                          stroke="#8884d8" 
                          activeDot={{ r: 8 }} 
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {salesReport.data?.topProducts && salesReport.data.topProducts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Популярные товары</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={salesReport.data.topProducts.slice(0, 5).map((product: any) => ({
                            name: product.title,
                            Количество: product.quantity,
                            Выручка: product.revenue
                          }))}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 60,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="name" 
                            angle={-45} 
                            textAnchor="end"
                            height={70}
                          />
                          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                          <YAxis 
                            yAxisId="right" 
                            orientation="right" 
                            stroke="#82ca9d"
                            tickFormatter={(value) => `${value} ₽`}
                          />
                          <Tooltip formatter={(value, name) => {
                            if (name === 'Выручка') return formatCurrency(Number(value));
                            return value;
                          }} />
                          <Legend />
                          <Bar yAxisId="left" dataKey="Количество" fill="#8884d8" />
                          <Bar yAxisId="right" dataKey="Выручка" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </TabsContent>
      
      {/* Отчет по мастер-классам */}
      <TabsContent value="workshops">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-medium">Период:</h3>
              <Select
                value={workshopsPeriod}
                onValueChange={setWorkshopsPeriod}
              >
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Неделя</SelectItem>
                  <SelectItem value="month">Месяц</SelectItem>
                  <SelectItem value="quarter">Квартал</SelectItem>
                  <SelectItem value="year">Год</SelectItem>
                  <SelectItem value="all">Все время</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button variant="outline" onClick={() => handleExportReport('workshops', workshopsPeriod)}>
              <Download className="mr-2 h-4 w-4" />
              Экспорт в Excel
            </Button>
          </div>
          
          {workshopsReport.isLoading ? (
            <div className="flex justify-center py-8">Загрузка отчета...</div>
          ) : workshopsReport.error ? (
            <div className="text-center py-8 text-red-500">Ошибка при загрузке отчета</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Количество мастер-классов
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {workshopsReport.data?.totalWorkshops || 0}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Количество участников
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {workshopsReport.data?.totalParticipants || 0}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Выручка
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(workshopsReport.data?.revenue || 0)}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Среднее кол-во участников
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {workshopsReport.data?.averageParticipants?.toFixed(1) || 0}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LineChart className="mr-2 h-5 w-5" />
                    Динамика участников
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart
                        data={formatWorkshopsChartData()}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="участники" 
                          stroke="#82ca9d" 
                          activeDot={{ r: 8 }} 
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {workshopsReport.data?.workshopStats && workshopsReport.data.workshopStats.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Загрузка мастер-классов</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={workshopsReport.data.workshopStats.slice(0, 5).map((workshop: any) => ({
                            name: workshop.title,
                            Участники: workshop.participants,
                            Вместимость: workshop.capacity
                          }))}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 60,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="name" 
                            angle={-45} 
                            textAnchor="end"
                            height={70}
                          />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="Вместимость" stackId="a" fill="#8884d8" />
                          <Bar dataKey="Участники" stackId="a" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ReportsSection;
