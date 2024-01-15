
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

import EditPatientBradenScaleScoreEvaluation from "./EditPatientBradenScaleScoreEvaluation";
import { dateToISOString } from "../../../utility/Utils";

const PatientBradenScaleScoreEvaluationDialog = ({ open, doTogglePopup, recordId, doHandleSaveAndClosePopup }) => {

    const { id } = useParams();

    const [loading, setLoading] = useState(false);
    const [doSubmit, setDoSubmit] = useState(false);

    const [formData, setFormData] = useState({
        patient_id: id,
        data_date: "",
        sensory_perception_id: "",
        moisture_id: "",
        activity_id: "",
        mobility_id: "",
        nutrition_id: "",
        friction_and_shear_id: "",
        score: "",
        prediction: "",


    });

    const saveCallback = (data, isValid) => {
        if (isValid) {
            setLoading(true);
            useApi
                .doRun(recordId > 0 ? "put" : "post", `patients/${id}/patient_braden_scale_score_evaluation/${recordId}`, {
                    id: parseInt(recordId),
                    patient_id: parseInt(id),
                    data_date: dateToISOString(new Date(data.data_date)),
                    sensory_perception_id: isNaN(data.sensory_perception_id) ? null : parseInt(data.sensory_perception_id),
                    moisture_id: isNaN(data.moisture_id) ? null : parseInt(data.moisture_id),
                    activity_id: isNaN(data.activity_id) ? null : parseInt(data.activity_id),
                    mobility_id: isNaN(data.mobility_id) ? null : parseInt(data.mobility_id),
                    nutrition_id: isNaN(data.nutrition_id) ? null : parseInt(data.nutrition_id),
                    friction_and_shear_id: isNaN(data.friction_and_shear_id) ? null : parseInt(data.friction_and_shear_id),
                    score: isNaN(data.score) ? null : parseInt(data.score),
                    prediction: data.prediction,


                })
                .then((res) => {
                    toast("Patient Lower Extremities Assessment Saved Successfully!");
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

    React.useEffect(() => {

        if (recordId > 0) {
            useApi
                .get(`/patients/${id}/patient_braden_scale_score_evaluation/${recordId}`, {})
                .then((res) => {
                    const data = res.data.data;
                    setFormData({
                        data_date: data.data_date,
                        sensory_perception_id: isNaN(data.sensory_perception_id) ? null : parseInt(data.sensory_perception_id),
                        moisture_id: isNaN(data.moisture_id) ? null : parseInt(data.moisture_id),
                        activity_id: isNaN(data.activity_id) ? null : parseInt(data.activity_id),
                        mobility_id: isNaN(data.mobility_id) ? null : parseInt(data.mobility_id),
                        nutrition_id: isNaN(data.nutrition_id) ? null : parseInt(data.nutrition_id),
                        friction_and_shear_id: isNaN(data.friction_and_shear_id) ? null : parseInt(data.friction_and_shear_id),
                        score: isNaN(data.score) ? null : parseInt(data.score),
                        prediction: data.prediction,
                    });
                    setLoading(false);
                })
                .catch((err) => {
                    showAlertError(err);
                    setLoading(false);
                });

        } else {
            setFormData({
                data_date: "",
                sensory_perception_id: "",
                moisture_id: "",
                activity_id: "",
                mobility_id: "",
                nutrition_id: "",
                friction_and_shear_id: "",
                score: "",
                prediction: "",        
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
                        <h1>Add New Braden Scale Score Evaluation</h1>
                        <p>Enter the values to continue</p>
                    </div>

                    <EditPatientBradenScaleScoreEvaluation callBack={saveCallback} doSubmit={doSubmit} formData={formData}></EditPatientBradenScaleScoreEvaluation>

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

export default PatientBradenScaleScoreEvaluationDialog;

