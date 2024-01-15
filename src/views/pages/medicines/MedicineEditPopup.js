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

const MedicineEditPopup = ({
  open,
  doTogglePopup,
  recordId,
  doReloadTable,
}) => {
  let formSchema = yup.object().shape({
    appl_no: yup.number().notRequired().label("ApplNo"),
    product_no: yup.number().notRequired().label("ProductNo"),
    form: yup.string().max(250).trim().required().label("Form"),
    strength: yup.string().max(250).trim().required().label("Strength"),
    reference_drug: yup.number().notRequired().label("ReferenceDrug"),
    drug_name: yup.string().max(2000).trim().required().label("DrugName"),
    active_ingredient: yup
      .string()
      .max(5000)
      .trim()
      .required()
      .label("ActiveIngredient"),
    reference_standard: yup.number().notRequired().label("ReferenceStandard"),
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
        .get(`/medicines/${recordId}`, {})
        .then((res) => {
          const data = res.data.data;
          setValue("appl_no", data.appl_no);
          setValue("product_no", data.product_no);
          setValue("form", data.form);
          setValue("strength", data.strength);
          setValue("reference_drug", data.reference_drug);
          setValue("drug_name", data.drug_name);
          setValue("active_ingredient", data.active_ingredient);
          setValue("reference_standard", data.reference_standard);

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
      .doRun(recordId > 0 ? "put" : "post", (recordId > 0 ? `/medicines/${recordId}`: `/medicines/-1`), {
        id: parseInt(recordId),
        appl_no: data.appl_no,
        product_no: data.product_no,
        form: data.form,
        strength: data.strength,
        reference_drug: data.reference_drug,
        drug_name: data.drug_name,
        active_ingredient: data.active_ingredient,
        reference_standard: data.reference_standard,
      })
      .then((res) => {
        toast("Medicine Updated Successfully!");
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
      appl_no: "",
      product_no: "",
      form: "",
      strength: "",
      reference_drug: "",
      drug_name: "",
      active_ingredient: "",
      reference_standard: "",
    });
  };

  return (
    <Sidebar
      size="lg"
      open={open}
      title="New Medicine"
      headerClassName="mb-1"
      contentClassName="pt-0"
      doTogglePopup={doTogglePopup}
      onClosed={handleSidebarClosed}
    >
      <UILoader blocking={loading} loader={<DefaultLoader />}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-1">
            <Label className="form-label" for="appl_no">
              Appl_no
            </Label>

            <Controller
              id="appl_no"
              name="appl_no"
              control={control}
              placeholder="10,000"
              render={({ field: { ref, ...field } }) => (
                <MyCleave
                  {...field}
                  className={classnames("form-control", {
                    "is-invalid": errors.appl_no && true,
                  })}
                  options={{
                    numeral: true,
                    numeralThousandsGroupStyle: "thousand",
                  }}
                />
              )}
            />

            {errors.appl_no && (
              <FormFeedback>{errors.appl_no.message}</FormFeedback>
            )}
          </div>

          <div className="mb-1">
            <Label className="form-label" for="product_no">
              Product_no
            </Label>

            <Controller
              id="product_no"
              name="product_no"
              control={control}
              placeholder="10,000"
              render={({ field: { ref, ...field } }) => (
                <MyCleave
                  {...field}
                  className={classnames("form-control", {
                    "is-invalid": errors.product_no && true,
                  })}
                  options={{
                    numeral: true,
                    numeralThousandsGroupStyle: "thousand",
                  }}
                />
              )}
            />

            {errors.product_no && (
              <FormFeedback>{errors.product_no.message}</FormFeedback>
            )}
          </div>
          <div className="mb-1">
            <Label className="form-label" for="form">
              Form <span className="text-danger">*</span>
            </Label>

            <Controller
              id="form"
              name="form"
              control={control}
              render={({ field }) => (
                <Input invalid={errors.form && true} {...field} />
              )}
            />
            {errors.form && <FormFeedback>{errors.form.message}</FormFeedback>}
          </div>
          <div className="mb-1">
            <Label className="form-label" for="strength">
              Strength <span className="text-danger">*</span>
            </Label>

            <Controller
              id="strength"
              name="strength"
              control={control}
              render={({ field }) => (
                <Input invalid={errors.strength && true} {...field} />
              )}
            />
            {errors.strength && (
              <FormFeedback>{errors.strength.message}</FormFeedback>
            )}
          </div>

          <div className="mb-1">
            <Label className="form-label" for="reference_drug">
              Reference_drug
            </Label>

            <Controller
              id="reference_drug"
              name="reference_drug"
              control={control}
              placeholder="10,000"
              render={({ field: { ref, ...field } }) => (
                <MyCleave
                  {...field}
                  className={classnames("form-control", {
                    "is-invalid": errors.reference_drug && true,
                  })}
                  options={{
                    numeral: true,
                    numeralThousandsGroupStyle: "thousand",
                  }}
                />
              )}
            />

            {errors.reference_drug && (
              <FormFeedback>{errors.reference_drug.message}</FormFeedback>
            )}
          </div>
          <div className="mb-1">
            <Label className="form-label" for="drug_name">
              Drug_name <span className="text-danger">*</span>
            </Label>

            <Controller
              id="drug_name"
              name="drug_name"
              control={control}
              render={({ field }) => (
                <Input invalid={errors.drug_name && true} {...field} />
              )}
            />
            {errors.drug_name && (
              <FormFeedback>{errors.drug_name.message}</FormFeedback>
            )}
          </div>
          <div className="mb-1">
            <Label className="form-label" for="active_ingredient">
              Active_ingredient <span className="text-danger">*</span>
            </Label>

            <Controller
              id="active_ingredient"
              name="active_ingredient"
              control={control}
              render={({ field }) => (
                <Input invalid={errors.active_ingredient && true} {...field} />
              )}
            />
            {errors.active_ingredient && (
              <FormFeedback>{errors.active_ingredient.message}</FormFeedback>
            )}
          </div>

          <div className="mb-1">
            <Label className="form-label" for="reference_standard">
              Reference_standard
            </Label>

            <Controller
              id="reference_standard"
              name="reference_standard"
              control={control}
              placeholder="10,000"
              render={({ field: { ref, ...field } }) => (
                <MyCleave
                  {...field}
                  className={classnames("form-control", {
                    "is-invalid": errors.reference_standard && true,
                  })}
                  options={{
                    numeral: true,
                    numeralThousandsGroupStyle: "thousand",
                  }}
                />
              )}
            />

            {errors.reference_standard && (
              <FormFeedback>{errors.reference_standard.message}</FormFeedback>
            )}
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

export default MedicineEditPopup;
