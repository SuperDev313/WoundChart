

//-----------------------EditWoundNotePeriwound

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

const EditWoundNotePeriwound = ({ id, formData, doSubmit, callBack }) => {


    const [today] = useState(new Date().toISOString().substr(0, 10));

    const formSchema = yup.object().shape({
        periwound_healthy: yup
            .bool().notRequired().label("Periwound Healthy"),
        periwound_blistered: yup
            .bool().notRequired().label("Periwound Blistered"),
        periwound_cayosed: yup
            .bool().notRequired().label("Periwound Cayosed"),
        periwound_discolored: yup
            .bool().notRequired().label("Periwound Discolored"),
        periwound_contact: yup
            .bool().notRequired().label("Periwound Contact"),
        periwound_dry_scaly: yup
            .bool().notRequired().label("Periwound Dry Scaly"),
        periwound_edema: yup
            .bool().notRequired().label("Periwound Edema"),
        periwound_erythema: yup
            .bool().notRequired().label("Periwound Erythema"),
        periwound_indurated: yup
            .bool().notRequired().label("Periwound Indurated"),
        periwound_macerated: yup
            .bool().notRequired().label("Periwound Macerated"),
        periwound_hyperpigmented: yup
            .bool().notRequired().label("Periwound Hyperpigmented"),
        periwound_hyperemic: yup
            .bool().notRequired().label("Periwound Hyperemic"),
        periwound_skin_irritation: yup
            .bool().notRequired().label("Periwound Skin Irritation"),
        periwound_not_determined: yup
            .bool().notRequired().label("Periwound Not Determined"),
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

            setValue("periwound_healthy", formData.periwound_healthy);

            setValue("periwound_blistered", formData.periwound_blistered);

            setValue("periwound_cayosed", formData.periwound_cayosed);

            setValue("periwound_discolored", formData.periwound_discolored);

            setValue("periwound_contact", formData.periwound_contact);

            setValue("periwound_dry_scaly", formData.periwound_dry_scaly);

            setValue("periwound_edema", formData.periwound_edema);

            setValue("periwound_erythema", formData.periwound_erythema);

            setValue("periwound_indurated", formData.periwound_indurated);

            setValue("periwound_macerated", formData.periwound_macerated);

            setValue("periwound_hyperpigmented", formData.periwound_hyperpigmented);

            setValue("periwound_hyperemic", formData.periwound_hyperemic);

            setValue("periwound_skin_irritation", formData.periwound_skin_irritation);

            setValue("periwound_not_determined", formData.periwound_not_determined);
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

    const checkBoxValueChange = (e) => {
        const { value, name } = e.target;

        setValue(name, e.target.checked && true);
        // updatValidField(e, name, value);

    }

    const onSubmit = (data) => {
        callBack(data, isObjEmpty(errors))
    };




    return (
        <>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                            control={control}
                            name="periwound_healthy"
                            label="Periwound Healthy"
                            onValueChange={checkBoxValueChange}
                            />
                        </Row>
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                            control={control}
                            name="periwound_blistered"
                            label="Periwound Blistered"
                            onValueChange={checkBoxValueChange}
                            />
                        </Row>
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                            control={control}
                            name="periwound_cayosed"
                            label="Periwound Cayosed"
                            onValueChange={checkBoxValueChange}
                            />
                        </Row>
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                            control={control}
                            name="periwound_discolored"
                            label="Periwound Discolored"
                            onValueChange={checkBoxValueChange}
                            />
                        </Row>
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                            control={control}
                            name="periwound_contact"
                            label="Periwound Contact"
                            onValueChange={checkBoxValueChange}
                            />
                        </Row>
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                            control={control}
                            name="periwound_dry_scaly"
                            label="Periwound Dry Scaly"
                            onValueChange={checkBoxValueChange}
                            />
                        </Row>
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                            control={control}
                            name="periwound_edema"
                            label="Periwound Edema"
                            onValueChange={checkBoxValueChange}
                            />
                        </Row>
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                            control={control}
                            name="periwound_erythema"
                            label="Periwound Erythema"
                            onValueChange={checkBoxValueChange}
                            />
                        </Row>
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                            control={control}
                            name="periwound_indurated"
                            label="Periwound Indurated"
                            onValueChange={checkBoxValueChange}
                            />
                        </Row>
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                            control={control}
                            name="periwound_macerated"
                            label="Periwound Macerated"
                            onValueChange={checkBoxValueChange}
                            />
                        </Row>
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                            control={control}
                            name="periwound_hyperpigmented"
                            label="Periwound Hyperpigmented"
                            onValueChange={checkBoxValueChange}
                            />
                        </Row>
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                            control={control}
                            name="periwound_hyperemic"
                            label="Periwound Hyperemic"
                            onValueChange={checkBoxValueChange}
                            />
                        </Row>
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                            control={control}
                            name="periwound_skin_irritation"
                            label="Periwound Skin Irritation"
                            onValueChange={checkBoxValueChange}
                            />
                        </Row>
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                            control={control}
                            name="periwound_not_determined"
                            label="Periwound Not Determined"
                            onValueChange={checkBoxValueChange}
                            />
                        </Row>
                    </Col>

                    {/* <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="periwound_healthy"
                                name="periwound_healthy"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.periwound_healthy && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="periwound_healthy">Periwound Healthy </Label>
                            {errors.periwound_healthy && (
                                <FormFeedback>{errors.periwound_healthy.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="periwound_blistered"
                                name="periwound_blistered"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.periwound_blistered && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="periwound_blistered">Periwound Blistered </Label>
                            {errors.periwound_blistered && (
                                <FormFeedback>{errors.periwound_blistered.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="periwound_cayosed"
                                name="periwound_cayosed"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.periwound_cayosed && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="periwound_cayosed">Periwound Cayosed </Label>
                            {errors.periwound_cayosed && (
                                <FormFeedback>{errors.periwound_cayosed.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="periwound_discolored"
                                name="periwound_discolored"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.periwound_discolored && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="periwound_discolored">Periwound Discolored </Label>
                            {errors.periwound_discolored && (
                                <FormFeedback>{errors.periwound_discolored.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="periwound_contact"
                                name="periwound_contact"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.periwound_contact && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="periwound_contact">Periwound Contact </Label>
                            {errors.periwound_contact && (
                                <FormFeedback>{errors.periwound_contact.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="periwound_dry_scaly"
                                name="periwound_dry_scaly"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.periwound_dry_scaly && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="periwound_dry_scaly">Periwound Dry Scaly </Label>
                            {errors.periwound_dry_scaly && (
                                <FormFeedback>{errors.periwound_dry_scaly.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="periwound_edema"
                                name="periwound_edema"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.periwound_edema && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="periwound_edema">Periwound Edema </Label>
                            {errors.periwound_edema && (
                                <FormFeedback>{errors.periwound_edema.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="periwound_erythema"
                                name="periwound_erythema"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.periwound_erythema && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="periwound_erythema">Periwound Erythema </Label>
                            {errors.periwound_erythema && (
                                <FormFeedback>{errors.periwound_erythema.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="periwound_indurated"
                                name="periwound_indurated"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.periwound_indurated && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="periwound_indurated">Periwound Indurated </Label>
                            {errors.periwound_indurated && (
                                <FormFeedback>{errors.periwound_indurated.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="periwound_macerated"
                                name="periwound_macerated"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.periwound_macerated && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="periwound_macerated">Periwound Macerated </Label>
                            {errors.periwound_macerated && (
                                <FormFeedback>{errors.periwound_macerated.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="periwound_hyperpigmented"
                                name="periwound_hyperpigmented"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.periwound_hyperpigmented && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="periwound_hyperpigmented">Periwound Hyperpigmented </Label>
                            {errors.periwound_hyperpigmented && (
                                <FormFeedback>{errors.periwound_hyperpigmented.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="periwound_hyperemic"
                                name="periwound_hyperemic"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.periwound_hyperemic && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="periwound_hyperemic">Periwound Hyperemic </Label>
                            {errors.periwound_hyperemic && (
                                <FormFeedback>{errors.periwound_hyperemic.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="periwound_skin_irritation"
                                name="periwound_skin_irritation"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.periwound_skin_irritation && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="periwound_skin_irritation">Periwound Skin Irritation </Label>
                            {errors.periwound_skin_irritation && (
                                <FormFeedback>{errors.periwound_skin_irritation.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="periwound_not_determined"
                                name="periwound_not_determined"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.periwound_not_determined && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="periwound_not_determined">Periwound Not Determined </Label>
                            {errors.periwound_not_determined && (
                                <FormFeedback>{errors.periwound_not_determined.message}</FormFeedback>
                            )}
                        </div>
                    </Col> */}

                </Row>

            </Form>
        </>
    );

}
export default EditWoundNotePeriwound;
