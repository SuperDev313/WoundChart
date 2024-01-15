
// ** React Import
import React, { useState } from "react";

import { useParams } from "react-router-dom";
// ** Custom Components
import useApi from "../../../api/useApi";
import { DefaultLoader } from "../../../components/spinner/LoadingSpinner";
import UILoader from "../../../components/ui-loader";

// ** Third Party Components
import toast from "react-hot-toast";
// ** Reactstrap Imports
import {
    Button,
    Modal,
    ModalBody,
    ModalHeader,
} from "reactstrap";

import EditPatientVitalSign from "./EditPatientVitalSign";
import { dateToISOString } from "../../../utility/Utils";

const PatientVitalSignDialog = ({ open, doTogglePopup, recordId, doHandleSaveAndClosePopup }) => {

    const { id } = useParams();

    const [loading, setLoading] = useState(false);
    const [doSubmit, setDoSubmit] = useState(false);

    const [formData, setFormData] = useState({
        patient_id: id,
        data_date: "",
        temperature: "",
        temperature_unit_id: "",
        pulse: "",
        respiratory_rate: "",
        blood_pressure_systolic: "",
        blood_pressure_diastolic: "",
        oxigen_saturation: "",
        blood_glucose: "",
        sample_taken_id: "",
    });

    const saveCallback = (data, isValid) => {
        if (isValid) {
            setLoading(true);
            useApi
                .doRun(recordId > 0 ? "put" : "post", `patients/${id}/patient_vital_signs/${recordId}`, {
                    patient_id: parseInt(id),
                    data_date: dateToISOString(new Date(data.data_date)),
                    temperature: isNaN(data.temperature) ? null : parseFloat(data.temperature),
                    temperature_unit_id: isNaN(data.temperature_unit_id) ? null : parseInt(data.temperature_unit_id),
                    pulse: isNaN(data.pulse) ? null : parseInt(data.pulse),
                    respiratory_rate: isNaN(data.respiratory_rate) ? null : parseInt(data.respiratory_rate),
                    blood_pressure_systolic: isNaN(data.blood_pressure_systolic) ? null : parseInt(data.blood_pressure_systolic),
                    blood_pressure_diastolic: isNaN(data.blood_pressure_diastolic) ? null : parseInt(data.blood_pressure_diastolic),
                    oxigen_saturation: isNaN(data.oxigen_saturation) ? null : parseFloat(data.oxigen_saturation),
                    blood_glucose: isNaN(data.blood_glucose) ? null : parseFloat(data.blood_glucose),
                    sample_taken_id: isNaN(data.sample_taken_id) ? null : parseInt(data.sample_taken_id),


                })
                .then((res) => {
                    toast("Vital Sign Saved Successfully!");
                    doHandleSaveAndClosePopup();

                    setLoading(false);

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

            setLoading(true);
            useApi
                .get(`/patients/${id}/patient_vital_signs/${recordId}`, {})
                .then((res) => {
                    const data = res.data.data;
                    setFormData({
                        data_date: data.data_date,
                        temperature: isNaN(data.temperature) ? null : parseInt(data.temperature),
                        temperature_unit_id: isNaN(data.temperature_unit_id) ? null : parseInt(data.temperature_unit_id),
                        pulse: isNaN(data.pulse) ? null : parseInt(data.pulse),
                        respiratory_rate: isNaN(data.respiratory_rate) ? null : parseInt(data.respiratory_rate),
                        // blood_pressure_systolic: isNaN(data.blood_pressure_systolic) ? null : parseInt(data.blood_pressure_systolic),
                        blood_pressure_systolic: isNaN(data.blood_pressure_systolic) ? null : parseInt(data.blood_pressure_systolic),
                        blood_pressure_diastolic: isNaN(data.blood_pressure_diastolic) ? null : parseInt(data.blood_pressure_diastolic),
                        oxigen_saturation: isNaN(data.oxigen_saturation) ? null : parseInt(data.oxigen_saturation),
                        blood_glucose: isNaN(data.blood_glucose) ? null : parseInt(data.blood_glucose),
                        sample_taken_id: isNaN(data.sample_taken_id) ? null : parseInt(data.sample_taken_id),
                    });

                    setLoading(false);
                })
                .catch((err) => {
                    showAlertError(err);
                    setLoading(false);
                });

        }
        else {
            setFormData({
                data_date: "",
                temperature: "",
                temperature_unit_id: "",
                pulse: "",
                respiratory_rate: "",
                blood_pressure_systolic: "",
                blood_pressure_diastolic: "",
                oxigen_saturation: "",
                blood_glucose: "",
                sample_taken_id: "",
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
                        <h1>{recordId > 0 && <>Edit</>} {recordId == "" && <>Add</>} Patient Vital Sign</h1>
                        <p>Enter the values to continue</p>
                    </div>

                    <EditPatientVitalSign id={recordId} callBack={saveCallback} doSubmit={doSubmit} formData={formData}></EditPatientVitalSign>

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

export default PatientVitalSignDialog;

