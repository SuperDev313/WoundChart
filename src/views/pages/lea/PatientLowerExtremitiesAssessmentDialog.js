
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

import EditPatientLowerExtremitiesAssessment from "./EditLeaWizard";
import { dateToISOString } from "../../../utility/Utils";

const PatientLowerExtremitiesAssessmentDialog = ({ open, doTogglePopup, recordId, doHandleSaveAndClosePopup }) => {

    const { id } = useParams();

    const [loading, setLoading] = useState(false);
    const [doSubmit, setDoSubmit] = useState(false);

    const [formData, setFormData] = useState({
        patient_id: id,
        visit_date: "",
        history_of_dvt: "",
        hx_of_prior_wound_or_ulcer: "",
        hx_of_prior_amputation: "",
        hx_of_prior_wound_amputation_detail: "",
        previous_vascular_studies: "",
        offloading_device_in_use: "",
        compression_device_in_use: "",
        color_right_lower_extremity_id: "",
        color_leftt_lower_extremity_id: "",
        edema_right_lower_extremity: "",
        edema_left_lower_extremity: "",
        sensation_right_lower_extremity_id: "",
        sensation_left_lower_extremity_id: "",
        hair_growth_right_lower_extremity: "",
        hair_growth_left_lower_extremity: "",
        erythema_right_lower_extremity: "",
        erythema_left_lower_extremity: "",
        dependant_rubor_right_lower_extremity: "",
        dependant_rubor_left_lower_extremity: "",
        lipodermatosclerosis_right_lower_extremity: "",
        lipodermatosclerosis_left_lower_extremity: "",
        capillary_refill_right_lower_extremity: "",
        capillary_refill_left_lower_extremity: "",
        popliteal_right_lower_extremity_id: "",
        popliteal_left_lower_extremity_id: "",
        posterior_tibialis_right_lower_extremity_id: "",
        posterior_tibialis_left_lower_extremity_id: "",
        dorsalis_pedis_right_lower_extremity_id: "",
        dorsalis_pedis_left_lower_extremity_id: "",
        additional_comments: "",

        color_right_lower_extremity_id_description: "",
        color_leftt_lower_extremity_id_description: "",
        sensation_right_lower_extremity_id_description: "",
        sensation_left_lower_extremity_id_description: "",
        popliteal_right_lower_extremity_id_description: "",
        popliteal_left_lower_extremity_id_description: "",
        posterior_tibialis_right_lower_extremity_id_description: "",
        posterior_tibialis_left_lower_extremity_id_description: "",
        dorsalis_pedis_right_lower_extremity_id_description: "",
        dorsalis_pedis_left_lower_extremity_id_description: "",

    });

    const saveCallback = (data, isValid) => {
 
        if (isValid) {
            setLoading(true);
            useApi
                .doRun( recordId > 0 ? "put": "post", `patients/${id}/patient_lower_extremities_assessment/${recordId}`, {
                    patient_id: parseInt(id),
                    visit_date: dateToISOString(new Date(data.visit_date)),
                    history_of_dvt: data.history_of_dvt == "" ? null : data.history_of_dvt,
                    hx_of_prior_wound_or_ulcer: data.hx_of_prior_wound_or_ulcer == "" ? null : data.hx_of_prior_wound_or_ulcer,
                    hx_of_prior_amputation: data.hx_of_prior_amputation == "" ? null : data.hx_of_prior_amputation,
                    hx_of_prior_wound_amputation_detail: data.hx_of_prior_wound_amputation_detail,
                    previous_vascular_studies: data.previous_vascular_studies == "" ? null : data.previous_vascular_studies,
                    offloading_device_in_use: data.offloading_device_in_use == "" ? null : data.offloading_device_in_use,
                    compression_device_in_use: data.compression_device_in_use == "" ? null : data.compression_device_in_use,
                    color_right_lower_extremity_id: isNaN(data.color_right_lower_extremity_id) ? null : parseInt(data.color_right_lower_extremity_id),
                    color_leftt_lower_extremity_id: isNaN(data.color_leftt_lower_extremity_id) ? null : parseInt(data.color_leftt_lower_extremity_id),
                    edema_right_lower_extremity: data.edema_right_lower_extremity == "" ? null : data.edema_right_lower_extremity,
                    edema_left_lower_extremity: data.edema_left_lower_extremity == "" ? null : data.edema_left_lower_extremity,
                    sensation_right_lower_extremity_id: isNaN(data.sensation_right_lower_extremity_id) ? null : parseInt(data.sensation_right_lower_extremity_id),
                    sensation_left_lower_extremity_id: isNaN(data.sensation_left_lower_extremity_id) ? null : parseInt(data.sensation_left_lower_extremity_id),
                    hair_growth_right_lower_extremity: data.hair_growth_right_lower_extremity == "" ? null : data.hair_growth_right_lower_extremity,
                    hair_growth_left_lower_extremity: data.hair_growth_left_lower_extremity == "" ? null : data.hair_growth_left_lower_extremity,
                    erythema_right_lower_extremity: data.erythema_right_lower_extremity == "" ? null : data.erythema_right_lower_extremity,
                    erythema_left_lower_extremity: data.erythema_left_lower_extremity == "" ? null : data.erythema_left_lower_extremity,
                    dependant_rubor_right_lower_extremity: data.dependant_rubor_right_lower_extremity == "" ? null : data.dependant_rubor_right_lower_extremity,
                    dependant_rubor_left_lower_extremity: data.dependant_rubor_left_lower_extremity == "" ? null : data.dependant_rubor_left_lower_extremity,
                    lipodermatosclerosis_right_lower_extremity: data.lipodermatosclerosis_right_lower_extremity == "" ? null : data.lipodermatosclerosis_right_lower_extremity,
                    lipodermatosclerosis_left_lower_extremity: data.lipodermatosclerosis_left_lower_extremity == "" ? null : data.lipodermatosclerosis_left_lower_extremity,
                    capillary_refill_right_lower_extremity: data.capillary_refill_right_lower_extremity == "" ? null : data.capillary_refill_right_lower_extremity,
                    capillary_refill_left_lower_extremity: data.capillary_refill_left_lower_extremity == "" ? null : data.capillary_refill_left_lower_extremity,
                    popliteal_right_lower_extremity_id: isNaN(data.popliteal_right_lower_extremity_id) ? null : parseInt(data.popliteal_right_lower_extremity_id),
                    popliteal_left_lower_extremity_id: isNaN(data.popliteal_left_lower_extremity_id) ? null : parseInt(data.popliteal_left_lower_extremity_id),
                    posterior_tibialis_right_lower_extremity_id: isNaN(data.posterior_tibialis_right_lower_extremity_id) ? null : parseInt(data.posterior_tibialis_right_lower_extremity_id),
                    posterior_tibialis_left_lower_extremity_id: isNaN(data.posterior_tibialis_left_lower_extremity_id) ? null : parseInt(data.posterior_tibialis_left_lower_extremity_id),
                    dorsalis_pedis_right_lower_extremity_id: isNaN(data.dorsalis_pedis_right_lower_extremity_id) ? null : parseInt(data.dorsalis_pedis_right_lower_extremity_id),
                    dorsalis_pedis_left_lower_extremity_id: isNaN(data.dorsalis_pedis_left_lower_extremity_id) ? null : parseInt(data.dorsalis_pedis_left_lower_extremity_id),
                    additional_comments: data.additional_comments,

                })
                .then((res) => {
                    toast("PatientLowerExtremitiesAssessment Saved Successfully!");
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
            setLoading(true);
            useApi
                .get(`/patients/${id}/patient_lower_extremities_assessment/${recordId}`, {})
                .then((res) => {
                    const data = res.data.data;
                    setFormData({
                        visit_date: data.visit_date,
                        history_of_dvt: data.history_of_dvt,
                        hx_of_prior_wound_or_ulcer: data.hx_of_prior_wound_or_ulcer,
                        hx_of_prior_amputation: data.hx_of_prior_amputation,
                        hx_of_prior_wound_amputation_detail: data.hx_of_prior_wound_amputation_detail,
                        previous_vascular_studies: data.previous_vascular_studies,
                        offloading_device_in_use: data.offloading_device_in_use,
                        compression_device_in_use: data.compression_device_in_use,
                        color_right_lower_extremity_id: isNaN(data.color_right_lower_extremity_id) ? null : parseInt(data.color_right_lower_extremity_id),
                        color_leftt_lower_extremity_id: isNaN(data.color_leftt_lower_extremity_id) ? null : parseInt(data.color_leftt_lower_extremity_id),
                        edema_right_lower_extremity: data.edema_right_lower_extremity,
                        edema_left_lower_extremity: data.edema_left_lower_extremity,
                        sensation_right_lower_extremity_id: isNaN(data.sensation_right_lower_extremity_id) ? null : parseInt(data.sensation_right_lower_extremity_id),
                        sensation_left_lower_extremity_id: isNaN(data.sensation_left_lower_extremity_id) ? null : parseInt(data.sensation_left_lower_extremity_id),
                        hair_growth_right_lower_extremity: data.hair_growth_right_lower_extremity,
                        hair_growth_left_lower_extremity: data.hair_growth_left_lower_extremity,
                        erythema_right_lower_extremity: data.erythema_right_lower_extremity,
                        erythema_left_lower_extremity: data.erythema_left_lower_extremity,
                        dependant_rubor_right_lower_extremity: data.dependant_rubor_right_lower_extremity,
                        dependant_rubor_left_lower_extremity: data.dependant_rubor_left_lower_extremity,
                        lipodermatosclerosis_right_lower_extremity: data.lipodermatosclerosis_right_lower_extremity,
                        lipodermatosclerosis_left_lower_extremity: data.lipodermatosclerosis_left_lower_extremity,
                        capillary_refill_right_lower_extremity: data.capillary_refill_right_lower_extremity,
                        capillary_refill_left_lower_extremity: data.capillary_refill_left_lower_extremity,
                        popliteal_right_lower_extremity_id: isNaN(data.popliteal_right_lower_extremity_id) ? null : parseInt(data.popliteal_right_lower_extremity_id),
                        popliteal_left_lower_extremity_id: isNaN(data.popliteal_left_lower_extremity_id) ? null : parseInt(data.popliteal_left_lower_extremity_id),
                        posterior_tibialis_right_lower_extremity_id: isNaN(data.posterior_tibialis_right_lower_extremity_id) ? null : parseInt(data.posterior_tibialis_right_lower_extremity_id),
                        posterior_tibialis_left_lower_extremity_id: isNaN(data.posterior_tibialis_left_lower_extremity_id) ? null : parseInt(data.posterior_tibialis_left_lower_extremity_id),
                        dorsalis_pedis_right_lower_extremity_id: isNaN(data.dorsalis_pedis_right_lower_extremity_id) ? null : parseInt(data.dorsalis_pedis_right_lower_extremity_id),
                        dorsalis_pedis_left_lower_extremity_id: isNaN(data.dorsalis_pedis_left_lower_extremity_id) ? null : parseInt(data.dorsalis_pedis_left_lower_extremity_id),
                        additional_comments: data.additional_comments,
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
                visit_date: "",
                history_of_dvt: "",
                hx_of_prior_wound_or_ulcer: "",
                hx_of_prior_amputation: "",
                hx_of_prior_wound_amputation_detail: "",
                previous_vascular_studies: "",
                offloading_device_in_use: "",
                compression_device_in_use: "",
                color_right_lower_extremity_id: "",
                color_leftt_lower_extremity_id: "",
                edema_right_lower_extremity: "",
                edema_left_lower_extremity: "",
                sensation_right_lower_extremity_id: "",
                sensation_left_lower_extremity_id: "",
                hair_growth_right_lower_extremity: "",
                hair_growth_left_lower_extremity: "",
                erythema_right_lower_extremity: "",
                erythema_left_lower_extremity: "",
                dependant_rubor_right_lower_extremity: "",
                dependant_rubor_left_lower_extremity: "",
                lipodermatosclerosis_right_lower_extremity: "",
                lipodermatosclerosis_left_lower_extremity: "",
                capillary_refill_right_lower_extremity: "",
                capillary_refill_left_lower_extremity: "",
                popliteal_right_lower_extremity_id: "",
                popliteal_left_lower_extremity_id: "",
                posterior_tibialis_right_lower_extremity_id: "",
                posterior_tibialis_left_lower_extremity_id: "",
                dorsalis_pedis_right_lower_extremity_id: "",
                dorsalis_pedis_left_lower_extremity_id: "",
                additional_comments: "",
        
                color_right_lower_extremity_id_description: "",
                color_leftt_lower_extremity_id_description: "",
                sensation_right_lower_extremity_id_description: "",
                sensation_left_lower_extremity_id_description: "",
                popliteal_right_lower_extremity_id_description: "",
                popliteal_left_lower_extremity_id_description: "",
                posterior_tibialis_right_lower_extremity_id_description: "",
                posterior_tibialis_left_lower_extremity_id_description: "",
                dorsalis_pedis_right_lower_extremity_id_description: "",
                dorsalis_pedis_left_lower_extremity_id_description: "",
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
                        {recordId == "" && <h1>Add New Patient Lower Extremities Assessment</h1>}
                        {recordId != "" && <h1>Update Patient Lower Extremities Assessment</h1>}
                        <p>Enter the values to continue</p>
                    </div>

                    <EditPatientLowerExtremitiesAssessment callBack={saveCallback} doSubmit={doSubmit} formData={formData}></EditPatientLowerExtremitiesAssessment>

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

export default PatientLowerExtremitiesAssessmentDialog;

