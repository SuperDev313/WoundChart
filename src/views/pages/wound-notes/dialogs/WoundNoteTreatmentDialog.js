
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

import EditWoundNoteTreatment from "../../../../components/edits/wound-notes/EditWoundNoteTreatment";

const WoundNoteTreatmentDialog = ({ open, formData, closeCallback }) => {
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
                .doRun("put", `/wound_notes/${formData.id}/treatment`, {
                    id: parseInt(formData.id),
                    tod_autolytic: data.tod_autolytic,
                    tod_enzymatic: data.tod_enzymatic,
                    tod_mechanical: data.tod_mechanical,
                    tod_sharp: data.tod_sharp,
                    tod_biological: data.tod_biological,
                    tod_other: data.tod_other,
                    tod_other_text: data.tod_other_text,
                    tod_applied_product: data.tod_applied_product,

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

                    <EditWoundNoteTreatment callBack={saveCallback} doSubmit={doNext} formData={formData}></EditWoundNoteTreatment>

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

export default WoundNoteTreatmentDialog;