import { User, Camera, Edit2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/context/AppContext';

interface ProfileTabProps {
  onLogout: () => void;
}

export function ProfileTab({ onLogout }: ProfileTabProps) {
  const { user, logout } = useApp();

  const handleLogout = () => {
    logout();
    onLogout();
  };

  if (!user) return null;

  const profile = user.profile;

  return (
    <div className="p-4 space-y-6">
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          <Avatar className="w-24 h-24">
            <AvatarImage src={profile?.photo} />
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
              {user.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Button
            size="icon"
            variant="secondary"
            className="absolute bottom-0 right-0 rounded-full w-8 h-8"
          >
            <Camera className="w-4 h-4" />
          </Button>
        </div>
        <h2 className="font-bold text-xl mt-4 text-foreground">{user.name}</h2>
        <p className="text-muted-foreground">{user.email}</p>
        <Badge variant="secondary" className="mt-2 capitalize">
          {user.role?.replace('_', ' ')}
        </Badge>
      </div>

      {/* Profile Info */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Personal Information</h3>
            <Button size="sm" variant="ghost">
              <Edit2 className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phone</span>
              <span className="font-medium">{user.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Address</span>
              <span className="font-medium text-right max-w-[200px]">{user.address || 'Not set'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Analysis Results */}
      {profile && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Skin Analysis</h3>
              <Badge variant="outline">AI Generated</Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-accent rounded-lg">
                <p className="text-xs text-muted-foreground">Face Type</p>
                <p className="font-semibold">{profile.faceType || '-'}</p>
              </div>
              <div className="p-3 bg-accent rounded-lg">
                <p className="text-xs text-muted-foreground">Skin Type</p>
                <p className="font-semibold">{profile.skinType || '-'}</p>
              </div>
              <div className="p-3 bg-accent rounded-lg">
                <p className="text-xs text-muted-foreground">Face Tone</p>
                <p className="font-semibold">{profile.faceTone || '-'}</p>
              </div>
              <div className="p-3 bg-accent rounded-lg">
                <p className="text-xs text-muted-foreground">Skin Tone</p>
                <p className="font-semibold">{profile.skinTone || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Health Info */}
      {profile && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold">Health Information</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Height</span>
                <span className="font-medium">{profile.height ? `${profile.height} cm` : '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Weight</span>
                <span className="font-medium">{profile.weight ? `${profile.weight} kg` : '-'}</span>
              </div>
              {profile.allergies && (
                <div>
                  <span className="text-muted-foreground">Allergies</span>
                  <p className="font-medium mt-1">{profile.allergies}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Logout Button */}
      <Button 
        variant="destructive" 
        className="w-full"
        onClick={handleLogout}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </Button>
    </div>
  );
}
