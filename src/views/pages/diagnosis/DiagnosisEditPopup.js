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

// ** Reactstrap Imports
import { Button, Label, FormText, Form, Input, FormFeedback } from "reactstrap";

const DiagnosisEditPopup = ({
  open,
  doTogglePopup,
  recordId,
  doReloadTable,
}) => {
  let formSchema = yup.object().shape({
    description: yup.string().max(1200).required().label("Description"),
    code: yup.string().max(20).required().label("Code"),
  });

  // ** States
  //const [productTypes, setproductTypes] = useState([{ label: "", value: "" }]);
  const [loading, setLoading] = useState(false);

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(formSchema) });

  React.useEffect(() => {
    if (recordId != "" && recordId !== 0) {
      doTogglePopup();
      setLoading(true);

      useApi
        .get(`/diagnoses/${recordId}`, {})
        .then((res) => {
          const data = res.data.data;
          setValue("description", data.description);
          setValue("code", data.code);

          setLoading(false);
        })
        .catch((err) => {
          showAlertError(err);
          setLoading(false);
        });
    }
  }, [recordId]);

  // ** Function to handle form submit
  const onSubmit = (data) => {
    setLoading(true);
    useApi
      .doRun(recordId > 0 ? "put" : "post", `/diagnoses/${recordId}`, {
        id: parseInt(recordId),
        description: data.description,
        code: data.code,
      })
      .then((res) => {
        toast("Diagnosis Updated Successfully!");
        setLoading(false);
        doReloadTable();
      })
      .catch((err) => {
        setLoading(false);
        showAlertError(err);
      });
  };

  const handleSidebarClosed = () => {
    reset({
        description: "",
        code: ""
    });
  };

  return (
    <Sidebar
      size="lg"
      open={open}
      title="New Diagnosis"
      headerClassName="mb-1"
      contentClassName="pt-0"
      doTogglePopup={doTogglePopup}
      onClosed={handleSidebarClosed}
    >
      <UILoader blocking={loading} loader={<DefaultLoader />}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-1">
            <Label className="form-label" for="description">
              Description
            </Label>

            <Controller
              id="description"
              name="description"
              control={control}
              render={({ field }) => (
                <Input invalid={errors.description && true} {...field} />
              )}
            />
            {errors.description && (
              <FormFeedback>{errors.description.message}</FormFeedback>
            )}

            <Label className="form-label" for="code">
              Code
            </Label>
          </div>
          <div className="mb-1">
            <Controller
              id="code"
              name="code"
              control={control}
              render={({ field }) => (
                <Input invalid={errors.code && true} {...field} />
              )}
            />
            {errors.code && <FormFeedback>{errors.code.message}</FormFeedback>}
          </div>

          <Button type="submit" className="me-1" color="primary">
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
        </Form>
      </UILoader>
    </Sidebar>
  );
};

export default DiagnosisEditPopup;
