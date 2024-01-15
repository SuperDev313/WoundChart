
// ** React Import
import React, { useState } from "react";
import { useParams } from "react-router-dom";
// ** Custom Components
import useApi from "../../../../api/useApi";
import { DefaultLoader } from "../../../../components/spinner/LoadingSpinner";
import UILoader from "../../../../components/ui-loader";
// ** Utils
import { showAlertError } from "../../../../components/alerts/AlertUtils";

// ** Third Party Components
import toast from "react-hot-toast";
// ** Reactstrap Imports
import {
    Button,
    Modal,
    ModalBody,
    ModalHeader,
} from "reactstrap";

import EditPatientDoc from "../../../../components/edits/patients/EditPatientDoc";

const PatientDocDialog = ({ open, doTogglePopup, formData, doHandleSaveAndClosePopup }) => {

    const { id } = useParams();

    const [loading, setLoading] = useState(false);
    const [doSubmit, setDoSubmit] = useState(false);

    const saveUrl = `/patients/${id}/docs/`

    const saveCallback = (data, isValid) => {
        console.log('data', data)

        if (isValid) {
            setLoading(true);
            useApi
                .doRun((formData.id == "" ? "post" : "put"), `${saveUrl}` + (formData.id == "" ? 0 : formData.id), {
                    doc_id: isNaN(data.doc_id) ? null : parseInt(data.doc_id),
                    patient_id: id
                })
                .then((res) => {
                    toast("Patient Document Saved Successfully!");
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
                        <h1>Add New Document</h1>
                        <p>Enter the values to continue</p>
                    </div>

                    <EditPatientDoc callBack={saveCallback} doSubmit={doSubmit} formData={formData}/>

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

export default PatientDocDialog;