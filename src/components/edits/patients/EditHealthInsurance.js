// ** React Imports
import React, { Fragment, useState } from "react";

// ** Utils
import { isObjEmpty } from "@utils";
import classnames from "classnames";

// ** Third Party Components
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import MyCleave from "../../../components/forms/MyCleave";
import useApi from "../../../api/useApi";

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

const EditHealthInsurance = ({ formData, doSubmit, callBack }) => {

    const [categories, setCategories] = useState([{ label: "", value: "" }]);
    const [relationships, setRelationships] = useState([{ label: "", value: "" }]);
    const [insurances, setInsurances] = useState([{ label: "", value: "" }]);

    const formSchema = yup.object().shape({
        insurance_number: yup
            .string()
            .max(20, 'Insurance Number must be at most 20 characters')
            .notRequired('Insurance Number is required')
            .label('Insurance Number'),

        insurance_group_number: yup
            .string()
            .max(20, 'Insurance Group Number must be at most 20 characters')
            .notRequired()
            .label('Insurance Group Number'),

        insurance_coverage_date: yup
            .string()
            .max(120, 'Insurance Coverage Date must be at most 120 characters')
            .notRequired('Insurance Coverage Date is required')
            .label('Insurance Coverage Date'),

        insurance_company_id: yup
            .number()
            .notRequired('Insurance Company Name is required')
            .label('Insurance Company'),

        other_insured_name: yup
            .string()
            .max(250, 'Other Insured Name must be at most 250 characters')
            .notRequired()
            .label('Other Insured Name'),

        other_insured_policy_name: yup
            .string()
            .max(250, 'Other Insured Policy Name must be at most 250 characters')
            .notRequired()
            .label('Other Insured Policy Name'),

        other_insured_policy_number: yup
            .string()
            .max(250, 'Other Insured Policy Number must be at most 250 characters')
            .notRequired()
            .label('Other Insured Policy Number'),

        relationship_to_insured_id: yup
            .number()
            .notRequired()
            .label('Relationship To Insured ID'),

        insurance_card: yup
            .string()
            .max(250, 'Insurance Card must be at most 250 characters')
            .notRequired()
            .label('Insurance Card'),

        insurance_category_id: yup
            .number()
            .notRequired()
            .label('Insurance Category ID'),

        insurance_company: yup.string(),
        insurance_category: yup.string(),
        relationship_to_insured: yup.string(),
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
        if (isObjEmpty(errors)) {
            callBack(data)
            stepper.next();
        }
    };

    React.useEffect(() => {
        const fetchFormData = () => {
            if (formData) {
                setValue("insurance_number", formData.insurance_number)
                setValue("insurance_group_number", formData.insurance_group_number)
                setValue("insurance_coverage_date", formData.insurance_coverage_date)
                setValue("insurance_company_id", formData.insurance_company_id)
                setValue("insurance_company", formData.insurance_company)
                setValue("other_insured_name", formData.other_insured_name)
                setValue("other_insured_policy_name", formData.other_insured_policy_name)
                setValue("other_insured_policy_number", formData.other_insured_policy_number)
                setValue("relationship_to_insured_id", formData.relationship_to_insured_id)
                setValue("insurance_card", formData.insurance_card)
                setValue("insurance_category_id", formData.insurance_category_id)
            }
        };
        fetchFormData();
    }, []);

    React.useEffect(() => {
        const fetchData = () => {
            useApi
                .get("/lookup/insurance_categories", {})
                .then((res) => {
                    var items = [{ label: "", value: "" }];
                    res.data.data.map((r) => {
                        const option = { label: r.description ?? r.name, value: r.id };
                        items.push(option);
                        return option;
                    });
                    setCategories(items);
                })
                .catch((err) => {
                    showAlertError(err);
                });
            useApi
                .get("/lookup/patient_relationships", {})
                .then((res) => {
                    var items = [{ label: "", value: "" }];
                    res.data.data.map((r) => {
                        const option = { label: r.description ?? r.name, value: r.id };
                        items.push(option);
                        return option;
                    });
                    setRelationships(items);
                })
                .catch((err) => {
                    showAlertError(err);
                });

            useApi
                .get("/lookup/insurance_companies", {})
                .then((res) => {
                    console.log(res)
                    var itemse = [{ label: "", value: "" }];
                    res.data.data.map((r) => {
                        const option = { label: r.description ?? r.name, value: r.id };
                        itemse.push(option);
                        return option;
                    });
                    setInsurances(itemse);
                })
                .catch((err) => {
                    showAlertError(err);
                });


        };
        fetchData();
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

    const insurance_company_id = watch("insurance_company_id")

    React.useEffect(() => {
        try {
            const label = insurances.find(subject => subject.value === parseInt(insurance_company_id)).label
            setValue("insurance_company", label)
        } catch (e) {
            // console.log(insurance_company_id);
            setValue("insurance_company", "")
        }
    }, [insurance_company_id, insurances])


    const relationship_to_insured_id = watch("relationship_to_insured_id")
    React.useEffect(() => {
        try {
            const label = relationships.find(subject => subject.value === parseInt(relationship_to_insured_id)).label
            setValue("relationship_to_insured", label)
        } catch (e) {
            setValue("relationship_to_insured", "")
        }
    }, [relationship_to_insured_id])

    const insurance_category_id = watch("insurance_category_id")
    React.useEffect(() => {
        try {
            const label = categories.find(subject => subject.value === parseInt(insurance_category_id)).label
            setValue("insurance_category", label)
        } catch (e) {
            setValue("insurance_category", "")
        }
    }, [insurance_category_id])




    return (
        <Fragment>

            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <div className="form-password-toggle mb-1">
                        <Label className="form-label" for="insurance_company_id">
                            Insurance Company
                        </Label>

                        <Controller
                            name="insurance_company_id"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="select"
                                    id="insurance_company_id"
                                    invalid={errors.insurance_company_id && true}
                                    {...field}
                                >
                                    {insurances.map &&
                                        insurances.map((item) => (
                                            <option value={item.value} key={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                </Input>
                            )}
                        />
                        {errors.insurance_company_id && (
                            <FormFeedback>
                                {errors.insurance_company_id.message}
                            </FormFeedback>
                        )}
                    </div>

                    <div className="col-md-6 mb-1">
                        <Label className="form-label" for="insurance_number">
                            Insurance Number
                        </Label>

                        <Controller
                            id="insurance_number"
                            name="insurance_number"
                            control={control}
                            render={({ field }) => (
                                <Input invalid={errors.insurance_number && true} {...field} />
                            )}
                        />
                        {errors.insurance_number && (
                            <FormFeedback>{errors.insurance_number.message}</FormFeedback>
                        )}
                    </div>

                    <div className="col-md-6 mb-1">
                        <Label className="form-label" for="insurance_group_number">
                            Insurance Group Number
                        </Label>

                        <Controller
                            id="insurance_group_number"
                            name="insurance_group_number"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    invalid={errors.insurance_group_number && true}
                                    {...field}
                                />
                            )}
                        />
                        {errors.insurance_group_number && (
                            <FormFeedback>
                                {errors.insurance_group_number.message}
                            </FormFeedback>
                        )}
                    </div>
                    <div className="col-md-6 mb-1">
                        <Label className="form-label" for="insurance_coverage_date">
                            Insurance Coverage Date
                        </Label>

                        <Controller
                            id="insurance_coverage_date"
                            name="insurance_coverage_date"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="date"
                                    invalid={errors.insurance_coverage_date && true}
                                    {...field}
                                />
                            )}
                        />
                        {errors.insurance_coverage_date && (
                            <FormFeedback>
                                {errors.insurance_coverage_date.message}
                            </FormFeedback>
                        )}
                    </div>
                    <div className="form-password-toggle col-md-6 mb-1">
                        <Label className="form-label" for="insurance_category_id">
                            Insurance Category Id
                        </Label>

                        <Controller
                            name="insurance_category_id"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="select"
                                    id="insurance_category_id"
                                    invalid={errors.insurance_category_id && true}
                                    {...field}
                                >
                                    {categories.map &&
                                        categories.map((item, index) => (
                                            <option value={item.value} key={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                </Input>
                            )}
                        />

                        {errors.insurance_category_id && (
                            <FormFeedback>
                                {errors.insurance_category_id.message}
                            </FormFeedback>
                        )}
                    </div>

                    <div className="col-md-6 mb-1">
                        <Label className="form-label" for="relationship_to_insured_id">
                            Relationship To Insured Id
                        </Label>

                        <Controller
                            name="relationship_to_insured_id"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="select"
                                    id="relationship_to_insured_id"
                                    invalid={errors.relationship_to_insured_id && true}
                                    {...field}
                                >
                                    {relationships.map &&
                                        relationships.map((item) => (
                                            <option value={item.value} key={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                </Input>
                            )}
                        />

                        {errors.relationship_to_insured_id && (
                            <FormFeedback>
                                {errors.relationship_to_insured_id.message}
                            </FormFeedback>
                        )}
                    </div>

                    <hr></hr>
                    <h5>Other Insured </h5>
                    <small class="text-muted">Enter the Patient Health Insurance Details.</small>
                    <div className="mb-1">
                        <Label className="form-label" for="other_insured_name">
                            Name
                        </Label>

                        <Controller
                            id="other_insured_name"
                            name="other_insured_name"
                            control={control}
                            render={({ field }) => (
                                <Input invalid={errors.other_insured_name && true} {...field} />
                            )}
                        />
                        {errors.other_insured_name && (
                            <FormFeedback>{errors.other_insured_name.message}</FormFeedback>
                        )}
                    </div>
                    <div className="col-md-6 mb-1">
                        <Label className="form-label" for="other_insured_policy_name">
                            Policy Name
                        </Label>

                        <Controller
                            id="other_insured_policy_name"
                            name="other_insured_policy_name"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    invalid={errors.other_insured_policy_name && true}
                                    {...field}
                                />
                            )}
                        />
                        {errors.other_insured_policy_name && (
                            <FormFeedback>
                                {errors.other_insured_policy_name.message}
                            </FormFeedback>
                        )}
                    </div>
                    <div className="col-md-6 mb-1">
                        <Label className="form-label" for="other_insured_policy_number">
                            Policy Number
                        </Label>

                        <Controller
                            id="other_insured_policy_number"
                            name="other_insured_policy_number"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    invalid={errors.other_insured_policy_number && true}
                                    {...field}
                                />
                            )}
                        />
                        {errors.other_insured_policy_number && (
                            <FormFeedback>
                                {errors.other_insured_policy_number.message}
                            </FormFeedback>
                        )}
                    </div>


                    <div className="col-md-6 mb-1">
                        <Label className="form-label" for="insurance_card">
                            Insurance Card
                        </Label>

                        <Controller
                            id="insurance_card"
                            name="insurance_card"
                            control={control}
                            render={({ field }) => (
                                <Input invalid={errors.insurance_card && true} {...field} />
                            )}
                        />
                        {errors.insurance_card && (
                            <FormFeedback>{errors.insurance_card.message}</FormFeedback>
                        )}
                    </div>
                </Row>

            </Form>

        </Fragment>
    );
};

export default EditHealthInsurance;
