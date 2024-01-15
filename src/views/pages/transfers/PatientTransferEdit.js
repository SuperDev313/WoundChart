

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

const PatientTransferEdit = ({ id, formData, doSubmit, callBack }) => {

    const [today] = useState(new Date().toISOString().substr(0, 10))

    const [transfer_place_options, setTransfer_Place_Options] = useState([{ label: "", value: "" }]);


    const formSchema = yup.object().shape({
        patient_id: yup
            .number().transform((value) => ((isNaN(value) || value === null || value === undefined) ? null : value)).notRequired().label("Patient"),
        transfer_place_id: yup
            .number().transform((value) => ((isNaN(value) || value === null || value === undefined) ? null : value)).notRequired().label("Transfer Place"),
        comments: yup
            .string().max(5000).notRequired().label("Comments"),
        transfer_date: yup
            .string().max(50).notRequired().label("Transfer Date"),

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
            setValue("patient_id", isNaN(formData.patient_id) ? "" : formData.patient_id);
            setValue("transfer_place_id", isNaN(formData.transfer_place_id) ? "" : formData.transfer_place_id);
            setValue("comments", formData.comments);
            setValue("transfer_date", getDateTimeLocal(formData.transfer_date));
        };
        if (formData) {
            fetchFormData();
        }
    }, [formData]);

    React.useEffect(() => {
        useApi
            .get("/lookup/transfer_place_options", {})
            .then((res) => {
                var items = [{ text: "", value: "" }];
                res.data.data.map((r) => {
                    const option = { label: r.description, value: r.id };
                    items.push(option);
                    return option;
                });
                setTransfer_Place_Options(items);
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

    return (
        <>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>

                    <Col md="6" className="mb-1">
                        <Label className="form-label" for="transfer_date">Transfer Date </Label>
                        <Controller
                            id="transfer_date"
                            name="transfer_date"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    maxDate={today}
                                    type="datetime-local"
                                    invalid={errors.transfer_date && true}
                                    {...field}
                                />
                            )}
                        />

                        {errors.transfer_date && (
                            <FormFeedback>{errors.transfer_date.message}</FormFeedback>
                        )}
                    </Col>


                    <Col className="col-md-6 mb-1">
                        <Label className="form-label" for="transfer_place_id">Transfer Place</Label>

                        <Controller
                            name="transfer_place_id"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="select"
                                    id="transfer_place_id"
                                    invalid={errors.transfer_place_id && true}
                                    {...field}
                                >
                                    {transfer_place_options.map &&
                                        transfer_place_options.map((item, index) => (
                                            <option value={item.value} key={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                </Input>
                            )}
                        />
                        {errors.transfer_place_id && (
                            <FormFeedback>{errors.transfer_place_id.message}</FormFeedback>
                        )}
                    </Col>

                    <Col md="6" className="mb-1">
                        <Label className="form-label" for="comments">Comments </Label>

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

export default PatientTransferEdit;
