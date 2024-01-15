

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

import PatientTransferEdit from "./PatientTransferEdit";
import { dateToISOString } from "../../../utility/Utils";

const PatientTransferDialog = ({ open, doTogglePopup, recordId, doHandleSaveAndClosePopup }) => {

    const { id } = useParams();

    const [loading, setLoading] = useState(false);
    const [doSubmit, setDoSubmit] = useState(false);

    const [formData, setFormData] = useState({
        patient_id: id,
        transfer_place_id: "",
        comments: "",
        transfer_date: "",

    });

    const saveCallback = (data, isValid) => {
        if (isValid) {
            setLoading(true);
            useApi
                .doRun(recordId > 0 ? "put" : "post", `patients/${id}/transfers/${recordId}`, {
                    patient_id: parseInt(id),
                    transfer_place_id: isNaN(data.transfer_place_id) ? null : parseInt(data.transfer_place_id),
                    comments: data.comments,
                    transfer_date: dateToISOString(new Date(data.transfer_date)),
                })
                .then((res) => {
                    toast("Patient Transfer Saved Successfully!");
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
                .get(`/patients/${id}/transfers/${recordId}`, {})
                .then((res) => {
                    const data = res.data.data;
                    setFormData({
                        patient_id: isNaN(data.patient_id) ? null : parseInt(data.patient_id),
                        transfer_place_id: isNaN(data.transfer_place_id) ? null : parseInt(data.transfer_place_id),
                        comments: data.comments,
                        transfer_date: data.transfer_date,
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
                patient_id: "",
                transfer_place_id: "",
                comments: "",
                transfer_date: "",
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
                        <h1>Add New Patient Transfer</h1>
                        <p>Enter the values to continue</p>
                    </div>

                    <PatientTransferEdit callBack={saveCallback} doSubmit={doSubmit} formData={formData}></PatientTransferEdit>

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

export default PatientTransferDialog;

