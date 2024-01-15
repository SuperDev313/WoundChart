
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
import SwitchControl from "../../../components/forms/SwitchControl"

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

const EditWoundNoteCompliance = ({ id, formData, doSubmit, callBack }) => {


    const [today] = useState(new Date().toISOString().substr(0, 10));

    const formSchema = yup.object().shape({
        ncw_limb_elevation: yup
            .bool().notRequired().label("Ncw Limb Elevation"),
        ncw_offloading: yup
            .bool().notRequired().label("Ncw Offloading"),
        ncw_keep_intact_dressings: yup
            .bool().notRequired().label("Ncw Keep Intact Dressings"),
        ncw_compression: yup
            .bool().notRequired().label("Ncw Compression"),
        ncw_meds: yup
            .bool().notRequired().label("Ncw Meds"),
        ncw_glucose_control: yup
            .bool().notRequired().label("Ncw Glucose Control"),
        ncw_visits: yup
            .bool().notRequired().label("Ncw Visits"),
        ncw_other: yup
            .bool().notRequired().label("Ncw Other"),


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

            setValue("ncw_limb_elevation", formData.ncw_limb_elevation);

            setValue("ncw_offloading", formData.ncw_offloading);

            setValue("ncw_keep_intact_dressings", formData.ncw_keep_intact_dressings);

            setValue("ncw_compression", formData.ncw_compression);

            setValue("ncw_meds", formData.ncw_meds);

            setValue("ncw_glucose_control", formData.ncw_glucose_control);

            setValue("ncw_visits", formData.ncw_visits);

            setValue("ncw_other", formData.ncw_other);

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

    const checkBoxValueChange = (e) => {
        const { value, name } = e.target;

        setValue(name, e.target.checked && true);
        // updatValidField(e, name, value);

    }

    return (
        <>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                                control={control}
                                name="ncw_limb_elevation"
                                label="Limb Elevation"
                                onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.ncw_limb_elevation && (
                            <FormFeedback>{errors.ncw_limb_elevation.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                                control={control}
                                name="ncw_offloading"
                                label="Offloading"
                                onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.ncw_offloading && (
                            <FormFeedback>{errors.ncw_offloading.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                                control={control}
                                name="ncw_keep_intact_dressings"
                                label="Keep Intact Dressings"
                                onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.ncw_keep_intact_dressings && (
                            <FormFeedback>{errors.ncw_keep_intact_dressings.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                                control={control}
                                name="ncw_compression"
                                label="Compression"
                                onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.ncw_compression && (
                            <FormFeedback>{errors.ncw_compression.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                                control={control}
                                name="ncw_meds"
                                label="Meds"
                                onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.ncw_meds && (
                            <FormFeedback>{errors.ncw_meds.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                                control={control}
                                name="ncw_glucose_control"
                                label="Glucose Control"
                                onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.ncw_glucose_control && (
                            <FormFeedback>{errors.ncw_glucose_control.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                                control={control}
                                name="ncw_visits"
                                label="Visits"
                                onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.ncw_visits && (
                            <FormFeedback>{errors.ncw_visits.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                                control={control}
                                name="ncw_other"
                                label="Other"
                                onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.ncw_other && (
                            <FormFeedback>{errors.ncw_other.message}</FormFeedback>
                        )}
                    </Col>

                </Row>

            </Form>
        </>
    );

}
export default EditWoundNoteCompliance;
