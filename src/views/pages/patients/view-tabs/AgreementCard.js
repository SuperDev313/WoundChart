// ** React Import
import React, { Fragment, useState, useEffect } from "react";
import useApi from "../../../../api/useApi";
// ** Utils
import { isObjEmpty, isValidDate, minDateOfBirth } from "@utils";
import classnames from "classnames";
// ** Third Party Components
import * as yup from "yup";
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useParams } from "react-router-dom";
// ** Custom Components
import { DefaultLoader } from "../../../../components/spinner/LoadingSpinner";
import UILoader from "../../../../components/ui-loader";
// ** Utils
import { showAlertError } from "../../../../components/alerts/AlertUtils";
import WarningAlert from "../../../../components/alerts/Alert";
import { FaTrashCan } from "react-icons/fa6";

// ** Third Party Components
import toast from "react-hot-toast";
import SignatureCanvas from "react-signature-canvas";

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
    Alert,
    FormFeedback,
    InputGroup,
    InputGroupText,
    Card,
    CardHeader,
    CardTitle,
    CardBody,
    CardText
} from "reactstrap";

import { dateToISOString } from "../../../../utility/Utils";
import SwitchControl from '../../../../components/forms/SwitchControl';

const AgreementCard = ({ open, doTogglePopup, recordId, doHandleSaveAndClosePopup }) => {

    const { id } = useParams();

    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(true)
    const [admission_status_options, setAdmission_Status_Options] = useState([{ label: "", value: "" }]);
    const [admission_reason_options, setAdmission_Reason_Options] = useState([{ label: "", value: "" }]);
    const [signatureData, setSignatureData] = useState(null);

    const dismissAlert = () => {
        setShowAlert(false);
    }

    const formSchema = yup.object().shape({
        id: yup
            .number(),
        data_date: yup
            .date()
            .required("Date is required.")
            .label(" Date")
            .transform((value) => (isValidDate(value) ? value : null))
            .max(new Date(), ' Date must be today or earlier')
            .min(minDateOfBirth(), 'Invalid  Date'),
        preferred_language: yup
            .number()
            .transform((value) => (isNaN(value) || value === null || value === undefined) ? null : value)
            .notRequired()
            .label("Admission Status"),
        wound_note_consent: yup
            .bool()
            .transform((value) => ((value === '' || value === undefined) ? null : value))
            .required()
            .label("Notify"),
        photography_consent: yup
            .bool()
            .transform((value) => ((value === '' || value === undefined) ? null : value))
            .required()
            .label("Notify"),
        hipaa_consent: yup
            .bool()
            .transform((value) => ((value === '' || value === undefined) ? null : value))
            .required()
            .label("Notify"),
        signature: yup
            .string()
            .required("Signature is required")
            .label("Signature")
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

    let signatureCanvasRef = React.createRef();

    React.useEffect(() => {
        useApi
            .get(`/patients/${id}/readmission`, {})
            .then((res) => {
                const data = res.data.data;
                setValue("id", data.id);
                setValue("data_date", data.data_date);
                setValue("preferred_language", isNaN(data.preferred_language) ? null : parseInt(data.preferred_language));
                setValue("wound_note_consent", isNaN(data.wound_note_consent) ? null : parseInt(data.wound_note_consent));
                setValue("photography_consent", isNaN(data.photography_consent) ? null : parseInt(data.photography_consent));
                setValue("photography_consent", isNaN(data.photography_consent) ? null : parseInt(data.photography_consent));
                setValue("signature", data.signature);
                setLoading(false);
            })
            .catch((err) => {
                showAlertError(err);
                setLoading(false);
            });
    }, []);

    const onSubmit = (data, isValid) => {
        console.log(data);
        console.log(signatureData);
        // if (isValid) {
        //     setLoading(true);
        //     useApi
        //         .doRun(data.id > 0 ? "put" : "post", `patients/${id}/readmission/${data.id}`, {
        //             patient_id: parseInt(id),
        //             data_date: dateToISOString(new Date(data.data_date)),
        //             admission_status_id: isNaN(data.admission_status_id) ? null : parseInt(data.admission_status_id),
        //             admission_reason_id: isNaN(data.admission_reason_id) ? null : parseInt(data.admission_reason_id),
        //             notes: data.notes,
        // signature: JSON.stringify(signatureData),
        //         })
        //         .then((res) => {
        //             toast("Patient Readmission Saved Successfully!");
        //             doHandleSaveAndClosePopup();
        //             setLoading(false);
        //         })
        //         .catch((err) => {
        //             setLoading(false);
        //             showAlertError(err);
        //         });
        // }
    }

    const handleClearSignature = () => {
        signatureCanvasRef.clear();
        setSignatureData(null);
    };

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
                        <h1>Patient Agreement</h1>
                        <p>Fill the Form Below</p>
                    </div>

                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col md="12" className="mb-1">
                                <Label className="form-label" for="data_date">Data Date </Label>
                                <Controller
                                    id="data_date"
                                    name="data_date"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
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

                            <Col className="col-md-12 mb-1">
                                <Label className="form-label" for="full_name">Full Name</Label>

                                <Controller
                                    name="full_name"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            id="full_name"
                                            disabled
                                            value={"Adedoyin Seyi Emmanuel"}
                                        />
                                    )}
                                />
                                {errors.admission_status_id && (
                                    <FormFeedback>{errors.admission_status_id.message}</FormFeedback>
                                )}
                            </Col>

                            <Col className="col-md-12 mb-1">

                                <Controller
                                    id="wound_note_consent"
                                    name="wound_note_consent"
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                        <Input
                                            type="checkbox"
                                            invalid={errors.wound_note_consent && true}
                                            checked={!!value}
                                            {...field}
                                        />
                                    )}
                                />
                                <span className='px-1'> WOUND CARE/PROCEDURE CONSENT </span>

                                <Card>
                                    <CardBody>
                                        <iframe
                                            src="https://mso-test.woundcharts.app/emr/pages/consent-es.php?cli_id=9"
                                            width="100%"
                                            height="125px"
                                            title="Consent 1"
                                        ></iframe>
                                    </CardBody>
                                </Card>


                                {errors.wound_note_consent && (
                                    <FormFeedback>{errors.wound_note_consent.message}</FormFeedback>
                                )}
                            </Col>

                            <Col className="col-md-12 mb-1">
                                <Controller
                                    id="photography_consent"
                                    name="photography_consent"
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                        <Input
                                            type="checkbox"
                                            invalid={errors.photography_consent && true}
                                            checked={!!value}
                                            {...field}
                                        />
                                    )}
                                />
                                <span className='px-1'> CONSENT FOR PHOTOGRAPHY </span>

                                <Card>
                                    <CardBody>
                                        <iframe
                                            src="https://mso-test.woundcharts.app/emr/pages/consent-es.php?cli_id=9"
                                            width="100%"
                                            height="125px"
                                            title="Consent 1"
                                        ></iframe>
                                    </CardBody>
                                </Card>

                                {errors.photography_consent && (
                                    <FormFeedback>{errors.photography_consent.message}</FormFeedback>
                                )}
                            </Col>

                            <Col className="col-md-12 mb-1">

                                <Controller
                                    id="hipaa_consent"
                                    name="hipaa_consent"
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                        <Input
                                            type="checkbox"
                                            invalid={errors.hipaa_consent && true}
                                            checked={!!value}
                                            {...field}
                                        />
                                    )}
                                />
                                <span className='px-1'> HIPAA COMPLIANCE PATIENT CONSENT </span>

                                <Card>
                                    <CardBody>
                                        <iframe
                                            src="https://mso-test.woundcharts.app/emr/pages/consent-es.php?cli_id=9"
                                            width="100%"
                                            height="125px"
                                            title="Consent 1"
                                        ></iframe>
                                    </CardBody>
                                </Card>

                                {errors.hipaa_consent && (
                                    <FormFeedback>{errors.hipaa_consent.message}</FormFeedback>
                                )}
                            </Col>


                            <Col md="12" className="mb-1">
                                <Label className="form-label" for="signature">Signature </Label>

                                <div className="d-flex align-items-center">
                                    <SignatureCanvas
                                        ref={(ref) => (signatureCanvasRef = ref)}
                                        penColor="black"
                                        canvasProps={{ width: "100%", height: 150, className: "sigCanvas", style: { backgroundColor: "white", borderRadius: "10px" } }}
                                        onEnd={(data) => {
                                            setSignatureData(data);
                                        }}
                                    />
                                </div>
                                    
                                {errors.signature && (
                                    <FormFeedback>{errors.signature.message}</FormFeedback>
                                )}
                            </Col>
                            

                        </Row>
                        <FaTrashCan
                            color="primary"
                            onClick={handleClearSignature}
                            className="me-1"
                        />
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
        </Modal >
    );
};

export default AgreementCard;