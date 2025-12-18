import { useState } from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { ProductsTab } from './ProductsTab';
import { ServicesTab } from './ServicesTab';
import { DoctorTab } from './DoctorTab';
import { ProfileTab } from './ProfileTab';

interface UserDashboardProps {
  onLogout: () => void;
}

export function UserDashboard({ onLogout }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState('products');

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return <ProductsTab />;
      case 'services':
        return <ServicesTab />;
      case 'doctor':
        return <DoctorTab />;
      case 'profile':
        return <ProfileTab onLogout={onLogout} />;
      default:
        return <ProductsTab />;
    }
  };

  return (
    <MobileLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </MobileLayout>
  );
}
