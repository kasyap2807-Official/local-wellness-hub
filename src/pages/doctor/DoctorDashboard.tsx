import { useState } from 'react';
import { Calendar, TrendingUp, Check, X, Video, FileText, Pill } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/context/AppContext';
import { mockDoctors, mockProducts } from '@/data/mockData';
import { Appointment } from '@/types';
import { toast } from 'sonner';

interface DoctorDashboardProps {
  onLogout: () => void;
}

export function DoctorDashboard({ onLogout }: DoctorDashboardProps) {
  const { appointments, updateAppointmentStatus, addPrescription, logout, user } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showPrescription, setShowPrescription] = useState<Appointment | null>(null);
  const [prescription, setPrescription] = useState({
    medicines: '',
    instructions: '',
    suggestedProducts: [] as string[]
  });

  const doctor = mockDoctors[0]; // Mock doctor for demo
  
  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  const confirmedAppointments = appointments.filter(a => a.status === 'confirmed');

  const handleAccept = (aptId: string) => {
    updateAppointmentStatus(aptId, 'confirmed');
    toast.success('Appointment confirmed!');
  };

  const handleReject = (aptId: string) => {
    updateAppointmentStatus(aptId, 'cancelled');
    toast.success('Appointment cancelled');
  };

  const handleSavePrescription = () => {
    if (!showPrescription) return;
    
    addPrescription(showPrescription.id, {
      id: `presc_${Date.now()}`,
      medicines: prescription.medicines.split('\n').filter(Boolean),
      instructions: prescription.instructions,
      suggestedProducts: prescription.suggestedProducts
    });
    
    setShowPrescription(null);
    setPrescription({ medicines: '', instructions: '', suggestedProducts: [] });
    toast.success('Prescription added!');
  };

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="p-4 space-y-6">
            {/* Profile Card */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-4 items-center">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={doctor.photo} />
                    <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                      {doctor.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{user?.name || doctor.name}</h3>
                    <Badge variant="secondary">{doctor.specialty}</Badge>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-muted-foreground">{doctor.experience} exp</span>
                      <Badge variant="outline">⭐ {doctor.rating}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{pendingAppointments.length}</p>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{confirmedAppointments.length}</p>
                      <p className="text-xs text-muted-foreground">Today</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Consultation Fee */}
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Consultation Fee</p>
                  <p className="text-2xl font-bold text-primary">₹{doctor.consultationFee}</p>
                </div>
                <Button size="sm" variant="outline">Edit</Button>
              </CardContent>
            </Card>

            <Button variant="destructive" className="w-full" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        );

      case 'appointments':
        return (
          <div className="p-4 space-y-4">
            <h2 className="font-bold text-lg">Appointments</h2>
            
            {appointments.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  No appointments yet
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {appointments.map((apt) => (
                  <Card key={apt.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{apt.userName}</span>
                        <Badge variant={
                          apt.status === 'confirmed' ? 'default' :
                          apt.status === 'pending' ? 'secondary' :
                          apt.status === 'completed' ? 'outline' : 'destructive'
                        }>
                          {apt.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {apt.date} at {apt.time}
                      </p>
                      
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {apt.status === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              onClick={() => handleAccept(apt.id)}
                            >
                              <Check className="w-3 h-3 mr-1" /> Accept
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleReject(apt.id)}
                            >
                              <X className="w-3 h-3 mr-1" /> Reject
                            </Button>
                          </>
                        )}
                        {apt.status === 'confirmed' && (
                          <>
                            <Button size="sm" variant="default">
                              <Video className="w-3 h-3 mr-1" /> Join Call
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setShowPrescription(apt)}
                            >
                              <FileText className="w-3 h-3 mr-1" /> Add Prescription
                            </Button>
                          </>
                        )}
                        {apt.prescription && (
                          <Badge variant="outline" className="gap-1">
                            <Pill className="w-3 h-3" /> Prescription Added
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Prescription Modal */}
            <Dialog open={!!showPrescription} onOpenChange={() => setShowPrescription(null)}>
              <DialogContent className="max-w-sm mx-4 max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Prescription</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="p-3 bg-accent rounded-lg">
                    <p className="font-medium">{showPrescription?.userName}</p>
                    <p className="text-sm text-muted-foreground">
                      {showPrescription?.date} at {showPrescription?.time}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Medicines (one per line)</Label>
                    <Textarea
                      placeholder="Medicine 1 - Dosage&#10;Medicine 2 - Dosage"
                      value={prescription.medicines}
                      onChange={(e) => setPrescription({ ...prescription, medicines: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Instructions</Label>
                    <Textarea
                      placeholder="Follow-up instructions..."
                      value={prescription.instructions}
                      onChange={(e) => setPrescription({ ...prescription, instructions: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Suggest Products</Label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {mockProducts.filter(p => p.category === 'Skincare').map((product) => (
                        <label key={product.id} className="flex items-center gap-3 p-2 bg-muted rounded-lg cursor-pointer">
                          <input
                            type="checkbox"
                            checked={prescription.suggestedProducts.includes(product.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setPrescription({
                                  ...prescription,
                                  suggestedProducts: [...prescription.suggestedProducts, product.id]
                                });
                              } else {
                                setPrescription({
                                  ...prescription,
                                  suggestedProducts: prescription.suggestedProducts.filter(id => id !== product.id)
                                });
                              }
                            }}
                            className="rounded"
                          />
                          <img src={product.image} alt={product.name} className="w-8 h-8 rounded object-cover" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{product.name}</p>
                            <p className="text-xs text-muted-foreground">₹{product.price}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full" onClick={handleSavePrescription}>
                    Save Prescription
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        );

      case 'profile':
        return (
          <div className="p-4 space-y-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="w-24 h-24">
                <AvatarImage src={doctor.photo} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {doctor.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <h2 className="font-bold text-xl mt-4">{user?.name || doctor.name}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
              <Badge variant="secondary" className="mt-2">{doctor.specialty}</Badge>
            </div>

            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Experience</span>
                  <span className="font-semibold">{doctor.experience}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="font-semibold">⭐ {doctor.rating}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reviews</span>
                  <span className="font-semibold">{doctor.reviews}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Consultation Fee</span>
                  <span className="font-semibold text-primary">₹{doctor.consultationFee}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3">Available Slots</h4>
                <div className="flex flex-wrap gap-2">
                  {doctor.availableSlots.map((slot) => (
                    <Badge key={slot} variant="outline">{slot}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button variant="destructive" className="w-full" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <MobileLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </MobileLayout>
  );
}
