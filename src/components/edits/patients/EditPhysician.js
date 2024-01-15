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

const EditPhysician = ({ formData, doSubmit, callBack }) => {
    const formSchema = yup.object().shape({
        pcp: yup
            .string()
            .max(250, "PCP must not exceed 250 characters")
            .notRequired()
            .label("PCP"),
        pcp_phone: yup
            .string()
            .max(20, "PCP Phone must not exceed 20 characters")
            .notRequired()
            .label("PCP Phone"),
        pcp_fax: yup
            .string()
            .max(20, "PCP Fax must not exceed 20 characters")
            .notRequired()
            .label("PCP Fax"),
        pcp_email: yup
            .string()
            .max(250, "PCP Email must not exceed 250 characters")
            .notRequired()
            .email("Invalid PCP Email")
            .label("PCP Email"),
        wcp: yup
            .string()
            .max(250, "WCP must not exceed 250 characters")
            .notRequired()
            .label("WCP"),
        wcp_phone: yup
            .string()
            .max(20, "WCP Phone must not exceed 20 characters")
            .notRequired()
            .label("WCP Phone"),
        wcp_email: yup
            .string()
            .max(250, "WCP Email must not exceed 250 characters")
            .notRequired()
            .email("Invalid WCP Email")
            .label("WCP Email"),
    });



    // ** Hooks
    const {
        trigger,
        control,
        setValue,
        getValues,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(formSchema) });

    const onSubmit = (data) => {
        if (isObjEmpty(errors)) {
            callBack(data)
            stepper.next();
        }
    };

    React.useEffect(() => {
        const fetchFormData = () => {
            if (formData) {
                setValue("pcp", formData.pcp)
                setValue("pcp_phone", formData.pcp_phone)
                setValue("pcp_fax", formData.pcp_fax)
                setValue("pcp_email", formData.pcp_email)
                setValue("zip_code", formData.zip_code)
                setValue("wcp", formData.wcp)
                setValue("wcp_phone", formData.wcp_phone)
                setValue("wcp_email", formData.wcp_email)
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

    return (
        <Fragment>

            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <div className="mb-1">
                        <Label className="form-label" for="pcp">
                            Primary Care Physician Name:
                        </Label>

                        <Controller
                            id="pcp"
                            name="pcp"
                            control={control}
                            render={({ field }) => (
                                <Input invalid={errors.pcp && true} {...field} />
                            )}
                        />
                        {errors.pcp && <FormFeedback>{errors.pcp.message}</FormFeedback>}
                    </div>
                    <div className="col-md-6 mb-1">
                        <Label className="form-label" for="pcp_phone">
                            Primary Care Physician Phone
                        </Label>
                        <InputGroup className="input-group-merge">
                            <InputGroupText>US (+1)</InputGroupText>
                            <Controller
                                id="pcp_phone"
                                name="pcp_phone"
                                control={control}
                                render={({ field: { ref, ...field } }) => (
                                    <MyCleave
                                        {...field}
                                        className={classnames("form-control", {
                                            "is-invalid": errors.pcp_phone && true,
                                        })}
                                        options={{ phone: true, phoneRegionCode: "US" }}
                                    />
                                )}
                            />
                        </InputGroup>
                        {errors.pcp_phone && (
                            <FormFeedback>{errors.pcp_phone.message}</FormFeedback>
                        )}
                    </div>
                    <div className="col-md-6 mb-1">
                        <Label className="form-label" for="pcp_fax">
                            Primary Care Physician Fax
                        </Label>
                        <InputGroup className="input-group-merge">
                            <InputGroupText>US (+1)</InputGroupText>
                            <Controller
                                id="pcp_fax"
                                name="pcp_fax"
                                control={control}
                                render={({ field: { ref, ...field } }) => (
                                    <MyCleave
                                        {...field}
                                        className={classnames("form-control", {
                                            "is-invalid": errors.pcp_fax && true,
                                        })}
                                        options={{ phone: true, phoneRegionCode: "US" }}
                                    />
                                )}
                            />
                        </InputGroup>
                        {errors.pcp_fax && (
                            <FormFeedback>{errors.pcp_fax.message}</FormFeedback>
                        )}
                    </div>
                    <div className="mb-1">
                        <Label className="form-label" for="pcp_email">
                            Primary Care Physician Email
                        </Label>

                        <Controller
                            id="pcp_email"
                            name="pcp_email"
                            control={control}
                            render={({ field }) => (
                                <Input invalid={errors.pcp_email && true} {...field} />
                            )}
                        />
                        {errors.pcp_email && (
                            <FormFeedback>{errors.pcp_email.message}</FormFeedback>
                        )}
                    </div>

                    <hr></hr>
                    <h5>Wound Care Physician Details </h5>
                    <small class="text-muted">Enter the Patient Wound Care Physician Details.</small>
                    <br />

                    <div className="mb-1">
                        <Label className="form-label" for="wcp">
                            Wound Care Physician
                        </Label>

                        <Controller
                            id="wcp"
                            name="wcp"
                            control={control}
                            render={({ field }) => (
                                <Input invalid={errors.wcp && true} {...field} />
                            )}
                        />
                        {errors.wcp && <FormFeedback>{errors.wcp.message}</FormFeedback>}
                    </div>
                    <div className="col-md-6 mb-1">
                        <Label className="form-label" for="wcp_phone">
                            Wound Care Physician Phone
                        </Label>
                        <InputGroup className="input-group-merge">
                            <InputGroupText>US (+1)</InputGroupText>
                            <Controller
                                id="wcp_phone"
                                name="wcp_phone"
                                control={control}
                                render={({ field: { ref, ...field } }) => (
                                    <MyCleave
                                        {...field}
                                        className={classnames("form-control", {
                                            "is-invalid": errors.wcp_phone && true,
                                        })}
                                        options={{ phone: true, phoneRegionCode: "US" }}
                                    />
                                )}
                            />
                        </InputGroup>
                        {errors.wcp_phone && (
                            <FormFeedback>{errors.wcp_phone.message}</FormFeedback>
                        )}
                    </div>
                    <div className="col-md-12 mb-1">
                        <Label className="form-label" for="wcp_email">
                            Wound Care Physician Email
                        </Label>

                        <Controller
                            id="wcp_email"
                            name="wcp_email"
                            control={control}
                            render={({ field }) => (
                                <Input invalid={errors.wcp_email && true} {...field} />
                            )}
                        />
                        {errors.wcp_email && (
                            <FormFeedback>{errors.wcp_email.message}</FormFeedback>
                        )}
                    </div>
                </Row>
            </Form>
        </Fragment>
    );
};

export default EditPhysician;
