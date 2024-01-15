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

import "cleave.js/dist/addons/cleave-phone.us";

// ** Reactstrap Imports
import {
    Form,
    Label,
    Input,
    FormFeedback,
    InputGroup,
    InputGroupText,
} from "reactstrap";

const EditContact = ({ formData, doSubmit, callBack }) => {

    const formSchema = yup.object().shape({
        contact_name: yup
            .string()
            .max(255, 'Contact Name must be at most 255 characters')
            .required('Contact Name is required')
            .label("Contact Name"),
    
        contact_number: yup
            .string()
            .max(20, 'Contact Number must be at most 20 characters')
            .required('Contact Number is required')
            .label("Contact Number"),
    
        other_number: yup
            .string()
            .max(255, 'Other Number must be at most 255 characters')
            .notRequired()
            .label("Other Number"),
    
        email: yup
            .string()
            .max(120, 'Email must be at most 120 characters')
            .email('Invalid email format')
            .notRequired()
            .label("Email"),
    
        other_name: yup
            .string()
            .max(255, 'Other Name must be at most 255 characters')
            .notRequired()
            .label("Other Name"),
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
                setValue("contact_name", formData.contact_name)
                setValue("contact_number", formData.contact_number)
                setValue("email", formData.email)
                setValue("other_number", formData.other_number)
                setValue("other_name", formData.other_name)
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
                <div className="mb-1">
                    <Label className="form-label" for="contact_name">
                        Contact Name
                    </Label>

                    <Controller
                        id="contact_name"
                        name="contact_name"
                        control={control}
                        render={({ field }) => (
                            <Input invalid={errors.contact_name && true} {...field} />
                        )}
                    />
                    {errors.contact_name && (
                        <FormFeedback>{errors.contact_name.message}</FormFeedback>
                    )}
                </div>
                <div className="mb-1">
                    <Label className="form-label" for="contact_number">
                        Contact Number
                    </Label>

                    <InputGroup className="input-group-merge">
                        <InputGroupText>US (+1)</InputGroupText>
                        <Controller
                            id="contact_number"
                            name="contact_number"
                            control={control}
                            render={({ field: { ref, ...field } }) => (
                                <MyCleave
                                    {...field}
                                    className={classnames("form-control", {
                                        "is-invalid": errors.contact_number && true,
                                    })}
                                    options={{ phone: true, phoneRegionCode: "US" }}
                                />
                                // <Input invalid={errors.contact_number && true} {...field} />
                            )}
                        />
                    </InputGroup>
                    {errors.contact_number && (
                        <FormFeedback>{errors.contact_number.message}</FormFeedback>
                    )}
                </div>
                <div className="mb-1">
                    <Label className="form-label" for="email">
                        Email
                    </Label>

                    <Controller
                        id="email"
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <Input invalid={errors.email && true} {...field} />
                        )}
                    />
                    {errors.email && (
                        <FormFeedback>{errors.email.message}</FormFeedback>
                    )}
                </div>

                <hr></hr>
                <h5>Other Contact Information </h5>
                <small class="text-muted">Enter the other contact information if available.</small>

                <div className="mb-1">
                    <Label className="form-label" for="other_name">
                        Other Name
                    </Label>

                    <Controller
                        id="other_name"
                        name="other_name"
                        control={control}
                        render={({ field }) => (
                            <Input invalid={errors.other_name && true} {...field} />
                        )}
                    />
                    {errors.other_name && (
                        <FormFeedback>{errors.other_name.message}</FormFeedback>
                    )}
                </div>

                <div className="mb-1">
                    <Label className="form-label" for="other_number">
                        Other Number
                    </Label>

                    <InputGroup className="input-group-merge">
                        <InputGroupText>US (+1)</InputGroupText>
                        <Controller
                            id="other_number"
                            name="other_number"
                            control={control}
                            render={({ field: { ref, ...field } }) => (
                                <MyCleave
                                    {...field}
                                    className={classnames("form-control", {
                                        "is-invalid": errors.other_number && true,
                                    })}
                                    options={{ phone: true, phoneRegionCode: "US" }}
                                />
                                // <Input invalid={errors.contact_number && true} {...field} />
                            )}
                        />
                    </InputGroup>
                    {errors.other_number && (
                        <FormFeedback>{errors.other_number.message}</FormFeedback>
                    )}
                </div>

            </Form>


        </Fragment>
    );
};

export default EditContact;
