
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

import EditWoundNoteDressings from "../../../../components/edits/wound-notes/EditWoundNoteDressings";

const WoundNoteDressingsDialog = ({ open, formData, closeCallback }) => {
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
                .doRun("put", `/wound_notes/${formData.id}/dressings`, {
                    id: parseInt(formData.id),
                    primary_dressing_id: isNaN(data.primary_dressing_id) ? null : parseInt(data.primary_dressing_id),
                    other_primary_dressing_id: isNaN(data.other_primary_dressing_id) ? null : parseInt(data.other_primary_dressing_id),
                    secondary_dressing_id: isNaN(data.secondary_dressing_id) ? null : parseInt(data.secondary_dressing_id),
                    peri_wound_skin_treatment_id: isNaN(data.peri_wound_skin_treatment_id) ? null : parseInt(data.peri_wound_skin_treatment_id),
                    secure_dressing_id: isNaN(data.secure_dressing_id) ? null : parseInt(data.secure_dressing_id),
                    tunneling_and_undermining_treatment_id: isNaN(data.tunneling_and_undermining_treatment_id) ? null : parseInt(data.tunneling_and_undermining_treatment_id),
                    primary_dressing_quantity: isNaN(data.primary_dressing_quantity) ? null : parseInt(data.primary_dressing_quantity),
                    other_primary_dressing_quantity: isNaN(data.other_primary_dressing_quantity) ? null : parseInt(data.other_primary_dressing_quantity),
                    secondary_dressing_quantity: isNaN(data.secondary_dressing_quantity) ? null : parseInt(data.secondary_dressing_quantity),
                    peri_wound_skin_treatment_quantity: isNaN(data.peri_wound_skin_treatment_quantity) ? null : parseInt(data.peri_wound_skin_treatment_quantity),
                    secure_dressing_quantity: isNaN(data.secure_dressing_quantity) ? null : parseInt(data.secure_dressing_quantity),
                    tunneling_and_undermining_treatment_quantity: isNaN(data.tunneling_and_undermining_treatment_quantity) ? null : parseInt(data.tunneling_and_undermining_treatment_quantity),
                    procedure_performed_id: isNaN(data.procedure_performed_id) ? null : parseInt(data.procedure_performed_id),
                    folley_insert_change: data.folley_insert_change,

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

                    <EditWoundNoteDressings callBack={saveCallback} doSubmit={doNext} formData={formData}></EditWoundNoteDressings>

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

export default WoundNoteDressingsDialog;