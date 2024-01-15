
// ** React Imports
import React, { Fragment, useState } from "react";

// ** Utils
import { isObjEmpty } from "@utils";

import classnames from "classnames";

// ** Third Party Components
import * as yup from "yup";
import { useForm, Controller, useWatch } from "react-hook-form";
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

const EditWoundNoteDescription = ({ id, formData, doSubmit, callBack }) => {

    const [exudate_types, setExudate_Types] = useState([{ label: "", value: "" }]);
    const [exudate_amounts, setExudate_Amounts] = useState([{ label: "", value: "" }]);
    const [exudate_odors, setExudate_Odors] = useState([{ label: "", value: "" }]);

    const [today] = useState(new Date().toISOString().substr(0, 10));

    const formSchema = yup.object().shape({
        signs_infected_wound: yup
            .bool()
            .notRequired()
            .label("Signs of Infected Wound"),
    
        granulation_tissue: yup
            .number()
            .notRequired()
            .label("Granulation Tissue"),
    
        slough_tissue: yup
            .number()
            .notRequired()
            .label("Slough Tissue"),
    
        neurotic_tissue: yup
            .number()
            .notRequired()
            .label("Necrotic Tissue"),
    
        other_tissue: yup
            .number()
            .notRequired()
            .label("Other Tissue"),
    
        type_of_exudate_id: yup
            .number()
            .notRequired()
            .label("Type of Exudate Id"),
    
        amount_of_exudate_id: yup
            .number()
            .notRequired()
            .label("Amount of Exudate Id"),
    
        odor_id: yup
            .number()
            .notRequired()
            .label("Odor Id"),
    
        type_of_exudate_id_description: yup
            .string()
            .label("Description for Type of Exudate Id"),
    
        amount_of_exudate_id_description: yup
            .string()
            .label("Description for Amount of Exudate Id"),
    
        odor_id_description: yup
            .string()
            .label("Description for Odor Id"),
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

    const type_of_exudate_id = watch("type_of_exudate_id");
    const amount_of_exudate_id = watch("amount_of_exudate_id");
    const odor_id = watch("odor_id");

    React.useEffect(() => {
        useApi
            .get("/lookup/exudate_types", {})
            .then((res) => {
                var items = [{ label: "", value: "" }];
                res.data.data.map((r) => {
                    const option = { label: r.description, value: r.id };
                    items.push(option);
                    return option;
                });
                setExudate_Types(items);
            })
            .catch((err) => {
                showAlertError(err);
            });
        useApi
            .get("/lookup/exudate_amounts", {})
            .then((res) => {
                var items = [{ label: "", value: "" }];
                res.data.data.map((r) => {
                    const option = { label: r.description, value: r.id };
                    items.push(option);
                    return option;
                });
                setExudate_Amounts(items);
            })
            .catch((err) => {
                showAlertError(err);
            });
        useApi
            .get("/lookup/exudate_odors", {})
            .then((res) => {
                var items = [{ label: "", value: "" }];
                res.data.data.map((r) => {
                    const option = { label: r.description, value: r.id };
                    items.push(option);
                    return option;
                });
                setExudate_Odors(items);
            })
            .catch((err) => {
                showAlertError(err);
            });


    }, []);

    React.useEffect(() => {
        const fetchFormData = () => {
            setValue("signs_infected_wound", formData.signs_infected_wound);
            setValue("granulation_tissue", isNaN(formData.granulation_tissue) ? "" : formData.granulation_tissue);
            setValue("slough_tissue", isNaN(formData.slough_tissue) ? "" : formData.slough_tissue);
            setValue("neurotic_tissue", isNaN(formData.neurotic_tissue) ? "" : formData.neurotic_tissue);
            setValue("other_tissue", isNaN(formData.other_tissue) ? "" : formData.other_tissue);
            setValue("type_of_exudate_id", isNaN(formData.type_of_exudate_id) ? "" : formData.type_of_exudate_id);
            setValue("amount_of_exudate_id", isNaN(formData.amount_of_exudate_id) ? "" : formData.amount_of_exudate_id);
            setValue("odor_id", isNaN(formData.odor_id) ? "" : formData.odor_id);
            setValue("type_of_exudate_id_description", formData.type_of_exudate_id_description);
            setValue("amount_of_exudate_id_description", formData.amount_of_exudate_id_description);
            setValue("odor_id_description", formData.odor_id_description);
        };
        if (formData){
            fetchFormData();
        }
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

    const onSubmit = (data) => {
        callBack(data, isObjEmpty(errors))
    };


    React.useEffect(() => {
        const value = exudate_types.find(r => r.value === parseInt(type_of_exudate_id));
        if (value) {
            setValue("type_of_exudate_id_description", value.label);
        }
    }, [type_of_exudate_id])
    React.useEffect(() => {
        const value = exudate_amounts.find(r => r.value === parseInt(amount_of_exudate_id));
        if (value) {
            setValue("amount_of_exudate_id_description", value.label);
        }
    }, [amount_of_exudate_id])
    React.useEffect(() => {
        const value = exudate_odors.find(r => r.value === parseInt(odor_id));
        if (value) {
            setValue("odor_id_description", value.label);
        }
    }, [odor_id])

    return (
        <>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>


                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="signs_infected_wound"
                                name="signs_infected_wound"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.signs_infected_wound && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="signs_infected_wound">Signs Infected Wound </Label>
                            {errors.signs_infected_wound && (
                                <FormFeedback>{errors.signs_infected_wound.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="6" className="mb-1">
                        <Label className="form-label" for="granulation_tissue">Granulation Tissue </Label>
                        <Controller
                            id="granulation_tissue"
                            name="granulation_tissue"
                            control={control}
                            placeholder="10,000"
                            render={({ field: { ref, ...field } }) => (
                                <MyCleave
                                    {...field}
                                    maxLength="3"
                                    className={classnames("form-control", {
                                        "is-invalid": errors.granulation_tissue && true,
                                    })}
                                    options={{
                                        numeral: true,
                                        numeralThousandsGroupStyle: "thousand",
                                    }}
                                />
                            )}
                        />

                        {errors.granulation_tissue && (
                            <FormFeedback>{errors.granulation_tissue.message}</FormFeedback>
                        )}
                    </Col>

                    <Col md="6" className="mb-1">
                        <Label className="form-label" for="slough_tissue">Slough Tissue </Label>
                        <Controller
                            id="slough_tissue"
                            name="slough_tissue"
                            control={control}
                            placeholder="10,000"
                            render={({ field: { ref, ...field } }) => (
                                <MyCleave
                                    {...field}
                                    maxLength="3"
                                    className={classnames("form-control", {
                                        "is-invalid": errors.slough_tissue && true,
                                    })}
                                    options={{
                                        numeral: true,
                                        numeralThousandsGroupStyle: "thousand",
                                    }}
                                />
                            )}
                        />

                        {errors.slough_tissue && (
                            <FormFeedback>{errors.slough_tissue.message}</FormFeedback>
                        )}
                    </Col>

                    <Col md="6" className="mb-1">
                        <Label className="form-label" for="neurotic_tissue">Neurotic Tissue </Label>
                        <Controller
                            id="neurotic_tissue"
                            name="neurotic_tissue"
                            control={control}
                            placeholder="10,000"
                            render={({ field: { ref, ...field } }) => (
                                <MyCleave
                                    {...field}
                                    maxLength="3"
                                    className={classnames("form-control", {
                                        "is-invalid": errors.neurotic_tissue && true,
                                    })}
                                    options={{
                                        numeral: true,
                                        numeralThousandsGroupStyle: "thousand",
                                    }}
                                />
                            )}
                        />

                        {errors.neurotic_tissue && (
                            <FormFeedback>{errors.neurotic_tissue.message}</FormFeedback>
                        )}
                    </Col>

                    <Col md="6" className="mb-1">
                        <Label className="form-label" for="other_tissue">Other Tissue </Label>
                        <Controller
                            id="other_tissue"
                            name="other_tissue"
                            control={control}
                            placeholder="10,000"
                            render={({ field: { ref, ...field } }) => (
                                <MyCleave
                                    {...field}
                                    maxLength="3"
                                    className={classnames("form-control", {
                                        "is-invalid": errors.other_tissue && true,
                                    })}
                                    options={{
                                        numeral: true,
                                        numeralThousandsGroupStyle: "thousand",
                                    }}
                                />
                            )}
                        />

                        {errors.other_tissue && (
                            <FormFeedback>{errors.other_tissue.message}</FormFeedback>
                        )}
                    </Col>

                    <Col className="col-md-6 mb-1">
                        <Label className="form-label" for="type_of_exudate_id">Type Of Exudate Id </Label>

                        <Controller
                            name="type_of_exudate_id"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="select"
                                    id="type_of_exudate_id"
                                    invalid={errors.type_of_exudate_id && true}
                                    {...field}
                                >
                                    {exudate_types.map &&
                                        exudate_types.map((item, index) => (
                                            <option value={item.value} key={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                </Input>
                            )}
                        />
                        {errors.type_of_exudate_id && (
                            <FormFeedback>{errors.type_of_exudate_id.message}</FormFeedback>
                        )}
                    </Col>

                    <Col className="col-md-6 mb-1">
                        <Label className="form-label" for="amount_of_exudate_id">Amount Of Exudate Id </Label>

                        <Controller
                            name="amount_of_exudate_id"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="select"
                                    id="amount_of_exudate_id"
                                    invalid={errors.amount_of_exudate_id && true}
                                    {...field}
                                >
                                    {exudate_amounts.map &&
                                        exudate_amounts.map((item, index) => (
                                            <option value={item.value} key={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                </Input>
                            )}
                        />
                        {errors.amount_of_exudate_id && (
                            <FormFeedback>{errors.amount_of_exudate_id.message}</FormFeedback>
                        )}
                    </Col>

                    <Col className="col-md-6 mb-1">
                        <Label className="form-label" for="odor_id">Odor Id </Label>

                        <Controller
                            name="odor_id"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="select"
                                    id="odor_id"
                                    invalid={errors.odor_id && true}
                                    {...field}
                                >
                                    {exudate_odors.map &&
                                        exudate_odors.map((item, index) => (
                                            <option value={item.value} key={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                </Input>
                            )}
                        />
                        {errors.odor_id && (
                            <FormFeedback>{errors.odor_id.message}</FormFeedback>
                        )}
                    </Col>

                </Row>

            </Form>
        </>
    );

}
export default EditWoundNoteDescription;