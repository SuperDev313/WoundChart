

// ** React Import
import React, { Fragment, useState, useEffect } from "react";
import useApi from "../../../api/useApi";
// ** Utils
import { isObjEmpty, isValidDate, minDateOfBirth } from "@utils";
import classnames from "classnames";
// ** Third Party Components
import * as yup from "yup";
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useParams } from "react-router-dom";
// ** Custom Components
import { DefaultLoader } from "../../../components/spinner/LoadingSpinner";
import UILoader from "../../../components/ui-loader";
// ** Utils
import { showAlertError } from "../../../components/alerts/AlertUtils";
import { getDateTimeLocal, transformValue } from "../../../utility/Utils";

import MyCleave from "../../../components/forms/MyCleave";
import "cleave.js/dist/addons/cleave-phone.us";
// ** Third Party Components
import toast from "react-hot-toast";
// ** Reactstrap Imports
import {
    Button,
    Modal,
    ModalBody,
    ModalHeader,
    Form,
    Label,
    Input,
    Row,
    Col,
    FormFeedback,
    InputGroup,
    InputGroupText,
} from "reactstrap";

import { dateToISOString } from "../../../utility/Utils";
import SwitchControl from '../../../components/forms/SwitchControl';

const PatientAppointmentDialog = ({ open, doTogglePopup, recordId, doHandleSaveAndClosePopup }) => {

    const { id } = useParams();

    const [loading, setLoading] = useState(false);
    const [doctorsName, setDoctorsName] = useState([{ label: "", value: "" }]);
    const [appointment_purpose, setAppointment_Purpose] = useState([{ label: "", value: "" }]);
    const [appointment_reschedule_reason, setAppointment_Reschedule_Reason] = useState([{ label: "", value: "" }]);
    const [appointment_status, setAppointment_Status] = useState([{ label: "", value: "" }]);

    const formSchema = yup.object().shape({
        patient_id: yup
          .number()
          .transform((value) => ((isNaN(value) || value === null || value === undefined) ? null : value))
          .notRequired()
          .label("Patient ID"),
        doctor_id: yup
          .number()
          .transform((value) => ((isNaN(value) || value === null || value === undefined) ? null : value))
          .notRequired()
          .label("Doctor ID"),
        doctor_name: yup
          .string()
          .max(250, "Doctor Name must be at most 250 characters.")
          .notRequired()
          .label("Doctor Name"),
        appointment_date: yup
          .date()
          .notRequired()
          .label("Appointment Date")
          .min(new Date(), "Appointment Date must be today or later"),
        reschedule_date: yup
          .date()
          .notRequired()
          .label("Reschedule Date"),
        reschedule_reason_id: yup
          .number()
          .transform((value) => ((isNaN(value) || value === null || value === undefined) ? null : value))
          .notRequired()
          .label("Reschedule Reason ID"),
        appointment_purpose_id: yup
          .number()
          .transform((value) => ((isNaN(value) || value === null || value === undefined) ? null : value))
          .notRequired()
          .label("Appointment Purpose ID"),
        appointment_status_id: yup
          .number()
          .transform((value) => ((isNaN(value) || value === null || value === undefined) ? null : value))
          .notRequired()
          .label("Appointment Status ID"),
        notify: yup
          .bool()
          .transform((value) => ((value === '' || value === undefined) ? null : value))
          .notRequired()
          .label("Notify"),
        notes: yup
          .string()
          .max(50, "Notes must be at most 50 characters.")
          .notRequired()
          .label("Notes"),
        wound_note_id: yup
          .number()
          .transform((value) => ((isNaN(value) || value === null || value === undefined) ? null : value))
          .notRequired()
          .label("Wound Note ID"),
        appointment_void: yup
          .bool()
          .transform((value) => ((value === '' || value === undefined) ? null : value))
          .notRequired()
          .label("Appointment Void"),
      });

    // ** Hooks
    const {
        trigger,
        control,
        setValue,
        getValues,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({ resolver: yupResolver(formSchema) });


    React.useEffect(() => {

        if (recordId > 0) {
            useApi
                .get(`/patients/${id}/appointments/${recordId}`, {})
                .then((res) => {
                    const data = res.data.data;
                    setValue("patient_id", parseInt(id));
                    setValue("doctor_name", data.doctor_name);
                    setValue("appointment_date", data.appointment_date);
                    setValue("reschedule_date", data.reschedule_date);
                    setValue("doctor_id", isNaN(data.doctor_id) ? null : parseInt(data.doctor_id));
                    setValue("reschedule_reazon_id", isNaN(data.reschedule_reazon_id) ? null : parseInt(data.reschedule_reazon_id));
                    setValue("appointment_purpose_id", isNaN(data.appointment_purpose_id) ? null : parseInt(data.appointment_purpose_id));
                    setValue("appointment_status_id", isNaN(data.appointment_status_id) ? null : parseInt(data.appointment_status_id));
                    setValue("notify", data.notify);
                    setValue("notes", data.notes);
                    setValue("wound_note_id", isNaN(data.wound_note_id) ? null : parseInt(data.wound_note_id));
                    setValue("appointment_void", data.appointment_void);
                    setLoading(false);
                })
                .catch((err) => {
                    showAlertError(err);
                    setLoading(false);
                });

        } else {
            setValue("patient_id", id);
            setValue("doctor_name", null);
            setValue("doctor_id", null);
            setValue("appointment_date", null);
            setValue("reschedule_date", null);
            setValue("reschedule_reazon_id", null);
            setValue("appointment_purpose_id", null);
            setValue("appointment_status_id", null);
            setValue("notify", null);
            setValue("notes", null);
            setValue("wound_note_id", null);
            setValue("appointment_void", null);
        }
    }, [recordId]);

    React.useEffect(() => {
        useApi
            .get("/users/MD", {})
            .then((res) => {
                console.log(res);
                // const items = [{ text: "", value: "" }];
                // res.data.data.map((r) => {
                //     const option = { label: r.description, value: r.id };
                //     items.push(option);
                //     return option;
                // });
                // setDoctorsName(items);
            })
            .catch((err) => {
                showAlertError(err);
            });

        useApi
            .get("/lookup/appointment_purpose", {})
            .then((res) => {
                const items = [{ text: "", value: "" }];
                res.data.data.map((r) => {
                    const option = { label: r.description, value: r.id };
                    items.push(option);
                    return option;
                });
                setAppointment_Purpose(items);
            })
            .catch((err) => {
                showAlertError(err);
            });

        useApi
            .get("/lookup/appointment_reschedule_reason", {})
            .then((res) => {
                const items = [{ text: "", value: "" }];
                res.data.data.map((r) => {
                    const option = { label: r.description, value: r.id };
                    items.push(option);
                    return option;
                });
                setAppointment_Reschedule_Reason(items);
            })
            .catch((err) => {
                showAlertError(err);
            });
        useApi
            .get("/lookup/appointment_status", {})
            .then((res) => {
                const items = [{ text: "", value: "" }];
                res.data.data.map((r) => {
                    const option = { label: r.description, value: r.id };
                    items.push(option);
                    return option;
                });
                setAppointment_Status(items);
            })
            .catch((err) => {
                showAlertError(err);
            });


    }, [recordId]);

    const onSubmit = (data, isValid) => {
        if (isValid) {
            setLoading(true);
            useApi
                .doRun(recordId > 0 ? "put" : "post", `patients/${id}/appointments/${recordId}`, {
                    patient_id: parseInt(id),
                    doctor_name: data.doctor_name,
                    appointment_date: dateToISOString(new Date(data.appointment_date)),
                    reschedule_date: dateToISOString(new Date(data.reschedule_date)),
                    reschedule_reazon_id: isNaN(data.reschedule_reazon_id) ? null : parseInt(data.reschedule_reazon_id),
                    appointment_purpose_id: isNaN(data.appointment_purpose_id) ? null : parseInt(data.appointment_purpose_id),
                    appointment_status_id: isNaN(data.appointment_status_id) ? null : parseInt(data.appointment_status_id),
                    notify: data.notify,
                    notes: data.notes,
                    wound_note_id: isNaN(data.wound_note_id) ? null : parseInt(data.wound_note_id),
                    appointment_void: data.appointment_void,
                })
                .then((res) => {
                    toast("Patient Appointment Saved Successfully!");
                    doHandleSaveAndClosePopup();
                    setLoading(false);
                })
                .catch((err) => {
                    setLoading(false);
                    showAlertError(err);
                });
        }
    }


    const doSubmit = async () => {
        const result = await trigger()

        onSubmit(getValues(), result)
    }

    const checkBoxValueChange = (e) => {
        const { value, name } = e.target;

        setValue(name, e.target.checked && true);

    }


    return (
        <Modal
            isOpen={open}
            className="modal-dialog-centered modal-lg"
            toggle={doTogglePopup}
        >
            <UILoader blocking={loading} loader={<DefaultLoader />}>
                <ModalHeader
                    className="bg-transparent"
                    toggle={doTogglePopup}
                ></ModalHeader>
                <ModalBody className="px-5 pb-5">
                    <div className='text-center mb-4'>
                        <h1>Add New Patient Appointment</h1>
                        <p>Enter the values to continue</p>
                    </div>

                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col md="6" className="mb-1">
                                <Label className="form-label" for="doctor_name">Doctor Name </Label>

                                <Controller
                                    id="doctor_name"
                                    name="doctor_name"
                                    control={control}
                                    render={({ field: { onBlur, value, ...field } }) => (
                                        <Input invalid={errors.doctor_name && true} {...field}
                                            value={value} />
                                    )}
                                />

                                {errors.doctor_name && (
                                    <FormFeedback>{errors.doctor_name.message}</FormFeedback>
                                )}
                            </Col>

                            <Col md="6" className="mb-1">
                                <Label className="form-label" for="appointment_date">Appointment Date </Label>
                                <Controller
                                    id="appointment_date"
                                    name="appointment_date"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="datetime-local"
                                            invalid={errors.appointment_date && true}
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.appointment_date && (
                                    <FormFeedback>{errors.appointment_date.message}</FormFeedback>
                                )}
                            </Col>

                            <Col md="6" className="mb-1">
                                <Label className="form-label" for="reschedule_date">Reschedule Date </Label>
                                <Controller
                                    id="reschedule_date"
                                    name="reschedule_date"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="datetime-local"
                                            invalid={errors.reschedule_date && true}
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.reschedule_date && (
                                    <FormFeedback>{errors.reschedule_date.message}</FormFeedback>
                                )}
                            </Col>

                            <Col className="col-md-6 mb-1">
                                <Label className="form-label" for="reschedule_reazon_id">Reschedule Reazon Id </Label>

                                <Controller
                                    name="reschedule_reazon_id"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="select"
                                            id="reschedule_reazon_id"
                                            invalid={errors.reschedule_reazon_id && true}
                                            {...field}
                                        >
                                            {appointment_reschedule_reason.map &&
                                                appointment_reschedule_reason.map((item, index) => (
                                                    <option value={item.value} key={item.value}>
                                                        {item.label}
                                                    </option>
                                                ))}
                                        </Input>
                                    )}
                                />
                                {errors.reschedule_reazon_id && (
                                    <FormFeedback>{errors.reschedule_reazon_id.message}</FormFeedback>
                                )}
                            </Col>

                            <Col className="col-md-6 mb-1">
                                <Label className="form-label" for="appointment_purpose_id">Appointment Purpose Id </Label>

                                <Controller
                                    name="appointment_purpose_id"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="select"
                                            id="appointment_purpose_id"
                                            invalid={errors.appointment_purpose_id && true}
                                            {...field}
                                        >
                                            {appointment_purpose.map &&
                                                appointment_purpose.map((item, index) => (
                                                    <option value={item.value} key={item.value}>
                                                        {item.label}
                                                    </option>
                                                ))}
                                        </Input>
                                    )}
                                />
                                {errors.appointment_purpose_id && (
                                    <FormFeedback>{errors.appointment_purpose_id.message}</FormFeedback>
                                )}
                            </Col>

                            <Col className="col-md-6 mb-1">
                                <Label className="form-label" for="appointment_status_id">Appointment Status Id </Label>

                                <Controller
                                    name="appointment_status_id"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="select"
                                            id="appointment_status_id"
                                            invalid={errors.appointment_status_id && true}
                                            {...field}
                                        >
                                            {appointment_status.map &&
                                                appointment_status.map((item, index) => (
                                                    <option value={item.value} key={item.value}>
                                                        {item.label}
                                                    </option>
                                                ))}
                                        </Input>
                                    )}
                                />
                                {errors.appointment_status_id && (
                                    <FormFeedback>{errors.appointment_status_id.message}</FormFeedback>
                                )}
                            </Col>


                            <Col xl='6' xs='6'>
                                <Row tag='dl' className='mb-0'>
                                    <SwitchControl
                                        control={control} name="notify"
                                        label=" Notify "
                                        onValueChange={checkBoxValueChange}
                                        sm={5}
                                    />

                                </Row>
                            </Col>


                            <Col md="6" className="mb-1">
                                <Label className="form-label" for="notes">Notes </Label>

                                <Controller
                                    id="notes"
                                    name="notes"
                                    control={control}
                                    render={({ field: { onBlur, value, ...field } }) => (
                                        <Input invalid={errors.notes && true} {...field}
                                            value={value} />
                                    )}
                                />

                                {errors.notes && (
                                    <FormFeedback>{errors.notes.message}</FormFeedback>
                                )}
                            </Col>


                            <Col xl='6' xs='6'>
                                <Row tag='dl' className='mb-0'>
                                    <SwitchControl
                                        control={control} name="appointment_void"
                                        label=" Appointment Void "
                                        onValueChange={checkBoxValueChange}
                                        sm={5}
                                    />

                                </Row>
                            </Col>


                        </Row>

                    </Form>

                    <Button type="button" className="me-1" color="primary" onClick={() => doSubmit()}>
                        Submit
                    </Button>
                    <Button
                        type="reset"
                        color="secondary"
                        outline
                        onClick={doTogglePopup}
                    >
                        Cancel
                    </Button>
                </ModalBody>
            </UILoader>
        </Modal>
    );
};

export default PatientAppointmentDialog;
