
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCog } from "lucide-react";

const AccountPage = () => {
  const [userInfo, setUserInfo] = useState({
    name: "Иван Иванов",
    email: "ivan@example.com",
    phone: "+7 (999) 123-45-67",
    address: "ул. Пушкина, д. 10"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here would be the logic to update user info
    alert("Информация обновлена");
  };

  return (
    <div className="section-container">
      <h1 className="page-title">Личный кабинет</h1>
      
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="h-6 w-6" />
              Личная информация
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="text-sm font-medium">
                  Имя
                </label>
                <Input
                  id="name"
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={userInfo.email}
                  onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="phone" className="text-sm font-medium">
                  Телефон
                </label>
                <Input
                  id="phone"
                  value={userInfo.phone}
                  onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="address" className="text-sm font-medium">
                  Адрес
                </label>
                <Input
                  id="address"
                  value={userInfo.address}
                  onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full">
                Сохранить изменения
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountPage;
