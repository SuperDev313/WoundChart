// ** React Import
import React, { Fragment, useState } from "react";
import { useParams } from "react-router-dom";

// ** Custom Components
// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs";
// ** Utils
import { selectThemeColors } from "@utils";

import useApi from "../../../api/useApi";

// ** Utils
import { showAlertError } from "../../../components/alerts/AlertUtils";

// ** Third Party Components
import { useForm, Controller } from "react-hook-form";
import { Copy, MoreVertical, Edit2, Trash2 } from "react-feather";

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Form,
  Label,
  Input,
  Button,
  CardBody,
  CardText,
  CardTitle,
  CardHeader,
  FormFeedback,
} from "reactstrap";

// ** Store & Actions
import { useDispatch } from "react-redux";

const ProductEdit = () => {
  const { id } = useParams();

  const defaulFormData = {
    ProductTypeId: "",
    ProductName: "",
    HcpcsCode: "",
    ProductCode: "",
    ProductPrice: "",
    IsActive: "",
  };

  // ** Hooks

  const [recordId, setRecordId] = useState(id);
  const {
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm(defaulFormData);

  const title = recordId === 0 ? "Add Product" : "Edit Product";

  // *** remnote api call
  React.useEffect(() => {
    if (recordId != "" && recordId !== 0) {
      useApi
        .get(`/products/${recordId}`, {})
        .then((res) => {
          const data = res.data.data;
          setValue('ProductName', data.product_name)
        //   setFormData({
        //     ProductTypeId: data.product_type_id,
        //     ProductName: data.product_name,
        //     HcpcsCode: data.hcpcs_code,
        //     ProductCode: data.product_code,
        //     ProductPrice: data.product_price,
        //     IsActive: data.is_active,
        //   });

          //console.log(formData)
        })
        .catch((err) => {
          // setLoading(false);
          showAlertError(err);
          console.log(err);
        });
    }
  }, [recordId]);

  const onSubmit = (data) => {
    if (data.apiKeyName.length) {
      return null;
    } else {
      setError("apiKeyName", {
        type: "manual",
      });
    }
  };
  return (
    <Fragment>
      <Breadcrumbs
        title={title}
        data={[{ title: "Products" }, { title: `${title}` }]}
      />
      <Card>
        <CardHeader className="pb-0">
          <CardTitle tag="h4">Please provide the values</CardTitle>
        </CardHeader>
        <Row>
          <Col md={{ size: 5, order: 0 }} xs={{ size: 12, order: 1 }}>
            <CardBody>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-2">
                  <Label className="form-label" for="ProductName">
                    Product Name <span className="text-danger">*</span>
                  </Label>
                  <Controller
                    id="ProductName"
                    name="ProductName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        invalid={errors.ProductName && true}
                        {...field}
                        // onChange={(e) => {
                        //   console.log(e.target);
                        // }}
                      />
                    )}
                  />
                  {errors && errors.apiKeyName && (
                    <FormFeedback>
                      Please enter a valid API key name
                    </FormFeedback>
                  )}
                </div>
                <div>
                  <Button block type="submit" color="primary">
                    Create Key
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Col>
          <Col md={{ size: 7, order: 1 }} xs={{ size: 12, order: 0 }}></Col>
        </Row>
      </Card>
    </Fragment>
  );
};

export default ProductEdit;
