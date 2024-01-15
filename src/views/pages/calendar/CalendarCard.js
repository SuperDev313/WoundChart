import React, { useRef, useEffect, useState } from 'react';
import '@fullcalendar/react/dist/vdom'
import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Card, CardBody } from 'reactstrap';
import AppointmentModal from './AppointmentModal';

const CalendarCard = ({ appointments }) => {
  const calendarRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Define the isModalOpen state
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const formattedAppointments = appointments.map((appointment) => ({
    id: appointment.id,
    title: appointment.patient_name,
    start: appointment.appointment_date,
    end: appointment.appointment_date,
    clinician: appointment.doctor_name,
    purpose: appointment.appointment_purpose_id_description,
    patient_id: appointment.patient_id,
  }));

  console.log('Formatted Appointments:', formattedAppointments);


  const handleEventClick = (info) => {
    const clickedAppointment = formattedAppointments.find((appointment) => appointment.id === parseInt(info.event.id));
    setSelectedAppointment(clickedAppointment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedAppointment(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (calendarRef.current) {
      calendarRef.current.getApi().gotoDate(new Date()); // Go to today's date
      calendarRef.current.getApi().removeAllEvents(); // Clear existing events
      calendarRef.current.getApi().addEventSource(formattedAppointments); // Add your formatted appointments
    }
  }, [formattedAppointments]);

  return (
    <Card className='shadow-none border-0 mb-0 rounded-0'>
      <CardBody className='pb-0'>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={formattedAppointments}
          eventClick={handleEventClick}
        />
      </CardBody>
      <AppointmentModal
        isOpen={isModalOpen}
        appointment={selectedAppointment}
        onClose={() => setIsModalOpen(false)}
      />
    </Card>
  );
};

export default CalendarCard;
