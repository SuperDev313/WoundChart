
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

const EditWoundNoteTreatment = ({ id, formData, doSubmit, callBack }) => {


    const [today] = useState(new Date().toISOString().substr(0, 10));

    const formSchema = yup.object().shape({
        tod_autolytic: yup
            .bool()
            .notRequired()
            .label("Autolytic"),

        tod_enzymatic: yup
            .bool()
            .notRequired()
            .label("Enzymatic"),

        tod_mechanical: yup
            .bool()
            .notRequired()
            .label("Mechanical"),

        tod_sharp: yup
            .bool()
            .notRequired()
            .label("Sharp"),

        tod_biological: yup
            .bool()
            .notRequired()
            .label("Biological"),

        tod_other: yup
            .bool()
            .notRequired()
            .label("Other"),

        tod_other_text: yup
            .string()
            .max(200)
            .notRequired()
            .label("Other Text"),

        tod_applied_product: yup
            .string()
            .max(200)
            .notRequired()
            .label("Applied Product"),
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

            setValue("tod_autolytic", formData.tod_autolytic);

            setValue("tod_enzymatic", formData.tod_enzymatic);

            setValue("tod_mechanical", formData.tod_mechanical);

            setValue("tod_sharp", formData.tod_sharp);

            setValue("tod_biological", formData.tod_biological);

            setValue("tod_other", formData.tod_other);

            setValue("tod_other_text", formData.tod_other_text);

            setValue("tod_applied_product", formData.tod_applied_product);

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
                                name="tod_autolytic"
                                label="Tod Autolytic"
                                onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.tod_autolytic && (
                            <FormFeedback>{errors.tod_autolytic.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                                control={control}
                                name="tod_enzymatic"
                                label="Tod Enzymatic"
                                onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.tod_enzymatic && (
                            <FormFeedback>{errors.tod_enzymatic.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                                control={control}
                                name="tod_mechanical"
                                label="Tod Mechanical"
                                onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.tod_mechanical && (
                            <FormFeedback>{errors.tod_mechanical.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                                control={control}
                                name="tod_sharp"
                                label="Tod Sharp"
                                onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.tod_sharp && (
                            <FormFeedback>{errors.tod_sharp.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                                control={control}
                                name="tod_biological"
                                label="Tod Biological"
                                onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.tod_biological && (
                            <FormFeedback>{errors.tod_biological.message}</FormFeedback>
                        )}
                    </Col>

                    {/* Continue this pattern for the remaining fields */}
                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                                control={control}
                                name="tod_other"
                                label="Tod Other"
                                onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.tod_other && (
                            <FormFeedback>{errors.tod_other.message}</FormFeedback>
                        )}
                    </Col>


                    <Col md="6" className="mb-1">
                        <Label className="form-label" for="tod_other_text">Tod Other Text </Label>

                        <Controller
                            id="tod_other_text"
                            name="tod_other_text"
                            control={control}
                            render={({ field }) => (
                                <Input invalid={errors.tod_other_text && true} {...field} />
                            )}
                        />
                        {errors.tod_other_text && (
                            <FormFeedback>{errors.tod_other_text.message}</FormFeedback>
                        )}
                    </Col>

                    <Col md="6" className="mb-1">
                        <Label className="form-label" for="tod_applied_product">Tod Applied Product </Label>

                        <Controller
                            id="tod_applied_product"
                            name="tod_applied_product"
                            control={control}
                            render={({ field }) => (
                                <Input invalid={errors.tod_applied_product && true} {...field} />
                            )}
                        />
                        {errors.tod_applied_product && (
                            <FormFeedback>{errors.tod_applied_product.message}</FormFeedback>
                        )}
                    </Col>

                </Row>

            </Form>
        </>
    );

}
export default EditWoundNoteTreatment;