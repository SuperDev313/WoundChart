
// ** React Imports
import React, { Fragment, useState } from "react";

// ** Utils
import { isObjEmpty, isValidDate, minDateOfBirth } from "@utils";
import Flatpickr from 'react-flatpickr'
import classnames from "classnames";
import { Check, X } from 'react-feather'


// ** Third Party Components
import * as yup from "yup";
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import MyCleave from "../../../components/forms/MyCleave";
import useApi from "../../../api/useApi";

// ** Utils
import { showAlertError } from "../../../components/alerts/AlertUtils";
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

const EditPatientMiniNutritionalAssesment = ({ id, formData, doSubmit, callBack }) => {

    const [today] = useState(new Date().toISOString().substr(0, 10));
    const [food_intake_declined_options, setFood_Intake_Declined_Options] = useState([{ label: "", value: "" }]);
    const [neuropsychological_problems_options, setNeuropsychological_Problems_Options] = useState([{ label: "", value: "" }]);
    const [weight_loss_options, setWeight_Loss_Options] = useState([{ label: "", value: "" }]);
    const [mobility_options, setMobility_Options] = useState([{ label: "", value: "" }]);


    const formSchema = yup.object().shape({
        data_date: yup
            .date()
            .nullable()
            .transform((value) => (isValidDate(value) ? value : null))
            .required('Visit Date is required.')
            .label("Visit Date"),
        food_intake_declined_id: yup
            .number()
            .transform(value => isNaN(value) ? null : value)
            .typeError("Only digits should be entered in this field.")
            .label("Food Intake Declined ID"),
        weight_loss_id: yup
            .number()
            .transform(value => isNaN(value) ? null : value)
            .typeError("Only digits should be entered in this field.")
            .label("Weight Loss ID"),
        mobility_id: yup
            .number()
            .transform(value => isNaN(value) ? null : value)
            .typeError("Only digits should be entered in this field.")
            .label("Mobility ID"),
        suffered_psychological_stress: yup
            .bool()
            .transform(value => value === '' ? null : value)
            .label("Suffered Psychological Stress"),
        neuropsychological_problems_id: yup
            .number()
            .transform(value => isNaN(value) ? null : value)
            .typeError("Only digits should be entered in this field.")
            .label("Neuropsychological Problems ID"),
        bmi_available: yup
            .bool()
            .transform(value => value === '' ? null : value)
            .label("BMI Available"),
        score: yup
            .number()
            .transform(value => isNaN(value) ? null : value)
            .typeError("Only digits should be entered in this field.")
            .label("Score")
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

    const CustomLabel = ({ htmlFor }) => {
        return (
            <Label className='form-check-label' htmlFor={htmlFor}>
                <span className='switch-icon-left'>
                    <Check size={14} />
                </span>
                <span className='switch-icon-right'>
                    <X size={14} />
                </span>
            </Label>
        )
    }

    React.useEffect(() => {
        useApi
            .get("/lookup/food_intake_declined_options", {})
            .then((res) => {
                let items = [{ label: "", value: "" }];
                res.data.data.map((r) => {
                    const option = { label: r.description, value: r.id };
                    items.push(option);
                    return option;
                });
                setFood_Intake_Declined_Options(items);
            })
            .catch((err) => {
                showAlertError(err);
            });
        useApi
            .get("/lookup/neuropsychological_problems_options", {})
            .then((res) => {
                let items = [{ label: "", value: "" }];
                res.data.data.map((r) => {
                    const option = { label: r.description, value: r.id };
                    items.push(option);
                    return option;
                });
                setNeuropsychological_Problems_Options(items);
            })
            .catch((err) => {
                showAlertError(err);
            });
        useApi
            .get("/lookup/weight_loss_options", {})
            .then((res) => {
                let items = [{ label: "", value: "" }]
                res.data.data.map((r) => {
                    const option = { label: r.description, value: r.id };
                    items.push(option);
                    return option;
                });
                setWeight_Loss_Options(items);
            })
            .catch((err) => {
                showAlertError(err);
            });
        useApi
            .get("/lookup/mobility_options", {})
            .then((res) => {
                let items = [{ label: "", value: "" }];
                res.data.data.map((r) => {
                    const option = { label: r.description, value: r.id };
                    items.push(option);
                    return option;
                });
                setMobility_Options(items);
            })
            .catch((err) => {
                showAlertError(err);
            });


    }, []);

    React.useEffect(() => {

        const fetchFormData = () => {
            setValue("data_date", getDateTimeLocal(formData.data_date));
            setValue("food_intake_declined_id", isNaN(formData.food_intake_declined_id) ? "" : formData.food_intake_declined_id);
            setValue("weight_loss_id", isNaN(formData.weight_loss_id) ? "" : formData.weight_loss_id);
            setValue("mobility_id", isNaN(formData.mobility_id) ? "" : formData.mobility_id);
            setValue("suffered_psychological_stress", formData.suffered_psychological_stress);
            setValue("neuropsychological_problems_id", isNaN(formData.neuropsychological_problems_id) ? "" : formData.neuropsychological_problems_id);
            setValue("bmi_available", formData.bmi_available);
            setValue("score", isNaN(formData.score) ? "" : formData.score);

        };
        if (formData) {
            fetchFormData();
        }
    }, [formData]);

    React.useEffect(() => {

        const food_intake_declined_id = parseInt(getValues("food_intake_declined_id"))
        const weight_loss_id = parseInt(getValues("weight_loss_id"))
        const mobility_id = parseInt(getValues("mobility_id"))
        const suffered_psychological_stress = getValues("suffered_psychological_stress")
        const neuropsychological_problems_id = parseInt(getValues("neuropsychological_problems_id"))
        let score = 0;

        score = food_intake_declined_id + weight_loss_id + mobility_id + suffered_psychological_stress + neuropsychological_problems_id;

        setValue("score", score);

    }, [watch("suffered_psychological_stress"), watch("food_intake_declined_id"), watch("weight_loss_id"), watch("mobility_id"), watch("neuropsychological_problems_id")])

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


                    <Col className="col-md-6 mb-1">
                        <Label className="form-label" for="food_intake_declined_id">Food Intake Declined </Label>

                        <Controller
                            name="food_intake_declined_id"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="select"
                                    id="food_intake_declined_id"
                                    invalid={errors.food_intake_declined_id && true}
                                    {...field}
                                >
                                    {food_intake_declined_options.map &&
                                        food_intake_declined_options.map((item, index) => (
                                            <option value={item.value} key={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                </Input>
                            )}
                        />
                        {errors.food_intake_declined_id && (
                            <FormFeedback>{errors.food_intake_declined_id.message}</FormFeedback>
                        )}
                    </Col>

                    <Col className="col-md-6 mb-1">
                        <Label className="form-label" for="weight_loss_id">Weight Loss </Label>

                        <Controller
                            name="weight_loss_id"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="select"
                                    id="weight_loss_id"
                                    invalid={errors.weight_loss_id && true}
                                    {...field}
                                >
                                    {weight_loss_options.map &&
                                        weight_loss_options.map((item, index) => (
                                            <option value={item.value} key={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                </Input>
                            )}
                        />
                        {errors.weight_loss_id && (
                            <FormFeedback>{errors.weight_loss_id.message}</FormFeedback>
                        )}
                    </Col>

                    <Col className="col-md-6 mb-1">
                        <Label className="form-label" for="mobility_id">Mobility </Label>

                        <Controller
                            name="mobility_id"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="select"
                                    id="mobility_id"
                                    invalid={errors.mobility_id && true}
                                    {...field}
                                >
                                    {mobility_options.map &&
                                        mobility_options.map((item, index) => (
                                            <option value={item.value} key={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                </Input>
                            )}
                        />
                        {errors.mobility_id && (
                            <FormFeedback>{errors.mobility_id.message}</FormFeedback>
                        )}
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className=" form-check-inline">
                            <Controller
                                id="suffered_psychological_stress"
                                name="suffered_psychological_stress"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <div className='d-flex flex-column'>
                                        <Label for='suffered_psychological_stress' className='form-check-label mb-50'>
                                            Suffered Psychological Stress
                                        </Label>
                                        <div className='form-switch form-check-primary'>
                                            <Input
                                                type='switch'
                                                invalid={errors.suffered_psychological_stress && true}
                                                checked={!!value}
                                                {...field}
                                            />
                                            <CustomLabel htmlFor='suffered_psychological_stress' />
                                        </div>
                                    </div>
                                )}
                            />
                            {/* <Label className="form-label" for="suffered_psychological_stress">Suffered Psychological Stress </Label> */}
                            {errors.suffered_psychological_stress && (
                                <FormFeedback>{errors.suffered_psychological_stress.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col className="col-md-6 mb-1">
                        <Label className="form-label" for="neuropsychological_problems_id">Neuropsychological Problems </Label>

                        <Controller
                            name="neuropsychological_problems_id"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="select"
                                    id="neuropsychological_problems_id"
                                    invalid={errors.neuropsychological_problems_id && true}
                                    {...field}
                                >
                                    {neuropsychological_problems_options.map &&
                                        neuropsychological_problems_options.map((item, index) => (
                                            <option value={item.value} key={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                </Input>
                            )}
                        />
                        {errors.neuropsychological_problems_id && (
                            <FormFeedback>{errors.neuropsychological_problems_id.message}</FormFeedback>
                        )}
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check-inline">
                            <Controller
                                id="bmi_available"
                                name="bmi_available"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <div className='d-flex flex-column'>
                                        <Label for='bmi_available' className='form-check-label mb-50'>
                                            Bmi Available
                                        </Label>
                                        <div className='form-switch form-check-primary'>
                                            <Input
                                                type='switch'
                                                invalid={errors.bmi_available && true}
                                                checked={!!value}
                                                {...field}
                                            />
                                            <CustomLabel htmlFor='bmi_available' />
                                        </div>
                                    </div>
                                )}
                            />
                            {errors.bmi_available && (
                                <FormFeedback>{errors.bmi_available.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <Label className="form-label" for="score">Score: <b>{getValues("score")}</b> </Label>
                    </Col>

                </Row>

            </Form>
        </>
    );

}

export default EditPatientMiniNutritionalAssesment;