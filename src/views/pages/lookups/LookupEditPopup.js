// ** React Import
import React, { useState } from "react";
// ** Custom Components
import Sidebar from "@components/sidebar";
import useApi from "../../../api/useApi";
import { DefaultLoader } from "../../../components/spinner/LoadingSpinner";
import UILoader from "../../../components/ui-loader";

// ** Utils
import { showAlertError } from "../../../components/alerts/AlertUtils";

// ** Third Party Components
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// ** Reactstrap Imports
import { Button, Label, FormText, Form, Input, FormFeedback } from "reactstrap";

const LookupEditPopup = ({
  open,
  doTogglePopup,
  recordId,
  doReloadTable,
  entity='allergies',
  entityLabel='Allergies'
}) => {
  let formSchema = yup.object().shape({
    description: yup.string().max(254).trim().required("Description is required").label("Description"),
  });

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
        .get(`/lookups/${entity}/${recordId}`, {})
        .then((res) => {
          const data = res.data.data;
          setValue("description", data.description);

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
      .doRun(recordId > 0 ? "put" : "post", `/lookups/${entity}/${recordId}`, {
        id: parseInt(recordId),
        description: data.description,
      })
      .then((res) => {
        toast(`${entityLabel} Updated Successfully!`);
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
    });
  };

  return (
    <Sidebar
      size="lg"
      open={open}
      title="New Record"
      headerClassName="mb-1"
      contentClassName="pt-0"
      doTogglePopup={doTogglePopup}
      onClosed={handleSidebarClosed}
    >
      <UILoader blocking={loading} loader={<DefaultLoader />}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-1">
            <Label className="form-label" for="description">
              Name <span className="text-danger">*</span>
            </Label>

            <Controller
              id="description"
              name="description"
              control={control}
              render={({ field }) => (
                <Input invalid={errors.description && true} {...field} />
              )}
            />
            {errors.description && <FormFeedback>{errors.description.message}</FormFeedback>}
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

export default LookupEditPopup;
