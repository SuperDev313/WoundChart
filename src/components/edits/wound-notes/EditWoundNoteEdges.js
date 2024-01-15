
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

const EditWoundNoteEdges = ({ id, formData, doSubmit, callBack }) => {


    const [today] = useState(new Date().toISOString().substr(0, 10));

    const formSchema = yup.object().shape({
        wound_edges_irregular: yup
            .bool().notRequired().label("Wound Edges Irregular"),
        wound_edges_epibole: yup
            .bool().notRequired().label("Wound Edges Epibole"),
        wound_edges_well: yup
            .bool().notRequired().label("Wound Edges Well"),
        wound_edges_good: yup
            .bool().notRequired().label("Wound Edges Good"),
        wound_edges_hyperkeratosis: yup
            .bool().notRequired().label("Wound Edges Hyperkeratosis"),
        wound_edges_fibrotic: yup
            .bool().notRequired().label("Wound Edges Fibrotic"),
        wound_edges_not_deter: yup
            .bool().notRequired().label("Wound Edges Not Deter"),


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

            setValue("wound_edges_irregular", formData.wound_edges_irregular);
            setValue("wound_edges_epibole", formData.wound_edges_epibole);
            setValue("wound_edges_well", formData.wound_edges_well);
            setValue("wound_edges_good", formData.wound_edges_good);
            setValue("wound_edges_hyperkeratosis", formData.wound_edges_hyperkeratosis);
            setValue("wound_edges_fibrotic", formData.wound_edges_fibrotic);
            setValue("wound_edges_not_deter", formData.wound_edges_not_deter);
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
                                name="wound_edges_irregular"
                                label="Wound Edges Irregular"
                                onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.wound_edges_irregular && (
                            <FormFeedback>{errors.wound_edges_irregular.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                                control={control}
                                name="wound_edges_epibole"
                                label="Wound Edges Epibole"
                                onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.wound_edges_epibole && (
                            <FormFeedback>{errors.wound_edges_epibole.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                                control={control}
                                name="wound_edges_well"
                                label="Wound Edges Well"
                                onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.wound_edges_well && (
                            <FormFeedback>{errors.wound_edges_well.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                                control={control}
                                name="wound_edges_good"
                                label="Wound Edges Good"
                                onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.wound_edges_good && (
                            <FormFeedback>{errors.wound_edges_good.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                                control={control}
                                name="wound_edges_hyperkeratosis"
                                label="Wound Edges Hyperkeratosis"
                                onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.wound_edges_hyperkeratosis && (
                            <FormFeedback>{errors.wound_edges_hyperkeratosis.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                                control={control}
                                name="wound_edges_fibrotic"
                                label="Wound Edges Fibrotic"
                                onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.wound_edges_fibrotic && (
                            <FormFeedback>{errors.wound_edges_fibrotic.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                                control={control}
                                name="wound_edges_not_deter"
                                label="Wound Edges Not Determined"
                                onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.wound_edges_not_deter && (
                            <FormFeedback>{errors.wound_edges_not_deter.message}</FormFeedback>
                        )}
                    </Col>

                </Row>

            </Form>
        </>
    );

}
export default EditWoundNoteEdges;