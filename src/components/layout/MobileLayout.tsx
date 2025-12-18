import { ReactNode } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

interface MobileLayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  showHeader?: boolean;
  showNav?: boolean;
}

export function MobileLayout({ 
  children, 
  activeTab, 
  onTabChange,
  showHeader = true,
  showNav = true 
}: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto relative">
      {showHeader && <Header />}
      <main className={`${showHeader ? 'pt-16' : ''} ${showNav ? 'pb-20' : ''} min-h-screen`}>
        {children}
      </main>
      {showNav && <BottomNav activeTab={activeTab} onTabChange={onTabChange} />}
    </div>
  );
}
