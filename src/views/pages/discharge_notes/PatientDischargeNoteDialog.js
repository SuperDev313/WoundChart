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


const PatientDischargeNoteDialog = ({ open, doTogglePopup, recordId, doHandleSaveAndClosePopup }) => {

    const { id } = useParams();

    const [discharge_reason_options, setDischarge_Reason_Options] = useState([{ label: "", value: "" }]);

    const [loading, setLoading] = useState(false);

    const formSchema = yup.object().shape({
        id: yup.number(),
        data_date: yup
            .date()
            .required("Date is required.")
            .label(" Date")
            .transform((value) => (isValidDate(value) ? value : null))
            .max(new Date(), ' Date must be today or earlier')
            .min(minDateOfBirth(), 'Invalid  Date'),
        discharge_reason_id: yup
            .number()
            .transform((value) => (isNaN(value) || value === null || value === undefined) ? null : value)
            .required("Discharge Reason must be selected")
            .label("Discharge Reason"),
        follow_up_with_primary_care_physician: yup
            .bool()
            .transform((value) => (value == '' || value === undefined) ? null : value)
            .notRequired()
            .label("Follow Up With Primary Care Physician"),
        importance_of_smoking_cessation: yup
            .bool()
            .transform((value) => (value == '' || value === undefined) ? null : value)
            .notRequired()
            .label("Importance Of Smoking Cessation"),
        minimizing_walking_amount: yup
            .bool()
            .transform((value) => (value == '' || value === undefined) ? null : value)
            .notRequired()
            .label("Minimizing Walking Amount"),
        follow_preventive_measures: yup
            .bool()
            .transform((value) => (value == '' || value === undefined) ? null : value)
            .notRequired()
            .label("Follow Preventive Measures"),
        notify_immediately_if_infection: yup
            .bool()
            .transform((value) => (value == '' || value === undefined) ? null : value)
            .notRequired()
            .label("Notify Immediately If Infection"),
        family_member_understood_treatment_recommendations: yup
            .bool()
            .transform((value) => (value == '' || value === undefined) ? null : value)
            .notRequired()
            .label("Family Member Understood Treatment Recommendations"),
        patient_understood_treatment_recommendations: yup
            .bool()
            .transform((value) => (value == '' || value === undefined) ? null : value)
            .notRequired()
            .label("Patient Understood Treatment Recommendations"),
        notify_wound_if_the_wound_reopens_or_new: yup
            .bool()
            .transform((value) => (value == '' || value === undefined) ? null : value)
            .notRequired()
            .label("Notify Wound If The Wound Reopens Or New"),
        notes: yup
            .string()
            .max(50)
            .notRequired()
            .label("Notes"),
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

        useApi
            .get(`/patients/${id}/discharge_notes`, {})
            .then((res) => {
                const data = res.data.data;
                setValue("id", data.id);
                setValue("procedure_date", getDateTimeLocal(data.data_date));
                setValue("discharge_reason_id", isNaN(data.discharge_reason_id) ? null : parseInt(data.discharge_reason_id));
                setValue("follow_up_with_primary_care_physician", data.follow_up_with_primary_care_physician);
                setValue("importance_of_smoking_cessation", data.importance_of_smoking_cessation);
                setValue("minimizing_walking_amount", data.minimizing_walking_amount);
                setValue("follow_preventive_measures", data.follow_preventive_measures);
                setValue("notify_immediately_if_infection", data.notify_immediately_if_infection);
                setValue("family_member_understood_treatment_recommendations", data.family_member_understood_treatment_recommendations);
                setValue("patient_understood_treatment_recommendations", data.patient_understood_treatment_recommendations);
                setValue("notify_wound_if_the_wound_reopens_or_new", data.notify_wound_if_the_wound_reopens_or_new);
                setValue("notes", data.notes);

                setLoading(false);
            })
            .catch((err) => {
                showAlertError(err);
                setLoading(false);
            });
    }, []);

    React.useEffect(() => {
        useApi
            .get("/lookup/discharge_reason_options", {})
            .then((res) => {
                var items = [{ text: "", value: "" }];
                res.data.data.map((r) => {
                    const option = { label: r.description, value: r.id };
                    items.push(option);
                    return option;
                });
                setDischarge_Reason_Options(items);
            })
            .catch((err) => {
                showAlertError(err);
            });


    }, []);

    const onSubmit = (data, valid) => {

        if (valid) {
            setLoading(true);
            useApi
                .doRun(data.id > 0 ? "put" : "post", `patients/${id}/discharge_notes/${data.id}`, {
                    patient_id: parseInt(id),
                    data_date: dateToISOString(new Date(data.data_date)),
                    discharge_reason_id: isNaN(data.discharge_reason_id) ? null : parseInt(data.discharge_reason_id),
                    follow_up_with_primary_care_physician: data.follow_up_with_primary_care_physician,
                    importance_of_smoking_cessation: data.importance_of_smoking_cessation,
                    minimizing_walking_amount: data.minimizing_walking_amount,
                    follow_preventive_measures: data.follow_preventive_measures,
                    notify_immediately_if_infection: data.notify_immediately_if_infection,
                    family_member_understood_treatment_recommendations: data.family_member_understood_treatment_recommendations,
                    patient_understood_treatment_recommendations: data.patient_understood_treatment_recommendations,
                    notify_wound_if_the_wound_reopens_or_new: data.notify_wound_if_the_wound_reopens_or_new,
                    notes: data.notes,
                })
                .then((res) => {
                    toast("PatientDischargeNote Saved Successfully!");
                    doHandleSaveAndClosePopup();
                    setLoading(false);
                })
                .catch((err) => {
                    setLoading(false);
                    showAlertError(err);
                });
        }
    }

    const doSubmit = async() => {
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
                        <h1>Add New Patient Discharge Note</h1>
                        <p>Enter the values to continue</p>
                    </div>

                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>

                            <Col md="6" className="mb-1">
                                <Label className="form-label" for="data_date">Data Date </Label>

                                <Controller
                                    id="data_date"
                                    name="data_date"
                                    control={control}
                                    render={({ field }) => (

                                        <Input
                                            type="datetime-local"
                                            invalid={errors.data_date && true}
                                            {...field}
                                        />
                                    )}
                                />

                                {errors.data_date && (
                                    <FormFeedback>{errors.data_date.message}</FormFeedback>
                                )}
                            </Col>

                            <Col className="col-md-6 mb-1">
                                <Label className="form-label" for="discharge_reason_id">Discharge Reason Id </Label>

                                <Controller
                                    name="discharge_reason_id"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="select"
                                            id="discharge_reason_id"
                                            invalid={errors.discharge_reason_id && true}
                                            {...field}
                                        >
                                            {discharge_reason_options.map &&
                                                discharge_reason_options.map((item, index) => (
                                                    <option value={item.value} key={item.value}>
                                                        {item.label}
                                                    </option>
                                                ))}
                                        </Input>
                                    )}
                                />
                                {errors.discharge_reason_id && (
                                    <FormFeedback>{errors.discharge_reason_id.message}</FormFeedback>
                                )}
                            </Col>

                            <Col xl='6' xs='6'>
                                <Row tag='dl' className='mb-0'>
                                    <SwitchControl
                                        control={control} name="follow_up_with_primary_care_physician"
                                        label="Follow Up With Primary Care Physician"
                                        onValueChange={checkBoxValueChange}
                                        sm={5}
                                    />
                                </Row>
                            </Col>

                            <Col xl='6' xs='6'>
                                <Row tag='dl' className='mb-0'>
                                    <SwitchControl
                                        control={control} name="importance_of_smoking_cessation"
                                        label="Importance Of Smoking Cessation"
                                        onValueChange={checkBoxValueChange}
                                        sm={5}
                                    />

                                </Row>
                            </Col>

                            <Col xl='6' xs='6'>
                                <Row tag='dl' className='mb-0'>
                                    <SwitchControl
                                        control={control} name="minimizing_walking_amount"
                                        label="Minimizing Walking Amount"
                                        onValueChange={checkBoxValueChange}
                                        sm={5}
                                    />

                                </Row>
                            </Col>



                            <Col xl='6' xs='6'>
                                <Row tag='dl' className='mb-0'>

                                    <SwitchControl
                                        control={control} name="follow_preventive_measures"
                                        label="Follow Preventive Measures"
                                        onValueChange={checkBoxValueChange}
                                        sm={5}
                                    />

                                </Row>
                            </Col>



                            <Col xl='6' xs='6'>
                                <Row tag='dl' className='mb-0'>
                                    <SwitchControl
                                        control={control} name="notify_immediately_if_infection"
                                        label="Notify Immediately If Infection"
                                        onValueChange={checkBoxValueChange}
                                        sm={5}
                                    />

                                </Row>
                            </Col>



                            <Col xl='6' xs='6'>
                                <Row tag='dl' className='mb-0'>
                                    <SwitchControl
                                        control={control} name="family_member_understood_treatment_recommendations"
                                        label="Family Member Understood Treatment Recommendations"
                                        onValueChange={checkBoxValueChange}
                                        sm={5}
                                    />

                                </Row>
                            </Col>



                            <Col xl='6' xs='6'>
                                <Row tag='dl' className='mb-0'>
                                    <SwitchControl
                                        control={control} name="patient_understood_treatment_recommendations"
                                        label="Patient Understood Treatment Recommendations"
                                        onValueChange={checkBoxValueChange}
                                        sm={5}
                                    />

                                </Row>
                            </Col>



                            <Col xl='6' xs='6'>
                                <Row tag='dl' className='mb-0'>
                                    <SwitchControl
                                        control={control} name="notify_wound_if_the_wound_reopens_or_new"
                                        label="Notify Wound If The Wound Reopens Or New"
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

export default PatientDischargeNoteDialog;