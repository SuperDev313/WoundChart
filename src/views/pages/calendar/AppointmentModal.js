import React from 'react';
import { useForm } from "react-hook-form";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Row,
    Col,
    Label,
    Input,
    InputGroup,
    InputGroupText
} from 'reactstrap';
import { Check, X, Calendar, Clock } from 'react-feather'
import { DateFormat, TimeFormat } from '../../../utility/Utils';
import AddToCalendarButton from './AddToCalendar';
import RescheduleDeleteAppointment from './RescheduleDeleteAppointment';

const AppointmentModal = ({ isOpen, appointment, onClose }) => {
    console.log(appointment);
    const [editOpen, setEditOpen] = React.useState(false);

    const handleCloseEditModal = () => {
        setEditOpen(false);
    };

    const doHandleSaveAndClosePopup = () => {
        setEditOpen(false);
    };

    return (
        <>
            <Modal isOpen={isOpen} toggle={onClose} className='modal-dialog-centered modal-lg'>
                <ModalHeader className='bg-transparent' toggle={onClose}></ModalHeader>
                <ModalBody className='px-sm-5 mx-50 pb-5'>
                    <div className='text-center mb-2'>
                        <h1 className='mb-1'>Appointment Details</h1>
                        {/* <p>Updating user details will receive a privacy audit.</p> */}
                    </div>
                    {appointment && (
                        <>
                            {/* <div>
                                <h5>Patient Name: {appointment.title}</h5>
                                <p>Appointment Date: {new Date(appointment.start).toLocaleString()}</p>
                            </div> */}
                            <Row tag='form' className='gy-1 pt-75'>
                                <Col md={12} xs={12}>
                                    <Label className='form-label' for='fullName'>
                                        Name
                                    </Label>

                                    <Input
                                        id='fullName'
                                        placeholder='John'
                                        value={appointment.title}
                                        disabled />
                                </Col>
                                <Col md={12} xs={12}>
                                    <Label className='form-label' for='fullName'>
                                        Date
                                    </Label>

                                    <InputGroup className='mb-2'>
                                        <Input
                                            id="Date"
                                            placeholder=""
                                            value={DateFormat(appointment.start)}
                                            disabled />
                                        <InputGroupText><Calendar /></InputGroupText>
                                    </InputGroup>
                                </Col>
                                <Col md={12} xs={12}>
                                    <Label className='form-label' for='fullName'>
                                        Time
                                    </Label>

                                    <InputGroup className='mb-2'>
                                        <Input
                                            id="Time"
                                            placeholder=""
                                            value={TimeFormat(appointment.start)}
                                            disabled />
                                        <InputGroupText><Clock /></InputGroupText>
                                    </InputGroup>
                                </Col>
                                <Col md={12} xs={12}>
                                    <Label className='form-label' for='fullName'>
                                        Clinician
                                    </Label>

                                    <Input
                                        id='clinician'
                                        placeholder='John'
                                        value={appointment.clinician}
                                        disabled />
                                </Col>
                                <Col md={12} xs={12}>
                                    <Label className='form-label' for='purpose'>
                                        Purpose
                                    </Label>

                                    <Input
                                        id='purpose'
                                        placeholder='John'
                                        value={appointment.purpose}
                                        disabled />
                                </Col>
                                <Col xs={12} className='text-center mt-2 pt-50'>
                                    <AddToCalendarButton
                                        startDate={`${DateFormat(appointment.start)} ${TimeFormat(appointment.start)}`}
                                        endDate={`${DateFormat(appointment.end)} ${TimeFormat(appointment.end)}`}
                                        timeZone="America/Puerto_Rico"
                                        title={appointment.title}
                                        description={`${appointment.purpose} with ${appointment.clinician}`} 
                                    />
                                    <Button
                                        type='submit'
                                        className='me-1'
                                        color='danger'
                                        onClick={() => setEditOpen(true)}
                                    >
                                        Reschedule or Delete Appointment
                                    </Button>
                                    <Button type='reset' color='secondary' outline onClick={() => setShow(false)}>
                                        Cancel
                                    </Button>
                                </Col>
                            </Row>
                            <RescheduleDeleteAppointment
                                open={editOpen}
                                patientId={ appointment.patient_id }
                                doTogglePopup={ handleCloseEditModal }
                                recordId={ appointment.id }
                                doHandleSaveAndClosePopup={ doHandleSaveAndClosePopup }
                            />
                        </>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
};

export default AppointmentModal;
