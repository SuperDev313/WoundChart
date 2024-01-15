
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
// import useApi from "../../../api/useApi";

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

const EditWoundNoteTissueExposure = ({ id, formData, doSubmit, callBack }) => {


    const [today] = useState(new Date().toISOString().substr(0, 10));

    const formSchema = yup.object().shape({
        tissue_exposure_bone: yup
            .bool().notRequired().label("Tissue Exposure Bone"),
        tissue_exposure_tendon: yup
            .bool().notRequired().label("Tissue Exposure Tendon"),
        tissue_exposure_vessel: yup
            .bool().notRequired().label("Tissue Exposure Vessel"),
        tissue_exposure_muscle: yup
            .bool().notRequired().label("Tissue Exposure Muscle"),
        tissue_exposure_fat: yup
            .bool().notRequired().label("Tissue Exposure Fat"),
        tissue_exposure_hardware: yup
            .bool().notRequired().label("Tissue Exposure Hardware"),
        tissue_exposure_fascia: yup
            .bool().notRequired().label("Tissue Exposure Fascia"),


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

            setValue("tissue_exposure_bone", formData.tissue_exposure_bone);

            setValue("tissue_exposure_tendon", formData.tissue_exposure_tendon);

            setValue("tissue_exposure_vessel", formData.tissue_exposure_vessel);

            setValue("tissue_exposure_muscle", formData.tissue_exposure_muscle);

            setValue("tissue_exposure_fat", formData.tissue_exposure_fat);

            setValue("tissue_exposure_hardware", formData.tissue_exposure_hardware);

            setValue("tissue_exposure_fascia", formData.tissue_exposure_fascia);
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

    const checkBoxValueChange = (e) => {
        const { value, name } = e.target;

        setValue(name, e.target.checked && true);
        // updatValidField(e, name, value);

    }




    return (
        <>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <SwitchControl
                        control={control}
                        name="tissue_exposure_bone"
                        label="Tissue Exposure - Bone"
                        onValueChange={checkBoxValueChange}
                    />
                    <SwitchControl
                        control={control}
                        name="tissue_exposure_tendon"
                        label="Tissue Exposure - Tendon"
                        onValueChange={checkBoxValueChange}
                    />

                    <SwitchControl
                        control={control}
                        name="tissue_exposure_vessel"
                        label="Tissue Exposure - Vessel"
                        onValueChange={checkBoxValueChange}
                    />

                    <SwitchControl
                        control={control}
                        name="tissue_exposure_muscle"
                        label="Tissue Exposure - Muscle"
                        onValueChange={checkBoxValueChange}
                    />

                    <SwitchControl
                        control={control}
                        name="tissue_exposure_fat"
                        label="Tissue Exposure - Fat"
                        onValueChange={checkBoxValueChange}
                    />

                    <SwitchControl
                        control={control}
                        name="tissue_exposure_hardware"
                        label="Tissue Exposure - Hardware"
                        onValueChange={checkBoxValueChange}
                    />

                    <SwitchControl
                        control={control}
                        name="tissue_exposure_fascia"
                        label="Tissue Exposure - Fascia"
                        onValueChange={checkBoxValueChange}
                    />


                    {/* <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="tissue_exposure_bone"
                                name="tissue_exposure_bone"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.tissue_exposure_bone && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="tissue_exposure_bone">Tissue Exposure Bone </Label>
                            {errors.tissue_exposure_bone && (
                                <FormFeedback>{errors.tissue_exposure_bone.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="tissue_exposure_tendon"
                                name="tissue_exposure_tendon"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.tissue_exposure_tendon && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="tissue_exposure_tendon">Tissue Exposure Tendon </Label>
                            {errors.tissue_exposure_tendon && (
                                <FormFeedback>{errors.tissue_exposure_tendon.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="tissue_exposure_vessel"
                                name="tissue_exposure_vessel"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.tissue_exposure_vessel && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="tissue_exposure_vessel">Tissue Exposure Vessel </Label>
                            {errors.tissue_exposure_vessel && (
                                <FormFeedback>{errors.tissue_exposure_vessel.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="tissue_exposure_muscle"
                                name="tissue_exposure_muscle"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.tissue_exposure_muscle && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="tissue_exposure_muscle">Tissue Exposure Muscle </Label>
                            {errors.tissue_exposure_muscle && (
                                <FormFeedback>{errors.tissue_exposure_muscle.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="tissue_exposure_fat"
                                name="tissue_exposure_fat"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.tissue_exposure_fat && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="tissue_exposure_fat">Tissue Exposure Fat </Label>
                            {errors.tissue_exposure_fat && (
                                <FormFeedback>{errors.tissue_exposure_fat.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="tissue_exposure_hardware"
                                name="tissue_exposure_hardware"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.tissue_exposure_hardware && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="tissue_exposure_hardware">Tissue Exposure Hardware </Label>
                            {errors.tissue_exposure_hardware && (
                                <FormFeedback>{errors.tissue_exposure_hardware.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="tissue_exposure_fascia"
                                name="tissue_exposure_fascia"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.tissue_exposure_fascia && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="tissue_exposure_fascia">Tissue Exposure Fascia </Label>
                            {errors.tissue_exposure_fascia && (
                                <FormFeedback>{errors.tissue_exposure_fascia.message}</FormFeedback>
                            )}
                        </div>
                    </Col> */}

                </Row>

            </Form>
        </>
    );

}
export default EditWoundNoteTissueExposure;