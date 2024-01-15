
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

import EditWoundNoteBarrierForHealing from "../../../../components/edits/wound-notes/EditWoundNoteBarrierForHealing";

const WoundNoteBarrierForHealingDialog = ({ open, formData, closeCallback }) => {
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
                .doRun("put", `/wound_notes/${formData.id}/barrier_for_healing`, {
                    id: parseInt(formData.id),
                    barrier_necrosis: data.barrier_necrosis,
                    barrier_infection: data.barrier_infection,
                    barrier_haemorrhage: data.barrier_haemorrhage,
                    barrier_mechanical_damage: data.barrier_mechanical_damage,
                    barrier_diet: data.barrier_diet,
                    barrier_medical_conditions: data.barrier_medical_conditions,
                    barrier_age: data.barrier_age,
                    barrier_medicines: data.barrier_medicines,
                    barrier_smoking: data.barrier_smoking,
                    barrier_varicose_veins: data.barrier_varicose_veins,
                    barrier_dryness: data.barrier_dryness,
                    barrier_bedridden: data.barrier_bedridden,
                    barrier_diabetic: data.barrier_diabetic,
                    barrier_immuno: data.barrier_immuno,

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

                    <EditWoundNoteBarrierForHealing callBack={saveCallback} doSubmit={doNext} formData={formData}></EditWoundNoteBarrierForHealing>

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

export default WoundNoteBarrierForHealingDialog;
