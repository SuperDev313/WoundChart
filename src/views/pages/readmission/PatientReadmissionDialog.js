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
import WarningAlert from "../../../components/alerts/Alert";
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
    Alert,
    FormFeedback,
    InputGroup,
    InputGroupText,
} from "reactstrap";

import { dateToISOString } from "../../../utility/Utils";
import SwitchControl from '../../../components/forms/SwitchControl';

const PatientReadmissionDialog = ({ open, doTogglePopup, recordId, doHandleSaveAndClosePopup }) => {

    const { id } = useParams();

    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(true)
    const [admission_status_options, setAdmission_Status_Options] = useState([{ label: "", value: "" }]);
    const [admission_reason_options, setAdmission_Reason_Options] = useState([{ label: "", value: "" }]);

    const dismissAlert = () => {
        setShowAlert(false);
    }

    const formSchema = yup.object().shape({
        id: yup.number(),
        data_date: yup
            .date()
            .required("Date is required.")
            .label(" Date")
            .transform((value) => (isValidDate(value) ? value : null))
            .max(new Date(), ' Date must be today or earlier')
            .min(minDateOfBirth(), 'Invalid  Date'),
        admission_status_id: yup
            .number()
            .transform((value) => (isNaN(value) || value === null || value === undefined) ? null : value)
            .notRequired()
            .label("Admission Status"),
        admission_reason_id: yup
            .number()
            .transform((value) => (isNaN(value) || value === null || value === undefined) ? null : value)
            .notRequired()
            .label("Admission Reason"),
        notes: yup
            .string()
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
        .get(`/patients/${id}/readmission`, {})
        .then((res) => {
            const data = res.data.data;
            setValue("id", data.id);
            setValue("data_date", data.data_date);
            setValue("admission_status_id", isNaN(data.admission_status_id) ? null : parseInt(data.admission_status_id));
            setValue("admission_reason_id", isNaN(data.admission_reason_id) ? null : parseInt(data.admission_reason_id));
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
            .get("/lookup/admission_status_options", {})
            .then((res) => {
                var items = [{ text: "", value: "" }];
                res.data.data.map((r) => {
                    const option = { label: r.description, value: r.id };
                    items.push(option);
                    return option;
                });
                setAdmission_Status_Options(items);
            })
            .catch((err) => {
                showAlertError(err);
            });
        useApi
            .get("/lookup/admission_reason_options", {})
            .then((res) => {
                var items = [{ text: "", value: "" }];
                res.data.data.map((r) => {
                    const option = { label: r.description, value: r.id };
                    items.push(option);
                    return option;
                });
                setAdmission_Reason_Options(items);
            })
            .catch((err) => {
                showAlertError(err);
            });


    }, []);

    const onSubmit = (data, isValid) => {
        if (isValid) {
            setLoading(true);
            useApi
                .doRun(data.id > 0 ? "put" : "post", `patients/${id}/readmission/${data.id}`, {
                    patient_id: parseInt(id),
                    data_date: dateToISOString(new Date(data.data_date)),
                    admission_status_id: isNaN(data.admission_status_id) ? null : parseInt(data.admission_status_id),
                    admission_reason_id: isNaN(data.admission_reason_id) ? null : parseInt(data.admission_reason_id),
                    notes: data.notes,
                })
                .then((res) => {
                    toast("Patient Readmission Saved Successfully!");
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
                        <h1>Add New Patient Readmission</h1>
                        <p>Enter the values to continue</p>
                    </div>

                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col md="12" className="mb-1">
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
                                <Label className="form-label" for="admission_status_id">Admission Status Id </Label>

                                <Controller
                                    name="admission_status_id"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="select"
                                            id="admission_status_id"
                                            invalid={errors.admission_status_id && true}
                                            {...field}
                                        >
                                            {admission_status_options.map &&
                                                admission_status_options.map((item, index) => (
                                                    <option value={item.value} key={item.value}>
                                                        {item.label}
                                                    </option>
                                                ))}
                                        </Input>
                                    )}
                                />
                                {errors.admission_status_id && (
                                    <FormFeedback>{errors.admission_status_id.message}</FormFeedback>
                                )}
                            </Col>

                            <Col className="col-md-6 mb-1">
                                <Label className="form-label" for="admission_reason_id">Admission Reason Id </Label>

                                <Controller
                                    name="admission_reason_id"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="select"
                                            id="admission_reason_id"
                                            invalid={errors.admission_reason_id && true}
                                            {...field}
                                        >
                                            {admission_reason_options.map &&
                                                admission_reason_options.map((item, index) => (
                                                    <option value={item.value} key={item.value}>
                                                        {item.label}
                                                    </option>
                                                ))}
                                        </Input>
                                    )}
                                />
                                {errors.admission_reason_id && (
                                    <FormFeedback>{errors.admission_reason_id.message}</FormFeedback>
                                )}
                            </Col>
                            <WarningAlert
                                variant="warning"
                                message={`
                                    <b>Readmission of Patient</b><br /><br />
                                    Remember to complete the following tasks:<br />
                                    - Start of Care Evaluation<br />
                                    - Lower Extremity Evaluation (if required)<br />
                                    - Pressure Injury Risk Assessment (if required)<br />
                                    - Mini Nutritional Assessment
                                `}
                                isOpen={showAlert}
                                toggle={dismissAlert}
                            />

                            <Col md="12" className="mb-1">
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

export default PatientReadmissionDialog;