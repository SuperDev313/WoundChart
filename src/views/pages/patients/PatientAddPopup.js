// ** React Import
import React, { useState } from "react";
import classnames from "classnames";
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
  Label,
  FormText,
  Form,
  Input,
  FormFeedback,
  Modal,
  ModalBody,
  ModalHeader,
} from "reactstrap";

import EditProfile from "../../../components/edits/patients/EditProfile";

const PatientAddPopup = ({ open, doTogglePopup, recordId, doHandleSaveAndClosePopup }) => {
  const [loading, setLoading] = useState(false);
  const [doNext, setDoNext] = useState(false);

  const [formData, setFormData] = useState({
    record_number: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    second_last_name: "",
    date_of_birth: "",
    gender_id: "",
  });

  const saveCallback = (data, isValid) => {
    if (isValid) {
      setLoading(true);
      useApi
        .doRun("post", `/patients/0`, {
          first_name: data.first_name,
          middle_name: data.middle_name,
          last_name: data.last_name,
          second_last_name: data.second_last_name,
          date_of_birth: data.date_of_birth,
          gender_id: isNaN(data.gender_id) ? null: parseInt(data.gender_id),
        })
        .then((res) => {
          toast("Patient Added Successfully!");
          setLoading(false);
          doHandleSaveAndClosePopup(res.data.data.id);
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
      toggle={doTogglePopup}
    >
      <UILoader blocking={loading} loader={<DefaultLoader />}>
        <ModalHeader
          className="bg-transparent"
          toggle={doTogglePopup}
        ></ModalHeader>
        <ModalBody className="px-5 pb-5">
          <div className='text-center mb-4'>
            <h1>Add new Patient</h1>
            <p>Please fill out the form to add a new Patient.</p>
          </div>

          <EditProfile callBack={saveCallback} doSubmit={doNext} formData={formData}></EditProfile>

          <Button type="button" className="me-1" color="primary" onClick={() => setDoNext(true)}>
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

export default PatientAddPopup;
