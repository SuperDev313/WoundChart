

//-----------------------WoundNoteMeasurementDialog.js


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

import EditWoundNoteMeasurement from "../../../../components/edits/wound-notes/EditWoundNoteMeasurement";

const WoundNoteMeasurementDialog = ({ open, formData, closeCallback }) => {
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
                .doRun("put", `/wound_notes/${formData.id}/measurement`, {
                    id: formData.id,
                    wound_length: isNaN(data.wound_length) ? null : parseFloat(data.wound_length),
                    wound_width: isNaN(data.wound_width) ? null : parseFloat(data.wound_width),
                    wound_depth: isNaN(data.wound_depth) ? null : parseFloat(data.wound_depth),
                    wound_lxw: isNaN(data.wound_lxw) ? null : parseFloat(data.wound_lxw),
                    wound_lxwxd: isNaN(data.wound_lxwxd) ? null : parseFloat(data.wound_lxwxd),

                })
                .then((res) => {
                    toast("Record Saved Successfully!");
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

                    <EditWoundNoteMeasurement callBack={saveCallback} doSubmit={doNext} formData={formData} id={formData.id}></EditWoundNoteMeasurement>

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

export default WoundNoteMeasurementDialog;
