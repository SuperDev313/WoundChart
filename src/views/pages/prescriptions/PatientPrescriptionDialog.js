


// ** React Import
import React, { useState } from "react";
import classnames from "classnames";

import { useParams } from "react-router-dom";
// ** Custom Components
import useApi from "../../../api/useApi";
import { DefaultLoader } from "../../../components/spinner/LoadingSpinner";
import UILoader from "../../../components/ui-loader";
// ** Utils
import { showAlertError } from "../../../components/alerts/AlertUtils";

// ** Third Party Components
import toast from "react-hot-toast";
// ** Reactstrap Imports
import {
    Button,
    Modal,
    ModalBody,
    ModalHeader,
} from "reactstrap";

import PatientPrescriptionEdit from "./PatientPrescriptionEdit";
import { dateToISOString } from "../../../utility/Utils";

const PatientPrescriptionDialog = ({ open, doTogglePopup, recordId, doHandleSaveAndClosePopup }) => {

    const { id } = useParams();

    const [loading, setLoading] = useState(false);
    const [doSubmit, setDoSubmit] = useState(false);

    const [formData, setFormData] = useState({
        patient_id: id,
        data_date: "",
        dispense_as_written: "",
        may_substitute: "",

        prescriptions: [],
    });

    const saveCallback = (data, isValid) => {
        var prescriptions = [];
        data.prescriptions.map((r) => {
            prescriptions.push({
                id: isNaN(r.id) ? null : parseInt(r.id),
                amount: r.amount,
                form: r.form,
                medicine_id: isNaN(r.medicine_id) ? null : parseInt(r.medicine_id),
                refill_total: parseInt(r.refill_total),
                drug_name: r.drug_name
            });
            return {};
        });

        if (isValid) {
            setLoading(true);
            useApi
                .doRun(recordId > 0 ? "put" : "post", `patients/${id}/prescriptions/${recordId}`, {
                    patient_id: parseInt(id),
                    data_date: dateToISOString(new Date(data.data_date)),
                    dispense_as_written: data.dispense_as_written,
                    may_substitute: data.may_substitute,
                    prescriptions: prescriptions,
                })
                .then((res) => {
                    toast("PatientPrescription Saved Successfully!");
                    doHandleSaveAndClosePopup();
                    setLoading(false);
                })
                .catch((err) => {
                    setLoading(false);
                    showAlertError(err);
                });
        }
    }

    React.useEffect(() => {

        if (recordId > 0) {
            useApi
                .get(`/patients/${id}/prescriptions/${recordId}`, {})
                .then((res) => {
                    const data = res.data.data;
                    setFormData({
                        patient_id: id,
                        data_date: data.data_date,
                        dispense_as_written: data.dispense_as_written,
                        may_substitute: data.may_substitute,
                        prescriptions: data.prescriptions,
                    });
                    setLoading(false);
                })
                .catch((err) => {
                    showAlertError(err);
                    setLoading(false);
                });

        }
        else {
            setFormData({
                data_date: "",
                dispense_as_written: "",
                may_substitute: "",

                prescriptions: [],
            });
        }
    }, [recordId]);

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
                        <h1>Add New Patient Prescription</h1>
                        <p>Enter the values to continue</p>
                    </div>

                    <PatientPrescriptionEdit callBack={saveCallback} doSubmit={doSubmit} formData={formData}></PatientPrescriptionEdit>

                    <Button type="button" className="me-1" color="primary" onClick={() => setDoSubmit(!doSubmit)}>
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

export default PatientPrescriptionDialog;