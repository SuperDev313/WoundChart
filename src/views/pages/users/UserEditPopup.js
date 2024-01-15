// ** React Import
import React, { useState } from "react";
import classnames from "classnames";
// ** Custom Components
import Sidebar from "@components/sidebar";
import useApi from "../../../api/useApi";
import { DefaultLoader } from "../../../components/spinner/LoadingSpinner";
import UILoader from "../../../components/ui-loader";
import MyCleave from "../../../components/forms/MyCleave";

// ** Utils
import { showAlertError } from "../../../components/alerts/AlertUtils";

// ** Third Party Components
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import FileUploaderSingle from "../../../components/upload-files/FileUploaderSingle";

// ** Reactstrap Imports
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Form,
  Label,
  Input,
  Row,
  Col,
  FormFeedback,
  InputGroup,
  InputGroupText,
} from "reactstrap";

const UserEditPopup = ({
  open,
  doTogglePopup,
  recordId,
  doReloadTable,
}) => {


  const formSchema = yup.object().shape({
    full_name: yup
        .string()
        .max(200, "Full Name must be at most 200 characters")
        .notRequired("Full Name is required")
        .label("Full Name"),

    phone_number: yup
        .number()
        .transform((value) => (!isNaN(value) ? value : null))
        .typeError("Phone Number must be a valid number")
        .max(9999999999, "Phone Number is too long")
        .nullable()
        .label("Phone Number"),

    logo: yup
        .string()
        .max(1000, "Logo URL must be at most 1000 characters")
        .notRequired("Logo URL is required")
        .label("Logo"),

    address: yup
        .string()
        .max(200, "Address must be at most 200 characters")
        .notRequired("Address is required")
        .label("Address"),

    phone: yup
        .string()
        .max(100, "Phone must be at most 100 characters")
        .notRequired("Phone is required")
        .label("Phone"),

    fax: yup
        .string()
        .max(100, "Fax must be at most 100 characters")
        .notRequired("Fax is required")
        .label("Fax"),

    email: yup
        .string()
        .max(100, "Email must be at most 100 characters")
        .email("Invalid Email format")
        .notRequired("Email is required")
        .label("Email"),

    license: yup
        .string()
        .max(100, "License must be at most 100 characters")
        .notRequired("License is required")
        .label("License"),

    status_id: yup
        .number()
        .typeError("Status must be a valid number")
        .integer("Status must be an integer")
        .nullable()
        .label("Status"),

    clinic_id: yup
        .number()
        .typeError("Clinic must be a valid number")
        .integer("Clinic must be an integer")
        .nullable()
        .label("Clinic"),

    user_type_id: yup
        .number()
        .typeError("User Type must be a valid number")
        .integer("User Type must be an integer")
        .nullable()
        .label("User Type"),

    clinician_type_id: yup
        .number()
        .typeError("Clinician Type must be a valid number")
        .integer("Clinician Type must be an integer")
        .nullable()
        .label("Clinician Type"),

    advance: yup
        .bool()
        .nullable()
        .label("Advance"),
  });


  // ** States
  const [loading, setLoading] = useState(false);
  const [userStatus, setUserStatus] = useState([{ label: "", value: "" }]);
  const [userType, setUserType] = useState([{ label: "", value: "" }]);

  const {
    trigger,
    control,
    setValue,
    getValues,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(formSchema) });


  React.useEffect(() => {

    if (recordId > 0) {
      useApi
        .get(`/users/${recordId}`, {})
        .then((res) => {
          const data = res.data.data;
          setValue("full_name", data.full_name);
          setValue("npi", isNaN(data.npi) ? null : parseInt(data.npi));
          setValue("logo", data.logo);
          setValue("address", data.address);
          setValue("phone", data.phone);
          setValue("fax", data.fax);
          setValue("email", data.email);
          setValue("status_id", isNaN(data.status_id) ? null : parseInt(data.status_id));
          setValue("advance", data.advance);
          setLoading(false);
        })
        .catch((err) => {
          showAlertError(err);
          setLoading(false);
        });

    }
    else {
      setValue("full_name", null);
      setValue("npi", null);
      setValue("logo", null);
      setValue("address", null);
      setValue("phone", null);
      setValue("fax", null);
      setValue("email", null);
      setValue("status_id", null);
      setValue("advance", null);
    }
  }, [recordId]);


  React.useEffect(() => {
    useApi
      .get("/lookup/user_status_options", {})
      .then((res) => {
        var items = [{ text: "", value: "" }];
        res.data.data.map((r) => {
          const option = { label: r.description, value: r.id };
          items.push(option);
          return option;
        });
        setUserStatus(items);
      })
      .catch((err) => {
        showAlertError(err);
      });


  }, []);

  React.useEffect(() => {
    useApi
      .get("/lookup/user_type_options", {})
      .then((res) => {
        var items = [{ text: "", value: "" }];
        res.data.data.map((r) => {
          console.log(r)
          const option = { label: r.description, value: r.id };
          items.push(option);
          return option;
        });
        setUserType(items);
      })
      .catch((err) => {
        showAlertError(err);
      });


  }, []);

  const onSubmit = (data, isValid) => {
    if (isValid) {
      setLoading(true);
      useApi
        .doRun(recordId != '' ? "put" : "post", `users/${recordId}`, {
          full_name: data.full_name,
          npi: isNaN(data.npi) ? null : parseInt(data.npi),
          logo: data.logo,
          address: data.address,
          phone: data.phone,
          fax: data.fax,
          email: data.email,
          status_id: isNaN(data.status_id) ? null : parseInt(data.status_id),
          advance: data.advance,
        })
        .then((res) => {
          toast("Clinic Saved Successfully!");
          doReloadTable();
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          showAlertError(err);
        });
    }
  }


  const doSubmit = async () => {
    const result = await trigger()

    onSubmit(getValues(), result)
  }

  const handleUploadAgencyLogo = (response) => {
    console.log('handleUploadAgencyLogo', response.file_url)

    setValue("logo", response.file_url);


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
            <h1>Add New User</h1>
            <p>Enter the values to continue</p>
          </div>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>



              <Col md="12" className="mb-1">
                <Label className="form-label" for="full_name">Full Name </Label>

                <Controller
                  id="full_name"
                  name="full_name"
                  control={control}
                  render={({ field: { onBlur, value, ...field } }) => (
                    <Input invalid={errors.full_name && true} {...field}
                      value={value} />
                  )}
                />

                {errors.full_name && (
                  <FormFeedback>{errors.full_name.message}</FormFeedback>
                )}
              </Col>

              <Col md="12" className="mb-1">
                <Label className="form-label" for="email">Email </Label>

                <Controller
                  id="email"
                  name="email"
                  control={control}
                  render={({ field: { onBlur, value, ...field } }) => (
                    <Input invalid={errors.email && true} {...field}
                      value={value} />
                  )}
                />

                {errors.email && (
                  <FormFeedback>{errors.email.message}</FormFeedback>
                )}
              </Col>

              <Col md="12" className="mb-1">
                <Label className="form-label" for="name">Password </Label>

                <Controller
                  id="password"
                  name="password"
                  control={control}
                  render={({ field: { onBlur, value, ...field } }) => (
                    <Input invalid={errors.password && true} {...field}
                      value={value} />
                  )}
                />

                {errors.password && (
                  <FormFeedback>{errors.password.message}</FormFeedback>
                )}
              </Col>

              <Col md="12" className="mb-1">
                <Controller
                  id="logo"
                  name="logo"
                  control={control}
                  render={({ field: { onBlur, value, ...field } }) => (
                    <img
                      src={value}
                      height="80"
                    />
                  )}
                />

              </Col>
              <Col className="pb-2 mb-lg-0 drop " lg={12} sm={12}>
                <div style={{ border: '1px solid', padding: '10px', borderRadius: "8px" }}>
                  <Label className="form-label" for="document_file">User Image</Label>
                    <FileUploaderSingle route="/files/upload/user_image" autoUpload={true} onResponseCallback={(res) => handleUploadAgencyLogo(res)} />
                </div>
              </Col>

              <Col className="col-md-6 mb-1">
                <Label className="form-label" for="status_id">Status </Label>

                <Controller
                  name="status_id"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="select"
                      id="status_id"
                      invalid={errors.status_id && true}
                      {...field}
                    >
                      {userStatus.map &&
                        userStatus.map((item, index) => (
                          <option value={item.value} key={item.value}>
                            {item.label}
                          </option>
                        ))}
                    </Input>
                  )}
                />
                {errors.status_id && (
                  <FormFeedback>{errors.status_id.message}</FormFeedback>
                )}
              </Col>

              <Col className="col-md-6 mb-1">
                <Label className="form-label" for="user_type_id">User Type </Label>

                <Controller
                  name="user_type_id"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="select"
                      id="user_type_id"
                      invalid={errors.user_type_id && true}
                      {...field}
                    >
                      {userType.map &&
                        userType.map((item, index) => (
                          <option value={item.value} key={item.value}>
                            {item.label}
                          </option>
                        ))}
                    </Input>
                  )}
                />
                {errors.user_type_id && (
                  <FormFeedback>{errors.user_type_id.message}</FormFeedback>
                )}
              </Col>

              <Col md="6" className="mb-1">
                <Label className="form-label" for="license">License No </Label>
                <Controller
                  id="license"
                  name="license"
                  control={control}
                  placeholder="10,000"
                  render={({ field: { onBlur, value, ...field } }) => (
                    <MyCleave
                      {...field}
                      value={value}
                      className={classnames("form-control", {
                        "is-invalid": errors.license && true,
                      })}
                      options={{
                        numeral: true,
                        numeralThousandsGroupStyle: "thousand",
                      }}
                    />
                  )}
                />

                {errors.license && (
                  <FormFeedback>{errors.license.message}</FormFeedback>
                )}
              </Col>

              <Col md="6" className="mb-1">
                <Label className="form-label" for="npi">Npi </Label>
                <Controller
                  id="npi"
                  name="npi"
                  control={control}
                  placeholder="10,000"
                  render={({ field: { onBlur, value, ...field } }) => (
                    <MyCleave
                      {...field}
                      value={value}
                      className={classnames("form-control", {
                        "is-invalid": errors.npi && true,
                      })}
                      options={{
                        numeral: true,
                        numeralThousandsGroupStyle: "thousand",
                      }}
                    />
                  )}
                />


                {errors.npi && (
                  <FormFeedback>{errors.npi.message}</FormFeedback>
                )}
              </Col>
              

              <Col md="12" className="mb-1">
                <Label className="form-label" for="name">Credentials </Label>

                <Controller
                  id="credentials"
                  name="credentials"
                  control={control}
                  render={({ field: { onBlur, value, ...field } }) => (
                    <Input invalid={errors.credentials && true} {...field}
                      value={value} />
                  )}
                />

                {errors.credentials && (
                  <FormFeedback>{errors.credentials.message}</FormFeedback>
                )}
              </Col>

            </Row>

          </Form>

          <Button type="button" className="me-1" color="primary" onClick={() => doSubmit()}>
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

export default UserEditPopup;
