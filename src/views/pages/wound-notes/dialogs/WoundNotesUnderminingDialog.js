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
    Modal,
    ModalBody,
    ModalHeader,
} from "reactstrap";

import EditWoundNotesUndermining from "../../../../components/edits/wound-notes/EditWoundNotesUndermining";

const WoundNotesUnderminingDialog = ({ open, doTogglePopup, recordId, formData, doHandleSaveAndClosePopup }) => {
    const [loading, setLoading] = useState(false);
    const [doSubmit, setDoSubmit] = useState(false);

    const saveCallback = (data, isValid) => {
        if (isValid) {
            setLoading(true);
            useApi
                .doRun((formData.id == "" ? "post" : "put"), `/wound_notes/${recordId}/wound_notes_undermining/` + (formData.id == "" ? 0 : formData.id), {
                    position: data.position,
                    distance: isNaN(data.distance) ? null : parseInt(data.distance),
                })
                .then((res) => {
                    toast("WoundNotesUndermining Saved Successfully!");
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
                        <h1>Add New Wound Notes Undermining</h1>
                        <p>Enter the values to continue</p>
                    </div>

                    <EditWoundNotesUndermining callBack={saveCallback} doSubmit={doSubmit} formData={formData}></EditWoundNotesUndermining>

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

export default WoundNotesUnderminingDialog;
