// ** React Imports
import React, { Fragment, useState } from "react";

// ** Utils
import { isObjEmpty } from "@utils";

// ** Third Party Components
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { ArrowLeft, ArrowRight } from "react-feather";
import { yupResolver } from "@hookform/resolvers/yup";

import useApi from "../../../../api/useApi";
import { useParams } from "react-router-dom";

// ** Utils
import { showAlertError } from "../../../../components/alerts/AlertUtils";

// ** Reactstrap Imports
import { Form, Label, Input, Row, Col, Button, FormFeedback } from "reactstrap";

import EditProfile from "../../../../components/edits/patients/EditProfile";

const AccountDetails = ({ stepper, callBack }) => {
  const { id } = useParams();
  const [doNext, setDoNext] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    record_number: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    second_last_name: "",
    date_of_birth: "",
    gender_id: "",
  });

  React.useEffect(() => {

    setLoading(true);
    useApi
      .get(`/patients/${id}`, {})
      .then((res) => {
        const data = res.data.data;
        formData.record_number = data.record_number;
        formData.first_name = data.first_name;
        formData.middle_name = data.middle_name;
        formData.last_name = data.last_name;
        formData.second_last_name = data.second_last_name;
        formData.date_of_birth = data.date_of_birth;
        formData.gender_id = data.gender_id;

        setLoading(false);
      })
      .catch((err) => {
        showAlertError(err);
        setLoading(false);
      });

  }, [id]);


  const saveCallback = (data, isValid) => {
    if (isValid) {
      callBack(data)
      stepper.next();
    }
    setDoNext(false)
  }

  return (
    <Fragment>
      <div className="content-header">
        <h5 className="mb-0">Account Details</h5>
        <small className="text-muted">Enter Your Account Details.</small>
      </div>

      <EditProfile callBack={saveCallback} doSubmit={doNext} formData={formData}></EditProfile>

      <div className="d-flex justify-content-between">
        <Button color="secondary" className="btn-prev" outline disabled>
          <ArrowLeft
            size={14}
            className="align-middle me-sm-25 me-0"
          ></ArrowLeft>
          <span className="align-middle d-sm-inline-block d-none">
            Previous
          </span>
        </Button>
        <Button type="submit" color="primary" className="btn-next" onClick={() => setDoNext(true)}>
          <span className="align-middle d-sm-inline-block d-none">Next</span>
          <ArrowRight
            size={14}
            className="align-middle ms-sm-25 ms-0"
          ></ArrowRight>
        </Button>
      </div>
    </Fragment>
  );
};

export default AccountDetails;
