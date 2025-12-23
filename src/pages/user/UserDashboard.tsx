import { useState } from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { ProductsTab } from './ProductsTab';
import { ServicesTab } from './ServicesTab';
import { DoctorTab } from './DoctorTab';
import { ProfileTab } from './ProfileTab';
import { HomeTab } from './HomeTab';

interface UserDashboardProps {
  onLogout: () => void;
}

export function UserDashboard({ onLogout }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab />;
      case 'products':
        return <ProductsTab />;
      case 'services':
        return <ServicesTab />;
      case 'doctor':
        return <DoctorTab />;
      case 'profile':
        return <ProfileTab onLogout={onLogout} />;
      default:
        return <HomeTab />;
    }
  };

  return (
    <MobileLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </MobileLayout>
  );
}
