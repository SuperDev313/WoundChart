
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

import EditStartOfCare from "../../../../components/edits/socs/EditStartOfCare";
import { getFormatedDateFromISODate, dateToISOString } from "../../../../utility/Utils";

//getFormatedDateFromISODate

const SOCDetailsDialog = ({ open, doTogglePopup, recordId, doHandleSaveAndClosePopup }) => {
    const [loading, setLoading] = useState(false);
    const [doNext, setDoNext] = useState(false);

    const [formData, setFormData] = useState({
        patient_id: recordId,
        data_date: "",
        information_taken_from_id: "",
        type_of_visit_id: "",
        location_id: "",
        chief_complaint: "",
        condition_related_to_employment: "",
        condition_related_to_car_accident: "",
        condition_related_to_other_accident: "",

    });

    const saveCallback = (data, isValid) => {
        if (isValid) {
            setLoading(true);
            useApi
                .doRun("post", `/start_of_care/0`, {
                    patient_id: parseInt(recordId),
                    data_date: dateToISOString(new Date(data.data_date)),
                    type_of_visit_id: isNaN(data.type_of_visit_id) ? null: parseInt(data.type_of_visit_id),
                    location_id: isNaN(data.location_id) ? null: parseInt(data.location_id),
                    chief_complaint:data.chief_complaint,
                    condition_related_to_employment:data.condition_related_to_employment == "" ? false: data.condition_related_to_employment,
                    condition_related_to_car_accident:data.condition_related_to_car_accident == "" ? false: data.condition_related_to_car_accident,
                    condition_related_to_other_accident:data.condition_related_to_other_accident == "" ? false: data.condition_related_to_other_accident,

                })
                .then((res) => {
                    toast("SOC Saved Successfully!");
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
                        <h1>Add New Start of Care Evaluation</h1>
                        <p>Fill in the Form Below to Continue</p>
                    </div>

                    <EditStartOfCare callBack={saveCallback} doSubmit={doNext} formData={formData}></EditStartOfCare>

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

export default SOCDetailsDialog;