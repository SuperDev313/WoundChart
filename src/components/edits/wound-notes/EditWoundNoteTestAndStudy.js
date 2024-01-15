
//-----------------------EditWoundNoteTestAndStudy

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

const EditWoundNoteTestAndStudy = ({ id, formData, doSubmit, callBack }) => {


    const [today] = useState(new Date().toISOString().substr(0, 10));

    const formSchema = yup.object().shape({
        as_wound_culture: yup
            .bool()
            .notRequired()
            .label("Wound Culture"),
    
        as_biopsy: yup
            .bool()
            .notRequired()
            .label("Biopsy"),
    
        as_mri: yup
            .bool()
            .notRequired()
            .label("MRI"),
    
        as_arterial_venous_duplex: yup
            .bool()
            .notRequired()
            .label("Arterial Venous Duplex"),
    
        as_arteriogram: yup
            .bool()
            .notRequired()
            .label("Arteriogram"),
    
        as_ctscan: yup
            .bool()
            .notRequired()
            .label("CT Scan"),
    
        as_arterial_venous_doppler: yup
            .bool()
            .notRequired()
            .label("Arterial Venous Doppler"),
    
        as_xray: yup
            .bool()
            .notRequired()
            .label("X-ray"),
    
        as_gallium_scan: yup
            .bool()
            .notRequired()
            .label("Gallium Scan"),
    
        as_ankle_brachial: yup
            .bool()
            .notRequired()
            .label("Ankle Brachial"),
    
        as_transcutaneous_done_oximetry: yup
            .bool()
            .notRequired()
            .label("Transcutaneous Done Oximetry"),
    
        as_transcutaneous_oximetry: yup
            .bool()
            .notRequired()
            .label("Transcutaneous Oximetry"),
    
        as_abi_tbi_ppg: yup
            .bool()
            .notRequired()
            .label("ABI TBI PPG"),
    
        as_other_text: yup
            .string()
            .max(50)
            .notRequired()
            .label("Other Text"),
    
        wound_culture_was_obtain: yup
            .bool()
            .notRequired()
            .label("Wound Culture Was Obtained"),
    
        wound_biopsy_was_obtain: yup
            .bool()
            .notRequired()
            .label("Wound Biopsy Was Obtained"),
    
        wound_shave_biopsy_was_obtain: yup
            .bool()
            .notRequired()
            .label("Wound Shave Biopsy Was Obtained"),
    
        wound_punch_biopsy_was_done: yup
            .bool()
            .notRequired()
            .label("Wound Punch Biopsy Was Done"),
    
        wound_incisional_biopsy_was_done: yup
            .bool()
            .notRequired()
            .label("Wound Incisional Biopsy Was Done"),
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


    const setFieldDescription = (items, field, fieldDescription) => {
        let value = getValues(field);
        if (!((isNaN(value) || value === null || value === undefined))) {
            const selectedValue = items.find(r => r.value === parseInt(value));
            if (selectedValue) {
                formData[fieldDescription] = selectedValue.label;
            }
            else {
                formData[fieldDescription] = "";
            }
        }
    }


    React.useEffect(() => {


    }, []);

    React.useEffect(() => {
        const fetchFormData = () => {

            setValue("as_wound_culture", formData.as_wound_culture);

            setValue("as_biopsy", formData.as_biopsy);

            setValue("as_mri", formData.as_mri);

            setValue("as_arterial_venous_duplex", formData.as_arterial_venous_duplex);

            setValue("as_arteriogram", formData.as_arteriogram);

            setValue("as_ctscan", formData.as_ctscan);

            setValue("as_arterial_venous_doppler", formData.as_arterial_venous_doppler);

            setValue("as_xray", formData.as_xray);

            setValue("as_gallium_scan", formData.as_gallium_scan);

            setValue("as_ankle_brachial", formData.as_ankle_brachial);

            setValue("as_transcutaneous_done_oximetry", formData.as_transcutaneous_done_oximetry);

            setValue("as_transcutaneous_oximetry", formData.as_transcutaneous_oximetry);

            setValue("as_abi_tbi_ppg", formData.as_abi_tbi_ppg);

            setValue("as_other_text", formData.as_other_text);

            setValue("wound_culture_was_obtain", formData.wound_culture_was_obtain);

            setValue("wound_biopsy_was_obtain", formData.wound_biopsy_was_obtain);

            setValue("wound_shave_biopsy_was_obtain", formData.wound_shave_biopsy_was_obtain);

            setValue("wound_punch_biopsy_was_done", formData.wound_punch_biopsy_was_done);

            setValue("wound_incisional_biopsy_was_done", formData.wound_incisional_biopsy_was_done);

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
                        <div className="form-check form-check-inline">
                            <Controller
                                id="as_wound_culture"
                                name="as_wound_culture"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.as_wound_culture && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="as_wound_culture">As Wound Culture </Label>
                            {errors.as_wound_culture && (
                                <FormFeedback>{errors.as_wound_culture.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="as_biopsy"
                                name="as_biopsy"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.as_biopsy && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="as_biopsy">As Biopsy </Label>
                            {errors.as_biopsy && (
                                <FormFeedback>{errors.as_biopsy.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="as_mri"
                                name="as_mri"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.as_mri && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="as_mri">As Mri </Label>
                            {errors.as_mri && (
                                <FormFeedback>{errors.as_mri.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="as_arterial_venous_duplex"
                                name="as_arterial_venous_duplex"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.as_arterial_venous_duplex && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="as_arterial_venous_duplex">As Arterial Venous Duplex </Label>
                            {errors.as_arterial_venous_duplex && (
                                <FormFeedback>{errors.as_arterial_venous_duplex.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="as_arteriogram"
                                name="as_arteriogram"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.as_arteriogram && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="as_arteriogram">As Arteriogram </Label>
                            {errors.as_arteriogram && (
                                <FormFeedback>{errors.as_arteriogram.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="as_ctscan"
                                name="as_ctscan"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.as_ctscan && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="as_ctscan">As Ctscan </Label>
                            {errors.as_ctscan && (
                                <FormFeedback>{errors.as_ctscan.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="as_arterial_venous_doppler"
                                name="as_arterial_venous_doppler"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.as_arterial_venous_doppler && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="as_arterial_venous_doppler">As Arterial Venous Doppler </Label>
                            {errors.as_arterial_venous_doppler && (
                                <FormFeedback>{errors.as_arterial_venous_doppler.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="as_xray"
                                name="as_xray"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.as_xray && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="as_xray">As Xray </Label>
                            {errors.as_xray && (
                                <FormFeedback>{errors.as_xray.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="as_gallium_scan"
                                name="as_gallium_scan"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.as_gallium_scan && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="as_gallium_scan">As Gallium Scan </Label>
                            {errors.as_gallium_scan && (
                                <FormFeedback>{errors.as_gallium_scan.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="as_ankle_brachial"
                                name="as_ankle_brachial"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.as_ankle_brachial && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="as_ankle_brachial">As Ankle Brachial </Label>
                            {errors.as_ankle_brachial && (
                                <FormFeedback>{errors.as_ankle_brachial.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="as_transcutaneous_done_oximetry"
                                name="as_transcutaneous_done_oximetry"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.as_transcutaneous_done_oximetry && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="as_transcutaneous_done_oximetry">As Transcutaneous Done Oximetry </Label>
                            {errors.as_transcutaneous_done_oximetry && (
                                <FormFeedback>{errors.as_transcutaneous_done_oximetry.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="as_transcutaneous_oximetry"
                                name="as_transcutaneous_oximetry"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.as_transcutaneous_oximetry && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="as_transcutaneous_oximetry">As Transcutaneous Oximetry </Label>
                            {errors.as_transcutaneous_oximetry && (
                                <FormFeedback>{errors.as_transcutaneous_oximetry.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="as_abi_tbi_ppg"
                                name="as_abi_tbi_ppg"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.as_abi_tbi_ppg && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="as_abi_tbi_ppg">As Abi Tbi Ppg </Label>
                            {errors.as_abi_tbi_ppg && (
                                <FormFeedback>{errors.as_abi_tbi_ppg.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <Label className="form-label" for="as_other_text">As Other Text </Label>

                        <Controller
                            id="as_other_text"
                            name="as_other_text"
                            control={control}
                            render={({ field }) => (
                                <Input invalid={errors.as_other_text && true} {...field} />
                            )}
                        />
                        {errors.as_other_text && (
                            <FormFeedback>{errors.as_other_text.message}</FormFeedback>
                        )}
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="wound_culture_was_obtain"
                                name="wound_culture_was_obtain"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.wound_culture_was_obtain && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="wound_culture_was_obtain">Wound Culture Was Obtain </Label>
                            {errors.wound_culture_was_obtain && (
                                <FormFeedback>{errors.wound_culture_was_obtain.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="wound_biopsy_was_obtain"
                                name="wound_biopsy_was_obtain"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.wound_biopsy_was_obtain && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="wound_biopsy_was_obtain">Wound Biopsy Was Obtain </Label>
                            {errors.wound_biopsy_was_obtain && (
                                <FormFeedback>{errors.wound_biopsy_was_obtain.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="wound_shave_biopsy_was_obtain"
                                name="wound_shave_biopsy_was_obtain"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.wound_shave_biopsy_was_obtain && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="wound_shave_biopsy_was_obtain">Wound Shave Biopsy Was Obtain </Label>
                            {errors.wound_shave_biopsy_was_obtain && (
                                <FormFeedback>{errors.wound_shave_biopsy_was_obtain.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="wound_punch_biopsy_was_done"
                                name="wound_punch_biopsy_was_done"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.wound_punch_biopsy_was_done && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="wound_punch_biopsy_was_done">Wound Punch Biopsy Was Done </Label>
                            {errors.wound_punch_biopsy_was_done && (
                                <FormFeedback>{errors.wound_punch_biopsy_was_done.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="wound_incisional_biopsy_was_done"
                                name="wound_incisional_biopsy_was_done"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.wound_incisional_biopsy_was_done && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="wound_incisional_biopsy_was_done">Wound Incisional Biopsy Was Done </Label>
                            {errors.wound_incisional_biopsy_was_done && (
                                <FormFeedback>{errors.wound_incisional_biopsy_was_done.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                </Row>

            </Form>
        </>
    );

}
export default EditWoundNoteTestAndStudy;