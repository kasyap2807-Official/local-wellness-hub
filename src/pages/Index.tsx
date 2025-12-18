import { useState } from 'react';
import { Login } from './auth/Login';
import { Signup } from './auth/Signup';
import { RoleSelection } from './auth/RoleSelection';
import { ProfileSetup } from './user/ProfileSetup';
import { UserDashboard } from './user/UserDashboard';
import { SalonOwnerDashboard } from './salon/SalonOwnerDashboard';
import { ArtistDashboard } from './artist/ArtistDashboard';
import { DoctorDashboard } from './doctor/DoctorDashboard';
import { useApp } from '@/context/AppContext';

type Screen = 'login' | 'signup' | 'role_selection' | 'profile_setup' | 'dashboard';

export default function Index() {
  const { user, isAuthenticated } = useApp();
  const [screen, setScreen] = useState<Screen>(() => {
    if (!isAuthenticated) return 'login';
    if (!user?.role) return 'role_selection';
    if (user.role === 'user' && !user.profileCompleted) return 'profile_setup';
    return 'dashboard';
  });

  const handleLogout = () => {
    setScreen('login');
  };

  const renderScreen = () => {
    if (!isAuthenticated) {
      if (screen === 'signup') {
        return (
          <Signup
            onSwitchToLogin={() => setScreen('login')}
            onSignupSuccess={() => setScreen('role_selection')}
          />
        );
      }
      return (
        <Login
          onSwitchToSignup={() => setScreen('signup')}
          onLoginSuccess={() => {
            if (!user?.role) setScreen('role_selection');
            else if (user.role === 'user' && !user.profileCompleted) setScreen('profile_setup');
            else setScreen('dashboard');
          }}
        />
      );
    }

    if (!user?.role || screen === 'role_selection') {
      return <RoleSelection onRoleSelected={() => {
        if (user?.role === 'user') setScreen('profile_setup');
        else setScreen('dashboard');
      }} />;
    }

    if (user.role === 'user' && !user.profileCompleted && screen === 'profile_setup') {
      return <ProfileSetup onComplete={() => setScreen('dashboard')} />;
    }

    // Dashboard based on role
    switch (user.role) {
      case 'user':
        return <UserDashboard onLogout={handleLogout} />;
      case 'salon_owner':
        return <SalonOwnerDashboard onLogout={handleLogout} />;
      case 'artist':
        return <ArtistDashboard onLogout={handleLogout} />;
      case 'doctor':
        return <DoctorDashboard onLogout={handleLogout} />;
      default:
        return <UserDashboard onLogout={handleLogout} />;
    }
  };

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto shadow-xl">
      {renderScreen()}
    </div>
  );
}
