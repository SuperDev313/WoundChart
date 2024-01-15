
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

import EditWoundNoteLowerExtremityAssessment from "../../../../components/edits/wound-notes/EditWoundNoteLowerExtremityAssessment";

const WoundNoteLowerExtremityAssessmentDialog = ({ open, formData, closeCallback }) => {
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
                .doRun("put", `/wound_notes/${formData.id}/lower_extremity_assessment`, {
                    id: parseInt(formData.id),
                    dorsalis_pedis_pulses_id: isNaN(data.dorsalis_pedis_pulses_id) ? null : parseInt(data.dorsalis_pedis_pulses_id),
                    posterior_tibialis_pulses_id: isNaN(data.posterior_tibialis_pulses_id) ? null : parseInt(data.posterior_tibialis_pulses_id),
                    radial_pulses_id: isNaN(data.radial_pulses_id) ? null : parseInt(data.radial_pulses_id),
                    capillary_refill_id: isNaN(data.capillary_refill_id) ? null : parseInt(data.capillary_refill_id),
                    dependant_rubor_id: isNaN(data.dependant_rubor_id) ? null : parseInt(data.dependant_rubor_id),
                    venous_filling_time: data.venous_filling_time,
                    ankle_brachial_index: data.ankle_brachial_index,
                    edema_id: isNaN(data.edema_id) ? null : parseInt(data.edema_id),
                    compression_in_use: data.compression_in_use,
                    sensation_id: isNaN(data.sensation_id) ? null : parseInt(data.sensation_id),
                    claudication_in_use: data.claudication_in_use,
                    temperature_of_extremity_id: isNaN(data.temperature_of_extremity_id) ? null : parseInt(data.temperature_of_extremity_id),
                    hair_growth_on_extremity: data.hair_growth_on_extremity,
                    erythema: data.erythema,
                    hyperpigmentation: data.hyperpigmentation,
                    lipodermatosclerosis: data.lipodermatosclerosis,
                    varicose_veins: data.varicose_veins,
                    off_loading_device_in_use: data.off_loading_device_in_use,

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

                    <EditWoundNoteLowerExtremityAssessment callBack={saveCallback} doSubmit={doNext} formData={formData}></EditWoundNoteLowerExtremityAssessment>

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

export default WoundNoteLowerExtremityAssessmentDialog;