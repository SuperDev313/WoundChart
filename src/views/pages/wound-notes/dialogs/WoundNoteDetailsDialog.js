
// ** React Import
import React, { useState } from "react";
import classnames from "classnames";
// ** Custom Components
import useApi from "../../../../api/useApi";
import { DefaultLoader } from "../../../../components/spinner/LoadingSpinner";
import UILoader from "../../../../components/ui-loader";
// ** Utils
import { showAlertError } from "../../../../components/alerts/AlertUtils";
import Flatpickr from 'react-flatpickr'
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

import EditWoundNoteDetails from "../../../../components/edits/wound-notes/EditWoundNoteDetails";
import { getFormatedDateFromISODate, dateToISOString } from "../../../../utility/Utils";

//getFormatedDateFromISODate

const WoundNoteDetailsDialog = ({ open, doTogglePopup, recordId, doHandleSaveAndClosePopup }) => {
    const [loading, setLoading] = useState(false);
    const [doNext, setDoNext] = useState(false);

    const [formData, setFormData] = useState({
        patient_id: recordId,
        visit_date: "",
        wound_location: "",
        pain_grade_id: "",
        visit_type_id: "",
        location_id: "",
        wound_type_id: "",

    });

    const saveCallback = (data, isValid) => {
        if (isValid) {
            setLoading(true);
            useApi
                .doRun("post", `/wound_notes/0/details`, {
                    patient_id: isNaN(data.patient_id) ? null : parseInt(data.patient_id),
                    visit_date: dateToISOString(new Date(data.visit_date)),
                    wound_location: data.wound_location,
                    pain_grade_id: isNaN(data.pain_grade_id) ? null : parseInt(data.pain_grade_id),
                    visit_type_id: isNaN(data.visit_type_id) ? null : parseInt(data.visit_type_id),
                    location_id: isNaN(data.location_id) ? null : parseInt(data.location_id),
                    wound_type_id: isNaN(data.wound_type_id) ? null : parseInt(data.wound_type_id),

                })
                .then((res) => {
                    toast("WoundNote Saved Successfully!");
                    setLoading(false);
                    doHandleSaveAndClosePopup(res.data.data.id);
                })
                .catch((err) => {
                    setLoading(false);
                    showAlertError(err);
                });
        }
        setDoNext(false)
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
                        <h1>Add New Wound Note</h1>
                        <p>Enter the values to continue</p>
                    </div>

                    <EditWoundNoteDetails callBack={saveCallback} doSubmit={doNext} formData={formData}></EditWoundNoteDetails>

                    <Button type="button" className="me-1" color="primary" onClick={() => setDoNext(true)}>
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

export default WoundNoteDetailsDialog;