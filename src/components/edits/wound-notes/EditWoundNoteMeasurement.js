// ** React Imports
import React, { useState, useEffect } from "react";

// ** Third Party Components
import * as yup from "yup";
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import classnames from "classnames";

import MyCleave from "../../forms/MyCleave";
import useApi from "../../../api/useApi";
import WarningAlert from "../../alerts/Alert";

import "cleave.js/dist/addons/cleave-phone.us";

// ** Reactstrap Imports
import {
  Form,
  Label,
  Input,
  Row,
  Col,
  Button,
  FormFeedback,
  InputGroup,
  InputGroupText,
} from "reactstrap";

const EditWoundNoteMeasurement = ({ id, formData, doSubmit, callBack }) => {
  const [today] = useState(new Date().toISOString().substr(0, 10));
  const [woundMeasurements, setWoundMeasurements] = useState({
    lxw: 0,
    lxwxd: 0,
  });
  const [showAlert, setShowAlert] = useState(false);
  

  const formSchema = yup.object().shape({
    wound_length: yup
      .number()
      .transform((o, v) => parseFloat(v.toString().replace(/,/g, "")))
      .notRequired()
      .label("Wound Length"),
    wound_width: yup
      .number()
      .transform((o, v) => parseFloat(v.toString().replace(/,/g, "")))
      .notRequired()
      .label("Wound Width"),
    wound_depth: yup
      .number()
      .transform((o, v) => parseFloat(v.toString().replace(/,/g, "")))
      .notRequired()
      .label("Wound Depth"),
  });

  // ** Hooks
  const {
    trigger,
    control,
    setValue,
    getValues,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(formSchema) });

  useEffect(() => {
    const length = getValues("wound_length");
    const width = getValues("wound_width");
    const depth = getValues("wound_depth");
    // alert(length)

    if (length == 0 && width == 0 && depth == 0) {
        // Show warning alert
        setShowAlert(true);
    }


    const lxw = length && width ? length * width : 0;
    const lxwxd = length && width && depth ? length * width * depth : 0;

    setWoundMeasurements({ lxw, lxwxd });
  }, [watch("wound_length"), watch("wound_width"), watch("wound_depth")]);

  const dismissAlert = () => {
    setShowAlert(false);
  };

  useEffect(() => {
    const fetchFormData = () => {
      const length = parseFloat(formData.wound_length) || "";
      const width = parseFloat(formData.wound_width) || "";
      const depth = parseFloat(formData.wound_depth) || "";

      setValue("wound_length", length);
      setValue("wound_width", width);
      setValue("wound_depth", depth);

      setWoundMeasurements({
        lxw: length * width,
        lxwxd: length * width * depth,
      });
    };

    if (formData) {
      fetchFormData();
    }
  }, [formData]);

  useEffect(() => {
    const doRun = async () => {
      const result = await trigger();
      callBack(getValues(), result);
    };

    if (doSubmit) {
      doRun();
    }
  }, [doSubmit]);

  const onSubmit = (data) => {
    const onSubmit = (data) => {
        callBack(data, Object.keys(errors).length === 0);
    };
  };



  return (
    <>
        {showAlert && (
            <WarningAlert 
                variant="warning" 
                message="Wound will be considered closed. Even after your wound looks closed and repaired, it’s still healing." 
                isOpen={showAlert} 
                toggle={dismissAlert} 
            />
        )}

        <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
            <Col md="6" className="mb-1">
            <Label className="form-label" for="wound_length">
                Wound Length
            </Label>
            <Controller
                id="wound_length"
                name="wound_length"
                control={control}
                placeholder="10,000"
                render={({ field: { ref, ...field } }) => (
                <MyCleave
                    {...field}
                    className={classnames("form-control", {
                    "is-invalid": errors.wound_length,
                    })}
                    options={{
                    numeral: true,
                    numeralThousandsGroupStyle: "thousand",
                    }}
                />
                )}
            />

            {errors.wound_length && (
                <FormFeedback>{errors.wound_length.message}</FormFeedback>
            )}
            </Col>

            <Col md="6" className="mb-1">
            <Label className="form-label" for="wound_width">
                Wound Width
            </Label>
            <Controller
                id="wound_width"
                name="wound_width"
                control={control}
                placeholder="10,000"
                render={({ field: { ref, ...field } }) => (
                <MyCleave
                    {...field}
                    className={classnames("form-control", {
                    "is-invalid": errors.wound_width,
                    })}
                    options={{
                    numeral: true,
                    numeralThousandsGroupStyle: "thousand",
                    }}
                />
                )}
            />

            {errors.wound_width && (
                <FormFeedback>{errors.wound_width.message}</FormFeedback>
            )}
            </Col>

            <Col md="6" className="mb-1">
            <Label className="form-label" for="wound_depth">
                Wound Depth
            </Label>
            <Controller
                id="wound_depth"
                name="wound_depth"
                control={control}
                placeholder="10,000"
                render={({ field: { ref, ...field } }) => (
                <MyCleave
                    {...field}
                    className={classnames("form-control", {
                    "is-invalid": errors.wound_depth,
                    })}
                    options={{
                    numeral: true,
                    numeralThousandsGroupStyle: "thousand",
                    }}
                />
                )}
            />

            {errors.wound_depth && (
                <FormFeedback>{errors.wound_depth.message}</FormFeedback>
            )}
            </Col>

            <Col md="6" className="mb-1">
            <Label className="form-label" for="wound_lxw">
                Wound LxW
            </Label>
            <InputGroup>
                <Input
                id="wound_lxw"
                name="wound_lxw"
                disabled
                value={woundMeasurements.lxw.toLocaleString()}
                className={classnames("form-control", {
                    "is-invalid": errors.wound_lxw,
                })}
                />
                <InputGroupText>cm²</InputGroupText>
            </InputGroup>
            {errors.wound_lxw && (
                <FormFeedback>{errors.wound_lxw.message}</FormFeedback>
            )}
            </Col>

            <Col md="6" className="mb-1">
            <Label className="form-label" for="wound_lxwxd">
                Wound Lxwxd
            </Label>
            <InputGroup>
                <Input
                id="wound_lxwxd"
                name="wound_lxwxd"
                disabled
                value={woundMeasurements.lxwxd.toLocaleString()}
                className={classnames("form-control", {
                    "is-invalid": errors.wound_lxwxd,
                })}
                />
                <InputGroupText>cm²</InputGroupText>
            </InputGroup>

            {errors.wound_lxwxd && (
                <FormFeedback>{errors.wound_lxwxd.message}</FormFeedback>
            )}
            </Col>
        </Row>
        </Form>
    </>
  );
};

export default EditWoundNoteMeasurement;
