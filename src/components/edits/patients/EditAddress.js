// ** React Imports
import React, { Fragment, useState } from "react";

// ** Utils
import { isObjEmpty } from "@utils";
import classnames from "classnames";

// ** Third Party Components
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import MyCleave from "../../forms/MyCleave";
import useApi from "../../../api/useApi";

// ** Utils
import { showAlertError } from "../../alerts/AlertUtils";

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

const EditAddress = ({ formData, doSubmit, callBack }) => {
    const [states, setStates] = useState([{ label: "", value: "" }]);

    const formSchema = yup.object().shape({
        address: yup
            .string()
            .max(250, "Address should not exceed 250 characters")
            .required("Address is required."),
        
        address1: yup
            .string()
            .max(250, "Address Line 2 should not exceed 250 characters")
            .notRequired("Address is required."),

        city: yup
            .string()
            .max(120, "City should not exceed 120 characters")
            .required("City is required."),

        country: yup
            .string()
            .max(120, "Country should not exceed 120 characters")
            .required("Country is required."),

        zip_code: yup
            .string()
            .required("Zip Code is required.")
            .matches(/^\d+$/, "Zip Code must contain only digits")
            .length(5, "Zip Code should be exactly 5 digits"),

        fax: yup
            .string()
            .max(120, "Fax should not exceed 120 characters"),

        phone: yup
            .string()
            .max(120, "Phone should not exceed 120 characters"),

        state_id: yup
            .number()
            .required("State is required.")
            .label("State"),

        state_name: yup
            .string(),
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

    const onSubmit = (data) => {
        callBack(data, isObjEmpty(errors))
    };

    React.useEffect(() => {
        const fetchData = () => {
            useApi
                .get("/lookup/states", {})
                .then((res) => {
                    var items = [{ label: "", value: "" }];
                    res.data.data.map((r) => {
                        const option = { label: r.description ?? r.name, value: r.id };
                        items.push(option);
                        return option;
                    });
                    setStates(items);
                })
                .catch((err) => {
                    console.error(err);
                });
        };
        fetchData();
    }, []);

    React.useEffect(() => {
        const fetchFormData = () => {

            if (formData) {
                setValue("address", formData.address)
                setValue("address1", formData.address1)
                setValue("city", formData.city)
                setValue("country", formData.country == null ? "US" : formData.country)
                setValue("zip_code", formData.zip_code)
                setValue("fax", formData.fax)
                setValue("phone", formData.phone)
                setValue("state_id", formData.state_id)
            }

        };
        fetchFormData();
    }, []);

    React.useEffect(() => {
        const doRun = async () => {
            const result = await trigger();
            callBack(getValues(), result)
        }
        if (doSubmit) {
            doRun()
        }

    }, [doSubmit]);

    const state_id = watch("state_id")

    React.useEffect(() => {
        try {
            const state = states.find(subject => subject.value === parseInt(state_id)).label
            setValue("state_name", state)
        } catch (e) {
            setValue("state_name", "")
        }
    }, [state_id])

    return (
        <Fragment>

            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <Col md="12" className="mb-1">
                        <Label className="form-label" for="address">
                            Address 1
                        </Label>

                        <Controller
                            id="address"
                            name="address"
                            control={control}
                            render={({ field }) => (
                                <Input invalid={errors.address && true} {...field} />
                            )}
                        />
                        {errors.address && (
                            <FormFeedback>{errors.address.message}</FormFeedback>
                        )}
                    </Col>
                    <Col md="12" className="mb-1">
                        <Label className="form-label" for="address1">
                            Additional 2
                        </Label>

                        <Controller
                            id="address1"
                            name="address1"
                            control={control}
                            render={({ field }) => (
                                <Input invalid={errors.address1 && true} {...field} />
                            )}
                        />
                        {errors.address1 && (
                            <FormFeedback>{errors.address1.message}</FormFeedback>
                        )}
                    </Col>
                </Row>
                <Row>
                    <div className="col-md-6 mb-1">
                        <Label className="form-label" for="city">
                            City
                        </Label>

                        <Controller
                            id="city"
                            name="city"
                            control={control}
                            render={({ field }) => (
                                <Input invalid={errors.city && true} {...field} />
                            )}
                        />
                        {errors.city && <FormFeedback>{errors.city.message}</FormFeedback>}
                    </div>
                    <div className="col-md-6 mb-1">
                        <Label className="form-label" for="state_id">
                            State
                        </Label>

                        <Controller
                            name="state_id"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="select"
                                    id="state_id"
                                    invalid={errors.state_id && true}
                                    {...field}
                                >
                                    {states.map &&
                                        states.map((item, index) => (
                                            <option value={item.value} key={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                </Input>
                            )}
                        />
                        {errors.state_id && (
                            <FormFeedback>{errors.state_id.message}</FormFeedback>
                        )}
                    </div>
                </Row>

                <Row>


                    <div className="col-md-6 mb-1">
                        <Label className="form-label" for="zip_code">
                            Zip Code
                        </Label>

                        <Controller
                            id="zip_code"
                            name="zip_code"
                            control={control}
                            render={({ field }) => (
                                <Input invalid={errors.zip_code && true} {...field} />
                            )}
                        />
                        {errors.zip_code && (
                            <FormFeedback>{errors.zip_code.message}</FormFeedback>
                        )}
                    </div>

                    <div className="col-md-6 mb-1">
                        <Label className="form-label" for="country">
                            Country
                        </Label>

                        <Controller
                            id="country"
                            name="country"
                            control={control}
                            render={({ field }) => (
                                <Input invalid={errors.country && true} {...field} />
                            )}
                        />
                        {errors.country && (
                            <FormFeedback>{errors.country.message}</FormFeedback>
                        )}
                    </div>
                </Row>

                <Row>
                    <div className="col-md-6 mb-1">
                        <Label className="form-label" for="phone">
                            Phone
                        </Label>

                        <InputGroup className="input-group-merge">
                            <InputGroupText>US (+1)</InputGroupText>
                            <Controller
                                id="phone"
                                name="phone"
                                control={control}
                                placeholder="1 234 567 8900"
                                render={({ field: { ref, ...field } }) => (
                                    <MyCleave
                                        {...field}
                                        className={classnames("form-control", {
                                            "is-invalid": errors.phone && true,
                                        })}
                                        options={{ phone: true, phoneRegionCode: "US" }}
                                    />
                                )}
                            />
                        </InputGroup>

                        {errors.phone && (
                            <FormFeedback>{errors.phone.message}</FormFeedback>
                        )}
                    </div>
                    <div className="col-md-6 mb-1">
                        <Label className="form-label" for="fax">
                            Fax
                        </Label>

                        <InputGroup className="input-group-merge">
                            <InputGroupText>US (+1)</InputGroupText>
                            <Controller
                                id="fax"
                                name="fax"
                                control={control}
                                placeholder="1 234 567 8900"
                                render={({ field: { ref, ...field } }) => (
                                    <MyCleave
                                        {...field}
                                        className={classnames("form-control", {
                                            "is-invalid": errors.fax && true,
                                        })}
                                        options={{ phone: true, phoneRegionCode: "US" }}
                                    />
                                )}
                            />
                        </InputGroup>


                        {errors.fax && <FormFeedback>{errors.fax.message}</FormFeedback>}
                    </div>
                </Row>
              
            </Form>
        </Fragment>
    );
};

export default EditAddress;
