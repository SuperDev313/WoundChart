
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

import EditWoundNoteTestAndStudy from "../../../../components/edits/wound-notes/EditWoundNoteTestAndStudy";

const WoundNoteTestAndStudyDialog = ({ open, formData, closeCallback }) => {
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
                .doRun("put", `/wound_notes/${formData.id}/test_and_study`, {
                    id: parseInt(formData.id),
                    as_wound_culture: data.as_wound_culture,
                    as_biopsy: data.as_biopsy,
                    as_mri: data.as_mri,
                    as_arterial_venous_duplex: data.as_arterial_venous_duplex,
                    as_arteriogram: data.as_arteriogram,
                    as_ctscan: data.as_ctscan,
                    as_arterial_venous_doppler: data.as_arterial_venous_doppler,
                    as_xray: data.as_xray,
                    as_gallium_scan: data.as_gallium_scan,
                    as_ankle_brachial: data.as_ankle_brachial,
                    as_transcutaneous_done_oximetry: data.as_transcutaneous_done_oximetry,
                    as_transcutaneous_oximetry: data.as_transcutaneous_oximetry,
                    as_abi_tbi_ppg: data.as_abi_tbi_ppg,
                    as_other_text: data.as_other_text,
                    wound_culture_was_obtain: data.wound_culture_was_obtain,
                    wound_biopsy_was_obtain: data.wound_biopsy_was_obtain,
                    wound_shave_biopsy_was_obtain: data.wound_shave_biopsy_was_obtain,
                    wound_punch_biopsy_was_done: data.wound_punch_biopsy_was_done,
                    wound_incisional_biopsy_was_done: data.wound_incisional_biopsy_was_done,

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

                    <EditWoundNoteTestAndStudy callBack={saveCallback} doSubmit={doNext} formData={formData}></EditWoundNoteTestAndStudy>

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

export default WoundNoteTestAndStudyDialog;