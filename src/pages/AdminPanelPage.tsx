
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LayoutDashboard, Package, UserCog, ShoppingBag, Tags, Activity, Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Navigate } from 'react-router-dom';
import ReportsSection from "@/components/admin/ReportsSection";

type ActiveTabType = 'orders' | 'paintings' | 'workshops' | 'promocodes' | 'reports';

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
  registeredParticipants: any[];
}

interface Painting {
  _id: string;
  title: string;
  description: string;
  category: string;
  materials: string;
  size: string;
  price: number;
  image: string;
  inStock: boolean;
}

interface PromoCode {
  _id: string;
  code: string;
  discountPercent: number;
  maxUses: number;
  usedCount: number;
  active: boolean;
  expiresAt?: string;
}

interface Order {
  _id: string;
  items: any[];
  total: number;
  status: string;
  customerName: string;
  customerEmail: string;
  date: string;
}

const AdminPanelPage = () => {
  const { user, token, isAdmin } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<ActiveTabType>('orders');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [currentItem, setCurrentItem] = useState<any>(null);

  // Form states
  const [paintingForm, setPaintingForm] = useState({
    title: '',
    description: '',
    category: 'landscape',
    materials: '',
    size: '',
    price: 0,
    inStock: true,
    image: '',
  });

  const [workshopForm, setWorkshopForm] = useState({
    title: '',
    description: '',
    date: '',
    duration: '',
    price: 0,
    availableSpots: 0,
    location: '',
    image: '',
  });

  const [promoCodeForm, setPromoCodeForm] = useState({
    code: '',
    discountPercent: 10,
    maxUses: 100,
    expiresAt: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // Redirect if not admin
  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  // Queries
  const paintings = useQuery({
    queryKey: ['admin-paintings'],
    queryFn: () => api.getPaintings(),
  });

  const workshops = useQuery({
    queryKey: ['admin-workshops'],
    queryFn: () => api.getWorkshops(),
  });

  const orders = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => token ? api.getAllOrders(token) : Promise.resolve([]),
    enabled: !!token,
  });

  const promoCodes = useQuery({
    queryKey: ['admin-promocodes'],
    queryFn: () => token ? api.getPromoCodes(token) : Promise.resolve([]),
    enabled: !!token,
  });

  // Mutations
  const createPaintingMutation = useMutation({
    mutationFn: (data: FormData) => api.createPainting(data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-paintings'] });
      toast({ title: "Успешно", description: "Картина добавлена" });
      setIsModalOpen(false);
      resetForms();
    },
    onError: (error) => {
      toast({ 
        title: "Ошибка", 
        description: error instanceof Error ? error.message : "Не удалось добавить картину",
        variant: "destructive" 
      });
    }
  });

  const updatePaintingMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => api.updatePainting(id, data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-paintings'] });
      toast({ title: "Успешно", description: "Картина обновлена" });
      setIsModalOpen(false);
      resetForms();
    },
    onError: (error) => {
      toast({ 
        title: "Ошибка", 
        description: error instanceof Error ? error.message : "Не удалось обновить картину",
        variant: "destructive" 
      });
    }
  });

  const deletePaintingMutation = useMutation({
    mutationFn: (id: string) => api.deletePainting(id, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-paintings'] });
      toast({ title: "Успешно", description: "Картина удалена" });
    },
    onError: (error) => {
      toast({ 
        title: "Ошибка", 
        description: error instanceof Error ? error.message : "Не удалось удалить картину",
        variant: "destructive" 
      });
    }
  });

  const createWorkshopMutation = useMutation({
    mutationFn: (data: FormData) => api.createWorkshop(data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-workshops'] });
      toast({ title: "Успешно", description: "Мастер-класс добавлен" });
      setIsModalOpen(false);
      resetForms();
    },
    onError: (error) => {
      toast({ 
        title: "Ошибка", 
        description: error instanceof Error ? error.message : "Не удалось добавить мастер-класс",
        variant: "destructive" 
      });
    }
  });

  const updateWorkshopMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => api.updateWorkshop(id, data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-workshops'] });
      toast({ title: "Успешно", description: "Мастер-класс обновлен" });
      setIsModalOpen(false);
      resetForms();
    },
    onError: (error) => {
      toast({ 
        title: "Ошибка", 
        description: error instanceof Error ? error.message : "Не удалось обновить мастер-класс",
        variant: "destructive" 
      });
    }
  });

  const deleteWorkshopMutation = useMutation({
    mutationFn: (id: string) => api.deleteWorkshop(id, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-workshops'] });
      toast({ title: "Успешно", description: "Мастер-класс удален" });
    },
    onError: (error) => {
      toast({ 
        title: "Ошибка", 
        description: error instanceof Error ? error.message : "Не удалось удалить мастер-класс",
        variant: "destructive" 
      });
    }
  });

  const createPromoCodeMutation = useMutation({
    mutationFn: (data: any) => api.createPromoCode(data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-promocodes'] });
      toast({ title: "Успешно", description: "Промокод добавлен" });
      setIsModalOpen(false);
      resetForms();
    },
    onError: (error) => {
      toast({ 
        title: "Ошибка", 
        description: error instanceof Error ? error.message : "Не удалось добавить промокод",
        variant: "destructive" 
      });
    }
  });

  const updatePromoCodeMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updatePromoCode(id, data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-promocodes'] });
      toast({ title: "Успешно", description: "Промокод обновлен" });
      setIsModalOpen(false);
      resetForms();
    },
    onError: (error) => {
      toast({ 
        title: "Ошибка", 
        description: error instanceof Error ? error.message : "Не удалось обновить промокод",
        variant: "destructive" 
      });
    }
  });

  const deletePromoCodeMutation = useMutation({
    mutationFn: (id: string) => api.deletePromoCode(id, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-promocodes'] });
      toast({ title: "Успешно", description: "Промокод удален" });
    },
    onError: (error) => {
      toast({ 
        title: "Ошибка", 
        description: error instanceof Error ? error.message : "Не удалось удалить промокод",
        variant: "destructive" 
      });
    }
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => api.updateOrderStatus(id, status, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast({ title: "Успешно", description: "Статус заказа обновлен" });
    },
    onError: (error) => {
      toast({ 
        title: "Ошибка", 
        description: error instanceof Error ? error.message : "Не удалось обновить статус заказа",
        variant: "destructive" 
      });
    }
  });

  const handleOpenModal = (mode: 'create' | 'edit', item?: any) => {
    setModalMode(mode);
    setCurrentItem(item || null);

    if (mode === 'edit' && item) {
      if (activeTab === 'paintings') {
        setPaintingForm({
          title: item.title,
          description: item.description,
          category: item.category,
          materials: item.materials,
          size: item.size,
          price: item.price,
          inStock: item.inStock,
          image: item.image,
        });
      } else if (activeTab === 'workshops') {
        setWorkshopForm({
          title: item.title,
          description: item.description,
          date: new Date(item.date).toISOString().split('T')[0],
          duration: item.duration,
          price: item.price,
          availableSpots: item.availableSpots,
          location: item.location,
          image: item.image,
        });
      } else if (activeTab === 'promocodes') {
        setPromoCodeForm({
          code: item.code,
          discountPercent: item.discountPercent,
          maxUses: item.maxUses,
          expiresAt: item.expiresAt ? new Date(item.expiresAt).toISOString().split('T')[0] : '',
        });
      }
    }

    setIsModalOpen(true);
  };

  const resetForms = () => {
    setPaintingForm({
      title: '',
      description: '',
      category: 'landscape',
      materials: '',
      size: '',
      price: 0,
      inStock: true,
      image: '',
    });

    setWorkshopForm({
      title: '',
      description: '',
      date: '',
      duration: '',
      price: 0,
      availableSpots: 0,
      location: '',
      image: '',
    });

    setPromoCodeForm({
      code: '',
      discountPercent: 10,
      maxUses: 100,
      expiresAt: '',
    });

    setImageFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === 'paintings') {
      const formData = new FormData();
      formData.append('title', paintingForm.title);
      formData.append('description', paintingForm.description);
      formData.append('category', paintingForm.category);
      formData.append('materials', paintingForm.materials);
      formData.append('size', paintingForm.size);
      formData.append('price', paintingForm.price.toString());
      formData.append('inStock', paintingForm.inStock.toString());
      
      if (imageFile) {
        formData.append('image', imageFile);
      } else if (modalMode === 'edit') {
        formData.append('image', paintingForm.image);
      }

      if (modalMode === 'create') {
        createPaintingMutation.mutate(formData);
      } else if (modalMode === 'edit' && currentItem) {
        updatePaintingMutation.mutate({ id: currentItem._id, data: formData });
      }
    }
    
    else if (activeTab === 'workshops') {
      const formData = new FormData();
      formData.append('title', workshopForm.title);
      formData.append('description', workshopForm.description);
      formData.append('date', workshopForm.date);
      formData.append('duration', workshopForm.duration);
      formData.append('price', workshopForm.price.toString());
      formData.append('availableSpots', workshopForm.availableSpots.toString());
      formData.append('location', workshopForm.location);
      
      if (imageFile) {
        formData.append('image', imageFile);
      } else if (modalMode === 'edit') {
        formData.append('image', workshopForm.image);
      }

      if (modalMode === 'create') {
        createWorkshopMutation.mutate(formData);
      } else if (modalMode === 'edit' && currentItem) {
        updateWorkshopMutation.mutate({ id: currentItem._id, data: formData });
      }
    }
    
    else if (activeTab === 'promocodes') {
      const data = {
        code: promoCodeForm.code.toUpperCase(),
        discountPercent: parseInt(promoCodeForm.discountPercent.toString()),
        maxUses: parseInt(promoCodeForm.maxUses.toString()),
        expiresAt: promoCodeForm.expiresAt || undefined,
      };

      if (modalMode === 'create') {
        createPromoCodeMutation.mutate(data);
      } else if (modalMode === 'edit' && currentItem) {
        updatePromoCodeMutation.mutate({ id: currentItem._id, data });
      }
    }
  };

  const handleDeleteItem = (item: any) => {
    if (window.confirm('Вы уверены, что хотите удалить этот элемент?')) {
      if (activeTab === 'paintings') {
        deletePaintingMutation.mutate(item._id);
      } else if (activeTab === 'workshops') {
        deleteWorkshopMutation.mutate(item._id);
      } else if (activeTab === 'promocodes') {
        deletePromoCodeMutation.mutate(item._id);
      }
    }
  };

  const handleUpdateOrderStatus = (id: string, status: string) => {
    updateOrderStatusMutation.mutate({ id, status });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  return (
    <div className="section-container">
      <h1 className="page-title">Панель администратора</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <Card 
          className={`dashboard-card cursor-pointer ${activeTab === 'orders' ? 'border-primary' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <div className="flex items-center gap-4 p-4">
            <div className={`p-4 rounded-lg ${activeTab === 'orders' ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}>
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Заказы</h3>
              <p className="text-muted-foreground">{orders.data?.length || 0} всего</p>
            </div>
          </div>
        </Card>
        
        <Card 
          className={`dashboard-card cursor-pointer ${activeTab === 'paintings' ? 'border-primary' : ''}`}
          onClick={() => setActiveTab('paintings')}
        >
          <div className="flex items-center gap-4 p-4">
            <div className={`p-4 rounded-lg ${activeTab === 'paintings' ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}>
              <Package className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Картины</h3>
              <p className="text-muted-foreground">{paintings.data?.length || 0} активных</p>
            </div>
          </div>
        </Card>
        
        <Card 
          className={`dashboard-card cursor-pointer ${activeTab === 'workshops' ? 'border-primary' : ''}`}
          onClick={() => setActiveTab('workshops')}
        >
          <div className="flex items-center gap-4 p-4">
            <div className={`p-4 rounded-lg ${activeTab === 'workshops' ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}>
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Мастер-классы</h3>
              <p className="text-muted-foreground">{workshops.data?.length || 0} активных</p>
            </div>
          </div>
        </Card>
        
        <Card 
          className={`dashboard-card cursor-pointer ${activeTab === 'promocodes' ? 'border-primary' : ''}`}
          onClick={() => setActiveTab('promocodes')}
        >
          <div className="flex items-center gap-4 p-4">
            <div className={`p-4 rounded-lg ${activeTab === 'promocodes' ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}>
              <Tags className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Промокоды</h3>
              <p className="text-muted-foreground">{promoCodes.data?.length || 0} активных</p>
            </div>
          </div>
        </Card>
        
        <Card 
          className={`dashboard-card cursor-pointer ${activeTab === 'reports' ? 'border-primary' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          <div className="flex items-center gap-4 p-4">
            <div className={`p-4 rounded-lg ${activeTab === 'reports' ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}>
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Отчеты</h3>
              <p className="text-muted-foreground">Статистика и аналитика</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Управление {
              activeTab === 'orders' ? 'заказами' : 
              activeTab === 'paintings' ? 'картинами' : 
              activeTab === 'workshops' ? 'мастер-классами' : 
              activeTab === 'promocodes' ? 'промокодами' : 'отчетами'
            }</CardTitle>
            
            {activeTab !== 'orders' && activeTab !== 'reports' && (
              <Button onClick={() => handleOpenModal('create')}>
                <Plus className="mr-2 h-4 w-4" />
                Добавить {
                  activeTab === 'paintings' ? 'картину' : 
                  activeTab === 'workshops' ? 'мастер-класс' : 'промокод'
                }
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <ReportsSection />
          )}
        
          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex justify-between">
                <Input placeholder="Поиск заказов..." className="max-w-sm" />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Клиент</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead>Сумма</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">Загрузка...</TableCell>
                    </TableRow>
                  ) : orders.data?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">Нет заказов</TableCell>
                    </TableRow>
                  ) : (
                    orders.data?.map((order: Order) => (
                      <TableRow key={order._id}>
                        <TableCell className="font-medium">{order._id.substring(0, 8)}</TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell>{formatDate(order.date)}</TableCell>
                        <TableCell>{order.total.toLocaleString()} ₽</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'Доставлен' || order.status === 'Завершен' 
                              ? 'bg-green-100 text-green-800' 
                              : order.status === 'Отменен' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-blue-100 text-blue-800'
                          }`}>{order.status}</span>
                        </TableCell>
                        <TableCell>
                          <Select 
                            defaultValue={order.status} 
                            onValueChange={(value) => handleUpdateOrderStatus(order._id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Статус" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="В обработке">В обработке</SelectItem>
                              <SelectItem value="Подтвержден">Подтвержден</SelectItem>
                              <SelectItem value="Доставлен">Доставлен</SelectItem>
                              <SelectItem value="Завершен">Завершен</SelectItem>
                              <SelectItem value="Отменен">Отменен</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
          
          {/* Paintings Tab */}
          {activeTab === 'paintings' && (
            <div className="space-y-4">
              <div className="flex justify-between">
                <Input placeholder="Поиск картин..." className="max-w-sm" />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Изображение</TableHead>
                    <TableHead>Название</TableHead>
                    <TableHead>Категория</TableHead>
                    <TableHead>Цена</TableHead>
                    <TableHead>Наличие</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paintings.isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">Загрузка...</TableCell>
                    </TableRow>
                  ) : paintings.data?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">Нет картин</TableCell>
                    </TableRow>
                  ) : (
                    paintings.data?.map((painting: Painting) => (
                      <TableRow key={painting._id}>
                        <TableCell>
                          <div className="h-12 w-12 rounded overflow-hidden">
                            <img src={painting.image} alt={painting.title} className="h-full w-full object-cover" />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{painting.title}</TableCell>
                        <TableCell>
                          {painting.category === 'landscape' ? 'Пейзаж' : 
                           painting.category === 'abstract' ? 'Абстракция' : 'Натюрморт'}
                        </TableCell>
                        <TableCell>{painting.price.toLocaleString()} ₽</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            painting.inStock 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {painting.inStock ? 'В наличии' : 'Продано'}
                          </span>
                        </TableCell>
                        <TableCell className="space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleOpenModal('edit', painting)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteItem(painting)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
          
          {/* Workshops Tab */}
          {activeTab === 'workshops' && (
            <div className="space-y-4">
              <div className="flex justify-between">
                <Input placeholder="Поиск мастер-классов..." className="max-w-sm" />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Изображение</TableHead>
                    <TableHead>Название</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead>Мест</TableHead>
                    <TableHead>Участников</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workshops.isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">Загрузка...</TableCell>
                    </TableRow>
                  ) : workshops.data?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">Нет мастер-классов</TableCell>
                    </TableRow>
                  ) : (
                    workshops.data?.map((workshop: Workshop) => (
                      <TableRow key={workshop._id}>
                        <TableCell>
                          <div className="h-12 w-12 rounded overflow-hidden">
                            <img src={workshop.image} alt={workshop.title} className="h-full w-full object-cover" />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{workshop.title}</TableCell>
                        <TableCell>{formatDate(workshop.date)}</TableCell>
                        <TableCell>{workshop.availableSpots}</TableCell>
                        <TableCell>
                          {workshop.registeredParticipants?.length || 0}
                        </TableCell>
                        <TableCell className="space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleOpenModal('edit', workshop)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteItem(workshop)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
          
          {/* Promo Codes Tab */}
          {activeTab === 'promocodes' && (
            <div className="space-y-4">
              <div className="flex justify-between">
                <Input placeholder="Поиск промокодов..." className="max-w-sm" />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Код</TableHead>
                    <TableHead>Скидка</TableHead>
                    <TableHead>Использований</TableHead>
                    <TableHead>Активен</TableHead>
                    <TableHead>Срок действия</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {promoCodes.isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">Загрузка...</TableCell>
                    </TableRow>
                  ) : promoCodes.data?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">Нет промокодов</TableCell>
                    </TableRow>
                  ) : (
                    promoCodes.data?.map((promoCode: PromoCode) => (
                      <TableRow key={promoCode._id}>
                        <TableCell className="font-mono font-bold">{promoCode.code}</TableCell>
                        <TableCell>{promoCode.discountPercent}%</TableCell>
                        <TableCell>{promoCode.usedCount} / {promoCode.maxUses}</TableCell>
                        <TableCell>
                          {promoCode.active ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <Check className="mr-1 h-3 w-3" />
                              Активен
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <X className="mr-1 h-3 w-3" />
                              Неактивен
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {promoCode.expiresAt ? formatDate(promoCode.expiresAt) : 'Бессрочно'}
                        </TableCell>
                        <TableCell className="space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleOpenModal('edit', promoCode)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteItem(promoCode)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal for adding/editing items */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {modalMode === 'create' ? 'Добавить' : 'Редактировать'} {
                activeTab === 'paintings' ? 'картину' : 
                activeTab === 'workshops' ? 'мастер-класс' : 'промокод'
              }
            </DialogTitle>
            <DialogDescription>
              Заполните все необходимые поля для {modalMode === 'create' ? 'создания' : 'обновления'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            {/* Painting Form */}
            {activeTab === 'paintings' && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">Название</label>
                  <Input
                    id="title"
                    value={paintingForm.title}
                    onChange={(e) => setPaintingForm({...paintingForm, title: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">Описание</label>
                  <Textarea
                    id="description"
                    value={paintingForm.description}
                    onChange={(e) => setPaintingForm({...paintingForm, description: e.target.value})}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">Категория</label>
                    <Select 
                      value={paintingForm.category}
                      onValueChange={(value) => setPaintingForm({...paintingForm, category: value})}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="abstract">Абстракция</SelectItem>
                        <SelectItem value="landscape">Пейзаж</SelectItem>
                        <SelectItem value="stilllife">Натюрморт</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="materials" className="text-sm font-medium">Материалы</label>
                    <Input
                      id="materials"
                      value={paintingForm.materials}
                      onChange={(e) => setPaintingForm({...paintingForm, materials: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="size" className="text-sm font-medium">Размер</label>
                    <Input
                      id="size"
                      placeholder="например: 40x60 см"
                      value={paintingForm.size}
                      onChange={(e) => setPaintingForm({...paintingForm, size: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="price" className="text-sm font-medium">Цена</label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      value={paintingForm.price}
                      onChange={(e) => setPaintingForm({...paintingForm, price: Number(e.target.value)})}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="inStock" className="text-sm font-medium flex items-center space-x-2">
                    <input
                      id="inStock"
                      type="checkbox"
                      className="form-checkbox h-4 w-4"
                      checked={paintingForm.inStock}
                      onChange={(e) => setPaintingForm({...paintingForm, inStock: e.target.checked})}
                    />
                    <span>В наличии</span>
                  </label>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="image" className="text-sm font-medium">Изображение</label>
                  {modalMode === 'edit' && (
                    <div className="h-32 w-full rounded overflow-hidden mb-2">
                      <img 
                        src={paintingForm.image} 
                        alt="Текущее изображение" 
                        className="h-full w-auto object-contain"
                      />
                    </div>
                  )}
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required={modalMode === 'create'}
                  />
                </div>
              </div>
            )}
            
            {/* Workshop Form */}
            {activeTab === 'workshops' && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="workshop-title" className="text-sm font-medium">Название</label>
                  <Input
                    id="workshop-title"
                    value={workshopForm.title}
                    onChange={(e) => setWorkshopForm({...workshopForm, title: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="workshop-description" className="text-sm font-medium">Описание</label>
                  <Textarea
                    id="workshop-description"
                    value={workshopForm.description}
                    onChange={(e) => setWorkshopForm({...workshopForm, description: e.target.value})}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="workshop-date" className="text-sm font-medium">Дата</label>
                    <Input
                      id="workshop-date"
                      type="date"
                      value={workshopForm.date}
                      onChange={(e) => setWorkshopForm({...workshopForm, date: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="workshop-duration" className="text-sm font-medium">Продолжительность</label>
                    <Input
                      id="workshop-duration"
                      placeholder="например: 2 часа"
                      value={workshopForm.duration}
                      onChange={(e) => setWorkshopForm({...workshopForm, duration: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="workshop-price" className="text-sm font-medium">Цена</label>
                    <Input
                      id="workshop-price"
                      type="number"
                      min="0"
                      value={workshopForm.price}
                      onChange={(e) => setWorkshopForm({...workshopForm, price: Number(e.target.value)})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="workshop-spots" className="text-sm font-medium">Доступные места</label>
                    <Input
                      id="workshop-spots"
                      type="number"
                      min="0"
                      value={workshopForm.availableSpots}
                      onChange={(e) => setWorkshopForm({...workshopForm, availableSpots: Number(e.target.value)})}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="workshop-location" className="text-sm font-medium">Место проведения</label>
                  <Input
                    id="workshop-location"
                    value={workshopForm.location}
                    onChange={(e) => setWorkshopForm({...workshopForm, location: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="workshop-image" className="text-sm font-medium">Изображение</label>
                  {modalMode === 'edit' && (
                    <div className="h-32 w-full rounded overflow-hidden mb-2">
                      <img 
                        src={workshopForm.image} 
                        alt="Текущее изображение" 
                        className="h-full w-auto object-contain"
                      />
                    </div>
                  )}
                  <Input
                    id="workshop-image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required={modalMode === 'create'}
                  />
                </div>
              </div>
            )}
            
            {/* Promo Code Form */}
            {activeTab === 'promocodes' && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="promo-code" className="text-sm font-medium">Код промокода</label>
                  <Input
                    id="promo-code"
                    value={promoCodeForm.code}
                    onChange={(e) => setPromoCodeForm({...promoCodeForm, code: e.target.value})}
                    placeholder="Например: SALE20"
                    required
                    disabled={modalMode === 'edit'}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="promo-discount" className="text-sm font-medium">Процент скидки</label>
                    <Input
                      id="promo-discount"
                      type="number"
                      min="1"
                      max="100"
                      value={promoCodeForm.discountPercent}
                      onChange={(e) => setPromoCodeForm({...promoCodeForm, discountPercent: Number(e.target.value)})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="promo-max-uses" className="text-sm font-medium">Макс. использований</label>
                    <Input
                      id="promo-max-uses"
                      type="number"
                      min="1"
                      value={promoCodeForm.maxUses}
                      onChange={(e) => setPromoCodeForm({...promoCodeForm, maxUses: Number(e.target.value)})}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="promo-expires" className="text-sm font-medium">Дата окончания (не обязательно)</label>
                  <Input
                    id="promo-expires"
                    type="date"
                    value={promoCodeForm.expiresAt}
                    onChange={(e) => setPromoCodeForm({...promoCodeForm, expiresAt: e.target.value})}
                  />
                  <p className="text-xs text-gray-500">Оставьте пустым для бессрочного промокода</p>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button type="submit" disabled={
                activeTab === 'paintings' && createPaintingMutation.isPending || updatePaintingMutation.isPending ||
                activeTab === 'workshops' && createWorkshopMutation.isPending || updateWorkshopMutation.isPending ||
                activeTab === 'promocodes' && createPromoCodeMutation.isPending || updatePromoCodeMutation.isPending
              }>
                {modalMode === 'create' ? 'Создать' : 'Обновить'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPanelPage;
