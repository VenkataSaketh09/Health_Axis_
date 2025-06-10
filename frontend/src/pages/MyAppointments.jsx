import React, { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner";
import { MapPin, Calendar, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button';
import { assets } from '../assets/assets';
const MyAppointments = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  // Sample upcoming appointments (2 doctors)
  const upcomingAppointments = [
    {
      id: 'doc1',
      name: 'Dr. Jane Cooper',
      address: '547 Carrington Trace Drive, Cornelius',
      appointmentDate: '20-Feb-2024',
      appointmentTime: '4:30 PM'
    },
    {
      id: 'doc2',
      name: 'Dr. Emma Watson',
      address: '525 N Tryon Street, NC 28117',
      appointmentDate: '23-Feb-2024',
      appointmentTime: '2:00 PM'
    }
  ];

  // Sample expired appointments (3 doctors)
  const expiredAppointments = [
    {
      id: 'doc3',
      name: 'Dr. Sarah Patel',
      address: '37th Cross, Richmond, Circle, Ring Road, London',
      appointmentDate: '15-Jan-2024',
      appointmentTime: '10:00 AM'
    },
    {
      id: 'doc4',
      name: 'Dr. Christopher Lee',
      address: '47th Cross, Richmond, Circle, Ring Road, London',
      appointmentDate: '12-Jan-2024',
      appointmentTime: '3:30 PM'
    },
    {
      id: 'doc5',
      name: 'Dr. Jennifer Garcia',
      address: '57th Cross, Richmond, Circle, Ring Road, London',
      appointmentDate: '08-Jan-2024',
      appointmentTime: '11:15 AM'
    }
  ];

  const handleCancelAppointment = (doctorName, appointmentDate, appointmentTime) => {
    toast.success("Appointment Cancelled Successfully", {
      description: `${doctorName} - ${appointmentDate}, ${appointmentTime}`,
      position: "top-right",
      style: {
        background: "#10b981", // Green background
        color: "white",
        border: "1px solid #059669",
        fontSize: "15px",
      },
      className: "toast-success",
      duration: 4000,
    });
  };

  const AppointmentCard = ({ appointment, showCancelButton = false }) => (
    <div className="bg-white rounded-lg border p-6 mb-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
            <img 
              src={assets.male} 
              alt={appointment.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-3">
              {appointment.name}
            </h3>
            <div className="space-y-2">
              <div className="flex items-center text-gray-600 text-sm">
                <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                {appointment.address}
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                Appointment On: {appointment.appointmentDate}
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <Clock className="w-4 h-4 mr-2 text-blue-500" />
                At Time: {appointment.appointmentTime}
              </div>
            </div>
          </div>
        </div>
        {showCancelButton && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                className="border-blue-500 text-blue-500 hover:bg-blue-50 px-6"
              >
                Cancel Appointment
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to cancel your appointment with {appointment.name} scheduled for {appointment.appointmentDate} at {appointment.appointmentTime}? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => handleCancelAppointment(appointment.name, appointment.appointmentDate, appointment.appointmentTime)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Booking</h1>
      
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'upcoming'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab('expired')}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'expired'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Expired
        </button>
      </div>

      {/* Appointment Lists */}
      <div className="space-y-4">
        {activeTab === 'upcoming' && (
          <>
            {upcomingAppointments.map((appointment) => (
              <AppointmentCard 
                key={appointment.id} 
                appointment={appointment} 
                showCancelButton={true} 
              />
            ))}
          </>
        )}
        
        {activeTab === 'expired' && (
          <>
            {expiredAppointments.map((appointment) => (
              <AppointmentCard 
                key={appointment.id} 
                appointment={appointment} 
                showCancelButton={false} 
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;