
// ** React Imports
import React, { Fragment, useState } from "react";

// ** Utils
import { isObjEmpty, isValidDate, minDateOfBirth } from "@utils";
import classnames from "classnames";

// ** Third Party Components
import * as yup from "yup";
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import MyCleave from "../../../components/forms/MyCleave";
import useApi from "../../../api/useApi";

import { getDateTimeLocal, transformValue } from "../../../utility/Utils";

import "cleave.js/dist/addons/cleave-phone.us";

// ** Reactstrap Imports
import {
    Form,
    Label,
    Input,
    Row,
    Col,
    FormFeedback,
} from "reactstrap";

const EditPatientVitalSign = ({ id, formData, doSubmit, callBack }) => {

    const [sample_taken_options, setSample_Taken_Options] = useState([{ label: "", value: "" }]);
    const [temperature_unit_options, setTemperature_Unit_Options] = useState([{ label: "", value: "" }]);
    const [today] = useState(new Date().toISOString().substr(0, 10));

    const formSchema = yup.object().shape({
        data_date: yup
            .date()
            .required("Visit Date is required.")
            .transform((value) => (isValidDate(value) ? value : null))
            .label("Visit Date")
            .max(new Date(), "Visit Date must be today or earlier")
            .min(minDateOfBirth(), "Invalid Visit Date"),
    
        temperature: yup
            .number()
            .transform((value) => transformValue(parseFloat(String(value).replace(/,/g, ""))))
            .required("Temperature is a Required Field, Please fill it")
            .typeError("Temperature value must be a number")
            .label("Temperature"),
    
        temperature_unit_id: yup
            .number()
            .transform(transformValue)
            .notRequired("Temperature Unit is a Required Field, Please fill it")
            .label("Temperature Unit ID"),
    
        pulse: yup
            .number()
            .transform(transformValue)
            .notRequired()
            .label("Pulse"),
    
        respiratory_rate: yup
            .number()
            .transform(transformValue)
            .notRequired()
            .label("Respiratory Rate"),
    
        blood_pressure_systolic: yup
            .number()
            .transform(transformValue)
            .notRequired()
            .label("Blood Pressure Systolic"),
    
        blood_pressure_diastolic: yup
            .number()
            .transform(transformValue)
            .notRequired()
            .label("Blood Pressure Diastolic"),
    
        oxygen_saturation: yup
            .number()
            .transform((value) => transformValue(parseFloat(String(value).replace(/,/g, ""))))
            .notRequired()
            .typeError("Oxygen Saturation value must be a number")
            .label("Oxygen Saturation"),
    
        blood_glucose: yup
            .number()
            .transform((value) => transformValue(parseFloat(String(value).replace(/,/g, ""))))
            .notRequired()
            .typeError("Blood Glucose value must be a number")
            .label("Blood Glucose"),
    
        sample_taken_id: yup
            .number()
            .transform(transformValue)
            .notRequired()
            .label("Sample Taken ID"),
    });
    
    // ** Hooks
    const {
        trigger,
        control,
        setValue,
        getValues,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(formSchema) });


    React.useEffect(() => {
        useApi
            .get("/lookup/sample_taken_options", {})
            .then((res) => {
                var items = [{ label: "", value: "" }];
                res.data.data.map((r) => {
                    const option = { label: r.description, value: r.id };
                    items.push(option);
                    return option;
                });
                setSample_Taken_Options(items);
            })
            .catch((err) => {
                showAlertError(err);
            });
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
            setValue("pulse", isNaN(formData.pulse) ? "" : formData.pulse);
            setValue("respiratory_rate", isNaN(formData.respiratory_rate) ? "" : formData.respiratory_rate);
            setValue("blood_pressure_systolic", isNaN(formData.blood_pressure_systolic) ? "" : formData.blood_pressure_systolic);
            setValue("blood_pressure_diastolic", isNaN(formData.blood_pressure_diastolic) ? "" : formData.blood_pressure_diastolic);
            setValue("oxigen_saturation", isNaN(formData.oxigen_saturation) ? "" : formData.oxigen_saturation);
            setValue("blood_glucose", isNaN(formData.blood_glucose) ? "" : formData.blood_glucose);
            setValue("sample_taken_id", isNaN(formData.sample_taken_id) ? "" : formData.sample_taken_id);

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

                    <Col md="12" className="mb-1">
                        <Label className="form-label" for="data_date"> Date of Assessment </Label>

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
                        <Label className="form-label" for="temperature">Temperature </Label>
                        <Controller
                            id="temperature"
                            name="temperature"
                            control={control}
                            placeholder="10,000"
                            render={({ field: { ref, ...field } }) => (
                                <MyCleave
                                    {...field}
                                    inputMode="numeric"
                                    maxLength="3"
                                    className={classnames("form-control", {
                                        "is-invalid": errors.temperature && true,
                                    })}
                                    options={{
                                        numeral: true,
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
                        <Label className="form-label" for="temperature_unit_id">Temperature Unit </Label>

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
                        <Label className="form-label" for="pulse">Pulse </Label>
                        <Controller
                            id="pulse"
                            name="pulse"
                            control={control}
                            placeholder="10,000"
                            render={({ field: { ref, ...field } }) => (
                                <MyCleave
                                    {...field}
                                    inputMode="numeric"
                                    maxLength="3"
                                    className={classnames("form-control", {
                                        "is-invalid": errors.pulse && true,
                                    })}
                                    options={{
                                        numeral: true,
                                        numeralThousandsGroupStyle: "thousand",
                                    }}
                                />
                            )}
                        />

                        {errors.pulse && (
                            <FormFeedback>{errors.pulse.message}</FormFeedback>
                        )}
                    </Col>

                    <Col md="6" className="mb-1">
                        <Label className="form-label" for="respiratory_rate">Respiratory Rate </Label>
                        <Controller
                            id="respiratory_rate"
                            name="respiratory_rate"
                            control={control}
                            placeholder="10,000"
                            render={({ field: { ref, ...field } }) => (
                                <MyCleave
                                    {...field}
                                    inputMode="numeric"
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
                        <Label className="form-label" for="blood_pressure_systolic">Blood Pressure Systolic </Label>
                        <Controller
                            id="blood_pressure_systolic"
                            name="blood_pressure_systolic"
                            control={control}
                            placeholder="10,000"
                            render={({ field: { ref, ...field } }) => (
                                <MyCleave
                                    {...field}
                                    inputMode="numeric"
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
                        <Label className="form-label" for="blood_pressure_diastolic">Blood Pressure Diastolic </Label>
                        <Controller
                            id="blood_pressure_diastolic"
                            name="blood_pressure_diastolic"
                            control={control}
                            placeholder="10,000"
                            render={({ field: { ref, ...field } }) => (
                                <MyCleave
                                    {...field}
                                    inputMode="numeric"
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
                        <Label className="form-label" for="oxigen_saturation">Oxygen Saturation </Label>
                        <Controller
                            id="oxigen_saturation"
                            name="oxigen_saturation"
                            control={control}
                            placeholder="10,000"
                            render={({ field: { ref, ...field } }) => (
                                <MyCleave
                                    {...field}
                                    inputMode="numeric"
                                    maxLength="3"
                                    className={classnames("form-control", {
                                        "is-invalid": errors.oxigen_saturation && true,
                                    })}
                                    options={{
                                        numeral: true,
                                        numeralThousandsGroupStyle: "thousand",
                                    }}
                                />
                            )}
                        />

                        {errors.oxigen_saturation && (
                            <FormFeedback>{errors.oxigen_saturation.message}</FormFeedback>
                        )}
                    </Col>

                    <Col md="6" className="mb-1">
                        <Label className="form-label" for="blood_glucose">Blood Glucose </Label>
                        <Controller
                            id="blood_glucose"
                            name="blood_glucose"
                            control={control}
                            placeholder="10,000"
                            render={({ field: { ref, ...field } }) => (
                                <MyCleave
                                    {...field}
                                    inputMode="numeric"
                                    maxLength="3"
                                    className={classnames("form-control", {
                                        "is-invalid": errors.blood_glucose && true,
                                    })}
                                    options={{
                                        numeral: true,
                                        numeralThousandsGroupStyle: "thousand",
                                    }}
                                />
                            )}
                        />

                        {errors.blood_glucose && (
                            <FormFeedback>{errors.blood_glucose.message}</FormFeedback>
                        )}
                    </Col>

                    <Col className="col-md-6 mb-1">
                        <Label className="form-label" for="sample_taken_id">Sample Taken </Label>

                        <Controller
                            name="sample_taken_id"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="select"
                                    id="sample_taken_id"
                                    invalid={errors.sample_taken_id && true}
                                    {...field}
                                >
                                    {sample_taken_options.map &&
                                        sample_taken_options.map((item, index) => (
                                            <option value={item.value} key={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                </Input>
                            )}
                        />
                        {errors.sample_taken_id && (
                            <FormFeedback>{errors.sample_taken_id.message}</FormFeedback>
                        )}
                    </Col>


                </Row>

            </Form>
        </>
    );

}

export default EditPatientVitalSign;