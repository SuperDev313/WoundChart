
// ** React Import
import React, { useState } from "react";
import classnames from "classnames";
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
    Label,
    FormText,
    Form,
    Input,
    FormFeedback,
    Modal,
    ModalBody,
    ModalHeader,
} from "reactstrap";

import EditWoundNoteReferral from "../../../../components/edits/wound-notes/EditWoundNoteReferral";

const WoundNoteReferralDialog = ({ open, formData, closeCallback }) => {
    const [loading, setLoading] = useState(false);
    const [doNext, doSubmit] = useState(false);


    const handleModalClosed = () => {
        if (closeCallback) {
            closeCallback();
        }
    }

    const saveCallback = (data, isValid) => {
        if (isValid) {
            setLoading(true);
            useApi
                .doRun("put", `/wound_notes/${formData.id}/referral`, {
                    id: parseInt(formData.id),
                    rr_vascular_evaluation: data.rr_vascular_evaluation,
                    rr_nutrition_evaluation: data.rr_nutrition_evaluation,
                    rr_infectious_diseases_evaluation: data.rr_infectious_diseases_evaluation,
                    rr_physical_therapy_evaluation: data.rr_physical_therapy_evaluation,
                    rr_primary_physician_evaluation: data.rr_primary_physician_evaluation,
                    rr_hyperbaric_medicine_evaluation: data.rr_hyperbaric_medicine_evaluation,
                    rr_occupational_therapy_evaluation: data.rr_occupational_therapy_evaluation,
                    rr_pain_management_evaluation: data.rr_pain_management_evaluation,
                    rr_off_loading: data.rr_off_loading,
                    rr_social_worker_evaluation: data.rr_social_worker_evaluation,
                    rr_surgery_evaluation: data.rr_surgery_evaluation,
                    rr_disease_management_evaluation: data.rr_disease_management_evaluation,
                    rr_case_management_evaluation: data.rr_case_management_evaluation,
                    rr_community_res_evaluation: data.rr_community_res_evaluation,
                    rr_compression_therapy: data.rr_compression_therapy,
                    rr_negative_pressure_system: data.rr_negative_pressure_system,
                    rr_quit_smoking: data.rr_quit_smoking,
                    rr_other_referrals: data.rr_other_referrals,
                    rr_additional_comments: data.rr_additional_comments,

                })
                .then((res) => {
                    toast("WoundNote Saved Successfully!");
                    setLoading(false);
                    closeCallback(data);
                })
                .catch((err) => {
                    setLoading(false);
                    showAlertError(err);
                });
        }
        doSubmit(false)
    }

    return (
        <Modal
            isOpen={open}
            className="modal-dialog-centered modal-lg"
            toggle={handleModalClosed}
        >
            <UILoader blocking={loading} loader={<DefaultLoader />}>
                <ModalHeader
                    className="bg-transparent"
                    toggle={() => handleModalClosed()}
                ></ModalHeader>
                <ModalBody className="px-5 pb-5">
                    <div className='text-center mb-4'>
                        <h1>Add New WoundNote</h1>
                        <p>Enter the values to continue</p>
                    </div>

                    <EditWoundNoteReferral callBack={saveCallback} doSubmit={doNext} formData={formData}></EditWoundNoteReferral>

                    <Button type="button" className="me-1" color="primary" onClick={() => doSubmit(true)}>
                        Submit
                    </Button>
                    <Button
                        type="reset"
                        color="secondary"
                        outline
                        onClick={handleModalClosed}
                    >
                        Cancel
                    </Button>
                </ModalBody>
            </UILoader>
        </Modal>
    );
};

export default WoundNoteReferralDialog;
