
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-studio-100 to-peach-100 py-16">
        <div className="section-container">
          <div className="text-center">
            <h1 className="page-title">О студии Art Home Soni</h1>
            <p className="text-lg max-w-3xl mx-auto">
              Место, где творчество и вдохновение становятся частью вашей жизни
            </p>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="py-16">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title">Наша история</h2>
              <p className="mb-4">
                Art Home Soni была основана в 2018 году талантливой художницей Софией Александровой, 
                которая всегда мечтала создать пространство, объединяющее людей через искусство и творчество.
              </p>
              <p className="mb-4">
                Сначала это была небольшая мастерская, где София проводила мастер-классы для друзей и 
                их детей. Благодаря её энтузиазму и уникальному подходу к обучению, слава о студии 
                быстро распространилась, и Art Home Soni превратилась в полноценный центр искусства.
              </p>
              <p>
                Сегодня мы гордимся тем, что создали сообщество художников, любителей искусства и 
                всех, кто хочет привнести в свою жизнь больше творчества и красоты.
              </p>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/3] bg-gray-200 rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1586158291800-2665f07bba79"
                  alt="Основательница студии за работой"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-36 h-36 bg-studio-100 rounded-xl -z-10"></div>
              <div className="absolute -top-6 -right-6 w-36 h-36 bg-peach-100 rounded-xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Mission */}
      <section className="py-16 bg-studio-50">
        <div className="section-container">
          <h2 className="section-title text-center mb-10">Наша миссия</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-studio-100 text-studio-600 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
                  <path d="M12 2v6" />
                  <path d="m4.93 10.93 1.41 1.41" />
                  <path d="M2 18h2" />
                  <path d="M20 18h2" />
                  <path d="m19.07 10.93-1.41 1.41" />
                  <path d="M22 22H2" />
                  <path d="M8 18v4" />
                  <path d="M16 18v4" />
                  <path d="M12 8a4 4 0 0 0-4 4h8a4 4 0 0 0-4-4Z" />
                </svg>
              </div>
              <h3 className="text-xl font-display mb-2">Вдохновлять</h3>
              <p className="text-gray-600">
                Мы стремимся вдохновлять людей на творчество и самовыражение через искусство, 
                показывая, что каждый может создавать прекрасное.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-peach-100 text-peach-600 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
                  <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 0-2.04-3.44H3" />
                  <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 1 2.04-3.44H21" />
                </svg>
              </div>
              <h3 className="text-xl font-display mb-2">Обучать</h3>
              <p className="text-gray-600">
                Мы делимся знаниями и техниками через мастер-классы и курсы, помогая 
                развивать талант и навыки в различных художественных направлениях.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                </svg>
              </div>
              <h3 className="text-xl font-display mb-2">Создавать</h3>
              <p className="text-gray-600">
                Мы создаем уникальные произведения искусства, которые несут в себе 
                эмоции, истории и красоту, чтобы украсить вашу жизнь и пространство.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Team */}
      <section className="py-16">
        <div className="section-container">
          <h2 className="section-title text-center mb-10">Наша команда</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Team Member 1 */}
            <div className="text-center">
              <div className="aspect-square bg-gray-200 rounded-full overflow-hidden mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2" 
                  alt="София Александрова" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-display text-xl mb-1">София Александрова</h3>
              <p className="text-studio-600 mb-2">Основательница, художник</p>
              <p className="text-gray-600 text-sm">
                Мастер масляной живописи с 15-летним стажем, преподаватель, участник международных выставок.
              </p>
            </div>
            
            {/* Team Member 2 */}
            <div className="text-center">
              <div className="aspect-square bg-gray-200 rounded-full overflow-hidden mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5" 
                  alt="Михаил Кузнецов" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-display text-xl mb-1">Михаил Кузнецов</h3>
              <p className="text-studio-600 mb-2">Художник, преподаватель</p>
              <p className="text-gray-600 text-sm">
                Специалист по акварельной технике и графике, выпускник Академии художеств.
              </p>
            </div>
            
            {/* Team Member 3 */}
            <div className="text-center">
              <div className="aspect-square bg-gray-200 rounded-full overflow-hidden mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956" 
                  alt="Анна Соколова" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-display text-xl mb-1">Анна Соколова</h3>
              <p className="text-studio-600 mb-2">Художник, иллюстратор</p>
              <p className="text-gray-600 text-sm">
                Создатель волшебных иллюстраций и мастер детских мастер-классов.
              </p>
            </div>
            
            {/* Team Member 4 */}
            <div className="text-center">
              <div className="aspect-square bg-gray-200 rounded-full overflow-hidden mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1615109398623-88346a601842" 
                  alt="Елена Морозова" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-display text-xl mb-1">Елена Морозова</h3>
              <p className="text-studio-600 mb-2">Администратор</p>
              <p className="text-gray-600 text-sm">
                Душа студии, помогает с организацией мастер-классов и выставок.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Location */}
      <section className="py-16 bg-white">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="section-title">Наше расположение</h2>
              <p className="mb-4">
                Наша студия расположена в центре города в светлом и просторном помещении, 
                создающем идеальную атмосферу для творчества и обучения.
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-1">Адрес</h3>
                  <p>ул. Художественная, 42, Москва</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-1">Как добраться</h3>
                  <p>5 минут пешком от станции метро "Творческая"</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-1">Часы работы</h3>
                  <p>Пн-Пт: 10:00 - 20:00</p>
                  <p>Сб-Вс: 11:00 - 18:00</p>
                </div>
              </div>
              
              <div className="mt-6">
                <Button size="lg">Свяжитесь с нами</Button>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 h-80 bg-gray-200 rounded-xl overflow-hidden">
              {/* Here would be the map, using a placeholder for now */}
              <img 
                src="https://images.unsplash.com/photo-1569336415962-a4bd9f69029d" 
                alt="Карта расположения студии" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
