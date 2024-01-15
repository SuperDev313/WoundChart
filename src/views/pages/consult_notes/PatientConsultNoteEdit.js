
// ** React Imports
import React, { Fragment, useState, useEffect } from "react";
import useApi from "../../../api/useApi";
// ** Utils
import { isObjEmpty, isValidDate, minDateOfBirth } from "@utils";

// ** Third Party Components
import * as yup from "yup";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { getDateTimeLocal, transformValue } from "../../../utility/Utils";
import { X, Plus } from 'react-feather'

// ** Reactstrap Imports
import {
    Form,
    Label,
    Input,
    Row,
    Col,
    Button,
    FormFeedback,
    Card, CardHeader, CardBody, CardText,
} from "reactstrap";

const PatientConsultNoteEdit = ({ id, formData, doSubmit, callBack }) => {

    const formSchema = yup.object().shape({
        data_date: yup
            .date()
            .required("Visit Date is required.")
            .label("Visit Date")
            .max(new Date(), 'Visit Date must be today or earlier'),
        patient_id: yup
            .number().transform((value) => ((isNaN(value) || value === null || value === undefined) ? null : value)).notRequired().label("Patient"),
        chief_complaint: yup
            .string().notRequired().label("Chief Complaint"),
        assessment: yup
            .string().notRequired().label("Assessment"),
        comments: yup
            .string().trim().required().label("Comments"),
        ckd_id: yup
            .string().trim().notRequired().label("CKD"),
        stage_id: yup
            .string().trim().notRequired().label("Stage"),
        dialysis_id: yup
            .string().trim().notRequired().label("Dialysis"),
        glomerular_filtration_rate: yup
            .string().trim().notRequired().label("Glomerular Filtration Rate"),
        laboratories: yup.array().of(
            yup.object().shape({
                id: yup.number(),
                laboratory: yup.string().required("Laboratory is required"),
            })
        ),
        recomendations: yup.array().of(
            yup.object().shape({
                id: yup.number(),
                recommendation: yup.string().required("Recomendation is required"),
            })
        )

    });


    // ** Hooks
    const {
        trigger,
        control,
        setValue,
        getValues,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(formSchema) });

    React.useEffect(() => {
        const fetchFormData = () => {
            setValue("data_date", getDateTimeLocal(formData.data_date));
            setValue("patient_id", isNaN(formData.patient_id) ? "" : formData.patient_id);
            setValue("chief_complaint", formData.chief_complaint);
            setValue("assessment", formData.assessment);
            setValue("comments", formData.comments);
            setValue("laboratories", formData.laboratories);
            setValue("recomendations", formData.recomendations);

        };
        if (formData) {
            fetchFormData();
        }
    }, [formData]);

    const {
        fields: laboratoryFields,
        append: addLaboratory,
        remove: removeLaboratory
    } = useFieldArray({ control, name: "laboratories" });

    const {
        fields: recomendaTionFields,
        append: addRecommendation,
        remove: removeRecommendation
    } = useFieldArray({ control, name: "recomendations" });

    const [today] = useState(new Date().toISOString().substr(0, 10));

    const ckd_options = [
        { label: "Yes", value: 1 },
        { label: "No", value: 2 },
    ];

    const dialysis_options = [
        { label: "Yes", value: 1 },
        { label: "No", value: 2 },
    ];

    const stage_options = [
        { label: "I", value: 1 },
        { label: "II", value: 2 },
        { label: "III", value: 3 },
        { label: "IV", value: 4 },
    ];
    

    React.useEffect(() => {
        const doRun = async () => {
            const result = await trigger()
            callBack(getValues(), result)
        }
        if (doSubmit) {
            doRun()
        }

    }, [doSubmit])

    const onSubmit = (data) => {
        callBack(data, isObjEmpty(errors))
    }


    console.log("errors:", errors);


    return (
        <>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <Col md="12" className="mb-1">
                        <Label className="form-label" for="data_date">Date of Assessment</Label>

                        <Controller
                            id="data_date"
                            name="data_date"
                            control={control}
                            render={({ field }) => (

                                <Input
                                    maxDate={today}
                                    type="datetime-local"
                                    invalid={errors.data_date && true}
                                    {...field}
                                />
                            )}
                        />
                        {errors.data_date && (
                            <FormFeedback>{errors.data_date.message}</FormFeedback>
                        )}
                    </Col>
                    <Col md="6" className="mb-1">
                        <Col md="12" className="mb-1">
                            <Label className="form-label" for="chief_complaint">Chief Complaint </Label>

                            <Controller
                                id="chief_complaint"
                                name="chief_complaint"
                                control={control}
                                render={({ field: { onBlur, value, ...field } }) => (
                                    <Input invalid={errors.chief_complaint && true} {...field}
                                        value={value} />
                                )}
                            />

                            {errors.chief_complaint && (
                                <FormFeedback>{errors.chief_complaint.message}</FormFeedback>
                            )}
                        </Col>
                        <Col md="12" className="mb-1">
                            <Label className="form-label" for="assessment">Assessment </Label>

                            <Controller
                                id="assessment"
                                name="assessment"
                                control={control}
                                render={({ field: { onBlur, value, ...field } }) => (
                                    <Input invalid={errors.assessment && true} {...field}
                                        value={value} />
                                )}
                            />

                            {errors.assessment && (
                                <FormFeedback>{errors.assessment.message}</FormFeedback>
                            )}
                        </Col>
                        <Col md="12" className="mb-1">
                            <Label className="form-label" for="sensory_perception_id">CKD</Label>

                            <Controller
                                name="ckd"
                                id="ckd"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="select"
                                        id="sensory_perception_id"
                                        invalid={errors.ckd_id && true}
                                        {...field}
                                    >
                                        {ckd_options.map &&
                                            ckd_options.map((item, index) => (
                                                <option value={item.value} key={item.value}>
                                                    {item.label}
                                                </option>
                                            ))}
                                    </Input>
                                )}
                            />
                            {errors.sensory_perception_id && (
                                <FormFeedback>{errors.sensory_perception_id.message}</FormFeedback>
                            )}
                        </Col>
                        <Col md="12" className="mb-1">
                            <Label className="form-label" for="sensory_perception_id">Stage</Label>

                            <Controller
                                name="stage_id"
                                id="stage_id"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="select"
                                        id="stage_id"
                                        invalid={errors.stage_id && true}
                                        {...field}
                                    >
                                        {stage_options.map &&
                                            stage_options.map((item, index) => (
                                                <option value={item.value} key={item.value}>
                                                    {item.label}
                                                </option>
                                            ))}
                                    </Input>
                                )}
                            />
                            {errors.sensory_perception_id && (
                                <FormFeedback>{errors.sensory_perception_id.message}</FormFeedback>
                            )}
                        </Col>
                        <Col md="12" className="mb-1">
                            <Label className="form-label" for="sensory_perception_id">Dialysis</Label>

                            <Controller
                                name="dialysis_id"
                                id="dialysis_id"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="select"
                                        id="dialysis_id"
                                        invalid={errors.dialysis_id && true}
                                        {...field}
                                    >
                                        {dialysis_options.map &&
                                            dialysis_options.map((item, index) => (
                                                <option value={item.value} key={item.value}>
                                                    {item.label}
                                                </option>
                                            ))}
                                    </Input>
                                )}
                            />
                            {errors.sensory_perception_id && (
                                <FormFeedback>{errors.sensory_perception_id.message}</FormFeedback>
                            )}
                        </Col>
                    </Col>
                    <Col md="6" className="mb-1">
                        <Card>
                            <CardHeader>
                                <h4 className='card-title'>Labs</h4>
                            </CardHeader>
                            <CardBody>
                                {laboratoryFields.map((item, i) => (
                                    <span key={item.id} >
                                        <Row className='row-container justify-content-between align-items-center'>
                                            <Col md={10} className='mb-md-0 mb-1'>
                                                <Controller
                                                    id={`laboratories[${i}].laboratory`}
                                                    name={`laboratories[${i}].laboratory`}
                                                    control={control}
                                                    render={({ field: { onBlur, value, ...field } }) => (
                                                        <Input invalid={errors.laboratories?.[i]?.laboratory && true} {...field}
                                                            value={value} />
                                                    )}
                                                />

                                                {errors.laboratories?.[i]?.laboratory && (
                                                    <FormFeedback>{errors.laboratories?.[i]?.laboratory?.message}</FormFeedback>
                                                )}
                                            </Col>

                                            <Col md={2}>
                                                <Button color='danger' className='text-nowrap px-1' onClick={() => removeLaboratory(i)}  outline>
                                                    <X size={14} className='me-50' />
                                                    <span>Delete</span>
                                                </Button>
                                            </Col>
                                            <Col sm={12}>
                                                <hr />
                                            </Col>
                                        </Row>
                                    </span>
                                ))}

                                <Button className='btn-icon' color='primary' onClick={addLaboratory}>
                                    <Plus size={14} />
                                    <span className='align-middle ms-25'>Add New</span>
                                </Button>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardHeader>
                                <h4 className='card-title'>Recommendations</h4>
                            </CardHeader>
                            <CardBody>
                                {recomendaTionFields.map((item, i) => (
                                    <span key={item.id} >
                                        <Row className='row-container justify-content-between align-items-center'>
                                            <Col md={10} className='mb-md-0 mb-1'>
                                                <Controller
                                                    id={`recomendations[${i}].recommendation`}
                                                    name={`recomendations[${i}].recommendation`}
                                                    control={control}
                                                    render={({ field: { onBlur, value, ...field } }) => (
                                                        <Input invalid={errors.recomendations?.[i]?.recommendation && true} {...field}
                                                            value={value} />
                                                    )}
                                                />

                                                {errors.recomendations?.[i]?.recommendation && (
                                                    <FormFeedback>{errors.recomendations?.[i]?.recommendation?.message}</FormFeedback>
                                                )}
                                            </Col>

                                            <Col md={2}>
                                                <Button color='danger' className='text-nowrap px-1' onClick={() => removeRecommendation(i)}  outline>
                                                    <X size={14} className='me-50' />
                                                    <span>Delete</span>
                                                </Button>
                                            </Col>
                                            <Col sm={12}>
                                                <hr />
                                            </Col>
                                        </Row>
                                    </span>
                                ))}

                                <Button className='btn-icon' color='primary' onClick={addRecommendation}>
                                    <Plus size={14} />
                                    <span className='align-middle ms-25'>Add New</span>
                                </Button>
                            </CardBody>
                        </Card>
                        <Col md="12" className="mb-1">
                            <Label className="form-label" for="glomerular_filtration_rate">GFR (glomerular filtration rate) </Label>

                            <Controller
                                id="glomerular_filtration_rate"
                                name="glomerular_filtration_rate"
                                control={control}
                                render={({ field: { onBlur, value, ...field } }) => (
                                    <Input invalid={errors.glomerular_filtration_rate && true} {...field}
                                        value={value} />
                                )}
                            />

                            {errors.glomerular_filtration_rate && (
                                <FormFeedback>{errors.glomerular_filtration_rate.message}</FormFeedback>
                            )}
                        </Col>
                    </Col>

                    <Col md="12" className="mb-1">
                        <Label className="form-label" for="comments">Comments <span className="text-danger">*</span></Label>

                        <Controller
                            id="comments"
                            name="comments"
                            control={control}
                            render={({ field: { onBlur, value, ...field } }) => (
                                <Input invalid={errors.comments && true} {...field}
                                    value={value} />
                            )}
                        />

                        {errors.comments && (
                            <FormFeedback>{errors.comments.message}</FormFeedback>
                        )}
                    </Col>
                            

                </Row>

            </Form>
        </>
    );

}

export default PatientConsultNoteEdit;

