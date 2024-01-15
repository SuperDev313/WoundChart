
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
import { parseInteger } from "../../../utility/Utils";

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
    Button,
    FormFeedback,
    InputGroup,
    InputGroupText,
} from "reactstrap";

const EditPatientBradenScaleScoreEvaluation = ({ id, formData, doSubmit, callBack }) => {

    const [sensory_perception_options, setSensory_Perception_Options] = useState([{ label: "", value: "" }]);
    const [moisture_options, setMoisture_Options] = useState([{ label: "", value: "" }]);
    const [activity_options, setActivity_Options] = useState([{ label: "", value: "" }]);
    const [mobility_options, setMobility_Options] = useState([{ label: "", value: "" }]);
    const [nutrition_options, setNutrition_Options] = useState([{ label: "", value: "" }]);
    const [friction_and_shear_options, setFriction_And_Shear_Options] = useState([{ label: "", value: "" }]);

    const [today] = useState(new Date().toISOString().substr(0, 10));

    const formSchema = yup.object().shape({
        data_date: yup
            .date(),
        // .required("Visit Date is required.")
        // .label("Visit Date")
        // .transform((value, originalValue) => (isValidDate(originalValue) ? originalValue : null))
        // .max(new Date(), 'Visit Date must be today or earlier')
        // .min(minDateOfBirth(), 'Invalid Visit Date'),
        sensory_perception: yup
            .number()
            .transform(transformNumber)
            .notRequired()
            .label("Sensory Perception"),

        moisture: yup
            .number()
            .transform(transformNumber)
            .notRequired()
            .label("Moisture"),

        activity: yup
            .number()
            .transform(transformNumber)
            .notRequired()
            .label("Activity"),

        mobility: yup
            .number()
            .transform(transformNumber)
            .notRequired()
            .label("Mobility"),

        nutrition: yup
            .number()
            .transform(transformNumber)
            .notRequired()
            .label("Nutrition"),

        friction_and_shear: yup
            .number()
            .transform(transformNumber)
            .notRequired()
            .label("Friction and Shear"),

        score: yup
            .number()
            .transform(transformNumber)
            .notRequired()
            .label("Score"),

        prediction: yup
            .string()
            .max(255)
            .notRequired()
            .label("Prediction")

    })


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
            .get("/lookup/sensory_perception_options", {})
            .then((res) => {
                var items = [{ label: "", value: "" }]
                res.data.data.map((r) => {
                    const option = { label: r.description, value: r.id }
                    items.push(option)
                    return option
                })
                setSensory_Perception_Options(items)
            })
            .catch((err) => {
                // showAlertError(err)
            });
        useApi
            .get("/lookup/moisture_options", {})
            .then((res) => {
                var items = [{ label: "", value: "" }]
                res.data.data.map((r) => {
                    const option = { label: r.description, value: r.id }
                    items.push(option)
                    return option
                })
                setMoisture_Options(items)
            })
            .catch((err) => {
                // showAlertError(err)
            })
        useApi
            .get("/lookup/activity_options", {})
            .then((res) => {
                var items = [{ label: "", value: "" }]
                res.data.data.map((r) => {
                    const option = { label: r.description, value: r.id }
                    items.push(option)
                    return option
                })
                setActivity_Options(items)
            })
            .catch((err) => {
                // showAlertError(err)
            })
        useApi
            .get("/lookup/mobility_options", {})
            .then((res) => {
                var items = [{ label: "", value: "" }]
                res.data.data.map((r) => {
                    const option = { label: r.description, value: r.id }
                    items.push(option)
                    return option
                })
                setMobility_Options(items)
            })
            .catch((err) => {
                // showAlertError(err)
            })
        useApi
            .get("/lookup/nutrition_options", {})
            .then((res) => {
                var items = [{ label: "", value: "" }]
                res.data.data.map((r) => {
                    const option = { label: r.description, value: r.id }
                    items.push(option)
                    return option
                })
                setNutrition_Options(items)
            })
            .catch((err) => {
                // showAlertError(err)
            })
        useApi
            .get("/lookup/friction_and_shear_options", {})
            .then((res) => {
                var items = [{ label: "", value: "" }]
                res.data.data.map((r) => {
                    const option = { label: r.description, value: r.id }
                    items.push(option)
                    return option
                })
                setFriction_And_Shear_Options(items)
            })
            .catch((err) => {
                // showAlertError(err)
            })


    }, [])


    React.useEffect(() => {

        const fetchFormData = () => {
            setValue("data_date", getDateTimeLocal(formData.data_date));
            setValue("sensory_perception_id", isNaN(formData.sensory_perception_id) ? "" : formData.sensory_perception_id)
            setValue("moisture_id", isNaN(formData.moisture_id) ? "" : formData.moisture_id)
            setValue("activity_id", isNaN(formData.activity_id) ? "" : formData.activity_id)
            setValue("mobility_id", isNaN(formData.mobility_id) ? "" : formData.mobility_id)
            setValue("nutrition_id", isNaN(formData.nutrition_id) ? "" : formData.nutrition_id)
            setValue("friction_and_shear_id", isNaN(formData.friction_and_shear_id) ? "" : formData.friction_and_shear_id)
            setValue("score", isNaN(formData.score) ? "" : formData.score)
            setValue("prediction", formData.prediction)

        }
        if (formData) {
            fetchFormData()
        }
    }, [formData])

    React.useEffect(() => {

        const sensory_perception_id = parseInteger(getValues("sensory_perception_id"))
        const moisture_id = parseInteger(getValues("moisture_id"))
        const activity_id = parseInteger(getValues("activity_id"))
        const mobility_id = parseInteger(getValues("mobility_id"))
        const nutrition_id = parseInteger(getValues("nutrition_id"))
        const friction_and_shear_id = parseInteger(getValues("friction_and_shear_id"))

        let sum = sensory_perception_id + mobility_id + moisture_id + activity_id + nutrition_id + friction_and_shear_id
        let prediction

        if (sum != 0 && sum <= 9) {
            //   $('#score').text(sum);
            //   $('#risk_factor').html("Patient has a <b>VERY HIGH RISK</b> for Pressure Injury");

            prediction = "VERY HIGH RISK"
        }
        else if (sum >= 10 && sum <= 12) {
            //   $('#score').text(sum);
            //   $('#risk_factor').html("Patient has a <b>HIGH RISK</b> for Pressure Injury");

            prediction = "HIGH RISK"
        }
        else if (sum == 13 || sum == 14) {
            //   $('#score').text(sum);
            //   $('#risk_factor').html("Patient has a <b>MODERATE RISK</b> for Pressure Injury");

            prediction = "MODERATE RISK"
        }
        else if (sum == 15 || sum == 16 || sum == 17 || sum == 18)
        // else if(sum >= 15 && sum <= 18)
        {
            //   $('#score').text(sum);
            //   $('#risk_factor').html("Patient has a <b>MILD RISK</b> for Pressure Injury");

            prediction = "MILD RISK"
        }
        else if (sum == 19 || sum == 20 || sum == 21 || sum == 22 || sum == 23)
        // else if(sum >= 15 && sum <= 18)
        {

            //   $('#score').text(sum);
            //   $('#risk_factor').html("Patient has <b>NO RISK</b> for Pressure Injury");

            prediction = "NO RISK"
        }
        else {
            //   $('#score').hide();
            //   $('#risk_factor').hide();
            prediction = ""
        }

        // alert(prediction);

        setValue("score", sum)
        setValue("prediction", prediction)



    }, [watch("sensory_perception_id"), watch("moisture_id"), watch("activity_id"), watch("mobility_id"), watch("nutrition_id"), watch("friction_and_shear_id")])


    React.useEffect(() => {
        const doRun = async () => {
            const result = await trigger()

            callBack(getValues(), result)
        }
        if (doSubmit) {
            doRun()
        }

    }, [doSubmit])

    const onSubmit = (data) => {
        callBack(data, isObjEmpty(errors))
    }


    return (
        <>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>



                    <Col md="12" className="mb-1">
                        <Label className="form-label" for="data_date">Date of Assessment</Label>

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
                        <Label className="form-label" for="sensory_perception_id">Sensory Perception</Label>

                        <Controller
                            name="sensory_perception_id"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="select"
                                    id="sensory_perception_id"
                                    invalid={errors.sensory_perception_id && true}
                                    {...field}
                                >
                                    {sensory_perception_options.map &&
                                        sensory_perception_options.map((item, index) => (
                                            <option value={item.value} key={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                </Input>
                            )}
                        />
                        {errors.sensory_perception_id && (
                            <FormFeedback>{errors.sensory_perception_id.message}</FormFeedback>
                        )}
                    </Col>

                    <Col className="col-md-6 mb-1">
                        <Label className="form-label" for="moisture_id">Moisture</Label>

                        <Controller
                            name="moisture_id"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="select"
                                    id="moisture_id"
                                    invalid={errors.moisture_id && true}
                                    {...field}
                                >
                                    {moisture_options.map &&
                                        moisture_options.map((item, index) => (
                                            <option value={item.value} key={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                </Input>
                            )}
                        />
                        {errors.moisture_id && (
                            <FormFeedback>{errors.moisture_id.message}</FormFeedback>
                        )}
                    </Col>

                    <Col className="col-md-6 mb-1">
                        <Label className="form-label" for="activity_id">Activity</Label>

                        <Controller
                            name="activity_id"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="select"
                                    id="activity_id"
                                    invalid={errors.activity_id && true}
                                    {...field}
                                >
                                    {activity_options.map &&
                                        activity_options.map((item, index) => (
                                            <option value={item.value} key={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                </Input>
                            )}
                        />
                        {errors.activity_id && (
                            <FormFeedback>{errors.activity_id.message}</FormFeedback>
                        )}
                    </Col>

                    <Col className="col-md-6 mb-1">
                        <Label className="form-label" for="mobility_id">Mobility</Label>

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

                    <Col className="col-md-6 mb-1">
                        <Label className="form-label" for="nutrition_id">Nutrition</Label>

                        <Controller
                            name="nutrition_id"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="select"
                                    id="nutrition_id"
                                    invalid={errors.nutrition_id && true}
                                    {...field}
                                >
                                    {nutrition_options.map &&
                                        nutrition_options.map((item, index) => (
                                            <option value={item.value} key={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                </Input>
                            )}
                        />
                        {errors.nutrition_id && (
                            <FormFeedback>{errors.nutrition_id.message}</FormFeedback>
                        )}
                    </Col>

                    <Col className="col-md-6 mb-1">
                        <Label className="form-label" for="friction_and_shear_id">Friction And Shear</Label>

                        <Controller
                            name="friction_and_shear_id"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="select"
                                    id="friction_and_shear_id"
                                    invalid={errors.friction_and_shear_id && true}
                                    {...field}
                                >
                                    {friction_and_shear_options.map &&
                                        friction_and_shear_options.map((item, index) => (
                                            <option value={item.value} key={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                </Input>
                            )}
                        />
                        {errors.friction_and_shear_id && (
                            <FormFeedback>{errors.friction_and_shear_id.message}</FormFeedback>
                        )}
                    </Col>

                    <Col md="6" className="mb-1">
                        <Label className="form-label" for="score">Score: <b>{getValues("score")}</b></Label>
                    </Col>

                    <Col md="6" className="mb-1">
                        <Label className="form-label" for="prediction">Prediction: <b>{getValues("prediction")}</b></Label>

                    </Col>

                </Row>

            </Form>
        </>
    );

}

export default EditPatientBradenScaleScoreEvaluation;