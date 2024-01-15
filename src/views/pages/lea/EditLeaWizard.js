
// ** React Imports
import React, { useRef, useState } from "react";

// ** Utils
import { isObjEmpty, isValidDate, minDateOfBirth } from "@utils";
import Flatpickr from 'react-flatpickr'
import classnames from "classnames";
import { Check, X, ArrowLeft, ArrowRight } from 'react-feather'


// ** Third Party Components
import * as yup from "yup";
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import MyCleave from "../../../components/forms/MyCleave";
import useApi from "../../../api/useApi";

// ** Utils
import Wizard from "@components/wizard";
import { showAlertError } from "../../../components/alerts/AlertUtils";
import SwitchControl from '../../../components/forms/SwitchControl';

import "cleave.js/dist/addons/cleave-phone.us";

import { getDateTimeLocal, transformValue } from "../../../utility/Utils";

// ** Reactstrap Imports
import {
    Form,
    Label,
    Input,
    Row,
    Col,
    Button,
    FormFeedback,
    Flex
} from "reactstrap";

const CustomLabel = ({ htmlFor }) => {
    return (
        <Label className='form-check-label' htmlFor={htmlFor}>
            <span className='switch-icon-left'>
                <Check size={14} />
            </span>
            <span className='switch-icon-right'>
                <X size={14} />
            </span>
        </Label>
    )
}

const EditPatientLowerExtremitiesAssessment = ({ id, formData, doSubmit, callBack }) => {

    const [extremity_color_options, setExtremity_Color_Options] = useState([{ label: "", value: "" }]);
    const [lower_extremity_pulse_options, setLower_Extremity_Pulse_Options] = useState([{ label: "", value: "" }]);

    const [today] = useState(new Date().toISOString().substr(0, 10));

    const formSchema = yup.object().shape({
        visit_date: yup
            .date()
            .required("Visit Date is required.")
            .label("Visit Date")
            .transform((value) => (isValidDate(value) ? value : null))
            .max(new Date(), 'Visit Date must be today or earlier')
            .min(minDateOfBirth(), 'Invalid Visit Date'),
        history_of_dvt: yup.bool().default(false).notRequired().label("History Of DVT"),
        hx_of_prior_wound_or_ulcer: yup.bool().default(false).notRequired().label("HX of Prior Wound or Ulcer"),
        hx_of_prior_amputation: yup.bool().default(false).notRequired().label("HX of Prior Amputation"),
        hx_of_prior_wound_amputation_detail: yup.string().max(50).notRequired().label("HX of Prior Wound/Amputation Detail"),
        previous_vascular_studies: yup.bool().default(false).notRequired().label("Previous Vascular Studies"),
        offloading_device_in_use: yup.bool().default(false).notRequired().label("Offloading Device In Use"),
        compression_device_in_use: yup.bool().default(false).notRequired().label("Compression Device In Use"),
        color_right_lower_extremity_id: yup.string().default(0).notRequired().label("Color (Right Lower Extremity)"),
        color_leftt_lower_extremity_id: yup.string().default(0).notRequired().label("Color (Left Lower Extremity)"),
        edema_right_lower_extremity: yup.bool().default(false).notRequired().label("Edema (Right Lower Extremity)").typeError("Edema (Right Lower Extremity) value should be boolean"),
        edema_left_lower_extremity: yup.bool().default(false).notRequired().label("Edema (Left Lower Extremity)").typeError("Edema (Left Lower Extremity) value should be boolean"),
        sensation_right_lower_extremity_id: yup.string().notRequired().label("Sensation (Right Lower Extremity)"),
        sensation_left_lower_extremity_id: yup.string().notRequired().label("Sensation (Left Lower Extremity)"),
        hair_growth_right_lower_extremity: yup.bool().default(false).notRequired().label("Hair Growth (Right Lower Extremity)").typeError("Hair Growth (Right Lower Extremity) value should be boolean"),
        hair_growth_left_lower_extremity: yup.bool().default(false).notRequired().label("Hair Growth (Left Lower Extremity)").typeError("Hair Growth (Left Lower Extremity) value should be boolean"),
        erythema_right_lower_extremity: yup.bool().default(false).notRequired().label("Erythema (Right Lower Extremity)").typeError("Erythema (Right Lower Extremity) value should be boolean"),
        erythema_left_lower_extremity: yup.bool().default(false).notRequired().label("Erythema (Left Lower Extremity)").typeError("Erythema (Left Lower Extremity) value should be boolean"),
        dependent_rubor_right_lower_extremity: yup.bool().default(false).notRequired().label("Dependent Rubor (Right Lower Extremity)").typeError("Dependent Rubor (Right Lower Extremity) value should be boolean"),
        dependent_rubor_left_lower_extremity: yup.bool().default(false).notRequired().label("Dependent Rubor (Left LowerExtremity)").typeError("Dependent Rubor (Left Lower Extremity) value should be boolean"),
        lipodermatosclerosis_right_lower_extremity: yup.bool().default(false).notRequired().label("Lipodermatosclerosis (Right Lower Extremity)").typeError("Lipodermatosclerosis (Right Lower Extremity) value should be boolean"),
        lipodermatosclerosis_left_lower_extremity: yup.bool().default(false).notRequired().label("Lipodermatosclerosis (Left Lower Extremity)").typeError("Lipodermatosclerosis (Left Lower Extremity) value should be boolean"),
        capillary_refill_right_lower_extremity: yup.bool().default(false).notRequired().label("Capillary Refill (Right Lower Extremity)"),
        capillary_refill_left_lower_extremity: yup.bool().default(false).notRequired().label("Capillary Refill (Left Lower Extremity)"),
        popliteal_right_lower_extremity_id: yup.string().notRequired().label("Popliteal (Right Lower Extremity)"),
        popliteal_left_lower_extremity_id: yup.string().notRequired().label("Popliteal (Left Lower Extremity)"),
        posterior_tibialis_right_lower_extremity_id: yup.string().notRequired().label("Posterior Tibialis (Right Lower Extremity)"),
        posterior_tibialis_left_lower_extremity_id: yup.string().notRequired().label("Posterior Tibialis (Left Lower Extremity)"),
        dorsalis_pedis_right_lower_extremity_id: yup.string().notRequired().label("Dorsalis Pedis (Right Lower Extremity)"),
        dorsalis_pedis_left_lower_extremity_id: yup.string().notRequired().label("Dorsalis Pedis (Left Lower Extremity)"),
        additional_comments: yup.string().max(50).notRequired().label("Additional Comments"),
    });

    const defaultValues = {
        history_of_dvt: false,
        hx_of_prior_wound_or_ulcer: false,
        hx_of_prior_amputation: false,
        previous_vascular_studies: false,
        offloading_device_in_use: false,
        compression_device_in_use: false,
        edema_right_lower_extremity: false,
        edema_left_lower_extremity: false,
        hair_growth_right_lower_extremity: false,
        hair_growth_left_lower_extremity: false,
        erythema_right_lower_extremity: false,
        erythema_left_lower_extremity: false,
        dependent_rubor_right_lower_extremity: false,
        dependent_rubor_left_lower_extremity: false,
        lipodermatosclerosis_right_lower_extremity: false,
        lipodermatosclerosis_left_lower_extremity: false,
        capillary_refill_right_lower_extremity: false,
        capillary_refill_left_lower_extremity: false,
    };

     // ** Hooks
     const {
        trigger,
        control,
        setValue,
        getValues,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(formSchema),
        defaultValues
    });

    const wizardRef = useRef(null);

    const checkBoxValueChange = (e) => {
        const { value, name } = e.target;

        setValue(name, e.target.checked || false);
        // updatValidField(e, name, value);

    }

    React.useEffect(() => {
        useApi
            .get("/lookup/extremity_color_options", {})
            .then((res) => {
                var items = [{ label: "", value: "" }];
                res.data.data.map((r) => {
                    const option = { label: r.description, value: r.id };
                    items.push(option);
                    return option;
                });
                setExtremity_Color_Options(items);
            })
            .catch((err) => {
                showAlertError(err);
            });
        useApi
            .get("/lookup/lower_extremity_pulse_options", {})
            .then((res) => {
                var items = [{ label: "", value: "" }];
                res.data.data.map((r) => {
                    const option = { label: r.description, value: r.id };
                    items.push(option);
                    return option;
                });
                setLower_Extremity_Pulse_Options(items);
            })
            .catch((err) => {
                showAlertError(err);
            });


    }, []);



    React.useEffect(() => {

        const fetchFormData = () => {
            setValue("visit_date", getDateTimeLocal(formData.visit_date));
            setValue("history_of_dvt", formData.history_of_dvt !== "" ? formData.history_of_dvt : false);
            setValue("hx_of_prior_wound_or_ulcer", formData.hx_of_prior_wound_or_ulcer !== "" ? formData.hx_of_prior_wound_or_ulcer : false);
            setValue("hx_of_prior_amputation", formData.hx_of_prior_amputation !== "" ? formData.hx_of_prior_amputation : false);
            setValue("hx_of_prior_wound_amputation_detail", formData.hx_of_prior_wound_amputation_detail);
            setValue("previous_vascular_studies", formData.previous_vascular_studies !== "" ? formData.previous_vascular_studies : false);
            setValue("offloading_device_in_use", formData.offloading_device_in_use !== "" ? formData.offloading_device_in_use : false);
            setValue("compression_device_in_use", formData.compression_device_in_use !== "" ? formData.compression_device_in_use : false);
            setValue("color_right_lower_extremity_id", isNaN(formData.color_right_lower_extremity_id) ? 0 : formData.color_right_lower_extremity_id);
            setValue("color_leftt_lower_extremity_id", isNaN(formData.color_leftt_lower_extremity_id) ? 0 : formData.color_leftt_lower_extremity_id);
            setValue("edema_right_lower_extremity", formData.edema_right_lower_extremity !== "" ? formData.edema_right_lower_extremity : false);
            setValue("edema_left_lower_extremity", formData.edema_left_lower_extremity !== "" ? formData.edema_left_lower_extremity : false);
            setValue("sensation_right_lower_extremity_id", isNaN(formData.sensation_right_lower_extremity_id) ? "" : formData.sensation_right_lower_extremity_id);
            setValue("sensation_left_lower_extremity_id", isNaN(formData.sensation_left_lower_extremity_id) ? "" : formData.sensation_left_lower_extremity_id);
            setValue("hair_growth_right_lower_extremity", formData.hair_growth_right_lower_extremity !== "" ? formData.hair_growth_right_lower_extremity : false);
            setValue("hair_growth_left_lower_extremity", formData.hair_growth_left_lower_extremity !== "" ? formData.hair_growth_left_lower_extremity : false);
            setValue("erythema_right_lower_extremity", formData.erythema_right_lower_extremity !== "" ? formData.erythema_right_lower_extremity : false);
            setValue("erythema_left_lower_extremity", formData.erythema_left_lower_extremity !== "" ? formData.erythema_left_lower_extremity : false);
            setValue("dependent_rubor_right_lower_extremity", formData.dependent_rubor_right_lower_extremity !== "" ? formData.dependent_rubor_right_lower_extremity : false);
            setValue("dependent_rubor_left_lower_extremity", formData.dependent_rubor_left_lower_extremity !== "" ? formData.dependent_rubor_left_lower_extremity : false);
            setValue("lipodermatosclerosis_right_lower_extremity", formData.lipodermatosclerosis_right_lower_extremity !== "" ? formData.lipodermatosclerosis_right_lower_extremity : false);
            setValue("lipodermatosclerosis_left_lower_extremity", formData.lipodermatosclerosis_left_lower_extremity !== "" ? formData.lipodermatosclerosis_left_lower_extremity : false);
            setValue("capillary_refill_right_lower_extremity", formData.capillary_refill_right_lower_extremity !== "" ? formData.capillary_refill_right_lower_extremity : false);
            setValue("capillary_refill_left_lower_extremity", formData.capillary_refill_left_lower_extremity !== "" ? formData.capillary_refill_left_lower_extremity : false);
            setValue("popliteal_right_lower_extremity_id", isNaN(formData.popliteal_right_lower_extremity_id) ? "" : formData.popliteal_right_lower_extremity_id);
            setValue("popliteal_left_lower_extremity_id", isNaN(formData.popliteal_left_lower_extremity_id) ? "" : formData.popliteal_left_lower_extremity_id);
            setValue("posterior_tibialis_right_lower_extremity_id", isNaN(formData.posterior_tibialis_right_lower_extremity_id) ? "" : formData.posterior_tibialis_right_lower_extremity_id);
            setValue("posterior_tibialis_left_lower_extremity_id", isNaN(formData.posterior_tibialis_left_lower_extremity_id) ? "" : formData.posterior_tibialis_left_lower_extremity_id);
            setValue("dorsalis_pedis_right_lower_extremity_id", isNaN(formData.dorsalis_pedis_right_lower_extremity_id) ? "" : formData.dorsalis_pedis_right_lower_extremity_id);
            setValue("dorsalis_pedis_left_lower_extremity_id", isNaN(formData.dorsalis_pedis_left_lower_extremity_id) ? "" : formData.dorsalis_pedis_left_lower_extremity_id);
            setValue("additional_comments", formData.additional_comments);

        };

        if (formData) {
            fetchFormData();
        }
    }, [formData]);


    React.useEffect(() => {
        const doRun = async () => {
            const result = await trigger();

            console.log(result);
            console.log(errors);

            callBack(getValues(), result)
        }
        if (doSubmit) {
            doRun()
        }

    }, [doSubmit]);

    const onSubmit = (data) => {
        callBack(data, isObjEmpty(errors))
    };

    const [stepper, setStepper] = useState(null);

    function Step1Content({ control, errors }) {

        const fieldsInCurrentStep = [
            'visit_date',
            'history_of_dvt',
            'hx_of_prior_wound_or_ulcer',
            'hx_of_prior_wound_amputation_detail',
            'previous_vascular_studies'
        ]

        return (
            <Row>
                <Row className="mb-1 d-flex justify-content-between">
                    <Col md="5">
                        <Label className="form-label" for="visit_date">Visit Date </Label>
                    </Col>
                    <Col md="7">
                        <Controller
                            id="visit_date"
                            name="visit_date"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    maxDate={today}
                                    type="datetime-local"
                                    invalid={errors.visit_date && true}
                                    {...field}
                                />
                            )}
                        />

                        {errors.visit_date && (
                            <FormFeedback>{errors.visit_date.message}</FormFeedback>
                        )}
                    </Col>
                </Row>

                <Row className="mb-1 d-flex justify-content-between">
                    <SwitchControl
                        control={control}
                        name="history_of_dvt"
                        label="History Of Dvt"
                        onValueChange={checkBoxValueChange}
                        justify={true}
                        sm={8}
                    />
                </Row>

                <Row className="mb-1 d-flex justify-content-between">
                    <SwitchControl
                        control={control}
                        name="hx_of_prior_wound_or_ulcer"
                        label="Hx Of Prior Wound Or Ulcer "
                        onValueChange={checkBoxValueChange}
                        justify={true}
                        sm={8}
                    />
                </Row>

                <Row className="mb-1 d-flex justify-content-between">
                    <SwitchControl
                        control={control}
                        name="hx_of_prior_amputation"
                        label="Hx Of Prior Amputation"
                        onValueChange={checkBoxValueChange}
                        justify={true}
                        sm={8}
                    />
                </Row>

                <Row className="mb-1 d-flex justify-content-between">
                    <Col md="5">
                        <Label className="form-label" for="hx_of_prior_wound_amputation_detail">Hx Of Prior Wound Amputation Detail </Label>
                    </Col>
                    <Col>
                        <Controller
                            id="hx_of_prior_wound_amputation_detail"
                            name="hx_of_prior_wound_amputation_detail"
                            control={control}
                            render={({ field }) => (
                                <Input invalid={errors.hx_of_prior_wound_amputation_detail && true} {...field} />
                            )}
                        />
                        {errors.hx_of_prior_wound_amputation_detail && (
                            <FormFeedback>{errors.hx_of_prior_wound_amputation_detail.message}</FormFeedback>
                        )}
                    </Col>
                </Row>

                <Row className="mb-1 d-flex justify-content-between">
                    <SwitchControl
                        control={control}
                        name="previous_vascular_studies"
                        label="Previous Vascular Studies"
                        onValueChange={checkBoxValueChange}
                        justify={true}
                        sm={8}
                    />
                </Row>

                <div className="d-flex justify-content-between">
                    <Button color="secondary" className="btn-prev" outline disabled>
                        <ArrowLeft
                            size={14}
                            className="align-middle me-sm-25 me-0"
                        ></ArrowLeft>
                        <span className="align-middle d-sm-inline-block d-none">
                            Previous
                        </span>
                    </Button>
                    <Button
                        type="button"
                        color="primary"
                        className="btn-next"
                        onClick={async () => {
                            const isValid = await Promise
                                .all(
                                    fieldsInCurrentStep.map((field) => trigger(field))
                                )
                                .then((results) => results.every((result) => result)
                            )

                            console.log(isValid)

                            if (isValid) {
                                stepper.next()
                            }
                        }}
                    >
                        <span className="align-middle d-sm-inline-block d-none">Next</span>
                        <ArrowRight size={14} className="align-middle ms-sm-25 ms-0"></ArrowRight>
                    </Button>

                </div>
            </Row>

        );
    }

    function Step2Content({ control, errors }) {

        const fieldsInCurrentStep = [
            'offloading_device_in_use',
            'compression_device_in_use',
            'color_right_lower_extremity_id',
            'color_leftt_lower_extremity_id',
            'edema_right_lower_extremity',
            'edema_left_lower_extremity'
        ]

        return (
            <Row>
                <Row className="mb-1 d-flex justify-content-between">
                    <SwitchControl
                        control={control}
                        name="offloading_device_in_use"
                        label="Offloading Device In Use"
                        onValueChange={checkBoxValueChange}
                        justify={true}
                        sm={8}
                    />
                </Row>

                <Row className="mb-1 d-flex justify-content-between">
                    <SwitchControl
                        control={control}
                        name="compression_device_in_use"
                        label="Compression Device In Use"
                        onValueChange={checkBoxValueChange}
                        justify={true}
                        sm={8}
                    />
                </Row>

                <Row className="mb-1 d-flex justify-content-between">
                    <Col sm="5">
                        <Label className="form-label" for="color_right_lower_extremity_id">Color Right Lower Extremity Id </Label>
                    </Col>
                    <Col sm="7">
                        <Controller
                            name="color_right_lower_extremity_id"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="select"
                                    id="color_right_lower_extremity_id"
                                    invalid={errors.color_right_lower_extremity_id && true}
                                    {...field}
                                >
                                    {extremity_color_options.map &&
                                        extremity_color_options.map((item, index) => (
                                            <option value={item.value} key={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                </Input>
                            )}
                        />
                        {errors.color_right_lower_extremity_id && (
                            <FormFeedback>{errors.color_right_lower_extremity_id.message}</FormFeedback>
                        )}
                    </Col>
                </Row>

                <Row className="mb-1 d-flex justify-content-between">
                    <Col md="5">
                        <Label className="form-label" for="color_leftt_lower_extremity_id">Color Leftt Lower Extremity Id </Label>
                    </Col>
                    <Col md="7">
                        <Controller
                            name="color_leftt_lower_extremity_id"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="select"
                                    id="color_leftt_lower_extremity_id"
                                    invalid={errors.color_leftt_lower_extremity_id && true}
                                    {...field}
                                >
                                    {extremity_color_options.map &&
                                        extremity_color_options.map((item, index) => (
                                            <option value={item.value} key={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                </Input>
                            )}
                        />
                        {errors.color_leftt_lower_extremity_id && (
                            <FormFeedback>{errors.color_leftt_lower_extremity_id.message}</FormFeedback>
                        )}
                    </Col>
                </Row>

                <Row className="mb-1 d-flex justify-content-between">
                    <SwitchControl
                        control={control}
                        name="edema_right_lower_extremity"
                        label="Edema Right Lower Extremity"
                        onValueChange={checkBoxValueChange}
                        justify={true}
                        sm={8}
                    />
                </Row>

                <Row className="mb-1 d-flex justify-content-between">
                    <SwitchControl
                        control={control}
                        name="edema_left_lower_extremity"
                        label="Edema Left Lower Extremity"
                        onValueChange={checkBoxValueChange}
                        justify={true}
                        sm={8}
                    />
                </Row>

                <div className="d-flex justify-content-between">
                    <Button
                        color="secondary"
                        className="btn-prev"
                        outline
                        onClick={() => stepper.previous()} // Navigate to the previous step
                    >
                        <ArrowLeft size={14} className="align-middle me-sm-25 me-0"></ArrowLeft>
                        <span className="align-middle d-sm-inline-block d-none">Previous</span>
                    </Button>
                    <Button
                        type="button"
                        color="primary"
                        className="btn-next"
                        onClick={async () => {
                            const isValid = await Promise
                                .all(
                                    fieldsInCurrentStep.map((field) => trigger(field))
                                )
                                .then((results) => results.every((result) => result)
                            )

                            console.log(isValid)

                            if (isValid) {
                                stepper.next()
                            }
                        }}
                    >
                        <span className="align-middle d-sm-inline-block d-none">Next</span>
                        <ArrowRight size={14} className="align-middle ms-sm-25 ms-0"></ArrowRight>
                    </Button>

                </div>

            </Row>
        )
    }

    function Step3Content({ control, errors }) {

        const fieldsInCurrentStep = [
            'sensation_right_lower_extremity_id',
            'sensation_left_lower_extremity_id',
            'hair_growth_right_lower_extremity',
            'hair_growth_left_lower_extremity',
            'erythema_right_lower_extremity',
            'erythema_left_lower_extremity'
        ]

        return (
            <Row>
                <Col className="col-md-6 mb-1">
                    <Label className="form-label" for="sensation_right_lower_extremity_id">Sensation Right Lower Extremity Id </Label>

                    <Controller
                        name="sensation_right_lower_extremity_id"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="select"
                                id="sensation_right_lower_extremity_id"
                                invalid={errors.sensation_right_lower_extremity_id && true}
                                {...field}
                            >
                                {lower_extremity_pulse_options.map &&
                                    lower_extremity_pulse_options.map((item, index) => (
                                        <option value={item.value} key={item.value}>
                                            {item.label}
                                        </option>
                                    ))}
                            </Input>
                        )}
                    />
                    {errors.sensation_right_lower_extremity_id && (
                        <FormFeedback>{errors.sensation_right_lower_extremity_id.message}</FormFeedback>
                    )}
                </Col>

                <Col className="col-md-6 mb-1">
                    <Label className="form-label" for="sensation_left_lower_extremity_id">Sensation Left Lower Extremity Id </Label>

                    <Controller
                        name="sensation_left_lower_extremity_id"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="select"
                                id="sensation_left_lower_extremity_id"
                                invalid={errors.sensation_left_lower_extremity_id && true}
                                {...field}
                            >
                                {lower_extremity_pulse_options.map &&
                                    lower_extremity_pulse_options.map((item, index) => (
                                        <option value={item.value} key={item.value}>
                                            {item.label}
                                        </option>
                                    ))}
                            </Input>
                        )}
                    />
                    {errors.sensation_left_lower_extremity_id && (
                        <FormFeedback>{errors.sensation_left_lower_extremity_id.message}</FormFeedback>
                    )}
                </Col>

                <Col md="6" className="mb-1">
                    <SwitchControl
                        control={control}
                        name="hair_growth_right_lower_extremity"
                        label="Hair Growth Right Lower Extremity"
                        onValueChange={checkBoxValueChange}
                        sm={12}
                    />
                </Col>

                <Col md="6" className="mb-1">
                    <SwitchControl
                        control={control}
                        name="hair_growth_left_lower_extremity"
                        label="Hair Growth Left Lower Extremity"
                        onValueChange={checkBoxValueChange}
                        sm={12}
                    />
                </Col>

                <Col md="6" className="mb-1">
                    <SwitchControl
                        control={control}
                        name="erythema_right_lower_extremity"
                        label="Erythema Right Lower Extremity"
                        onValueChange={checkBoxValueChange}
                        sm={12}
                    />
                </Col>

                <Col md="6" className="mb-1">
                    <SwitchControl
                        control={control}
                        name="erythema_left_lower_extremity"
                        label="Erythema Left Lower Extremity"
                        onValueChange={checkBoxValueChange}
                        sm={12}
                    />
                </Col>

                <div className="d-flex justify-content-between">
                    <Button
                        color="secondary"
                        className="btn-prev"
                        outline
                        onClick={() => stepper.previous()} // Navigate to the previous step
                    >
                        <ArrowLeft size={14} className="align-middle me-sm-25 me-0"></ArrowLeft>
                        <span className="align-middle d-sm-inline-block d-none">Previous</span>
                    </Button>
                    <Button
                        type="button"
                        color="primary"
                        className="btn-next"
                        onClick={async () => {
                            const isValid = await Promise
                                .all(
                                    fieldsInCurrentStep.map((field) => trigger(field))
                                )
                                .then((results) => results.every((result) => result)
                            )

                            console.log(isValid)

                            if (isValid) {
                                stepper.next()
                            }
                        }}
                    >
                        <span className="align-middle d-sm-inline-block d-none">Next</span>
                        <ArrowRight size={14} className="align-middle ms-sm-25 ms-0"></ArrowRight>
                    </Button>

                </div>

            </Row>
        )
    }

    function Step4Content({ control, errors }) {

        const fieldsInCurrentStep = [
        ]

        return (
            <Row>
                <Col md="6" className="mb-1">
                    <SwitchControl
                        control={control}
                        name="dependant_rubor_right_lower_extremity"
                        label="Dependant Rubor Right Lower Extremity"
                        onValueChange={checkBoxValueChange}
                        sm={12}
                    />
                </Col>

                <Col md="6" className="mb-1">
                    <SwitchControl
                        control={control}
                        name="dependant_rubor_left_lower_extremity"
                        label="Dependant Rubor Left Lower Extremity"
                        onValueChange={checkBoxValueChange}
                        sm={12}
                    />
                </Col>

                <Col md="6" className="mb-1">
                    <SwitchControl
                        control={control}
                        name="lipodermatosclerosis_right_lower_extremity"
                        label="Lipodermatosclerosis Right Lower Extremity"
                        onValueChange={checkBoxValueChange}
                        sm={12}
                    />
                </Col>

                <Col md="6" className="mb-1">
                    <SwitchControl
                        control={control}
                        name="lipodermatosclerosis_left_lower_extremity"
                        label="Lipodermatosclerosis Left Lower Extremity"
                        onValueChange={checkBoxValueChange}
                        sm={12}
                    />
                </Col>

                <Col md="6" className="mb-1">
                    <SwitchControl
                        control={control}
                        name="capillary_refill_right_lower_extremity"
                        label="Capillary Refill Right Lower Extremity"
                        onValueChange={checkBoxValueChange}
                        sm={12}
                    />
                </Col>

                <Col md="6" className="mb-1">
                    <SwitchControl
                        control={control}
                        name="capillary_refill_left_lower_extremity"
                        label="Capillary Refill Left Lower Extremity"
                        onValueChange={checkBoxValueChange}
                        sm={12}
                    />
                </Col>

                <div className="d-flex justify-content-between">
                    <Button
                        color="secondary"
                        className="btn-prev"
                        outline
                        onClick={() => stepper.previous()} // Navigate to the previous step
                    >
                        <ArrowLeft size={14} className="align-middle me-sm-25 me-0"></ArrowLeft>
                        <span className="align-middle d-sm-inline-block d-none">Previous</span>
                    </Button>
                    <Button
                        type="button"
                        color="primary"
                        className="btn-next"
                        onClick={async () => {
                            const isValid = await Promise
                                .all(
                                    fieldsInCurrentStep.map((field) => trigger(field))
                                )
                                .then((results) => results.every((result) => result)
                            )

                            console.log(isValid)

                            if (isValid) {
                                stepper.next()
                            }
                        }}
                    >
                        <span className="align-middle d-sm-inline-block d-none">Next</span>
                        <ArrowRight size={14} className="align-middle ms-sm-25 ms-0"></ArrowRight>
                    </Button>

                </div>

            </Row>
        )
    }

    function Step5Content({ control, errors }) {

        const fieldsInCurrentStep = [
            'popliteal_right_lower_extremity_id',
            'popliteal_left_lower_extremity_id',
            'posterior_tibialis_right_lower_extremity_id',
            'posterior_tibialis_left_lower_extremity_id',
            'dorsalis_pedis_right_lower_extremity_id',
            'dorsalis_pedis_left_lower_extremity_id',
            'additional_comments'
        ]

        return (
            <Row>
                <Col className="col-md-6 mb-1">
                    <Label className="form-label" for="popliteal_right_lower_extremity_id">Popliteal Right Lower Extremity Id </Label>

                    <Controller
                        name="popliteal_right_lower_extremity_id"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="select"
                                id="popliteal_right_lower_extremity_id"
                                invalid={errors.popliteal_right_lower_extremity_id && true}
                                {...field}
                            >
                                {lower_extremity_pulse_options.map &&
                                    lower_extremity_pulse_options.map((item, index) => (
                                        <option value={item.value} key={item.value}>
                                            {item.label}
                                        </option>
                                    ))}
                            </Input>
                        )}
                    />
                    {errors.popliteal_right_lower_extremity_id && (
                        <FormFeedback>{errors.popliteal_right_lower_extremity_id.message}</FormFeedback>
                    )}
                </Col>

                <Col className="col-md-6 mb-1">
                    <Label className="form-label" for="popliteal_left_lower_extremity_id">Popliteal Left Lower Extremity Id </Label>

                    <Controller
                        name="popliteal_left_lower_extremity_id"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="select"
                                id="popliteal_left_lower_extremity_id"
                                invalid={errors.popliteal_left_lower_extremity_id && true}
                                {...field}
                            >
                                {lower_extremity_pulse_options.map &&
                                    lower_extremity_pulse_options.map((item, index) => (
                                        <option value={item.value} key={item.value}>
                                            {item.label}
                                        </option>
                                    ))}
                            </Input>
                        )}
                    />
                    {errors.popliteal_left_lower_extremity_id && (
                        <FormFeedback>{errors.popliteal_left_lower_extremity_id.message}</FormFeedback>
                    )}
                </Col>

                <Col className="col-md-6 mb-1">
                    <Label className="form-label" for="posterior_tibialis_right_lower_extremity_id">Posterior Tibialis Right Lower Extremity Id </Label>

                    <Controller
                        name="posterior_tibialis_right_lower_extremity_id"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="select"
                                id="posterior_tibialis_right_lower_extremity_id"
                                invalid={errors.posterior_tibialis_right_lower_extremity_id && true}
                                {...field}
                            >
                                {lower_extremity_pulse_options.map &&
                                    lower_extremity_pulse_options.map((item, index) => (
                                        <option value={item.value} key={item.value}>
                                            {item.label}
                                        </option>
                                    ))}
                            </Input>
                        )}
                    />
                    {errors.posterior_tibialis_right_lower_extremity_id && (
                        <FormFeedback>{errors.posterior_tibialis_right_lower_extremity_id.message}</FormFeedback>
                    )}
                </Col>

                <Col className="col-md-6 mb-1">
                    <Label className="form-label" for="posterior_tibialis_left_lower_extremity_id">Posterior Tibialis Left Lower Extremity Id </Label>

                    <Controller
                        name="posterior_tibialis_left_lower_extremity_id"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="select"
                                id="posterior_tibialis_left_lower_extremity_id"
                                invalid={errors.posterior_tibialis_left_lower_extremity_id && true}
                                {...field}
                            >
                                {lower_extremity_pulse_options.map &&
                                    lower_extremity_pulse_options.map((item, index) => (
                                        <option value={item.value} key={item.value}>
                                            {item.label}
                                        </option>
                                    ))}
                            </Input>
                        )}
                    />
                    {errors.posterior_tibialis_left_lower_extremity_id && (
                        <FormFeedback>{errors.posterior_tibialis_left_lower_extremity_id.message}</FormFeedback>
                    )}
                </Col>

                <Col className="col-md-6 mb-1">
                    <Label className="form-label" for="dorsalis_pedis_right_lower_extremity_id">Dorsalis Pedis Right Lower Extremity Id </Label>

                    <Controller
                        name="dorsalis_pedis_right_lower_extremity_id"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="select"
                                id="dorsalis_pedis_right_lower_extremity_id"
                                invalid={errors.dorsalis_pedis_right_lower_extremity_id && true}
                                {...field}
                            >
                                {lower_extremity_pulse_options.map &&
                                    lower_extremity_pulse_options.map((item, index) => (
                                        <option value={item.value} key={item.value}>
                                            {item.label}
                                        </option>
                                    ))}
                            </Input>
                        )}
                    />
                    {errors.dorsalis_pedis_right_lower_extremity_id && (
                        <FormFeedback>{errors.dorsalis_pedis_right_lower_extremity_id.message}</FormFeedback>
                    )}
                </Col>

                <Col className="col-md-6 mb-1">
                    <Label className="form-label" for="dorsalis_pedis_left_lower_extremity_id">Dorsalis Pedis Left Lower Extremity Id </Label>

                    <Controller
                        name="dorsalis_pedis_left_lower_extremity_id"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="select"
                                id="dorsalis_pedis_left_lower_extremity_id"
                                invalid={errors.dorsalis_pedis_left_lower_extremity_id && true}
                                {...field}
                            >
                                {lower_extremity_pulse_options.map &&
                                    lower_extremity_pulse_options.map((item, index) => (
                                        <option value={item.value} key={item.value}>
                                            {item.label}
                                        </option>
                                    ))}
                            </Input>
                        )}
                    />
                    {errors.dorsalis_pedis_left_lower_extremity_id && (
                        <FormFeedback>{errors.dorsalis_pedis_left_lower_extremity_id.message}</FormFeedback>
                    )}
                </Col>

                <Col md="6" className="mb-1">
                    <Label className="form-label" for="additional_comments">Additional Comments </Label>

                    <Controller
                        id="additional_comments"
                        name="additional_comments"
                        control={control}
                        render={({ field }) => (
                            <Input invalid={errors.additional_comments && true} {...field} />
                        )}
                    />
                    {errors.additional_comments && (
                        <FormFeedback>{errors.additional_comments.message}</FormFeedback>
                    )}
                </Col>

                <div className="d-flex justify-content-between">
                    <Button
                        color="secondary"
                        className="btn-prev"
                        outline
                        onClick={() => stepper.previous()} // Navigate to the previous step
                    >
                        <ArrowLeft size={14} className="align-middle me-sm-25 me-0"></ArrowLeft>
                        <span className="align-middle d-sm-inline-block d-none">Previous</span>
                    </Button>
                    <Button
                        type="button"
                        color="primary"
                        className="btn-next"
                        onClick={async () => {
                            const isValid = await Promise
                                .all(
                                    fieldsInCurrentStep.map((field) => trigger(field))
                                )
                                .then((results) => results.every((result) => result)
                            )

                            console.log(isValid)

                            if (isValid) {
                                stepper.next()
                            }
                        }}
                    >
                        <span className="align-middle d-sm-inline-block d-none">Submit</span>
                        <ArrowRight size={14} className="align-middle ms-sm-25 ms-0"></ArrowRight>
                    </Button>

                </div>

            </Row>
        )
    }

    const steps = [
        {
            id: "lea1",
            title: "First Section",
            subtitle: "Enter the Information Details.",
            content: <Step1Content control={control} errors={errors} />
        },
        {
            id: "lea2",
            title: "Second Section",
            subtitle: "Enter the Information Details.",
            content: <Step2Content control={control} errors={errors} />
        },
        {
            id: "lea3",
            title: "Third Section",
            subtitle: "Enter the Information Details.",
            content: <Step3Content control={control} errors={errors} />
        },
        {
            id: "lea4",
            title: "Fourth Section",
            subtitle: "Enter the Information Details.",
            content: <Step4Content control={control} errors={errors} />
        },
        {
            id: "lea5",
            title: "Fifth Section",
            subtitle: "Enter the Information Details.",
            content: <Step5Content control={control} errors={errors} />
        }
    ]

    return (
        <>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <Wizard
                        ref={wizardRef}
                        type="vertical"
                        steps={steps}
                        options={{
                            linear: false,
                        }}
                        instance={(el) => setStepper(el)}
                    />

                </Row>
            </Form>
        </>
    );

}

export default EditPatientLowerExtremitiesAssessment;