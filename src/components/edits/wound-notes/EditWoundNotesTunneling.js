
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

const EditWoundNotesTunneling = ({ id, formData, doSubmit, callBack }) => {

    const [today] = useState(new Date().toISOString().substr(0, 10));

    const formSchema = yup.object().shape({
        position: yup
            .string().max(120).trim().required('Position is required').label("Position"),
        distance: yup
            .number().required().label("Distance is required").typeError('Distance must be a Number')

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
        const fetchFormData = () => {
            setValue("position", formData.position);
            setValue("distance", isNaN(formData.distance) ? "" : formData.distance);
        }
        if (formData){
            fetchFormData()
        }
    }, [])


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
                        <Label className="form-label" for="position">Position <span className="text-danger">*</span></Label>
                        <Controller
                            id="position"
                            name="position"
                            control={control}
                            render={({ field }) => (
                                <Input invalid={errors.position && true} {...field} />
                            )}
                        />
                        {errors.position && (
                            <FormFeedback>{errors.position.message}</FormFeedback>
                        )}
                    </Col>

                    <Col md="6" className="mb-1">
                        <Label className="form-label" for="distance">Distance </Label>
                        <Controller
                            id="distance"
                            name="distance"
                            control={control}
                            placeholder="10,000"
                            render={({ field: { ref, ...field } }) => (
                                <MyCleave
                                    {...field}
                                    inputMode="numeric"
                                    maxLength="3"
                                    className={classnames("form-control", {
                                        "is-invalid": errors.distance && true,
                                    })}
                                    options={{
                                        numeral: true,
                                        numeralThousandsGroupStyle: "thousand",
                                    }}
                                />
                            )}
                        />

                        {errors.distance && (
                            <FormFeedback>{errors.distance.message}</FormFeedback>
                        )}
                    </Col>

                </Row>

            </Form>
        </>
    );

}


export default EditWoundNotesTunneling;
