import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { WeekModule } from './components/WeekModule';
import { Mindset } from './components/Mindset';
import { Nutrition } from './components/Nutrition';
import { Bonuses } from './components/Bonuses';
import { week1Days, week2Days } from './data/mockData';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'week1':
        return (
          <WeekModule
            weekNumber={1}
            title="BASE E REATIVAÇÃO"
            description="Reacenda músculos e crie rotina"
            progress={100}
            totalDays={7}
            days={week1Days}
          />
        );
      case 'week2':
        return (
          <WeekModule
            weekNumber={2}
            title="QUEIMA E DEFINIÇÃO"
            description="Intensifique e queime gordura"
            progress={65}
            totalDays={7}
            days={week2Days}
          />
        );
      case 'mindset':
        return <Mindset />;
      case 'nutrition':
        return <Nutrition />;
      case 'bonuses':
        return <Bonuses />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-dark-bg">
        <Header onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

        <div className="flex pt-[70px]">
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            currentPage={currentPage}
            onPageChange={(page) => {
              setCurrentPage(page);
              setIsSidebarOpen(false);
            }}
          />

          <main className="flex-1 lg:ml-64 p-6 max-w-7xl mx-auto w-full">
            {renderContent()}
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
