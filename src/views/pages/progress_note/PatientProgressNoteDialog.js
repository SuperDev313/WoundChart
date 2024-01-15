
// ** React Import
import React, { useState } from "react";
import classnames from "classnames";

import { useParams } from "react-router-dom";
// ** Custom Components
import useApi from "../../../api/useApi";
import { DefaultLoader } from "../../../components/spinner/LoadingSpinner";
import UILoader from "../../../components/ui-loader";
// ** Utils
import { showAlertError } from "../../../components/alerts/AlertUtils";

// ** Third Party Components
import toast from "react-hot-toast";
// ** Reactstrap Imports
import {
    Button,
    Label,
    FormText,
    Form,
    Input,
    FormFeedback,
    Modal,
    ModalBody,
    ModalHeader,
} from "reactstrap";

import EditPatientProgressNote from "./EditPatientProgressNote";
import { dateToISOString } from "../../../utility/Utils";

const PatientProgressNoteDialog = ({ open, doTogglePopup, recordId, doHandleSaveAndClosePopup }) => {

    const { id } = useParams();

    const [loading, setLoading] = useState(false);
    const [doSubmit, setDoSubmit] = useState(false);
    const [addOrEdit, setAddOrEdit] = useState("Add New")

    const [formData, setFormData] = useState({
        patient_id: id,
        data_date: "",
        temperature: "",
        temperature_unit_id: "",
        respiratory_rate: "",
        blood_pressure_systolic: "",
        blood_pressure_diastolic: "",
        heart_rate: "",
        assessment: "",
        chief_complaint: "",
    });

    const saveCallback = (data, isValid) => {
        if (isValid) {
            setLoading(true);
            useApi
                .doRun(recordId > 0 ? "put" : "post", `patients/${id}/patient_progress_note/${recordId}`, {
                    patient_id: parseInt(id),
                    data_date: dateToISOString(new Date(data.data_date)),
                    temperature: isNaN(data.temperature) ? null: parseFloat(data.temperature),
                    temperature_unit_id: isNaN(data.temperature_unit_id) ? null: parseInt(data.temperature_unit_id),
                    respiratory_rate: isNaN(data.respiratory_rate) ? null: parseInt(data.respiratory_rate),
                    blood_pressure_systolic: isNaN(data.blood_pressure_systolic) ? null: parseInt(data.blood_pressure_systolic),
                    blood_pressure_diastolic: isNaN(data.blood_pressure_diastolic) ? null: parseInt(data.blood_pressure_diastolic),
                    heart_rate: isNaN(data.heart_rate) ? null: parseFloat(data.heart_rate),
                    assessment:data.assessment,
                    chief_complaint:data.chief_complaint,
                })
                .then((res) => {
                    toast("Record Saved Successfully!");
                    setLoading(false);
                    doHandleSaveAndClosePopup();
                })
                .catch((err) => {
                    setLoading(false);
                    showAlertError(err);
                });
        }
        setDoSubmit(false)
    }

    React.useEffect(() => {

        if (recordId > 0) {
            setAddOrEdit('Edit')
            useApi
                .get(`/patients/${id}/patient_progress_note/${recordId}`, {})
                .then((res) => {
                    const data = res.data.data;
                    setFormData({
                        data_date: data.data_date,
                        temperature: isNaN(data.temperature) ? null: parseFloat(data.temperature),
                        temperature_unit_id: isNaN(data.temperature_unit_id) ? null: parseInt(data.temperature_unit_id),
                        respiratory_rate: isNaN(data.respiratory_rate) ? null: parseInt(data.respiratory_rate),
                        blood_pressure_systolic: isNaN(data.blood_pressure_systolic) ? null: parseInt(data.blood_pressure_systolic),
                        blood_pressure_diastolic: isNaN(data.blood_pressure_diastolic) ? null: parseInt(data.blood_pressure_diastolic),
                        heart_rate: isNaN(data.heart_rate) ? null: parseFloat(data.heart_rate),
                        assessment:data.assessment,
                        chief_complaint:data.chief_complaint,
                    });
                    setLoading(false);
                })
                .catch((err) => {
                    showAlertError(err);
                    setLoading(false);
                });

        }
        else{
            setFormData({
                data_date: "",
                temperature: "",
                temperature_unit_id: "",
                respiratory_rate: "",
                blood_pressure_systolic: "",
                blood_pressure_diastolic: "",
                heart_rate: "",
                assessment: "",
                chief_complaint: "",
            });
        }
    }, [recordId]);

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
                        <h1>{addOrEdit} Progress Note</h1>
                        <p>Enter the values to continue</p>
                    </div>

                    <EditPatientProgressNote id={recordId} callBack={saveCallback} doSubmit={doSubmit} formData={formData}></EditPatientProgressNote>

                    <Button type="button" className="me-1" color="primary" onClick={() => setDoSubmit(true)}>
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

export default PatientProgressNoteDialog;

