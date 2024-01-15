// ** React Import
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Check, X } from 'react-feather';
import classnames from "classnames";
import { Button, Label, FormText, Form, Input, FormFeedback, Modal, ModalBody, ModalHeader } from "reactstrap";
import toast from "react-hot-toast";

// ** Custom Components
import useApi from "../../../api/useApi";
import { DefaultLoader } from "../../../components/spinner/LoadingSpinner";
import UILoader from "../../../components/ui-loader";
import EditPatientMiniNutritionalAssesment from "./EditPatientMiniNutritionalAssesment";
import { showAlertError } from "../../../components/alerts/AlertUtils";

// ** Utils
import { dateToISOString } from "../../../utility/Utils";

const PatientMiniNutritionalAssesmentDialog = ({ open, doTogglePopup, recordId, doHandleSaveAndClosePopup }) => {
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [doSubmit, setDoSubmit] = useState(false);
  const [editOrAdd, setEditOrAdd] = useState('Add New');

  const [formData, setFormData] = useState({
    patient_id: id,
    data_date: "",
    food_intake_declined_id: "",
    weight_loss_id: "",
    mobility_id: "",
    suffered_psychological_stress: "",
    neuropsychological_problems_id: "",
    bmi_available: "",
    score: "",
  });

  const saveCallback = (data, isValid) => {
    if (isValid) {
      setLoading(true);
      useApi
        .doRun(recordId > 0 ? "put" : "post", `patients/${id}/patient_mini_nutritional_assesment/${recordId}`, {
          patient_id: parseInt(id),
          data_date: dateToISOString(new Date(data.data_date)),
          food_intake_declined_id: isNaN(data.food_intake_declined_id) ? null : parseInt(data.food_intake_declined_id),
          weight_loss_id: isNaN(data.weight_loss_id) ? null : parseInt(data.weight_loss_id),
          mobility_id: isNaN(data.mobility_id) ? null : parseInt(data.mobility_id),
          suffered_psychological_stress: data.suffered_psychological_stress === "" ? null : data.suffered_psychological_stress,
          neuropsychological_problems_id: isNaN(data.neuropsychological_problems_id) ? null : parseInt(data.neuropsychological_problems_id),
          bmi_available: data.bmi_available === "" ? null : data.bmi_available,
          score: isNaN(data.score) ? null : parseInt(data.score),
        })
        .then((res) => {
          toast("patient_mini_nutritional_assesment Saved Successfully!");
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
      setEditOrAdd('Edit');
      setLoading(true);
  
      useApi
        .get(`/patients/${id}/patient_mini_nutritional_assesment/${recordId}`, {})
        .then((res) => {
          const data = res.data.data;
          setFormData({
            data_date: data.data_date,
            food_intake_declined_id: isNaN(data.food_intake_declined_id) ? null : parseInt(data.food_intake_declined_id),
            weight_loss_id: isNaN(data.weight_loss_id) ? null : parseInt(data.weight_loss_id),
            mobility_id: isNaN(data.mobility_id) ? null : parseInt(data.mobility_id),
            suffered_psychological_stress: data.suffered_psychological_stress,
            neuropsychological_problems_id: isNaN(data.neuropsychological_problems_id) ? null : parseInt(data.neuropsychological_problems_id),
            bmi_available: data.bmi_available,
            score: isNaN(data.score) ? null : parseInt(data.score),
          });
          setLoading(false);
        })
        .catch((err) => {
          showAlertError(err);
          setLoading(false);
        });
    }
  }, [recordId, id]); // Add `id` to the dependency array
  

  return (
    <Modal
      isOpen={open}
      className="modal-dialog-centered modal-lg"
      toggle={doTogglePopup}
    >
      <UILoader blocking={loading} loader={<DefaultLoader />}>
        <ModalHeader className="bg-transparent" toggle={doTogglePopup}></ModalHeader>
        <ModalBody className="px-5 pb-5">
          <div className='text-center mb-4'>
            <h1>{editOrAdd} Patient Mini Nutritional Assesment</h1>
            <p>Enter the values to continue</p>
          </div>

          <EditPatientMiniNutritionalAssesment callBack={saveCallback} doSubmit={doSubmit} formData={formData} />

          <Button type="button" className="me-1" color="primary" onClick={() => setDoSubmit(true)}>
            Submit
          </Button>
          <Button type="reset" color="secondary" outline onClick={doTogglePopup}>
            Cancel
          </Button>
        </ModalBody>
      </UILoader>
    </Modal>
  );
};

export default PatientMiniNutritionalAssesmentDialog;
