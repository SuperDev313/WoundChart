

//-----------------------EditWoundNoteReferral

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

const EditWoundNoteReferral = ({ id, formData, doSubmit, callBack }) => {


    const [today] = useState(new Date().toISOString().substr(0, 10));

    const formSchema = yup.object().shape({
        rr_vascular_evaluation: yup
            .bool()
            .notRequired()
            .label("Vascular Evaluation"),
    
        rr_nutrition_evaluation: yup
            .bool()
            .notRequired()
            .label("Nutrition Evaluation"),
    
        rr_infectious_diseases_evaluation: yup
            .bool()
            .notRequired()
            .label("Infectious Diseases Evaluation"),
    
        rr_physical_therapy_evaluation: yup
            .bool()
            .notRequired()
            .label("Physical Therapy Evaluation"),
    
        rr_primary_physician_evaluation: yup
            .bool()
            .notRequired()
            .label("Primary Physician Evaluation"),
    
        rr_hyperbaric_medicine_evaluation: yup
            .bool()
            .notRequired()
            .label("Hyperbaric Medicine Evaluation"),
    
        rr_occupational_therapy_evaluation: yup
            .bool()
            .notRequired()
            .label("Occupational Therapy Evaluation"),
    
        rr_pain_management_evaluation: yup
            .bool()
            .notRequired()
            .label("Pain Management Evaluation"),
    
        rr_off_loading: yup
            .bool()
            .notRequired()
            .label("Off-Loading"),
    
        rr_social_worker_evaluation: yup
            .bool()
            .notRequired()
            .label("Social Worker Evaluation"),
    
        rr_surgery_evaluation: yup
            .bool()
            .notRequired()
            .label("Surgery Evaluation"),
    
        rr_disease_management_evaluation: yup
            .bool()
            .notRequired()
            .label("Disease Management Evaluation"),
    
        rr_case_management_evaluation: yup
            .bool()
            .notRequired()
            .label("Case Management Evaluation"),
    
        rr_community_res_evaluation: yup
            .bool()
            .notRequired()
            .label("Community Resources Evaluation"),
    
        rr_compression_therapy: yup
            .bool()
            .notRequired()
            .label("Compression Therapy"),
    
        rr_negative_pressure_system: yup
            .bool()
            .notRequired()
            .label("Negative Pressure System"),
    
        rr_quit_smoking: yup
            .bool()
            .notRequired()
            .label("Quit Smoking"),
    
        rr_other_referrals: yup
            .string()
            .max(200)
            .notRequired()
            .label("Other Referrals"),
    
        rr_additional_comments: yup
            .string()
            .max(50)
            .notRequired()
            .label("Additional Comments"),
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

            setValue("rr_vascular_evaluation", formData.rr_vascular_evaluation);

            setValue("rr_nutrition_evaluation", formData.rr_nutrition_evaluation);

            setValue("rr_infectious_diseases_evaluation", formData.rr_infectious_diseases_evaluation);

            setValue("rr_physical_therapy_evaluation", formData.rr_physical_therapy_evaluation);

            setValue("rr_primary_physician_evaluation", formData.rr_primary_physician_evaluation);

            setValue("rr_hyperbaric_medicine_evaluation", formData.rr_hyperbaric_medicine_evaluation);

            setValue("rr_occupational_therapy_evaluation", formData.rr_occupational_therapy_evaluation);

            setValue("rr_pain_management_evaluation", formData.rr_pain_management_evaluation);

            setValue("rr_off_loading", formData.rr_off_loading);

            setValue("rr_social_worker_evaluation", formData.rr_social_worker_evaluation);

            setValue("rr_surgery_evaluation", formData.rr_surgery_evaluation);

            setValue("rr_disease_management_evaluation", formData.rr_disease_management_evaluation);

            setValue("rr_case_management_evaluation", formData.rr_case_management_evaluation);

            setValue("rr_community_res_evaluation", formData.rr_community_res_evaluation);

            setValue("rr_compression_therapy", formData.rr_compression_therapy);

            setValue("rr_negative_pressure_system", formData.rr_negative_pressure_system);

            setValue("rr_quit_smoking", formData.rr_quit_smoking);

            setValue("rr_other_referrals", formData.rr_other_referrals);

            setValue("rr_additional_comments", formData.rr_additional_comments);

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
                                id="rr_vascular_evaluation"
                                name="rr_vascular_evaluation"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.rr_vascular_evaluation && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="rr_vascular_evaluation">Rr Vascular Evaluation </Label>
                            {errors.rr_vascular_evaluation && (
                                <FormFeedback>{errors.rr_vascular_evaluation.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="rr_nutrition_evaluation"
                                name="rr_nutrition_evaluation"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.rr_nutrition_evaluation && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="rr_nutrition_evaluation">Rr Nutrition Evaluation </Label>
                            {errors.rr_nutrition_evaluation && (
                                <FormFeedback>{errors.rr_nutrition_evaluation.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="rr_infectious_diseases_evaluation"
                                name="rr_infectious_diseases_evaluation"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.rr_infectious_diseases_evaluation && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="rr_infectious_diseases_evaluation">Rr Infectious Diseases Evaluation </Label>
                            {errors.rr_infectious_diseases_evaluation && (
                                <FormFeedback>{errors.rr_infectious_diseases_evaluation.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="rr_physical_therapy_evaluation"
                                name="rr_physical_therapy_evaluation"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.rr_physical_therapy_evaluation && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="rr_physical_therapy_evaluation">Rr Physical Therapy Evaluation </Label>
                            {errors.rr_physical_therapy_evaluation && (
                                <FormFeedback>{errors.rr_physical_therapy_evaluation.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="rr_primary_physician_evaluation"
                                name="rr_primary_physician_evaluation"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.rr_primary_physician_evaluation && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="rr_primary_physician_evaluation">Rr Primary Physician Evaluation </Label>
                            {errors.rr_primary_physician_evaluation && (
                                <FormFeedback>{errors.rr_primary_physician_evaluation.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="rr_hyperbaric_medicine_evaluation"
                                name="rr_hyperbaric_medicine_evaluation"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.rr_hyperbaric_medicine_evaluation && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="rr_hyperbaric_medicine_evaluation">Rr Hyperbaric Medicine Evaluation </Label>
                            {errors.rr_hyperbaric_medicine_evaluation && (
                                <FormFeedback>{errors.rr_hyperbaric_medicine_evaluation.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="rr_occupational_therapy_evaluation"
                                name="rr_occupational_therapy_evaluation"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.rr_occupational_therapy_evaluation && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="rr_occupational_therapy_evaluation">Rr Occupational Therapy Evaluation </Label>
                            {errors.rr_occupational_therapy_evaluation && (
                                <FormFeedback>{errors.rr_occupational_therapy_evaluation.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="rr_pain_management_evaluation"
                                name="rr_pain_management_evaluation"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.rr_pain_management_evaluation && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="rr_pain_management_evaluation">Rr Pain Management Evaluation </Label>
                            {errors.rr_pain_management_evaluation && (
                                <FormFeedback>{errors.rr_pain_management_evaluation.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="rr_off_loading"
                                name="rr_off_loading"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.rr_off_loading && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="rr_off_loading">Rr Off Loading </Label>
                            {errors.rr_off_loading && (
                                <FormFeedback>{errors.rr_off_loading.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="rr_social_worker_evaluation"
                                name="rr_social_worker_evaluation"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.rr_social_worker_evaluation && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="rr_social_worker_evaluation">Rr Social Worker Evaluation </Label>
                            {errors.rr_social_worker_evaluation && (
                                <FormFeedback>{errors.rr_social_worker_evaluation.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="rr_surgery_evaluation"
                                name="rr_surgery_evaluation"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.rr_surgery_evaluation && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="rr_surgery_evaluation">Rr Surgery Evaluation </Label>
                            {errors.rr_surgery_evaluation && (
                                <FormFeedback>{errors.rr_surgery_evaluation.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="rr_disease_management_evaluation"
                                name="rr_disease_management_evaluation"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.rr_disease_management_evaluation && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="rr_disease_management_evaluation">Rr Disease Management Evaluation </Label>
                            {errors.rr_disease_management_evaluation && (
                                <FormFeedback>{errors.rr_disease_management_evaluation.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="rr_case_management_evaluation"
                                name="rr_case_management_evaluation"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.rr_case_management_evaluation && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="rr_case_management_evaluation">Rr Case Management Evaluation </Label>
                            {errors.rr_case_management_evaluation && (
                                <FormFeedback>{errors.rr_case_management_evaluation.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="rr_community_res_evaluation"
                                name="rr_community_res_evaluation"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.rr_community_res_evaluation && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="rr_community_res_evaluation">Rr Community Res Evaluation </Label>
                            {errors.rr_community_res_evaluation && (
                                <FormFeedback>{errors.rr_community_res_evaluation.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="rr_compression_therapy"
                                name="rr_compression_therapy"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.rr_compression_therapy && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="rr_compression_therapy">Rr Compression Therapy </Label>
                            {errors.rr_compression_therapy && (
                                <FormFeedback>{errors.rr_compression_therapy.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="rr_negative_pressure_system"
                                name="rr_negative_pressure_system"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.rr_negative_pressure_system && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="rr_negative_pressure_system">Rr Negative Pressure System </Label>
                            {errors.rr_negative_pressure_system && (
                                <FormFeedback>{errors.rr_negative_pressure_system.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="rr_quit_smoking"
                                name="rr_quit_smoking"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.rr_quit_smoking && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="rr_quit_smoking">Rr Quit Smoking </Label>
                            {errors.rr_quit_smoking && (
                                <FormFeedback>{errors.rr_quit_smoking.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <Label className="form-label" for="rr_other_referrals">Rr Other Referrals </Label>

                        <Controller
                            id="rr_other_referrals"
                            name="rr_other_referrals"
                            control={control}
                            render={({ field }) => (
                                <Input invalid={errors.rr_other_referrals && true} {...field} />
                            )}
                        />
                        {errors.rr_other_referrals && (
                            <FormFeedback>{errors.rr_other_referrals.message}</FormFeedback>
                        )}
                    </Col>

                    <Col md="6" className="mb-1">
                        <Label className="form-label" for="rr_additional_comments">Rr Additional Comments </Label>

                        <Controller
                            id="rr_additional_comments"
                            name="rr_additional_comments"
                            control={control}
                            render={({ field }) => (
                                <Input invalid={errors.rr_additional_comments && true} {...field} />
                            )}
                        />
                        {errors.rr_additional_comments && (
                            <FormFeedback>{errors.rr_additional_comments.message}</FormFeedback>
                        )}
                    </Col>

                </Row>

            </Form>
        </>
    );

}
export default EditWoundNoteReferral;