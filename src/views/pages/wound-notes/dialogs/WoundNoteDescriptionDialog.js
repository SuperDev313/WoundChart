
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

import EditWoundNoteDescription from "../../../../components/edits/wound-notes/EditWoundNoteDescription";

const WoundNoteDescriptionDialog = ({ open, formData, closeCallback }) => {
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
                .doRun("put", `/wound_notes/${formData.id}/description`, {
                    id: formData.id,
                    signs_infected_wound: data.signs_infected_wound,
                    granulation_tissue: isNaN(data.granulation_tissue) ? null : parseInt(data.granulation_tissue),
                    slough_tissue: isNaN(data.slough_tissue) ? null : parseInt(data.slough_tissue),
                    neurotic_tissue: isNaN(data.neurotic_tissue) ? null : parseInt(data.neurotic_tissue),
                    other_tissue: isNaN(data.other_tissue) ? null : parseInt(data.other_tissue),
                    type_of_exudate_id: isNaN(data.type_of_exudate_id) ? null : parseInt(data.type_of_exudate_id),
                    amount_of_exudate_id: isNaN(data.amount_of_exudate_id) ? null : parseInt(data.amount_of_exudate_id),
                    odor_id: isNaN(data.odor_id) ? null : parseInt(data.odor_id),

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

                    <EditWoundNoteDescription callBack={saveCallback} doSubmit={doNext} formData={formData}></EditWoundNoteDescription>

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

export default WoundNoteDescriptionDialog;