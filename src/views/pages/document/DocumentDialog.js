
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

import MyCleave from "../../../components/forms/MyCleave";
import AsyncSelect from 'react-select/async'
import FileUploaderSingle from "../../../components/upload-files/FileUploaderSingle";


const PatientDocumentsViewDialog = ({ open, doTogglePopup, recordId, doHandleSaveAndClosePopup }) => {

    const [selectedPatient, setSelectedPatient] = useState(null)

    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(0);
    const [payload, setPayload] = useState({
        q: "",
        limit: 50,
        offset: page,
        sortColumn: "full_name",
        sort: "ASC",
    });

    const formSchema = yup.object().shape({
        id: yup
            .number(),
        parent_id: yup
            .number().transform((value) => (isNaN(value) || value === null || value === undefined) ? null : value).notRequired().label("ParentId"),
        file_url: yup
            .string().max(2000).notRequired().label("FileUrl"),
        title: yup
            .string().max(250).notRequired().label("Title"),
        description: yup
            .string().max(1200).notRequired().label("Description"),

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

    const getPatientsData = (q) => {
        return new Promise(resolve => {
            setLoading(true);
            useApi
                .post("/patients", {
                    q: q,
                    limit: payload.limit,
                    offset: payload.offset,
                    sortColumn: payload.sortColumn,
                    sort: payload.sort,
                })
                .then((res) => {
                    const data = res.data.data;
                    var items = [{ label: "", value: "" }];
                    data.rows.map((r) => {
                        const option = { label: r.full_name + ' [' + r.record_number + ']', value: r.id };
                        items.push(option);
                        return option;
                    });
                    resolve(() => {
                        setLoading(false);
                        return items;
                    })
                })
                .catch((err) => {
                    setLoading(false);
                    //handleError(err);
                    console.log(err)
                    resolve(() => {
                        return [{ label: "", value: "" }];
                    })

                });
        })
    }


    React.useEffect(() => {

        if (recordId > 0) {
            setValue('id', recordId)
            useApi
                .get(`/files/${recordId}`, {})
                .then((res) => {
                    const data = res.data.data;
                    setValue("parent_id", isNaN(data.parent_id) ? null : parseInt(data.parent_id));
                    setValue("name", data.name);
                    setValue("original_file_name", data.original_file_name);
                    setValue("file_url", data.file_url);
                    setValue("mime_type", data.mime_type);
                    setValue("file_size", isNaN(data.file_size) ? null : parseInt(data.file_size));
                    setValue("title", data.title);
                    setValue("description", data.description);
                    setLoading(false);
                })
                .catch((err) => {
                    showAlertError(err);
                    setLoading(false);
                });

        }
        else {
            setValue("parent_id", null);
            setValue("name", null);
            setValue("original_file_name", null);
            setValue("file_url", null);
            setValue("mime_type", null);
            setValue("file_size", null);
            setValue("title", null);
            setValue("description", null);
        }
    }, [recordId]);
 
    const onSubmit = (data, isValid) => {
        console.log('onSubmit', data)

        if (isValid) {
            setLoading(true);
            useApi
                .doRun("put", `/files/${data.id}` , {
                    parent_id: isNaN(data.parent_id) ? null : parseInt(data.parent_id),
                    title: data.title,
                    description: data.description,
                })
                .then((res) => {
                    toast("PatientDocumentsView Saved Successfully!");
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

    const handleSelectedPatient = (value) => {
        setSelectedPatient(value)

        if (value != null) {
            setValue("parent_id", value.value);
            setValue("parent_id_description", value.label);
        }
        else {
            setValue("parent_id", '');
            setValue("parent_id_description", '');
        }
    }

    const handleUploadDocument= (response) => {
        console.log('handleUploadAgencyLogo', response)
        setValue('id', response.id)
        setValue('name', 'patient_document')
        setValue('file_url', response.file_url)
        setValue('mime_type', response.content_type)
        setValue('original_file_name', response.file_name)
        setValue('file_size', response.size)
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
                        <h1>Add New PatientDocumentsView</h1>
                        <p>Enter the values to continue</p>
                    </div>

                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>

                            <Col md="12" className="mb-1">
                                <Label className="form-label" for="parent_id">Parent  </Label>
                                <Controller
                                    name="parent_id"
                                    control={control}
                                    render={({ field: { onChange, ...field } }) => (
                                        <AsyncSelect
                                            id="parent_id"
                                            invalid={errors.parent_id && true}
                                            {...field}
                                            isClearable={true}
                                            className='react-select'
                                            classNamePrefix='select'
                                            loadOptions={(v) => getPatientsData(v)}
                                            onChange={handleSelectedPatient}
                                            value={selectedPatient}
                                            cacheOptions
                                            defaultOptions
                                            isLoading={loading}
                                        />
                                    )}
                                />


                                {errors.parent_id && (
                                    <FormFeedback>{errors.parent_id.message}</FormFeedback>
                                )}
                            </Col>


                            <Col md="12" className="mb-1">
                                <Label className="form-label" for="file_url">File Url </Label>

                                <Controller
                                    id="file_url"
                                    name="file_url"
                                    control={control}
                                    render={({ field: { onBlur, value, ...field } }) => (
                                        <Input invalid={errors.file_url && true} {...field}
                                            value={value} />
                                    )}
                                />

                                {errors.file_url && (
                                    <FormFeedback>{errors.file_url.message}</FormFeedback>
                                )}
                            </Col>



                            <Col md="12" className="mb-1">
                                <Label className="form-label" for="title">Title </Label>

                                <Controller
                                    id="title"
                                    name="title"
                                    control={control}
                                    render={({ field: { onBlur, value, ...field } }) => (
                                        <Input invalid={errors.title && true} {...field}
                                            value={value} />
                                    )}
                                />

                                {errors.title && (
                                    <FormFeedback>{errors.title.message}</FormFeedback>
                                )}
                            </Col>

                            <Col md="12" className="mb-1">
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

                            <Col className='pb-2 mb-lg-0 drop ' lg={12} sm={12}>
                                <div style={{ border: '1px solid', padding: '10px', borderRadius: '8px' }}>
                                    <Label className='form-label' for='document_file'>
                                        Patient Document
                                    </Label>
                                    <FileUploaderSingle
                                        route='/files/upload/0/patient_document'
                                        autoUpload={true}
                                        onResponseCallback={(res) => handleUploadDocument(res)}
                                    />
                                </div>
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

export default PatientDocumentsViewDialog;