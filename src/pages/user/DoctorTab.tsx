import { useState } from 'react';
import { Search, Star, Clock, Calendar, Video, FileText, ShoppingBag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useApp } from '@/context/AppContext';
import { mockDoctors, mockProducts } from '@/data/mockData';
import { Doctor, Appointment } from '@/types';
import { toast } from 'sonner';

export function DoctorTab() {
  const { user, addAppointment, appointments } = useApp();
  const [search, setSearch] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showPrescription, setShowPrescription] = useState<Appointment | null>(null);

  const filteredDoctors = mockDoctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialty.toLowerCase().includes(search.toLowerCase())
  );

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const handleBook = () => {
    if (!selectedDate || !selectedTime || !selectedDoctor) {
      toast.error('Please select date and time');
      return;
    }

    const appointment: Appointment = {
      id: `apt_${Date.now()}`,
      userId: user?.id || '',
      userName: user?.name || '',
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      date: selectedDate,
      time: selectedTime,
      status: 'pending'
    };

    addAppointment(appointment);
    setShowBooking(false);
    setSelectedDoctor(null);
    setSelectedDate('');
    setSelectedTime('');
    toast.success('Appointment booked!');
  };

  const myAppointments = appointments.filter(a => a.userId === user?.id);

  return (
    <div className="p-4 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search doctors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Doctors List */}
      <div className="space-y-3">
        {filteredDoctors.map((doctor) => (
          <Card 
            key={doctor.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => {
              setSelectedDoctor(doctor);
              setShowBooking(true);
            }}
          >
            <CardContent className="p-4 flex gap-4">
              <img
                src={doctor.photo}
                alt={doctor.name}
                className="w-20 h-20 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">{doctor.name}</h4>
                <Badge variant="secondary" className="mt-1">{doctor.specialty}</Badge>
                <div className="flex items-center gap-1 mt-2">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  <span className="text-sm font-medium">{doctor.rating}</span>
                  <span className="text-sm text-muted-foreground">({doctor.reviews})</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-muted-foreground">{doctor.experience} exp</span>
                  <span className="font-bold text-primary">₹{doctor.consultationFee}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Booking Modal */}
      <Dialog open={showBooking} onOpenChange={setShowBooking}>
        <DialogContent className="max-w-sm mx-4">
          {selectedDoctor && (
            <>
              <DialogHeader>
                <DialogTitle>Book Appointment</DialogTitle>
              </DialogHeader>
              <div className="space-y-5 py-2">
                <div className="flex gap-4 p-4 bg-accent rounded-lg">
                  <img
                    src={selectedDoctor.photo}
                    alt={selectedDoctor.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">{selectedDoctor.name}</h4>
                    <p className="text-sm text-muted-foreground">{selectedDoctor.specialty}</p>
                    <p className="text-primary font-bold mt-1">₹{selectedDoctor.consultationFee}</p>
                  </div>
                </div>

                {/* Date Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Date</label>
                  <Input
                    type="date"
                    min={getTomorrowDate()}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>

                {/* Time Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Available Slots</label>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedDoctor.availableSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedTime(time)}
                      >
                        <Clock className="w-3 h-3 mr-1" /> {time}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button className="w-full" onClick={handleBook}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Appointment
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* My Appointments */}
      {myAppointments.length > 0 && (
        <div className="mt-8">
          <h3 className="font-semibold text-foreground mb-3">My Appointments</h3>
          <div className="space-y-3">
            {myAppointments.map((apt) => (
              <Card key={apt.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{apt.doctorName}</span>
                    <Badge variant={
                      apt.status === 'confirmed' ? 'default' :
                      apt.status === 'completed' ? 'secondary' : 'outline'
                    }>
                      {apt.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {apt.date} at {apt.time}
                  </p>
                  
                  <div className="flex gap-2 mt-3">
                    {apt.status === 'confirmed' && (
                      <Button size="sm" variant="default">
                        <Video className="w-3 h-3 mr-1" /> Join Call
                      </Button>
                    )}
                    {apt.prescription && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setShowPrescription(apt)}
                      >
                        <FileText className="w-3 h-3 mr-1" /> View Prescription
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Prescription Modal */}
      <Dialog open={!!showPrescription} onOpenChange={() => setShowPrescription(null)}>
        <DialogContent className="max-w-sm mx-4">
          <DialogHeader>
            <DialogTitle>Prescription</DialogTitle>
          </DialogHeader>
          {showPrescription?.prescription && (
            <div className="space-y-4 py-2">
              <div>
                <h4 className="font-medium mb-2">Medicines</h4>
                <ul className="space-y-1">
                  {showPrescription.prescription.medicines.map((med, i) => (
                    <li key={i} className="text-sm text-muted-foreground">• {med}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Instructions</h4>
                <p className="text-sm text-muted-foreground">
                  {showPrescription.prescription.instructions}
                </p>
              </div>

              {showPrescription.prescription.suggestedProducts.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Suggested Products</h4>
                  <div className="space-y-2">
                    {showPrescription.prescription.suggestedProducts.map((productId) => {
                      const product = mockProducts.find(p => p.id === productId);
                      if (!product) return null;
                      return (
                        <div key={productId} className="flex items-center gap-3 p-2 bg-accent rounded-lg">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{product.name}</p>
                            <p className="text-sm text-primary">₹{product.price}</p>
                          </div>
                          <Button size="sm" variant="ghost">
                            <ShoppingBag className="w-4 h-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
