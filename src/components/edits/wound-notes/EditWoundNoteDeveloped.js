
// ** React Imports
import React, { Fragment, useState } from "react";

// ** Utils
import { isObjEmpty } from "@utils";

import classnames from "classnames";

// ** Third Party Components
import * as yup from "yup";
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import MyCleave from "../../forms/MyCleave";
import useApi from "../../../api/useApi";

// ** Utils
import { showAlertError } from "../../alerts/AlertUtils";

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

const EditWoundNoteDeveloped = ({ id, formData, doSubmit, callBack }) => {


    const [today] = useState(new Date().toISOString().substr(0, 10));

    const formSchema = yup.object().shape({
        date_wound_developed: yup
            .date().notRequired().label("Date Wound Developed"),
        wound_at_facility: yup
            .bool().notRequired().label("Wound At Facility"),
        wound_recurrence: yup
            .bool().notRequired().label("Wound Recurrence"),


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


    }, []);

    React.useEffect(() => {

        const fetchFormData = () => {
            setValue("date_wound_developed", formData.date_wound_developed);
            setValue("wound_at_facility", formData.wound_at_facility);
            setValue("wound_recurrence", formData.wound_recurrence);
        };

        if (formData){
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




    return (
        <>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>


                    <Col md="6" className="mb-1">
                        <Label className="form-label" for="date_wound_developed">Date Wound Developed </Label>
                        <Controller
                            id="date_wound_developed"
                            name="date_wound_developed"
                            control={control}
                            render={({ field }) => (
                                <Input max={today} type="date" invalid={errors.date_wound_developed && true} {...field} />
                            )}
                        />
                        {errors.date_wound_developed && (
                            <FormFeedback>{errors.date_wound_developed.message}</FormFeedback>
                        )}
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="wound_at_facility"
                                name="wound_at_facility"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.wound_at_facility && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="wound_at_facility">Wound At Facility </Label>
                            {errors.wound_at_facility && (
                                <FormFeedback>{errors.wound_at_facility.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="wound_recurrence"
                                name="wound_recurrence"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.wound_recurrence && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="wound_recurrence">Wound Recurrence </Label>
                            {errors.wound_recurrence && (
                                <FormFeedback>{errors.wound_recurrence.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                </Row>

            </Form>
        </>
    );

}
export default EditWoundNoteDeveloped;