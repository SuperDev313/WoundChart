
// ** React Imports
import React, { Fragment, useState } from "react";

// ** Utils
import { isObjEmpty, isValidDate, minDateOfBirth } from "@utils";
import Flatpickr from 'react-flatpickr'
import classnames from "classnames";

// ** Third Party Components
import * as yup from "yup";
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import MyCleave from "../../../components/forms/MyCleave";
import useApi from "../../../api/useApi";

import { getDateTimeLocal, dateToISOString } from "../../../utility/Utils";
// ** Utils
import { showAlertError } from "../../../components/alerts/AlertUtils";

import "cleave.js/dist/addons/cleave-phone.us";

// ** Reactstrap Imports
import {
    Form,
    Label,
    Input,
    Row,
    Col,
    Button,
    FormFeedback,
    InputGroup,
    InputGroupText,
} from "reactstrap";

const EditPatientProgressNote = ({ id, formData, doSubmit, callBack }) => {

    const [temperature_unit_options, setTemperature_Unit_Options] = useState([{ label: "", value: "" }]);
    const [today] = useState(new Date().toISOString().substr(0, 10));

    const formSchema = yup.object().shape({
        data_date: yup
            .date()
            .required("Visit Date is required.")
            .label("Visit Date")
            .transform((value) => (isValidDate(value) ? value : null))
            .max(new Date(), 'Visit Date must be today or earlier')
            .min(minDateOfBirth(), 'Invalid Visit Date'),
    
        temperature: yup
            .number()
            .transform((o, v) => (parseFloat((v + "").replace(/,/g, ""))))
            .required('Temperature is Required')
            .typeError('Temperature value must be a number')
            .label("Temperature"),
    
        temperature_unit_id: yup
            .string()
            .required('Temperature Unit is required')
            .label("Temperature Unit ID"),
    
        respiratory_rate: yup
            .number()
            .transform((o, v) => (parseFloat((v + "").replace(/,/g, ""))))
            .required('Respiratory Rate is required')
            .label("Respiratory Rate")
            .typeError('Respiratory value must be a number'),
    
        blood_pressure_systolic: yup
            .number()
            .transform((o, v) => (parseFloat((v + "").replace(/,/g, ""))))
            .required('Blood Pressure systolic value is required')
            .label("Blood Pressure Systolic")
            .typeError('Blood Pressure systolic value must be a number'),
    
        blood_pressure_diastolic: yup
            .number()
            .transform((o, v) => (parseFloat((v + "").replace(/,/g, ""))))
            .required('Blood Pressure Diastolic value is required')
            .label("Blood Pressure Diastolic")
            .typeError('Blood Pressure Diastolic value must be a number'),
    
        heart_rate: yup
            .number()
            .transform((o, v) => (parseFloat((v + "").replace(/,/g, ""))))
            .required('Heart Rate Value is required')
            .typeError('Heart Rate value must be a number')
            .label("Heart Rate"),
    
        assessment: yup
            .string()
            .max(1000)
            .required()
            .label("Assessment"),
    
        chief_complaint: yup
            .string()
            .max(5000)
            .required('Chief Complaint is required')
            .label("Chief Complaint"),
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
            .get("/lookup/temperature_unit_options", {})
            .then((res) => {
                var items = [{ label: "", value: "" }];
                res.data.data.map((r) => {
                    const option = { label: r.description, value: r.id };
                    items.push(option);
                    return option;
                });
                setTemperature_Unit_Options(items);
            })
            .catch((err) => {
                showAlertError(err);
            });


    }, []);


    React.useEffect(() => {

        const fetchFormData = () => {
            setValue("data_date", getDateTimeLocal(formData.data_date));
            setValue("temperature", isNaN(formData.temperature) ? "" : formData.temperature);
            setValue("temperature_unit_id", isNaN(formData.temperature_unit_id) ? "" : formData.temperature_unit_id);
            setValue("respiratory_rate", isNaN(formData.respiratory_rate) ? "" : formData.respiratory_rate);
            setValue("blood_pressure_systolic", isNaN(formData.blood_pressure_systolic) ? "" : formData.blood_pressure_systolic);
            setValue("blood_pressure_diastolic", isNaN(formData.blood_pressure_diastolic) ? "" : formData.blood_pressure_diastolic);
            setValue("heart_rate", isNaN(formData.heart_rate) ? "" : formData.heart_rate);
            setValue("assessment", formData.assessment);
            setValue("chief_complaint", formData.chief_complaint);

        };
        if (formData) {
            fetchFormData();
        }
    }, [formData]);


    React.useEffect(() => {
        const doRun = async () => {
            const result = await trigger();

            callBack(getValues(), result)
        }
        if (doSubmit) {
            doRun()
        }

    }, [doSubmit]);

    const onSubmit = (data) => {
        callBack(data, isObjEmpty(errors))
    };


    return (
        <>
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
                                    maxDate={today}
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

                    <Col md="6" className="mb-1">
                        <Label className="form-label" for="temperature">Temperature <span className="text-danger">*</span></Label>
                        <Controller
                            id="temperature"
                            name="temperature"
                            control={control}
                            placeholder="10,000"
                            render={({ field: { ref, ...field } }) => (
                                <MyCleave
                                    {...field}
                                    maxLength="3"
                                    className={classnames("form-control", {
                                        "is-invalid": errors.temperature && true,
                                    })}
                                    options={{
                                        numeral: true,
                                        max: 999,
                                        numeralThousandsGroupStyle: "thousand",
                                    }}
                                />
                            )}
                        />

                        {errors.temperature && (
                            <FormFeedback>{errors.temperature.message}</FormFeedback>
                        )}
                    </Col>

                    <Col className="col-md-6 mb-1">
                        <Label className="form-label" for="temperature_unit_id">Temperature Unit Id <span className="text-danger">*</span></Label>

                        <Controller
                            name="temperature_unit_id"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="select"
                                    id="temperature_unit_id"
                                    invalid={errors.temperature_unit_id && true}
                                    {...field}
                                >
                                    {temperature_unit_options.map &&
                                        temperature_unit_options.map((item, index) => (
                                            <option value={item.value} key={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                </Input>
                            )}
                        />
                        {errors.temperature_unit_id && (
                            <FormFeedback>{errors.temperature_unit_id.message}</FormFeedback>
                        )}
                    </Col>

                    <Col md="6" className="mb-1">
                        <Label className="form-label" for="respiratory_rate">Respiratory Rate <span className="text-danger">*</span></Label>
                        <Controller
                            id="respiratory_rate"
                            name="respiratory_rate"
                            control={control}
                            placeholder="10,000"
                            render={({ field: { ref, ...field } }) => (
                                <MyCleave
                                    {...field}
                                    maxLength="3"
                                    className={classnames("form-control", {
                                        "is-invalid": errors.respiratory_rate && true,
                                    })}
                                    options={{
                                        numeral: true,
                                        numeralThousandsGroupStyle: "thousand",
                                    }}
                                />
                            )}
                        />

                        {errors.respiratory_rate && (
                            <FormFeedback>{errors.respiratory_rate.message}</FormFeedback>
                        )}
                    </Col>

                    <Col md="6" className="mb-1">
                        <Label className="form-label" for="blood_pressure_systolic">Blood Pressure Systolic <span className="text-danger">*</span></Label>
                        <Controller
                            id="blood_pressure_systolic"
                            name="blood_pressure_systolic"
                            control={control}
                            placeholder="10,000"
                            render={({ field: { ref, ...field } }) => (
                                <MyCleave
                                    {...field}
                                    maxLength="3"
                                    className={classnames("form-control", {
                                        "is-invalid": errors.blood_pressure_systolic && true,
                                    })}
                                    options={{
                                        numeral: true,
                                        numeralThousandsGroupStyle: "thousand",
                                    }}
                                />
                            )}
                        />

                        {errors.blood_pressure_systolic && (
                            <FormFeedback>{errors.blood_pressure_systolic.message}</FormFeedback>
                        )}
                    </Col>

                    <Col md="6" className="mb-1">
                        <Label className="form-label" for="blood_pressure_diastolic">Blood Pressure Diastolic <span className="text-danger">*</span></Label>
                        <Controller
                            id="blood_pressure_diastolic"
                            name="blood_pressure_diastolic"
                            control={control}
                            placeholder="10,000"
                            render={({ field: { ref, ...field } }) => (
                                <MyCleave
                                    {...field}
                                    maxLength="3"
                                    className={classnames("form-control", {
                                        "is-invalid": errors.blood_pressure_diastolic && true,
                                    })}
                                    options={{
                                        numeral: true,
                                        numeralThousandsGroupStyle: "thousand",
                                    }}
                                />
                            )}
                        />

                        {errors.blood_pressure_diastolic && (
                            <FormFeedback>{errors.blood_pressure_diastolic.message}</FormFeedback>
                        )}
                    </Col>

                    <Col md="6" className="mb-1">
                        <Label className="form-label" for="heart_rate">Heart Rate <span className="text-danger">*</span></Label>
                        <Controller
                            id="heart_rate"
                            name="heart_rate"
                            control={control}
                            placeholder="10,000"
                            render={({ field: { ref, ...field } }) => (
                                <MyCleave
                                    {...field}
                                    maxLength="3"
                                    className={classnames("form-control", {
                                        "is-invalid": errors.heart_rate && true,
                                    })}
                                    options={{
                                        numeral: true,
                                        numeralThousandsGroupStyle: "thousand",
                                    }}
                                />
                            )}
                        />

                        {errors.heart_rate && (
                            <FormFeedback>{errors.heart_rate.message}</FormFeedback>
                        )}
                    </Col>

                    <Col md="6" className="mb-1">
                        <Label className="form-label" for="assessment">Assessment <span className="text-danger">*</span></Label>

                        <Controller
                            id="assessment"
                            name="assessment"
                            control={control}
                            render={({ field }) => (
                                <Input invalid={errors.assessment && true} {...field} />
                            )}
                        />
                        {errors.assessment && (
                            <FormFeedback>{errors.assessment.message}</FormFeedback>
                        )}
                    </Col>

                    <Col md="6" className="mb-1">
                        <Label className="form-label" for="chief_complaint">Chief Complaint <span className="text-danger">*</span></Label>

                        <Controller
                            id="chief_complaint"
                            name="chief_complaint"
                            control={control}
                            render={({ field }) => (
                                <Input invalid={errors.chief_complaint && true} {...field} />
                            )}
                        />
                        {errors.chief_complaint && (
                            <FormFeedback>{errors.chief_complaint.message}</FormFeedback>
                        )}
                    </Col>

                </Row>

            </Form>
        </>
    );

}

export default EditPatientProgressNote;