
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

import EditWoundNotePeriwound from "../../../../components/edits/wound-notes/EditWoundNotePeriwound";

const WoundNotePeriwoundDialog = ({ open, formData, closeCallback }) => {
    const [loading, setLoading] = useState(false);
    const [doNext, setDoNext] = useState(false);


    const handleModalClosed = () => {
        if (closeCallback) {
            closeCallback();
        }
    }

    const saveCallback = (data, isValid) => {
        if (isValid) {
            setLoading(true);
            useApi
                .doRun("put", `/wound_notes/${formData.id}/periwound`, {
                    id: formData.id,
                    periwound_healthy: data.periwound_healthy,
                    periwound_blistered: data.periwound_blistered,
                    periwound_cayosed: data.periwound_cayosed,
                    periwound_discolored: data.periwound_discolored,
                    periwound_contact: data.periwound_contact,
                    periwound_dry_scaly: data.periwound_dry_scaly,
                    periwound_edema: data.periwound_edema,
                    periwound_erythema: data.periwound_erythema,
                    periwound_indurated: data.periwound_indurated,
                    periwound_macerated: data.periwound_macerated,
                    periwound_hyperpigmented: data.periwound_hyperpigmented,
                    periwound_hyperemic: data.periwound_hyperemic,
                    periwound_skin_irritation: data.periwound_skin_irritation,
                    periwound_not_determined: data.periwound_not_determined,

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
        setDoNext(false)
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

                    <EditWoundNotePeriwound callBack={saveCallback} doSubmit={doNext} formData={formData}></EditWoundNotePeriwound>

                    <Button type="button" className="me-1" color="primary" onClick={() => setDoNext(true)}>
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

export default WoundNotePeriwoundDialog;