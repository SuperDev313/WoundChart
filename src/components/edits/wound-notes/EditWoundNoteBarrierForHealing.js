
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

const EditWoundNoteBarrierForHealing = ({ id, formData, doSubmit, callBack }) => {


    const [today] = useState(new Date().toISOString().substr(0, 10));

    const formSchema = yup.object().shape({
        barrier_necrosis: yup
            .bool().notRequired().label("Barrier Necrosis"),
        barrier_infection: yup
            .bool().notRequired().label("Barrier Infection"),
        barrier_haemorrhage: yup
            .bool().notRequired().label("Barrier Haemorrhage"),
        barrier_mechanical_damage: yup
            .bool().notRequired().label("Barrier Mechanical Damage"),
        barrier_diet: yup
            .bool().notRequired().label("Barrier Diet"),
        barrier_medical_conditions: yup
            .bool().notRequired().label("Barrier Medical Conditions"),
        barrier_age: yup
            .bool().notRequired().label("Barrier Age"),
        barrier_medicines: yup
            .bool().notRequired().label("Barrier Medicines"),
        barrier_smoking: yup
            .bool().notRequired().label("Barrier Smoking"),
        barrier_varicose_veins: yup
            .bool().notRequired().label("Barrier Varicose Veins"),
        barrier_dryness: yup
            .bool().notRequired().label("Barrier Dryness"),
        barrier_bedridden: yup
            .bool().notRequired().label("Barrier Bedridden"),
        barrier_diabetic: yup
            .bool().notRequired().label("Barrier Diabetic"),
        barrier_immuno: yup
            .bool().notRequired().label("Barrier Immuno"),
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

            setValue("barrier_necrosis", formData.barrier_necrosis);

            setValue("barrier_infection", formData.barrier_infection);

            setValue("barrier_haemorrhage", formData.barrier_haemorrhage);

            setValue("barrier_mechanical_damage", formData.barrier_mechanical_damage);

            setValue("barrier_diet", formData.barrier_diet);

            setValue("barrier_medical_conditions", formData.barrier_medical_conditions);

            setValue("barrier_age", formData.barrier_age);

            setValue("barrier_medicines", formData.barrier_medicines);

            setValue("barrier_smoking", formData.barrier_smoking);

            setValue("barrier_varicose_veins", formData.barrier_varicose_veins);

            setValue("barrier_dryness", formData.barrier_dryness);

            setValue("barrier_bedridden", formData.barrier_bedridden);

            setValue("barrier_diabetic", formData.barrier_diabetic);

            setValue("barrier_immuno", formData.barrier_immuno);

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
                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                            control={control}
                            name="barrier_necrosis"
                            label="Barrier Necrosis"
                            onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.barrier_necrosis && (
                            <FormFeedback>{errors.barrier_necrosis.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                            control={control}
                            name="barrier_infection"
                            label="Barrier Infection"
                            onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.barrier_infection && (
                            <FormFeedback>{errors.barrier_infection.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                            control={control}
                            name="barrier_haemorrhage"
                            label="Barrier Haemorrhage"
                            onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.barrier_haemorrhage && (
                            <FormFeedback>{errors.barrier_haemorrhage.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                            control={control}
                            name="barrier_mechanical_damage"
                            label="Barrier Mechanical Damage"
                            onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.barrier_mechanical_damage && (
                            <FormFeedback>{errors.barrier_mechanical_damage.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                            control={control}
                            name="barrier_diet"
                            label="Barrier Diet"
                            onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.barrier_diet && (
                            <FormFeedback>{errors.barrier_diet.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                            control={control}
                            name="barrier_medical_conditions"
                            label="Barrier Medical Conditions"
                            onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.barrier_medical_conditions && (
                            <FormFeedback>{errors.barrier_medical_conditions.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                            control={control}
                            name="barrier_age"
                            label="Barrier Age"
                            onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.barrier_age && (
                            <FormFeedback>{errors.barrier_age.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                            control={control}
                            name="barrier_medicines"
                            label="Barrier Medicines"
                            onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.barrier_medicines && (
                            <FormFeedback>{errors.barrier_medicines.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                            control={control}
                            name="barrier_smoking"
                            label="Barrier Smoking"
                            onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.barrier_smoking && (
                            <FormFeedback>{errors.barrier_smoking.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                            control={control}
                            name="barrier_varicose_veins"
                            label="Barrier Varicose Veins"
                            onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.barrier_varicose_veins && (
                            <FormFeedback>{errors.barrier_varicose_veins.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                            control={control}
                            name="barrier_dryness"
                            label="Barrier Dryness"
                            onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.barrier_dryness && (
                            <FormFeedback>{errors.barrier_dryness.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                            control={control}
                            name="barrier_bedridden"
                            label="Barrier Bedridden"
                            onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.barrier_bedridden && (
                            <FormFeedback>{errors.barrier_bedridden.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                            control={control}
                            name="barrier_diabetic"
                            label="Barrier Diabetic"
                            onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.barrier_diabetic && (
                            <FormFeedback>{errors.barrier_diabetic.message}</FormFeedback>
                        )}
                    </Col>

                    <Col xl='6' xs='6'>
                        <Row tag='dl' className='mb-0'>
                            <SwitchControl
                            control={control}
                            name="barrier_immuno"
                            label="Barrier Immuno"
                            onValueChange={checkBoxValueChange}
                            />
                        </Row>
                        {errors.barrier_immuno && (
                            <FormFeedback>{errors.barrier_immuno.message}</FormFeedback>
                        )}
                    </Col>

                </Row>

            </Form>
        </>
    );

}
export default EditWoundNoteBarrierForHealing;