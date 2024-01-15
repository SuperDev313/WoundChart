
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

const EditWoundNoteAdjuvantTreatment = ({ id, formData, doSubmit, callBack }) => {


    const [today] = useState(new Date().toISOString().substr(0, 10));

    const formSchema = yup.object().shape({
        patient_has_cleansing: yup
            .bool()
            .notRequired()
            .label("Patient Has Cleansing"),
    
        patient_on_offloading_device: yup
            .bool()
            .notRequired()
            .label("Patient On Offloading Device"),
    
        patient_on_wheelchair: yup
            .bool()
            .notRequired()
            .label("Patient On Wheelchair"),
    
        patient_is_using_compression_device: yup
            .bool()
            .notRequired()
            .label("Patient Is Using Compression Device"),
    
        patient_receiving_hyperbaric_oxygen_treatment: yup
            .bool()
            .notRequired()
            .label("Patient Receiving Hyperbaric Oxygen Treatment"),
    
        patient_has_receiving_hyperbaric_oxygen_treatment: yup
            .bool()
            .notRequired()
            .label("Patient Has Receiving Hyperbaric Oxygen Treatment"),
    
        patient_treated_with_low_level_laser_therapy: yup
            .bool()
            .notRequired()
            .label("Patient Treated With Low Level Laser Therapy"),
    
        patient_receiving_occupational_therapy: yup
            .bool()
            .notRequired()
            .label("Patient Receiving Occupational Therapy"),
    
        patient_receiving_intermittent_pneumatic_compression: yup
            .bool()
            .notRequired()
            .label("Patient Receiving Intermittent Pneumatic Compression"),
    
        patient_receiving_whirlpool: yup
            .bool()
            .notRequired()
            .label("Patient Receiving Whirlpool"),
    
        patient_receiving_complete_decongestive_therapy_on_lower_ex: yup
            .bool()
            .notRequired()
            .label("Patient Receiving Complete Decongestive Therapy On Lower Extremity"),
    
        patient_receiving_manual_lymph_drainage: yup
            .bool()
            .notRequired()
            .label("Patient Receiving Manual Lymph Drainage"),
    
        patient_receiving_electrical_stimulation_therapy: yup
            .bool()
            .notRequired()
            .label("Patient Receiving Electrical Stimulation Therapy"),
    
        patient_receiving_electromagnetic_therapy: yup
            .bool()
            .notRequired()
            .label("Patient Receiving Electromagnetic Therapy"),
    
        cellular_and_or_tissue_based_product: yup
            .bool()
            .notRequired()
            .label("Cellular And/Or Tissue Based Product"),
    
        patient_receiving_transcutaneous_oxygen_therapy: yup
            .bool()
            .notRequired()
            .label("Patient Receiving Transcutaneous Oxygen Therapy"),
    
        patient_receiving_ultrasound_therapy: yup
            .bool()
            .notRequired()
            .label("Patient Receiving Ultrasound Therapy"),
    
        patient_receiving_shockwave_therapy: yup
            .bool()
            .notRequired()
            .label("Patient Receiving Shockwave Therapy"),
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

            setValue("patient_has_cleansing", formData.patient_has_cleansing);

            setValue("patient_on_offloading_device", formData.patient_on_offloading_device);

            setValue("patient_on_wheelchair", formData.patient_on_wheelchair);

            setValue("patient_is_using_compression_device", formData.patient_is_using_compression_device);

            setValue("patient_receiving_hyperbaric_oxygen_treatment", formData.patient_receiving_hyperbaric_oxygen_treatment);

            setValue("patient_has_receiving_hyperbaric_oxygen_treatment", formData.patient_has_receiving_hyperbaric_oxygen_treatment);

            setValue("patient_treated_with_low_level_laser_therapy", formData.patient_treated_with_low_level_laser_therapy);

            setValue("patient_receiving_occupational_therapy", formData.patient_receiving_occupational_therapy);

            setValue("patient_receiving_intermittent_pneumatic_compression", formData.patient_receiving_intermittent_pneumatic_compression);

            setValue("patient_receiving_whirlpool", formData.patient_receiving_whirlpool);

            setValue("patient_receiving_complete_decongestive_therapy_on_lower_ex", formData.patient_receiving_complete_decongestive_therapy_on_lower_ex);

            setValue("patient_receiving_manual_lymph_drainage", formData.patient_receiving_manual_lymph_drainage);

            setValue("patient_receiving_electrical_stimulation_therapy", formData.patient_receiving_electrical_stimulation_therapy);

            setValue("patient_receiving_electromagnetic_therapy", formData.patient_receiving_electromagnetic_therapy);

            setValue("cellular_and_or_tissue_based_product", formData.cellular_and_or_tissue_based_product);

            setValue("patient_receiving_transcutaneous_oxygen_therapy", formData.patient_receiving_transcutaneous_oxygen_therapy);

            setValue("patient_receiving_ultrasound_therapy", formData.patient_receiving_ultrasound_therapy);

            setValue("patient_receiving_shockwave_therapy", formData.patient_receiving_shockwave_therapy);

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
                                name="patient_has_cleansing"
                                label="Patient Has Cleansing"
                                onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.patient_has_cleansing && (
                            <FormFeedback>{errors.patient_has_cleansing.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                                control={control}
                                name="patient_on_offloading_device"
                                label="Patient On Offloading Device"
                                onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.patient_on_offloading_device && (
                            <FormFeedback>{errors.patient_on_offloading_device.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                                control={control}
                                name="patient_on_wheelchair"
                                label="Patient On Wheelchair"
                                onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.patient_on_wheelchair && (
                            <FormFeedback>{errors.patient_on_wheelchair.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                                control={control}
                                name="patient_is_using_compression_device"
                                label="Patient Is Using Compression Device"
                                onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.patient_is_using_compression_device && (
                            <FormFeedback>{errors.patient_is_using_compression_device.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                                control={control}
                                name="patient_receiving_hyperbaric_oxygen_treatment"
                                label="Patient Receiving Hyperbaric Oxygen Treatment"
                                onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.patient_receiving_hyperbaric_oxygen_treatment && (
                            <FormFeedback>{errors.patient_receiving_hyperbaric_oxygen_treatment.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                                control={control}
                                name="patient_has_receiving_hyperbaric_oxygen_treatment"
                                label="Patient Has Receiving Hyperbaric Oxygen Treatment"
                                onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.patient_has_receiving_hyperbaric_oxygen_treatment && (
                            <FormFeedback>{errors.patient_has_receiving_hyperbaric_oxygen_treatment.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                                control={control}
                                name="patient_treated_with_low_level_laser_therapy"
                                label="Patient Treated With Low Level Laser Therapy"
                                onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.patient_treated_with_low_level_laser_therapy && (
                            <FormFeedback>{errors.patient_treated_with_low_level_laser_therapy.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                                control={control}
                                name="patient_receiving_occupational_therapy"
                                label="Patient Receiving Occupational Therapy"
                                onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.patient_receiving_occupational_therapy && (
                            <FormFeedback>{errors.patient_receiving_occupational_therapy.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                                control={control}
                                name="patient_receiving_intermittent_pneumatic_compression"
                                label="Patient Receiving Intermittent Pneumatic Compression"
                                onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.patient_receiving_intermittent_pneumatic_compression && (
                            <FormFeedback>{errors.patient_receiving_intermittent_pneumatic_compression.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                                control={control}
                                name="patient_receiving_whirlpool"
                                label="Patient Receiving Whirlpool"
                                onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.patient_receiving_whirlpool && (
                            <FormFeedback>{errors.patient_receiving_whirlpool.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                                control={control}
                                name="patient_receiving_complete_decongestive_therapy_on_lower_ex"
                                label="Patient Receiving Complete Decongestive Therapy on Lower Extremities"
                                onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.patient_receiving_complete_decongestive_therapy_on_lower_ex && (
                            <FormFeedback>{errors.patient_receiving_complete_decongestive_therapy_on_lower_ex.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                                control={control}
                                name="patient_receiving_manual_lymph_drainage"
                                label="Patient Receiving Manual Lymph Drainage"
                                onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.patient_receiving_manual_lymph_drainage && (
                            <FormFeedback>{errors.patient_receiving_manual_lymph_drainage.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                                control={control}
                                name="patient_receiving_electrical_stimulation_therapy"
                                label="Patient Receiving Electrical Stimulation Therapy"
                                onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.patient_receiving_electrical_stimulation_therapy && (
                            <FormFeedback>{errors.patient_receiving_electrical_stimulation_therapy.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                                control={control}
                                name="patient_receiving_electromagnetic_therapy"
                                label="Patient Receiving Electromagnetic Therapy"
                                onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.patient_receiving_electromagnetic_therapy && (
                            <FormFeedback>{errors.patient_receiving_electromagnetic_therapy.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                                control={control}
                                name="cellular_and_or_tissue_based_product"
                                label="Cellular and/or Tissue Based Product"
                                onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.cellular_and_or_tissue_based_product && (
                            <FormFeedback>{errors.cellular_and_or_tissue_based_product.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                                control={control}
                                name="patient_receiving_transcutaneous_oxygen_therapy"
                                label="Patient Receiving Transcutaneous Oxygen Therapy"
                                onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.patient_receiving_transcutaneous_oxygen_therapy && (
                            <FormFeedback>{errors.patient_receiving_transcutaneous_oxygen_therapy.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                                control={control}
                                name="patient_receiving_ultrasound_therapy"
                                label="Patient Receiving Ultrasound Therapy"
                                onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.patient_receiving_ultrasound_therapy && (
                            <FormFeedback>{errors.patient_receiving_ultrasound_therapy.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                                control={control}
                                name="patient_receiving_shockwave_therapy"
                                label="Patient Receiving Shockwave Therapy"
                                onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.patient_receiving_shockwave_therapy && (
                            <FormFeedback>{errors.patient_receiving_shockwave_therapy.message}</FormFeedback>
                        )}
                    </Col>

                </Row>

            </Form>
        </>
    );

}
export default EditWoundNoteAdjuvantTreatment;