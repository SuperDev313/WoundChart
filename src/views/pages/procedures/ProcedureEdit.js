
// ** React Imports
import React, { Fragment, useState, useEffect } from "react";
import useApi from "../../../api/useApi";
// ** Utils
import { isObjEmpty, isValidDate, minDateOfBirth } from "@utils";

// ** Third Party Components
import * as yup from "yup";
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import MyCleave from "../../../components/forms/MyCleave";

import { getDateTimeLocal, transformValue } from "../../../utility/Utils";
// ** Utils
import FileUploaderSingle from "../../../components/upload-files/FileUploaderSingle";
import { showAlertError } from "../../../components/alerts/AlertUtils";



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

const ProcedureEdit = ({ id, formData, doSubmit, callBack }) => {

    const [today] = useState(new Date().toISOString().substr(0, 10))
    const [loading, setLoading] = useState(false);
    const [locations, setLocations] = useState([{ label: "", value: "" }]);

    const formSchema = yup.object().shape({
        procedure_date: yup
            .date()
            .required("Procedure Date is required.")
            .label("Procedure Date")
            .transform((value) => (isValidDate(value) ? value : null))
            .max(new Date(), 'Procedure Date must be today or earlier')
            .min(minDateOfBirth(), 'Invalid Procedure Date'),
        location_id: yup
            .number()
            .transform((value) => ((isNaN(value) || value === null || value === undefined) ? null : value))
            .notRequired()
            .label("Location ID"),
        procedure_performed: yup
            .string()
            .max(5000)
            .trim()
            .required()
            .label("Procedure Performed"),
        indication: yup
            .string()
            .max(5000)
            .trim()
            .notRequired()
            .label("Indication"),
        anesthesia: yup
            .string()
            .max(512)
            .trim()
            .notRequired()
            .label("Anesthesia"),
        description: yup
            .string()
            .max(5000)
            .trim()
            .notRequired()
            .label("Description"),
        complications: yup
            .string()
            .max(5000)
            .trim()
            .notRequired()
            .label("Complications"),
        estimated_blood_loss: yup
            .string()
            .max(5000)
            .trim()
            .notRequired()
            .label("Estimated Blood Loss"),
        disposition: yup
            .string()
            .max(5000)
            .trim()
            .notRequired()
            .label("Disposition"),
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
        const fetchFormData = () => {
            setValue("procedure_date", getDateTimeLocal(formData.procedure_date));
            setValue("location_id", isNaN(formData.location_id) ? "" : formData.location_id);
            setValue("procedure_performed", formData.procedure_performed);
            setValue("indication", formData.indication);
            setValue("anesthesia", formData.anesthesia);
            setValue("description", formData.description);
            setValue("complications", formData.complications);
            setValue("estimated_blood_loss", formData.estimated_blood_loss);
            setValue("disposition", formData.disposition);
            setValue("billed_by_id", formData.billed_by_id);
            setValue("date_billed", formData.date_billed);
            setValue("clinician_id", formData.clinician_id);
            setValue("signature_physician", formData.signature_physician);
            setValue("physician_id", formData.physician_id);
            setValue("signature_date", getDateTimeLocal(formData.signature_date));

        };
        if (formData) {
            fetchFormData();
        }
    }, [formData]);

    React.useEffect(() => {

        useApi
            .get("/lookup/locations", {})
            .then((res) => {
                var items = [{ label: "", value: "" }];
                res.data.data.map((r) => {
                    const option = { label: r.name, value: r.id };
                    items.push(option);
                    return option;
                });
                setLocations(items);
            })
            .catch((err) => {
                showAlertError(err);
            });


    }, []);


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

    const handleUploadPhoto = (response) => {
        return null
    }
    return (
        <>
            <Form onSubmit={handleSubmit(onSubmit)} className="mb-1">
                <Row>


                    <Col md="12" className="mb5000">
                        <Label className="form-label" for="procedure_date"> Date of Procedure </Label>

                        <Controller
                            id="procedure_date"
                            name="procedure_date"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    maxDate={today}
                                    type="datetime-local"
                                    invalid={errors.procedure_date && true}
                                    {...field}
                                />
                            )}
                        />


                        {errors.procedure_date && (
                            <FormFeedback>{errors.procedure_date.message}</FormFeedback>
                        )}
                    </Col>

                    <Col md="6" className="mb5000">
                        <Label className="form-label" for="location_id">Location </Label>

                        <Controller
                            name="location_id"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="select"
                                    id="location_id"
                                    invalid={errors.location_id && true}
                                    {...field}
                                >
                                    {locations.map &&
                                        locations.map((item, index) => (
                                            <option value={item.value} key={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                </Input>
                            )}
                        />
                        {errors.location_id && (
                            <FormFeedback>{errors.location_id.message}</FormFeedback>
                        )}
                    </Col>

                    <Col md="6" className="mb5000">
                        <Label className="form-label" for="procedure_performed">Procedure Performed <span className="text-danger">*</span></Label>

                        <Controller
                            id="procedure_performed"
                            name="procedure_performed"
                            control={control}
                            render={({ field: { onBlur, value, ...field } }) => (
                                <Input invalid={errors.procedure_performed && true} {...field}
                                    value={value} />
                            )}
                        />

                        {errors.procedure_performed && (
                            <FormFeedback>{errors.procedure_performed.message}</FormFeedback>
                        )}
                    </Col>

                    <Col md="6" className="mb5000">
                        <Label className="form-label" for="indication">Indication </Label>

                        <Controller
                            id="indication"
                            name="indication"
                            control={control}
                            render={({ field: { onBlur, value, ...field } }) => (
                                <Input invalid={errors.indication && true} {...field}
                                    value={value} />
                            )}
                        />

                        {errors.indication && (
                            <FormFeedback>{errors.indication.message}</FormFeedback>
                        )}
                    </Col>

                    <Col md="6" className="mb5000">
                        <Label className="form-label" for="anesthesia">Anesthesia </Label>

                        <Controller
                            id="anesthesia"
                            name="anesthesia"
                            control={control}
                            render={({ field: { onBlur, value, ...field } }) => (
                                <Input invalid={errors.anesthesia && true} {...field}
                                    value={value} />
                            )}
                        />

                        {errors.anesthesia && (
                            <FormFeedback>{errors.anesthesia.message}</FormFeedback>
                        )}
                    </Col>

                    <Col md="6" className="mb5000">
                        <Label className="form-label" for="description">Description </Label>

                        <Controller
                            id="description"
                            name="description"
                            control={control}
                            render={({ field: { onBlur, value, ...field } }) => (
                                <Input invalid={errors.description && true} {...field}
                                    value={value} />
                            )}
                        />

                        {errors.description && (
                            <FormFeedback>{errors.description.message}</FormFeedback>
                        )}
                    </Col>

                    <Col md="6" className="mb5000">
                        <Label className="form-label" for="complications">Complications </Label>

                        <Controller
                            id="complications"
                            name="complications"
                            control={control}
                            render={({ field: { onBlur, value, ...field } }) => (
                                <Input invalid={errors.complications && true} {...field}
                                    value={value} />
                            )}
                        />

                        {errors.complications && (
                            <FormFeedback>{errors.complications.message}</FormFeedback>
                        )}
                    </Col>

                    <Col md="6" className="mb5000">
                        <Label className="form-label" for="estimated_blood_loss">Estimated Blood Loss </Label>

                        <Controller
                            id="estimated_blood_loss"
                            name="estimated_blood_loss"
                            control={control}
                            render={({ field: { onBlur, value, ...field } }) => (
                                <Input invalid={errors.estimated_blood_loss && true} {...field}
                                    value={value} />
                            )}
                        />

                        {errors.estimated_blood_loss && (
                            <FormFeedback>{errors.estimated_blood_loss.message}</FormFeedback>
                        )}
                    </Col>

                    <Col md="6" className="mb5000">
                        <Label className="form-label" for="disposition">Disposition </Label>

                        <Controller
                            id="disposition"
                            name="disposition"
                            control={control}
                            render={({ field: { onBlur, value, ...field } }) => (
                                <Input invalid={errors.disposition && true} {...field}
                                    value={value} />
                            )}
                        />

                        {errors.disposition && (
                            <FormFeedback>{errors.disposition.message}</FormFeedback>
                        )}
                    </Col>
                    <br/>
                    <Col className="mb-5 mt-5 mb-lg-0 drop" lg={12} sm={12} style={{ border: "1px solid", borderRadius: "8px" }}>
                        <FileUploaderSingle route="/files/upload_patient_picture" onResponseCallback={(res) => handleUploadPhoto(res)} />
                    </Col>

                    
                    </Row>
            </Form>
        </>
    );

}

export default ProcedureEdit;