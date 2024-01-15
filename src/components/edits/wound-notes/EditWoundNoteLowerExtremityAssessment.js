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

const EditWoundNoteLowerExtremityAssessment = ({ id, formData, doSubmit, callBack }) => {

    const [pulse_options, setPulse_Options] = useState([{ label: "", value: "" }]);
    const [temperature_of_extremities, setTemperature_Of_Extremities] = useState([{ label: "", value: "" }]);
    const [capillary_refills, setCapillary_Refills] = useState([{ label: "", value: "" }]);
    const [plus_minus_options, setPlus_Minus_Options] = useState([{ label: "", value: "" }]);
    const [edema_options, setEdema_Options] = useState([{ label: "", value: "" }]);

    const [today] = useState(new Date().toISOString().substr(0, 10));

    const formSchema = yup.object().shape({
        dorsalis_pedis_pulses_id: yup
            .number()
            .transform((value) => (isNaN(value) || value === null || value === undefined) ? null : value)
            .notRequired().label("Dorsalis Pedis Pulses"),
        posterior_tibialis_pulses_id: yup
            .number()
            .transform((value) => (isNaN(value) || value === null || value === undefined) ? null : value).notRequired().label("Posterior Tibialis Pulses"),
        radial_pulses_id: yup
            .number()
            .transform((value) => (isNaN(value) || value === null || value === undefined) ? null : value).notRequired().label("Radial Pulses"),
        capillary_refill_id: yup
            .number()
            .transform((value) => (isNaN(value) || value === null || value === undefined) ? null : value).notRequired().label("Capillary Refill"),
        dependant_rubor_id: yup
            .number()
            .transform((value) => (isNaN(value) || value === null || value === undefined) ? null : value).notRequired().label("Dependant Rubor"),
        venous_filling_time: yup
            .string().max(100).notRequired().label("Venous Filling Time"),
        ankle_brachial_index: yup
            .string().max(100).notRequired().label("Ankle Brachial Index"),
        edema_id: yup
            .number()
            .transform((value) => (isNaN(value) || value === null || value === undefined) ? null : value).notRequired().label("Edema"),
        compression_in_use: yup
            .bool().notRequired().label("Compression In Use"),
        sensation_id: yup
            .number()
            .transform((value) => (isNaN(value) || value === null || value === undefined) ? null : value).notRequired().label("Sensation"),
        claudication_in_use: yup
            .bool().notRequired().label("Claudication In Use"),
        temperature_of_extremity_id: yup
            .number()
            .transform((value) => (isNaN(value) || value === null || value === undefined) ? null : value).notRequired().label("Temperature Of Extremity"),
        hair_growth_on_extremity: yup
            .bool().notRequired().label("Hair Growth On Extremity"),
        erythema: yup
            .bool().notRequired().label("Erythema"),
        hyperpigmentation: yup
            .bool().notRequired().label("Hyperpigmentation"),
        lipodermatosclerosis: yup
            .bool().notRequired().label("Lipodermatosclerosis"),
        varicose_veins: yup
            .bool().notRequired().label("Varicose Veins"),
        off_loading_device_in_use: yup
            .bool().notRequired().label("Off Loading Device In Use"),
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
        useApi
            .get("/lookup/pulse_options", {})
            .then((res) => {
                var items = [{ label: "", value: "" }];
                res.data.data.map((r) => {
                    const option = { label: r.description, value: r.id };
                    items.push(option);
                    return option;
                });
                setPulse_Options(items);
            })
            .catch((err) => {
                showAlertError(err);
            });
        useApi
            .get("/lookup/temperature_of_extremities", {})
            .then((res) => {
                var items = [{ label: "", value: "" }];
                res.data.data.map((r) => {
                    const option = { label: r.description, value: r.id };
                    items.push(option);
                    return option;
                });
                setTemperature_Of_Extremities(items);
            })
            .catch((err) => {
                showAlertError(err);
            });
        useApi
            .get("/lookup/capillary_refills", {})
            .then((res) => {
                var items = [{ label: "", value: "" }];
                res.data.data.map((r) => {
                    const option = { label: r.description, value: r.id };
                    items.push(option);
                    return option;
                });
                setCapillary_Refills(items);
            })
            .catch((err) => {
                showAlertError(err);
            });
        useApi
            .get("/lookup/plus_minus_options", {})
            .then((res) => {
                var items = [{ label: "", value: "" }];
                res.data.data.map((r) => {
                    const option = { label: r.description, value: r.id };
                    items.push(option);
                    return option;
                });
                setPlus_Minus_Options(items);
            })
            .catch((err) => {
                showAlertError(err);
            });
        useApi
            .get("/lookup/edema_options", {})
            .then((res) => {
                var items = [{ label: "", value: "" }];
                res.data.data.map((r) => {
                    const option = { label: r.description, value: r.id };
                    items.push(option);
                    return option;
                });
                setEdema_Options(items);
            })
            .catch((err) => {
                showAlertError(err);
            });

    }, []);

    React.useEffect(() => {
        const fetchFormData = () => {

            setValue("dorsalis_pedis_pulses_id", isNaN(formData.dorsalis_pedis_pulses_id) ? "" : formData.dorsalis_pedis_pulses_id);
            setValue("posterior_tibialis_pulses_id", isNaN(formData.posterior_tibialis_pulses_id) ? "" : formData.posterior_tibialis_pulses_id);
            setValue("radial_pulses_id", isNaN(formData.radial_pulses_id) ? "" : formData.radial_pulses_id);
            setValue("capillary_refill_id", isNaN(formData.capillary_refill_id) ? "" : formData.capillary_refill_id);
            setValue("dependant_rubor_id", isNaN(formData.dependant_rubor_id) ? "" : formData.dependant_rubor_id);
            setValue("venous_filling_time", formData.venous_filling_time);
            setValue("ankle_brachial_index", formData.ankle_brachial_index);
            setValue("edema_id", isNaN(formData.edema_id) ? "" : formData.edema_id);
            setValue("compression_in_use", formData.compression_in_use);
            setValue("sensation_id", isNaN(formData.sensation_id) ? "" : formData.sensation_id);
            setValue("claudication_in_use", formData.claudication_in_use);
            setValue("temperature_of_extremity_id", isNaN(formData.temperature_of_extremity_id) ? "" : formData.temperature_of_extremity_id);
            setValue("hair_growth_on_extremity", formData.hair_growth_on_extremity);
            setValue("erythema", formData.erythema);
            setValue("hyperpigmentation", formData.hyperpigmentation);
            setValue("lipodermatosclerosis", formData.lipodermatosclerosis);
            setValue("varicose_veins", formData.varicose_veins);
            setValue("off_loading_device_in_use", formData.off_loading_device_in_use);

        };
        if (formData){
            fetchFormData();
        }
    }, []);

    React.useEffect(() => {
        const doRun = async () => {
            const result = await trigger();

            setFieldDescription(pulse_options, "sensation_id", "sensation_id_description")
            setFieldDescription(temperature_of_extremities, "temperature_of_extremity_id", "temperature_of_extremity_id_description")
            setFieldDescription(capillary_refills, "capillary_refill_id", "capillary_refill_id_description")
            setFieldDescription(plus_minus_options, "dependant_rubor_id", "dependant_rubor_id_description")
            setFieldDescription(pulse_options, "dorsalis_pedis_pulses_id", "dorsalis_pedis_pulses_id_description")
            setFieldDescription(edema_options, "edema_id", "edema_id_description")
            setFieldDescription(pulse_options, "posterior_tibialis_pulses_id", "posterior_tibialis_pulses_id_description")
            setFieldDescription(pulse_options, "radial_pulses_id", "radial_pulses_id_description")

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

    const onSubmit = (data) => {
        callBack(data, isObjEmpty(errors))
    };

    return (
        <>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <Col className="col-md-6 mb-1">
                        <Label className="form-label" for="dorsalis_pedis_pulses_id">Dorsalis Pedis Pulses Id </Label>

                        <Controller
                            name="dorsalis_pedis_pulses_id"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="select"
                                    id="dorsalis_pedis_pulses_id"
                                    invalid={errors.dorsalis_pedis_pulses_id && true}
                                    {...field}
                                >
                                    {pulse_options.map &&
                                        pulse_options.map((item, index) => (
                                            <option value={item.value} key={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                </Input>
                            )}
                        />
                        {errors.dorsalis_pedis_pulses_id && (
                            <FormFeedback>{errors.dorsalis_pedis_pulses_id.message}</FormFeedback>
                        )}
                    </Col>

                    <Col className="col-md-6 mb-1">
                        <Label className="form-label" for="posterior_tibialis_pulses_id">Posterior Tibialis Pulses Id </Label>

                        <Controller
                            name="posterior_tibialis_pulses_id"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="select"
                                    id="posterior_tibialis_pulses_id"
                                    invalid={errors.posterior_tibialis_pulses_id && true}
                                    {...field}
                                >
                                    {pulse_options.map &&
                                        pulse_options.map((item, index) => (
                                            <option value={item.value} key={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                </Input>
                            )}
                        />
                        {errors.posterior_tibialis_pulses_id && (
                            <FormFeedback>{errors.posterior_tibialis_pulses_id.message}</FormFeedback>
                        )}
                    </Col>

                    <Col className="col-md-6 mb-1">
                        <Label className="form-label" for="radial_pulses_id">Radial Pulses Id </Label>

                        <Controller
                            name="radial_pulses_id"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="select"
                                    id="radial_pulses_id"
                                    invalid={errors.radial_pulses_id && true}
                                    {...field}
                                >
                                    {pulse_options.map &&
                                        pulse_options.map((item, index) => (
                                            <option value={item.value} key={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                </Input>
                            )}
                        />
                        {errors.radial_pulses_id && (
                            <FormFeedback>{errors.radial_pulses_id.message}</FormFeedback>
                        )}
                    </Col>

                    <Col className="col-md-6 mb-1">
                        <Label className="form-label" for="capillary_refill_id">Capillary Refill Id </Label>

                        <Controller
                            name="capillary_refill_id"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="select"
                                    id="capillary_refill_id"
                                    invalid={errors.capillary_refill_id && true}
                                    {...field}
                                >
                                    {capillary_refills.map &&
                                        capillary_refills.map((item, index) => (
                                            <option value={item.value} key={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                </Input>
                            )}
                        />
                        {errors.capillary_refill_id && (
                            <FormFeedback>{errors.capillary_refill_id.message}</FormFeedback>
                        )}
                    </Col>

                    <Col className="col-md-6 mb-1">
                        <Label className="form-label" for="dependant_rubor_id">Dependant Rubor Id </Label>

                        <Controller
                            name="dependant_rubor_id"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="select"
                                    id="dependant_rubor_id"
                                    invalid={errors.dependant_rubor_id && true}
                                    {...field}
                                >
                                    {plus_minus_options.map &&
                                        plus_minus_options.map((item, index) => (
                                            <option value={item.value} key={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                </Input>
                            )}
                        />
                        {errors.dependant_rubor_id && (
                            <FormFeedback>{errors.dependant_rubor_id.message}</FormFeedback>
                        )}
                    </Col>

                    <Col md="6" className="mb-1">
                        <Label className="form-label" for="venous_filling_time">Venous Filling Time </Label>

                        <Controller
                            id="venous_filling_time"
                            name="venous_filling_time"
                            control={control}
                            render={({ field }) => (
                                <Input invalid={errors.venous_filling_time && true} {...field} />
                            )}
                        />
                        {errors.venous_filling_time && (
                            <FormFeedback>{errors.venous_filling_time.message}</FormFeedback>
                        )}
                    </Col>

                    <Col md="6" className="mb-1">
                        <Label className="form-label" for="ankle_brachial_index">Ankle Brachial Index </Label>

                        <Controller
                            id="ankle_brachial_index"
                            name="ankle_brachial_index"
                            control={control}
                            render={({ field }) => (
                                <Input invalid={errors.ankle_brachial_index && true} {...field} />
                            )}
                        />
                        {errors.ankle_brachial_index && (
                            <FormFeedback>{errors.ankle_brachial_index.message}</FormFeedback>
                        )}
                    </Col>

                    <Col className="col-md-6 mb-1">
                        <Label className="form-label" for="edema_id">Edema  </Label>

                        <Controller
                            name="edema_id"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="select"
                                    id="edema_id"
                                    invalid={errors.edema_id && true}
                                    {...field}
                                >
                                    {edema_options.map &&
                                        edema_options.map((item, index) => (
                                            <option value={item.value} key={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                </Input>
                            )}
                        />
                        {errors.edema_id && (
                            <FormFeedback>{errors.edema_id.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                            control={control}
                            name="compression_in_use"
                            label="Compression In Use"
                            onValueChange={checkBoxValueChange}
                            sm="6"
                            />
                        </Row>
                        {errors.compression_in_use && (
                            <FormFeedback>{errors.compression_in_use.message}</FormFeedback>
                        )}
                    </Col>


                    <Col className="col-md-6 mb-1">
                        <Label className="form-label" for="sensation_id">Sensation </Label>

                        <Controller
                            name="sensation_id"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="select"
                                    id="sensation_id"
                                    invalid={errors.sensation_id && true}
                                    {...field}
                                >
                                    {pulse_options.map &&
                                        pulse_options.map((item, index) => (
                                            <option value={item.value} key={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                </Input>
                            )}
                        />
                        {errors.sensation_id && (
                            <FormFeedback>{errors.sensation_id.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                                control={control}
                                name="claudication_in_use"
                                label="Claudication In Use"
                                onValueChange={checkBoxValueChange}
                                sm="6"
                            />
                        </Row>
                        {errors.claudication_in_use && (
                            <FormFeedback>{errors.claudication_in_use.message}</FormFeedback>
                        )}
                    </Col>

                    <Col className="col-md-6 mb-1">
                        <Label className="form-label" for="temperature_of_extremity_id">Temperature Of Extremity Id </Label>

                        <Controller
                            name="temperature_of_extremity_id"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="select"
                                    id="temperature_of_extremity_id"
                                    invalid={errors.temperature_of_extremity_id && true}
                                    {...field}
                                >
                                    {temperature_of_extremities.map &&
                                        temperature_of_extremities.map((item, index) => (
                                            <option value={item.value} key={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                </Input>
                            )}
                        />
                        {errors.temperature_of_extremity_id && (
                            <FormFeedback>{errors.temperature_of_extremity_id.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                                control={control}
                                name="hair_growth_on_extremity"
                                label="Hair Growth On Extremity"
                                onValueChange={checkBoxValueChange}
                                sm='6'
                            />
                        </Row>
                        {errors.temperature_of_extremity_id && (
                            <FormFeedback>{errors.temperature_of_extremity_id.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                                control={control}
                                name="hair_growth_on_extremity"
                                label="Hair Growth On Extremity"
                                onValueChange={checkBoxValueChange}
                                sm='6'
                            />
                        </Row>
                        {errors.hair_growth_on_extremity && (
                            <FormFeedback>{errors.hair_growth_on_extremity.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                                control={control}
                                name="erythema"
                                label="Erythema"
                                onValueChange={checkBoxValueChange}
                                sm='6'
                            />
                        </Row>
                        {errors.erythema && (
                            <FormFeedback>{errors.erythema.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                                control={control}
                                name="hyperpigmentation"
                                label="Hyperpigmentation"
                                onValueChange={checkBoxValueChange}
                                sm='6'
                            />
                        </Row>
                        {errors.hyperpigmentation && (
                            <FormFeedback>{errors.hyperpigmentation.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                                control={control}
                                name="lipodermatosclerosis"
                                label="Lipodermatosclerosis"
                                onValueChange={checkBoxValueChange}
                                sm='6'
                            />
                        </Row>
                        {errors.lipodermatosclerosis && (
                            <FormFeedback>{errors.lipodermatosclerosis.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                                control={control}
                                name="varicose_veins"
                                label="Varicose Veins"
                                onValueChange={checkBoxValueChange}
                                sm='6'
                            />
                        </Row>
                        {errors.varicose_veins && (
                            <FormFeedback>{errors.varicose_veins.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                                control={control}
                                name="off_loading_device_in_use"
                                label="Off Loading Device In Use"
                                onValueChange={checkBoxValueChange}
                                sm='6'
                            />
                        </Row>
                        {errors.off_loading_device_in_use && (
                            <FormFeedback>{errors.off_loading_device_in_use.message}</FormFeedback>
                        )}
                    </Col>
                </Row>

            </Form>
        </>
    );

}
export default EditWoundNoteLowerExtremityAssessment;