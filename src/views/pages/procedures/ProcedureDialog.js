
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
    Modal,
    ModalBody,
    ModalHeader,
} from "reactstrap";

import ProcedureEdit from "./ProcedureEdit";
import { dateToISOString } from "../../../utility/Utils";

const ProcedureDialog = ({ open, doTogglePopup, recordId, doHandleSaveAndClosePopup }) => {

    const { id } = useParams();

    const [loading, setLoading] = useState(false);
    const [doSubmit, setDoSubmit] = useState(false);

    const [formData, setFormData] = useState({
        patient_id: id,
        procedure_date: "",
        procedure_performed: "",
        indication: "",
        anesthesia: "",
        description: "",
        complications: "",
        estimated_blood_loss: "",
        disposition: "",
        billed_by_id: "",
        date_billed: "",
        clinician_id: "",
        signature_physician: "",
        physician_id: "",
        signature_date: "",

    });

    const saveCallback = (data, isValid) => {
        if (isValid) {
            setLoading(true);
            useApi
                .doRun( recordId > 0 ? "put": "post", `patients/${id}/procedures/${recordId}`, {
                    patient_id: parseInt(id),
                    procedure_date: dateToISOString(new Date(data.procedure_date)),
                    location_id: isNaN(data.location_id) ? null : parseInt(data.location_id),
                    procedure_performed: data.procedure_performed,
                    indication: data.indication,
                    anesthesia: data.anesthesia,
                    description: data.description,
                    complications: data.complications,
                    estimated_blood_loss: data.estimated_blood_loss,
                    disposition: data.disposition,

                })
                .then((res) => {
                    toast("Procedure Saved Successfully!");
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
            useApi
                .get(`/patients/${id}/procedures/${recordId}`, {})
                .then((res) => {
                    const data = res.data.data;
                    setFormData({
                        procedure_date: data.procedure_date,
                        location_id: data.location_id,
                        procedure_performed: data.procedure_performed,
                        indication: data.indication,
                        anesthesia: data.anesthesia,
                        description: data.description,
                        complications: data.complications,
                        estimated_blood_loss: data.estimated_blood_loss,
                        disposition: data.disposition,
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
                procedure_date: "",
                procedure_performed: "",
                indication: "",
                anesthesia: "",
                description: "",
                complications: "",
                estimated_blood_loss: "",
                disposition: "",
                billed_by_id: "",
                date_billed: "",
                clinician_id: "",
                signature_physician: "",
                physician_id: "",
                signature_date: "",
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
                        <h1>Add New Procedure</h1>
                        <p>Enter the values to continue</p>
                    </div>

                    <ProcedureEdit callBack={saveCallback} doSubmit={doSubmit} formData={formData}></ProcedureEdit>

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

export default ProcedureDialog;

