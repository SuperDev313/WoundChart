
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

import EditWoundNoteEdges from "../../../../components/edits/wound-notes/EditWoundNoteEdges";

const WoundNoteEdgesDialog = ({ open, formData, closeCallback }) => {
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
                .doRun("put", `/wound_notes/${formData.id}/edge`, {
                    id: formData.id,
                    wound_edges_irregular: data.wound_edges_irregular,
                    wound_edges_epibole: data.wound_edges_epibole,
                    wound_edges_well: data.wound_edges_well,
                    wound_edges_good: data.wound_edges_good,
                    wound_edges_hyperkeratosis: data.wound_edges_hyperkeratosis,
                    wound_edges_fibrotic: data.wound_edges_fibrotic,
                    wound_edges_not_deter: data.wound_edges_not_deter,

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

                    <EditWoundNoteEdges callBack={saveCallback} doSubmit={doNext} formData={formData}></EditWoundNoteEdges>

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

export default WoundNoteEdgesDialog;