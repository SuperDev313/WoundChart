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

const ProductEditPopup = ({ open, doTogglePopup, recordId, doReloadTable }) => {
  let formSchema = yup.object().shape({
    product_name: yup
      .string()
      .label("Product Name")
      .trim()
      .required("Product Name is Required, Please fill it")
      .min(3)
      .max(64),
    product_type_id: yup.number().label("Product Type").required("Select a Product type"),
    hcpcs_code: yup.string().label("Hcpcs Code").max(20).notRequired("Product HCPS Code is Required, Please fill it"),
    product_code: yup.string().label("Product Code").max(20).notRequired("Product Code is Required, Please fill it"),
    product_price: yup
      .number()
      .transform((o, v) => (parseFloat((v + "").replace(/,/g, ""))))
      .label("Product Price")
      .typeError("Product Price must be a Number")
      .notRequired(),
    is_active: yup.bool().label("Is Active"),
  });

  // ** States
  const [productTypes, setproductTypes] = useState([{ label: "", value: "" }]);
  const [loading, setLoading] = useState(false);

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(formSchema), shouldFocusError: true });

  React.useEffect(() => {
    if (recordId != "" && recordId !== 0) {
      doTogglePopup();
      setLoading(true);

      useApi
        .get(`/products/${recordId}`, {})
        .then((res) => {
          const data = res.data.data;
          setValue("product_name", data.product_name);
          setValue("product_type_id", data.product_type_id);
          setValue("hcpcs_code", data.hcpcs_code);
          setValue("product_code", data.product_code);
          setValue("product_price", data.product_price);
          setValue("is_active", data.is_active);

          setLoading(false);
        })
        .catch((err) => {
          showAlertError(err);
          setLoading(false);
        });
    }
  }, [recordId]);

  React.useEffect(() => {
    const fetchData = () => {
      useApi
        .get("/lookup/product_types", {})
        .then((res) => {
          var items = [{ label: "", value: "" }];
          res.data.data.map((r) => {
            const option = { label: r.description ?? r.name, value: r.id };
            items.push(option);
            return option;
          });
          setproductTypes(items);
        })
        .catch((err) => {
          showAlertError(err);
        });
    };
    fetchData();
  }, []);

  // ** Function to handle form submit
  const onSubmit = (data) => {
    setLoading(true);
    useApi
      .doRun(recordId > 0 ? "put" : "post", (recordId > 0 ? `/products/${recordId}`: `/products/-1`), {
        id: parseInt(recordId),
        product_type_id: parseInt(data.product_type_id),
        product_name: data.product_name,
        hcpcs_code: data.hcpcs_code,
        product_code: data.product_code,
        product_price: data.product_price,
        is_active: data.is_active,
      })
      .then((res) => {
        toast("Product Updated Successfully!");
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
      product_name: "",
    });
  };

  return (
    <Sidebar
      size="lg"
      open={open}
      title="New Product"
      headerClassName="mb-1"
      contentClassName="pt-0"
      doTogglePopup={doTogglePopup}
      onClosed={handleSidebarClosed}
    >
      <UILoader blocking={loading} loader={<DefaultLoader />}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-1">
            <Label className="form-label" for="product_name">
              Product Name <span className="text-danger">*</span>
            </Label>
            <Controller
              id="product_name"
              name="product_name"
              control={control}
              render={({ field }) => (
                <Input invalid={errors.product_name && true} {...field} />
              )}
            />

            {errors.product_name && (
              <FormFeedback>{errors.product_name.message}</FormFeedback>
            )}
          </div>

          <div className="mb-1">
            <div className="form-check form-check-inline">
              <Controller
                id="is_active"
                name="is_active"
                control={control}
                render={({ field: { value, ...field } }) => (
                  <Input
                    type="checkbox"
                    invalid={errors.is_active && true}
                    checked={!!value}
                    {...field}
                  />
                )}
              />

              {errors.is_active && (
                <FormFeedback>{errors.is_active.message}</FormFeedback>
              )}
              <Label for="basic-cb-checked" className="form-check-label">
                Is Active
              </Label>
            </div>
          </div>

          <div className="mb-1">
            <Label className="form-label" for="hcpcs_code">
              Product HCPS Code <span className="text-danger">*</span>
            </Label>
            <Controller
              id="hcpcs_code"
              name="hcpcs_code"
              control={control}
              render={({ field }) => (
                <Input invalid={errors.hcpcs_code && true} {...field} />
              )}
            />

            {errors.hcpcs_code && (
              <FormFeedback>{errors.hcpcs_code.message}</FormFeedback>
            )}
          </div>

          <div className="mb-1">
            <Label className="form-label" for="product_code">
              Product Code <span className="text-danger">*</span>
            </Label>
            <Controller
              id="product_code"
              name="product_code"
              control={control}
              render={({ field }) => (
                <Input invalid={errors.product_code && true} {...field} />
              )}
            />

            {errors.product_code && (
              <FormFeedback>{errors.product_code.message}</FormFeedback>
            )}
          </div>

          <div className="mb-1">
            <Label className="form-label" for="product_price">
              Product Price <span className="text-danger">*</span>
            </Label>

            <Controller
              id="product_price"
              name="product_price"
              control={control}
              placeholder="10,000"
              render={({ field: { ref, ...field } }) => (
                <MyCleave
                  {...field}
                  inputMode="numeric"
                  maxLength="5"
                  className={classnames("form-control", {
                    "is-invalid": errors.product_price && true,
                  })}
                  options={{
                    numeral: true,
                    numeralThousandsGroupStyle: "thousand",
                  }}
                />
              )}
            />

            {errors.product_price && (
              <FormFeedback>{errors.product_price.message}</FormFeedback>
            )}
          </div>

          <div className="mb-1">
            <Label className="form-label" for="product_type_id">
              Select Product Type <span className="text-danger">*</span>
            </Label>

            <Controller
              name="product_type_id"
              control={control}
              render={({ field }) => (
                <Input
                  type="select"
                  id="product_type_id"
                  invalid={errors.product_type_id && true}
                  {...field}
                >
                  {productTypes.map &&
                    productTypes.map((item, index) => (
                      <option value={item.value} key={item.value}>
                        {item.label}
                      </option>
                    ))}
                </Input>
              )}
            />
            {errors.product_type_id && (
              <FormFeedback>{errors.product_type_id.message}</FormFeedback>
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

export default ProductEditPopup;
