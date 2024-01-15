


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

const IctDialog = ({ open, doTogglePopup, recordId, doHandleSaveAndClosePopup }) => {

    const { id } = useParams();

    const [loading, setLoading] = useState(false);
    const [ict_reason_list, setIct_reason_list] = useState([{ label: "", value: "" }]);
    const [ict_type_list, setIct_type_list] = useState([{ label: "", value: "" }]);
    const [ict_invited_attendees_list, setIct_invited_attendees_list] = useState([{ label: "", value: "" }]);

    const formSchema = yup.object().shape({
        patient_id: yup
            .number()
            .transform((value) => (isNaN(value) || value === null || value === undefined) ? null : value)
            .notRequired()
            .label("Patient ID"),
        doctor_name: yup
            .string()
            .max(250, "Doctor Name must be at most 250 characters.")
            .notRequired()
            .label("Doctor Name"),
        visit_date: yup
            .date()
            .notRequired()
            .label("Appointment Date"),
        ict_type_id: yup
            .number()
            .transform((value) => (isNaN(value) || value === null || value === undefined) ? null : value)
            .notRequired()
            .label("ICT Type"),
        reason_for_ict_id: yup
            .number()
            .transform((value) => (isNaN(value) || value === null || value === undefined) ? null : value)
            .notRequired()
            .label("ICT Type"),
        invited_attendees_id: yup
            .number()
            .transform((value) => (isNaN(value) || value === null || value === undefined) ? null : value)
            .notRequired()
            .label("ICT Type"),
        notes: yup
            .string()
            .max(50, "Notes must be at most 50 characters.")
            .notRequired()
            .label("Notes")
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
                .get(`/patients/${id}/ict/${recordId}`, {})
                .then((res) => {
                    const data = res.data.data;
                    setValue("patient_id", parseInt(id));
                    setValue("doctor_name", data.doctor_name);
                    setValue("visit_date", data.visit_date);
                    setValue("ict_type_id", isNaN(data.ict_type_id) ? null : parseInt(data.ict_type_id));
                    setValue("reason_for_ict_id", isNaN(data.reason_for_ict_id) ? null : parseInt(data.reason_for_ict_id));
                    setValue("invited_attendees_id", isNaN(data.invited_attendees_id) ? null : parseInt(data.invited_attendees_id));
                    setValue("notes", data.notes);
                    setLoading(false);
                })
                .catch((err) => {
                    showAlertError(err);
                    setLoading(false);
                });

        }
        else {
            setValue("patient_id", id);
            setValue("doctor_name", null);
            setValue("visit_date", null);
            setValue("ict_type_id", null);
            setValue("reason_for_ict_id", null);
            setValue("invited_attendees_id", null);
            setValue("notes", null);
            setValue("wound_note_id", null);
        }
    }, [recordId]);

    React.useEffect(() => {
        useApi
            .get("/lookup/ict_reason_options", {})
            .then((res) => {
                console.log(res)
                var items = [{ text: "", value: "" }];
                res.data.data.map((r) => {
                    const option = { label: r.description, value: r.id };
                    items.push(option);
                    return option;
                });
                setIct_reason_list(items);
            })
            .catch((err) => {
                showAlertError(err);
            });
        useApi
            .get("/lookup/ict_type_options", {})
            .then((res) => {
                var items = [{ text: "", value: "" }];
                res.data.data.map((r) => {
                    const option = { label: r.description, value: r.id };
                    items.push(option);
                    return option;
                });
                setIct_type_list(items);
            })
            .catch((err) => {
                showAlertError(err);
            });
        useApi
            .get("/lookup/ict_invited_attendees_options", {})
            .then((res) => {
                var items = [{ text: "", value: "" }];
                res.data.data.map((r) => {
                    const option = { label: r.description, value: r.id };
                    items.push(option);
                    return option;
                });
                setIct_invited_attendees_list(items);
            })
            .catch((err) => {
                showAlertError(err);
            });


    }, [recordId]);

    const onSubmit = (data, isValid) => {
        if (isValid) {
            setLoading(true);
            useApi
                .doRun(recordId > 0 ? "put" : "post", `patients/${id}/ict/${recordId}`, {
                    patient_id: parseInt(id),
                    doctor_name: data.doctor_name,
                    visit_date: dateToISOString(new Date(data.visit_date)),
                    ict_type_id: isNaN(data.ict_type_id) ? null : parseInt(data.ict_type_id),
                    reason_for_ict_id: isNaN(data.reason_for_ict_id) ? null : parseInt(data.reason_for_ict_id),
                    invited_attendees_id: isNaN(data.invited_attendees_id) ? null : parseInt(data.invited_attendees_id),
                    notes: data.notes,
                    wound_note_id: isNaN(data.wound_note_id) ? null : parseInt(data.wound_note_id),
                })
                .then((res) => {
                    toast("Patient ICT Note Saved Successfully!");
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
                        <h1>Add New ICT Note</h1>
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
                                <Label className="form-label" for="visit_date">Visit Date </Label>
                                <Controller
                                    id="visit_date"
                                    name="visit_date"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="datetime-local"
                                            invalid={errors.visit_date && true}
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.visit_date && (
                                    <FormFeedback>{errors.visit_date.message}</FormFeedback>
                                )}
                            </Col>

                            <Col className="col-md-6 mb-1">
                                <Label className="form-label" for="ict_type_id">ICT TYPE </Label>

                                <Controller
                                    name="ict_type_id"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="select"
                                            id="ict_type_id"
                                            invalid={errors.ict_type_id && true}
                                            {...field}
                                        >
                                            {ict_type_list.map &&
                                                ict_type_list.map((item, index) => (
                                                    <option value={item.value} key={item.value}>
                                                        {item.label}
                                                    </option>
                                                ))}
                                        </Input>
                                    )}
                                />
                                {errors.ict_type_id && (
                                    <FormFeedback>{errors.ict_type_id.message}</FormFeedback>
                                )}
                            </Col>

                            <Col className="col-md-6 mb-1">
                                <Label className="form-label" for="reason_for_ict_id">REASON FOR ICT MEETING</Label>

                                <Controller
                                    name="reason_for_ict_id"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="select"
                                            id="reason_for_ict_id"
                                            invalid={errors.reason_for_ict_id && true}
                                            {...field}
                                        >
                                            {ict_reason_list.map &&
                                                ict_reason_list.map((item, index) => (
                                                    <option value={item.value} key={item.value}>
                                                        {item.label}
                                                    </option>
                                                ))}
                                        </Input>
                                    )}
                                />
                                {errors.reason_for_ict_id && (
                                    <FormFeedback>{errors.reason_for_ict_id.message}</FormFeedback>
                                )}
                            </Col>

                            <Col className="col-md-6 mb-1">
                                <Label className="form-label" for="invited_attendees_id">INVITED ATTENDEES:</Label>

                                <Controller
                                    name="invited_attendees_id"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="select"
                                            id="invited_attendees_id"
                                            invalid={errors.invited_attendees_id && true}
                                            {...field}
                                        >
                                            {ict_invited_attendees_list.map &&
                                                ict_invited_attendees_list.map((item, index) => (
                                                    <option value={item.value} key={item.value}>
                                                        {item.label}
                                                    </option>
                                                ))}
                                        </Input>
                                    )}
                                />
                                {errors.invited_attendees_id && (
                                    <FormFeedback>{errors.invited_attendees_id.message}</FormFeedback>
                                )}
                            </Col>


                            <Col md="6" className="mb-1">
                                <Label className="form-label" for="notes">ICT Meeting Notes Recommendations: </Label>

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

export default IctDialog;
