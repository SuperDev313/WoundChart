// ** React Import
import React, { Fragment, useState, useEffect } from "react";
import useApi from "../../../api/useApi";
// ** Utils
import { isObjEmpty, isValidDate, minDateOfBirth } from "@utils";
import classnames from "classnames";
// ** Third Party Components
import * as yup from "yup";
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useParams } from "react-router-dom";
// ** Custom Components
import { DefaultLoader } from "../../../components/spinner/LoadingSpinner";
import UILoader from "../../../components/ui-loader";
// ** Utils
import { showAlertError } from "../../../components/alerts/AlertUtils";
import { getDateTimeLocal, transformValue } from "../../../utility/Utils";

// ** Third Party Components
import toast from "react-hot-toast";
// ** Reactstrap Imports
import {
    Button,
    Modal,
    ModalBody,
    ModalHeader,
    Form,
    Label,
    Input,
    Row,
    Col,
    FormFeedback,
    InputGroup,
    InputGroupText,
} from "reactstrap";

import { dateToISOString } from "../../../utility/Utils";
import SwitchControl from '../../../components/forms/SwitchControl';

const MessageDialog = ({ open, doTogglePopup, recordId, doHandleSaveAndClosePopup }) => {


    const [loading, setLoading] = useState(false);
    const [clinics, setClinics] = useState([{ label: "", value: "" }]);

    const formSchema = yup.object().shape({
        clinic_id: yup
            .number().transform((value) => (isNaN(value) || value === null || value === undefined) ? null : value).notRequired().label("ClinicId"),
        message: yup
            .string().max(50).notRequired().label("Message"),

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

        if (recordId > 0) {
            useApi
                .get(`/all_messages/${recordId}`, {})
                .then((res) => {
                    const data = res.data.data;
                    setValue("clinic_id", isNaN(data.clinic_id) ? null : parseInt(data.clinic_id));
                    setValue("message", data.message);
                    setLoading(false);
                })
                .catch((err) => {
                    showAlertError(err);
                    setLoading(false);
                });

        }
        else {
            setValue("clinic_id", null);
            setValue("message", null);
        }
    }, [recordId]);

    React.useEffect(() => {

        useApi
            .get("/lookup/clinics", {})
            .then((res) => {
                var items = [{ text: "", value: "" }];
                res.data.data.map((r) => {
                    const option = { label: r.name, value: r.id };
                    items.push(option);
                    return option;
                });
                setClinics(items);
            })
            .catch((err) => {
                showAlertError(err);
            });


    }, []);

    const onSubmit = (data, isValid) => {
        console.log(errors)
        if (isValid) {
            setLoading(true);
            useApi
                .doRun(recordId > 0 ? "put" : "post", `/all_messages/${recordId}`, {
                    clinic_id: isNaN(data.clinic_id) ? null : parseInt(data.clinic_id),
                    message: data.message,
                })
                .then((res) => {
                    toast("Message Saved Successfully!");
                    doHandleSaveAndClosePopup();
                    setLoading(false);
                })
                .catch((err) => {
                    setLoading(false);
                    showAlertError(err);
                });
        }
    }


    const doSubmit = async () => {
        const result = await trigger()

        onSubmit(getValues(), result)
    }


    return (
        <Modal
            isOpen={open}
            className="modal-dialog-centered modal-lg"
            toggle={doTogglePopup}
        >
            <UILoader blocking={loading} loader={<DefaultLoader />}>
                <ModalHeader
                    className="bg-transparent"
                    toggle={doTogglePopup}
                ></ModalHeader>
                <ModalBody className="px-5 pb-5">
                    <div className='text-center mb-4'>
                        <h1>Add New Message</h1>
                        <p>Enter the values to continue</p>
                    </div>

                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
 

                            <Col className="col-md-6 mb-1">
                                <Label className="form-label" for="clinic_id">Clinic Id </Label>

                                <Controller
                                    name="clinic_id"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="select"
                                            id="clinic_id"
                                            invalid={errors.clinic_id && true}
                                            {...field}
                                        >
                                            {clinics.map &&
                                                clinics.map((item, index) => (
                                                    <option value={item.value} key={item.value}>
                                                        {item.label}
                                                    </option>
                                                ))}
                                        </Input>
                                    )}
                                />
                                {errors.clinic_id && (
                                    <FormFeedback>{errors.clinic_id.message}</FormFeedback>
                                )}
                            </Col>

                            <Col md="6" className="mb-1">
                                <Label className="form-label" for="message">Message </Label>

                                <Controller
                                    id="message"
                                    name="message"
                                    control={control}
                                    render={({ field: { onBlur, value, ...field } }) => (
                                        <Input invalid={errors.message && true} {...field}
                                            value={value} />
                                    )}
                                />

                                {errors.message && (
                                    <FormFeedback>{errors.message.message}</FormFeedback>
                                )}
                            </Col>


                        </Row>

                    </Form>

                    <Button type="button" className="me-1" color="primary" onClick={() => doSubmit()}>
                        Submit
                    </Button>
                    <Button
                        type="reset"
                        color="secondary"
                        outline
                        onClick={doTogglePopup}
                    >
                        Cancel
                    </Button>
                </ModalBody>
            </UILoader>
        </Modal>
    );
};

export default MessageDialog;