
//-----------------------EditWoundNoteDetails

// ** React Imports
import React, { Fragment, useState } from "react";

import Flatpickr from 'react-flatpickr'
import classnames from "classnames";
// ** Utils
import { isObjEmpty, isValidDate, minDateOfBirth } from "@utils"


// ** Third Party Components
import * as yup from "yup";
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import MyCleave from "../../forms/MyCleave";
import useApi from "../../../api/useApi";


// ** Utils
import { showAlertError } from "../../alerts/AlertUtils";
import { getDateTimeLocal } from "../../../utility/Utils";

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

import '@styles/react/libs/flatpickr/flatpickr.scss'

const EditWoundNoteDetails = ({ id, formData, doSubmit, callBack }) => {

    const [wound_types, setWound_Types] = useState([{ label: "", value: "" }]);
    const [pain_scores, setPain_Scores] = useState([{ label: "", value: "" }]);
    const [visit_types, setVisit_Types] = useState([{ label: "", value: "" }]);
    const [locations, setLocations] = useState([{ label: "", value: "" }]);

    const [today] = useState(new Date().toISOString().substr(0, 10));

    const formSchema = yup.object().shape({
        visit_date: yup
            .date()
            .required("Visit Date is required.")
            .label("Visit Date")
            .transform((value) => (isValidDate(value) ? value : null))
            .max(new Date(), 'Visit Date must be today or earlier')
            .min(minDateOfBirth(), 'Invalid Visit Date'),
        wound_location: yup
            .string()
            .max(200)
            .required("Wound Location is required.")
            .label("Wound Location"),
        pain_grade_id: yup
            .number()
            .transform((value) => (isNaN(value) || value === null || value === undefined) ? null : value)
            .required('Pain Grade is Required')
            .label("Pain Grade"),
        visit_type_id: yup
            .number()
            .transform((value) => (isNaN(value) || value === null || value === undefined) ? null : value)
            .required('Visit Type is required')
            .label("Visit Type"),
        location_id: yup
            .number()
            .transform((value) => (isNaN(value) || value === null || value === undefined) ? null : value)
            .required('Facility is Required')
            .label("Facility"),
        wound_type_id: yup
            .number()
            .transform((value) => (isNaN(value) || value === null || value === undefined) ? null : value)
            .required('Wound Type is required')
            .label("Wound Type"),
        wound_type_id_description: yup
            .string()
            .max(150, "Wound Type Description must be at most 150 characters."),
        pain_grade_id_description: yup
            .string()
            .max(150, "Pain Grade Description must be at most 150 characters."),
        visit_type_id_description: yup
            .string()
            .max(150, "Visit Type Description must be at most 150 characters."),
        location_id_name: yup
            .string()
            .max(150, "Facility Name must be at most 150 characters.")
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

    const wound_type_id = watch("wound_type_id");
    const pain_grade_id = watch("pain_grade_id");
    const visit_type_id = watch("visit_type_id");
    const location_id = watch("location_id");

    React.useEffect(() => {
        useApi
            .get("/lookup/wound_types", {})
            .then((res) => {
                var items = [{ label: "", value: "" }];
                res.data.data.map((r) => {
                    const option = { label: r.description, value: r.id };
                    items.push(option);
                    return option;
                });
                setWound_Types(items);
            })
            .catch((err) => {
                showAlertError(err);
            });
        useApi
            .get("/lookup/pain_scores", {})
            .then((res) => {
                var items = [{ label: "", value: "" }];
                res.data.data.map((r) => {
                    const option = { label: r.description, value: r.id };
                    items.push(option);
                    return option;
                });
                items.sort((a, b) => a.value - b.value);

                setPain_Scores(items);
            })
            .catch((err) => {
                showAlertError(err);
            });
        useApi
            .get("/lookup/visit_types", {})
            .then((res) => {
                var items = [{ label: "", value: "" }];
                res.data.data.map((r) => {
                    const option = { label: r.description, value: r.id };
                    if (r.id === 1 || r.id === 2) {
                        items.push(option);
                    }
                    return option;
                });
                setVisit_Types(items);
            })
            .catch((err) => {
                showAlertError(err);
            });
        useApi
            .get("/lookup/locations", {})
            .then((res) => {
                var items = [{ label: "", value: "" }];
                res.data.data.map((r) => {
                    const option = { label: r.name, value: r.id };
                    items.push(option);
                    return option;
                });
                setLocations(items);
            })
            .catch((err) => {
                showAlertError(err);
            });


    }, []);

    React.useEffect(() => {
        const fetchFormData = () => {
            setValue("patient_id", formData.patient_id);
            setValue("visit_date", getDateTimeLocal(formData.visit_date));
            setValue("wound_location", formData.wound_location);
            setValue("pain_grade_id", formData.pain_grade_id);
            setValue("visit_type_id", formData.visit_type_id);
            setValue("location_id", formData.location_id);
            setValue("wound_type_id", formData.wound_type_id);

            setValue("wound_type_id_description", formData.wound_type_id_description);
            setValue("pain_grade_id_description", formData.pain_grade_id_description);
            setValue("visit_type_id_description", formData.visit_type_id_description);
            setValue("location_id_name", formData.location_id_name);
        };
        if (formData) {
            fetchFormData();
        }
    }, []);

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



    React.useEffect(() => {
        const value = wound_types.find(r => r.value === parseInt(wound_type_id));
        if (value) {
            setValue("wound_type_id_description", value.label);
        }
    }, [wound_type_id])
    React.useEffect(() => {
        const value = pain_scores.find(r => r.value === parseInt(pain_grade_id));
        if (value) {
            setValue("pain_grade_id_description", value.label);
        }
    }, [pain_grade_id])
    React.useEffect(() => {
        const value = visit_types.find(r => r.value === parseInt(visit_type_id));
        console.log(formData)
        if (value) {
            setValue("visit_type_id_description", value.label);
        }
    }, [visit_type_id])
    React.useEffect(() => {
        const value = locations.find(r => r.value === parseInt(location_id));
        if (value) {
            setValue("location_id_name", value.label);
        }
    }, [location_id])

    return (
        <>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <Col md="6" className="mb-1">
                        <Label className="form-label" for="visit_date">
                            Visit Date
                        </Label>

                        <Controller
                            id="visit_date"
                            name="visit_date"
                            control={control}
                            render={({ field }) => (

                                <Input
                                    maxDate={today}
                                    type="datetime-local"
                                    invalid={errors.visit_date && true}
                                    {...field}
                                />
                            )}
                        />
                        {errors.visit_date && <FormFeedback>{errors.visit_date.message}</FormFeedback>}
                    </Col>


                    <Col md="6" className="mb-1">
                        <Label className="form-label" for="wound_location">Wound Location </Label>

                        <Controller
                            id="wound_location"
                            name="wound_location"
                            control={control}
                            render={({ field }) => (
                                <Input invalid={errors.wound_location && true} {...field} />
                            )}
                        />
                        {errors.wound_location && (
                            <FormFeedback>{errors.wound_location.message}</FormFeedback>
                        )}
                    </Col>

                    <Col className="col-md-6 mb-1">
                        <Label className="form-label" for="pain_grade_id">Pain Grade </Label>

                        <Controller
                            name="pain_grade_id"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="select"
                                    id="pain_grade_id"
                                    invalid={errors.pain_grade_id && true}
                                    {...field}
                                >
                                    {pain_scores.map &&
                                        pain_scores.map((item, index) => (
                                            <option value={item.value} key={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                </Input>
                            )}
                        />
                        {errors.pain_grade_id && (
                            <FormFeedback>{errors.pain_grade_id.message}</FormFeedback>
                        )}
                    </Col>

                    <Col className="col-md-6 mb-1">
                        <Label className="form-label" for="visit_type_id">Visit Type </Label>

                        <Controller
                            name="visit_type_id"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="select"
                                    id="visit_type_id"
                                    invalid={errors.visit_type_id && true}
                                    {...field}
                                >
                                    {visit_types.map &&
                                        visit_types.map((item, index) => (
                                            <option value={item.value} key={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                </Input>
                            )}
                        />
                        {errors.visit_type_id && (
                            <FormFeedback>{errors.visit_type_id.message}</FormFeedback>
                        )}
                    </Col>

                    <Col className="col-md-6 mb-1">
                        <Label className="form-label" for="location_id">Facility </Label>

                        <Controller
                            name="location_id"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="select"
                                    id="location_id"
                                    invalid={errors.location_id && true}
                                    {...field}
                                >
                                    {locations.map &&
                                        locations.map((item, index) => (
                                            <option value={item.value} key={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                </Input>
                            )}
                        />
                        {errors.location_id && (
                            <FormFeedback>{errors.location_id.message}</FormFeedback>
                        )}
                    </Col>

                    <Col className="col-md-6 mb-1">
                        <Label className="form-label" for="wound_type_id">Wound Type </Label>

                        <Controller
                            name="wound_type_id"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="select"
                                    id="wound_type_id"
                                    invalid={errors.wound_type_id && true}
                                    {...field}
                                >
                                    {wound_types.map &&
                                        wound_types.map((item, index) => (
                                            <option value={item.value} key={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                </Input>
                            )}
                        />
                        {errors.wound_type_id && (
                            <FormFeedback>{errors.wound_type_id.message}</FormFeedback>
                        )}
                    </Col>

                </Row>

            </Form>
        </>
    );

}
export default EditWoundNoteDetails;