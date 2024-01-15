
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

import EditWoundNoteAdjuvantTreatment from "../../../../components/edits/wound-notes/EditWoundNoteAdjuvantTreatment";

const WoundNoteAdjuvantTreatmentDialog = ({ open, formData, closeCallback }) => {
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
                .doRun("put", `/wound_notes/${formData.id}/adjuvant_treatment`, {
                    id: parseInt(formData.id),
                    patient_has_cleansing: data.patient_has_cleansing,
                    patient_on_offloading_device: data.patient_on_offloading_device,
                    patient_on_wheelchair: data.patient_on_wheelchair,
                    patient_is_using_compression_device: data.patient_is_using_compression_device,
                    patient_receiving_hyperbaric_oxygen_treatment: data.patient_receiving_hyperbaric_oxygen_treatment,
                    patient_has_receiving_hyperbaric_oxygen_treatment: data.patient_has_receiving_hyperbaric_oxygen_treatment,
                    patient_treated_with_low_level_laser_therapy: data.patient_treated_with_low_level_laser_therapy,
                    patient_receiving_occupational_therapy: data.patient_receiving_occupational_therapy,
                    patient_receiving_intermittent_pneumatic_compression: data.patient_receiving_intermittent_pneumatic_compression,
                    patient_receiving_whirlpool: data.patient_receiving_whirlpool,
                    patient_receiving_complete_decongestive_therapy_on_lower_ex: data.patient_receiving_complete_decongestive_therapy_on_lower_ex,
                    patient_receiving_manual_lymph_drainage: data.patient_receiving_manual_lymph_drainage,
                    patient_receiving_electrical_stimulation_therapy: data.patient_receiving_electrical_stimulation_therapy,
                    patient_receiving_electromagnetic_therapy: data.patient_receiving_electromagnetic_therapy,
                    cellular_and_or_tissue_based_product: data.cellular_and_or_tissue_based_product,
                    patient_receiving_transcutaneous_oxygen_therapy: data.patient_receiving_transcutaneous_oxygen_therapy,
                    patient_receiving_ultrasound_therapy: data.patient_receiving_ultrasound_therapy,
                    patient_receiving_shockwave_therapy: data.patient_receiving_shockwave_therapy,

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

                    <EditWoundNoteAdjuvantTreatment callBack={saveCallback} doSubmit={doNext} formData={formData}></EditWoundNoteAdjuvantTreatment>

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

export default WoundNoteAdjuvantTreatmentDialog;