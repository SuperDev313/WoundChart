

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

import PatientPhysicianOrderEdit from "./PatientPhysicianOrderEdit";
import { dateToISOString } from "../../../utility/Utils";

const PatientPhysicianOrderDialog = ({ open, doTogglePopup, recordId, doHandleSaveAndClosePopup }) => {

    const { id } = useParams();

    const [loading, setLoading] = useState(false);
    const [doSubmit, setDoSubmit] = useState(false);

    const [formData, setFormData] = useState({
        patient_id: id,
        order_type_id: "",
        data_date: "",

        items: [],
    });

    const saveCallback = (data, isValid) => {
        var items = [];
        data.items.map((r) => {
            items.push({
                id: r.id,
                item_description: r.item_description
            });
            return {};
        });

        if (isValid) {
            setLoading(true);
            useApi
                .doRun(recordId > 0 ? "put" : "post", `patients/${id}/physician_orders/${recordId}`, {
                    patient_id: parseInt(id),
                    order_type_id: isNaN(data.order_type_id) ? null : parseInt(data.order_type_id),
                    data_date: dateToISOString(new Date(data.data_date)),
                    items: items,
                })
                .then((res) => {
                    toast("PatientPhysicianOrder Saved Successfully!");
                    doHandleSaveAndClosePopup();
                    setLoading(false);
                })
                .catch((err) => {
                    setLoading(false);
                    showAlertError(err);
                });
        }
        setDoSubmit(false)
    }

    React.useEffect(() => {

        if (recordId > 0) {
            useApi
                .get(`/patients/${id}/physician_orders/${recordId}`, {})
                .then((res) => {
                    const data = res.data.data;
                    setFormData({
                        patient_id: id,
                        order_type_id: isNaN(data.order_type_id) ? null : parseInt(data.order_type_id),
                        data_date: data.data_date,
                        items: data.items,
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
                order_type_id: "",
                data_date: "",
                items: []
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
                        <h1>Add New Patient Physician Order</h1>
                        <p>Enter the values to continue</p>
                    </div>

                    <PatientPhysicianOrderEdit callBack={saveCallback} doSubmit={doSubmit} formData={formData}></PatientPhysicianOrderEdit>

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

export default PatientPhysicianOrderDialog;

