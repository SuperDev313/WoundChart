
// ** React Imports
import React, { Fragment, useState } from "react";
import { isObjEmpty } from "@utils";
import classnames from "classnames";
import * as yup from "yup";
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import MyCleave from "../../forms/MyCleave";
import useApi from "../../../api/useApi";

import AsyncSelect from 'react-select/async'
import { showAlertError } from "../../alerts/AlertUtils";
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

const EditWoundNoteDressings = ({ id, formData, doSubmit, callBack }) => {

    const [procedure_performed_options, setProcedure_Performed_Options] = useState([{ label: "", value: "" }]);
    const [products, setProducts] = useState([{ label: "", value: "" }]);
    const [loading, setLoading] = useState(false);

    const formSchema = yup.object().shape({
        primary_dressing_id: yup
            .number()
            .transform((value) => (isNaN(value) || value === null || value === undefined) ? null : value)
            .notRequired()
            .label("Primary Dressing"),
    
        other_primary_dressing_id: yup
            .number()
            .transform((value) => (isNaN(value) || value === null || value === undefined) ? null : value)
            .notRequired()
            .label("Other Primary Dressing"),
    
        secondary_dressing_id: yup
            .number()
            .transform((value) => (isNaN(value) || value === null || value === undefined) ? null : value)
            .notRequired()
            .label("Secondary Dressing"),
    
        peri_wound_skin_treatment_id: yup
            .number()
            .transform((value) => (isNaN(value) || value === null || value === undefined) ? null : value)
            .notRequired()
            .label("Peri-Wound Skin Treatment"),
    
        secure_dressing_id: yup
            .number()
            .transform((value) => (isNaN(value) || value === null || value === undefined) ? null : value)
            .notRequired()
            .label("Secure Dressing"),
    
        tunneling_and_undermining_treatment_id: yup
            .number()
            .transform((value) => (isNaN(value) || value === null || value === undefined) ? null : value)
            .notRequired()
            .label("Tunneling and Undermining Treatment"),
    
        primary_dressing_quantity: yup
            .number()
            .transform((value) => (isNaN(value) || value === null || value === undefined) ? null : value)
            .notRequired()
            .label("Primary Dressing Quantity"),
    
        other_primary_dressing_quantity: yup
            .number()
            .transform((value) => (isNaN(value) || value === null || value === undefined) ? null : value)
            .notRequired()
            .label("Other Primary Dressing Quantity"),
    
        secondary_dressing_quantity: yup
            .number()
            .transform((value) => (isNaN(value) || value === null || value === undefined) ? null : value)
            .notRequired()
            .label("Secondary Dressing Quantity"),
    
        peri_wound_skin_treatment_quantity: yup
            .number()
            .transform((value) => (isNaN(value) || value === null || value === undefined) ? null : value)
            .notRequired()
            .label("Peri-Wound Skin Treatment Quantity"),
    
        secure_dressing_quantity: yup
            .number()
            .transform((value) => (isNaN(value) || value === null || value === undefined) ? null : value)
            .notRequired()
            .label("Secure Dressing Quantity"),
    
        tunneling_and_undermining_treatment_quantity: yup
            .number()
            .transform((value) => (isNaN(value) || value === null || value === undefined) ? null : value)
            .notRequired()
            .label("Tunneling and Undermining Treatment Quantity"),
    
        procedure_performed_id: yup
            .number()
            .transform((value) => (isNaN(value) || value === null || value === undefined) ? null : value)
            .notRequired()
            .label("Procedure Performed"),
    
        folley_insert_change: yup
            .bool()
            .notRequired()
            .label("Folley Insert Change"),
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


    const setFieldDescription = (items, field, fieldDescription) => {
        let value = getValues(field);
        if (!((isNaN(value) || value === null || value === undefined))) {
            const selectedValue = items.find(r => r.value === parseInt(value));
            if (selectedValue) {
                formData[fieldDescription] = selectedValue.label;
            }
            else {
                formData[fieldDescription] = "";
            }
        }
    }


    React.useEffect(() => {
        useApi
            .get("/lookup/procedure_performed_options", {})
            .then((res) => {
                var items = [{ label: "", value: "" }];
                res.data.data.map((r) => {
                    const option = { label: r.description, value: r.id };
                    items.push(option);
                    return option;
                });
                setProcedure_Performed_Options(items);
            })
            .catch((err) => {
                showAlertError(err);
            });


    }, []);

    React.useEffect(() => {
        const fetchFormData = () => {

            setValue("primary_dressing_id", isNaN(formData.primary_dressing_id) ? "" : formData.primary_dressing_id);
            setValue("other_primary_dressing_id", isNaN(formData.other_primary_dressing_id) ? "" : formData.other_primary_dressing_id);
            setValue("secondary_dressing_id", isNaN(formData.secondary_dressing_id) ? "" : formData.secondary_dressing_id);
            setValue("peri_wound_skin_treatment_id", isNaN(formData.peri_wound_skin_treatment_id) ? "" : formData.peri_wound_skin_treatment_id);
            setValue("secure_dressing_id", isNaN(formData.secure_dressing_id) ? "" : formData.secure_dressing_id);
            setValue("tunneling_and_undermining_treatment_id", isNaN(formData.tunneling_and_undermining_treatment_id) ? "" : formData.tunneling_and_undermining_treatment_id);
            setValue("primary_dressing_quantity", isNaN(formData.primary_dressing_quantity) ? "" : formData.primary_dressing_quantity);
            setValue("other_primary_dressing_quantity", isNaN(formData.other_primary_dressing_quantity) ? "" : formData.other_primary_dressing_quantity);
            setValue("secondary_dressing_quantity", isNaN(formData.secondary_dressing_quantity) ? "" : formData.secondary_dressing_quantity);
            setValue("peri_wound_skin_treatment_quantity", isNaN(formData.peri_wound_skin_treatment_quantity) ? "" : formData.peri_wound_skin_treatment_quantity);
            setValue("secure_dressing_quantity", isNaN(formData.secure_dressing_quantity) ? "" : formData.secure_dressing_quantity);
            setValue("tunneling_and_undermining_treatment_quantity", isNaN(formData.tunneling_and_undermining_treatment_quantity) ? "" : formData.tunneling_and_undermining_treatment_quantity);
            setValue("procedure_performed_id", isNaN(formData.procedure_performed_id) ? "" : formData.procedure_performed_id);
            setValue("folley_insert_change", formData.folley_insert_change);

            setSelectedPrimaryDressing({
                "label": formData.primary_dressing_id_product_name,
                "value": (isNaN(formData.primary_dressing_id) ? "" : formData.primary_dressing_id)
            })

            setSelectedOtherPrimaryDressing({
                "label": formData.other_primary_dressing_id_product_name,
                "value": (isNaN(formData.other_primary_dressing_id) ? "" : formData.other_primary_dressing_id)
            })

            setSelectedSecondaryDressing({
                "label": formData.secondary_dressing_id_product_name,
                "value": (isNaN(formData.secondary_dressing_id) ? "" : formData.secondary_dressing_id)
            })

            setSelectedPeriWound({
                "label": formData.peri_wound_skin_treatment_id_product_name,
                "value": (isNaN(formData.peri_wound_skin_treatment_id) ? "" : formData.peri_wound_skin_treatment_id)
            })
            
            setSelectedSecureDressing({
                "label": formData.secure_dressing_id_product_name,
                "value": (isNaN(formData.secure_dressing_id) ? "" : formData.secure_dressing_id)
            })
            
            setSelectedUnderminingTreatment({
                "label": formData.tunneling_and_undermining_treatment_id_product_name,
                "value": (isNaN(formData.tunneling_and_undermining_treatment_id) ? "" : formData.tunneling_and_undermining_treatment_id)
            })

            setValue("procedure_performed_id_description", formData.procedure_performed_id_description);
            setValue("other_primary_dressing_id_product_name", formData.other_primary_dressing_id_product_name);
            setValue("secondary_dressing_id_product_name", formData.secondary_dressing_id_product_name);
            setValue("peri_wound_skin_treatment_id_product_name", formData.peri_wound_skin_treatment_id_product_name);
            setValue("secure_dressing_id_product_name", formData.secure_dressing_id_product_name);
            setValue("tunneling_and_undermining_treatment_id_product_name", formData.tunneling_and_undermining_treatment_id_product_name);


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


    const getDressingsData = (q, limit, offset) => {
        return new Promise(resolve => {
            setLoading(true);
            useApi
                .post("/lookup/products/dressings", {
                    q: q,
                    limit: limit,
                    offset: offset,
                    sortColumn: "product_name",
                    sort: "ASC",
                })
                .then((res) => {
                    const data = res.data.data;
                    var items = [{ label: "", value: "" }];
                    data.rows.map((r) => {
                        const option = { label: r.product_name, value: r.id };
                        items.push(option);
                        return option;
                    });
                    resolve(() => {
                        setLoading(false);
                        return items;
                    })
                })
                .catch((err) => {
                    setLoading(false);
                    //handleError(err);
                    console.log(err)
                    resolve(() => {
                        return [{ label: "", value: "" }];
                    })

                });
        })
    }

    const getSecureDressingsData = (q, limit, offset) => {
        return new Promise(resolve => {
            setLoading(true);
            useApi
                .post("/lookup/products/secure_dressings", {
                    q: q,
                    limit: limit,
                    offset: offset,
                    sortColumn: "product_name",
                    sort: "ASC",
                })
                .then((res) => {
                    const data = res.data.data;
                    var items = [{ label: "", value: "" }];
                    data.rows.map((r) => {
                        const option = { label: r.product_name, value: r.id };
                        items.push(option);
                        return option;
                    });
                    resolve(() => {
                        setLoading(false);
                        return items;
                    })
                })
                .catch((err) => {
                    setLoading(false);
                    //handleError(err);
                    console.log(err)
                    resolve(() => {
                        return [{ label: "", value: "" }];
                    })

                });
        })
    }


    const getPeriWoundsData = (q, limit, offset) => {
        return new Promise(resolve => {
            setLoading(true);
            useApi
                .post("/lookup/products/peri_wounds", {
                    q: q,
                    limit: limit,
                    offset: offset,
                    sortColumn: "product_name",
                    sort: "ASC",
                })
                .then((res) => {
                    const data = res.data.data;
                    var items = [{ label: "", value: "" }];
                    data.rows.map((r) => {
                        const option = { label: r.product_name, value: r.id };
                        items.push(option);
                        return option;
                    });
                    resolve(() => {
                        setLoading(false);
                        return items;
                    })
                })
                .catch((err) => {
                    setLoading(false);
                    //handleError(err);
                    resolve(() => {
                        return [{ label: "", value: "" }];
                    })

                });
        })
    }

    const [selectedPrimaryDressing, setSelectedPrimaryDressing] = useState(null)
    const handleSelectedPrimaryDressing = (value) => {
        setSelectedPrimaryDressing(value)

        if (value != null) {
            setValue("primary_dressing_id", value.value);
            setValue("primary_dressing_id_product_name", value.label);
        }
        else {
            setValue("primary_dressing_id", '');
            setValue("primary_dressing_id_product_name", '');
        }
    }

    const [selectedOtherPrimaryDressing, setSelectedOtherPrimaryDressing] = useState(null)
    const handleSelectedOtherPrimaryDressing = (value) => {
        setSelectedOtherPrimaryDressing(value)

        if (value != null) {
            setValue("other_primary_dressing_id", value.value);
            setValue("other_primary_dressing_id_product_name", value.label);
        }
        else {
            setValue("other_primary_dressing_id", '');
            setValue("other_primary_dressing_id_product_name", '');
        }
    }

    const [selectedSecondayDressing, setSelectedSecondaryDressing] = useState(null)
    const handleSelectedSecondaryDressing = (value) => {
        setSelectedSecondaryDressing(value)

        if (value != null) {
            setValue("secondary_dressing_id", value.value);
            setValue("secondary_dressing_id_product_name", value.label);
        }
        else {
            setValue("secondary_dressing_id", '');
            setValue("secondary_dressing_id_product_name", '');
        }
    }


    const [selectedPeriWound, setSelectedPeriWound] = useState(null)
    const handleSelectedPeriWound = (value) => {
        setSelectedPeriWound(value)

        if (value != null) {
            setValue("peri_wound_skin_treatment_id", value.value);
            setValue("peri_wound_skin_treatment_id_product_name", value.label);
        }
        else {
            setValue("peri_wound_skin_treatment_id", '');
            setValue("peri_wound_skin_treatment_id_product_name", '');
        }
    }

    const [selectedSecureDressing, setSelectedSecureDressing] = useState(null)
    const handleSelectedSecureDressing = (value) => {
        setSelectedSecureDressing(value)

        if (value != null) {
            setValue("secure_dressing_id", value.value);
            setValue("secure_dressing_id_product_name", value.label);
        }
        else {
            setValue("secure_dressing_id", '');
            setValue("secure_dressing_id_product_name", '');
        }
    }

    const [selectedUnderminingTreatment, setSelectedUnderminingTreatment] = useState(null)
    const handleSelectedUnderminingTreatment = (value) => {
        setSelectedUnderminingTreatment(value)

        if (value != null) {
            setValue("tunneling_and_undermining_treatment_id", value.value);
            setValue("tunneling_and_undermining_treatment_id_product_name", value.label);
        }
        else {
            setValue("tunneling_and_undermining_treatment_id", '');
            setValue("tunneling_and_undermining_treatment_id_product_name", '');
        }
    }

    return (
        <>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>


                    <Col className="col-md-6 mb-1">
                        <Label className="form-label" for="primary_dressing_id">Primary Dressing Id </Label>

                        <Controller
                            name="primary_dressing_id"
                            control={control}
                            render={({ field: { onChange, ...field } }) => (
                                <AsyncSelect
                                    id="primary_dressing_id"
                                    invalid={errors.primary_dressing_id && true}
                                    {...field}
                                    isClearable={true}
                                    className='react-select'
                                    classNamePrefix='select'
                                    loadOptions={(v) => getDressingsData(v, 50, 0)}
                                    onChange={handleSelectedPrimaryDressing}
                                    value={selectedPrimaryDressing}
                                    cacheOptions
                                />
                            )}
                        />

                        {errors.primary_dressing_id && (
                            <FormFeedback>{errors.primary_dressing_id.message}</FormFeedback>
                        )}
                    </Col>

                    <Col md="6" className="mb-1">
                        <Label className="form-label" for="other_primary_dressing_id">Other Primary Dressing Id </Label>
                        <Controller
                            name="other_primary_dressing_id"
                            control={control}
                            render={({ field: { onChange, ...field } }) => (
                                <AsyncSelect
                                    id="other_primary_dressing_id"
                                    invalid={errors.other_primary_dressing_id && true}
                                    {...field}
                                    isClearable={true}
                                    className='react-select'
                                    classNamePrefix='select'
                                    loadOptions={(v) => getDressingsData(v, 50, 0)}
                                    onChange={handleSelectedOtherPrimaryDressing}
                                    value={selectedOtherPrimaryDressing}
                                    cacheOptions
                                />
                            )}
                        />
                        {errors.other_primary_dressing_id && (
                            <FormFeedback>{errors.other_primary_dressing_id.message}</FormFeedback>
                        )}
                    </Col>

                    <Col className="col-md-6 mb-1">
                        <Label className="form-label" for="secondary_dressing_id">Secondary Dressing Id </Label>
                        <Controller
                            name="secondary_dressing_id"
                            control={control}
                            render={({ field: { onChange, ...field } }) => (
                                <AsyncSelect
                                    id="secondary_dressing_id"
                                    invalid={errors.secondary_dressing_id && true}
                                    {...field}
                                    isClearable={true}
                                    className='react-select'
                                    classNamePrefix='select'
                                    loadOptions={(v) => getDressingsData(v, 50, 0)}
                                    onChange={handleSelectedSecondaryDressing}
                                    value={selectedSecondayDressing}
                                    cacheOptions
                                />
                            )}
                        />

                        {errors.secondary_dressing_id && (
                            <FormFeedback>{errors.secondary_dressing_id.message}</FormFeedback>
                        )}
                    </Col>

                    <Col md="6" className="mb-1">
                        <Label className="form-label" for="peri_wound_skin_treatment_id">Peri Wound Skin Treatment Id </Label>
                        <Controller
                            name="peri_wound_skin_treatment_id"
                            control={control}
                            render={({ field: { onChange, ...field } }) => (
                                <AsyncSelect
                                    id="peri_wound_skin_treatment_id"
                                    invalid={errors.peri_wound_skin_treatment_id && true}
                                    {...field}
                                    isClearable={true}
                                    className='react-select'
                                    classNamePrefix='select'
                                    loadOptions={(v) => getPeriWoundsData(v, 50, 0)}
                                    onChange={handleSelectedPeriWound}
                                    value={selectedPeriWound}
                                    cacheOptions
                                />
                            )}
                        />

                        {errors.peri_wound_skin_treatment_id && (
                            <FormFeedback>{errors.peri_wound_skin_treatment_id.message}</FormFeedback>
                        )}
                    </Col>

                    <Col className="col-md-6 mb-1">
                        <Label className="form-label" for="secure_dressing_id">Secure Dressing Id </Label>

                        <Controller
                            name="secure_dressing_id"
                            control={control}
                            render={({ field: { onChange, ...field } }) => (
                                <AsyncSelect
                                    id="secure_dressing_id"
                                    invalid={errors.secure_dressing_id && true}
                                    {...field}
                                    isClearable={true}
                                    className='react-select'
                                    classNamePrefix='select'
                                    loadOptions={(v) => getSecureDressingsData(v, 50, 0)}
                                    onChange={handleSelectedSecureDressing}
                                    value={selectedSecureDressing}
                                    cacheOptions
                                />
                            )}
                        />

                        {errors.secure_dressing_id && (
                            <FormFeedback>{errors.secure_dressing_id.message}</FormFeedback>
                        )}
                    </Col>

                    <Col className="col-md-6 mb-1">
                        <Label className="form-label" for="tunneling_and_undermining_treatment_id">Tunneling And Undermining Treatment Id </Label>

                        <Controller
                            name="tunneling_and_undermining_treatment_id"
                            control={control}
                            render={({ field: { onChange, ...field } }) => (
                                <AsyncSelect
                                    id="tunneling_and_undermining_treatment_id"
                                    invalid={errors.tunneling_and_undermining_treatment_id && true}
                                    {...field}
                                    isClearable={true}
                                    className='react-select'
                                    classNamePrefix='select'
                                    loadOptions={(v) => getDressingsData(v, 50, 0)}
                                    onChange={handleSelectedUnderminingTreatment}
                                    value={selectedUnderminingTreatment}
                                    cacheOptions
                                />
                            )}
                        />

                        {errors.tunneling_and_undermining_treatment_id && (
                            <FormFeedback>{errors.tunneling_and_undermining_treatment_id.message}</FormFeedback>
                        )}
                    </Col>

                    <Col md="6" className="mb-1">
                        <Label className="form-label" for="primary_dressing_quantity">Primary Dressing Quantity </Label>
                        <Controller
                            id="primary_dressing_quantity"
                            name="primary_dressing_quantity"
                            control={control}
                            placeholder="10,000"
                            render={({ field: { ref, ...field } }) => (
                                <MyCleave
                                    {...field}
                                    className={classnames("form-control", {
                                        "is-invalid": errors.primary_dressing_quantity && true,
                                    })}
                                    options={{
                                        numeral: true,
                                        numeralThousandsGroupStyle: "thousand",
                                    }}
                                />
                            )}
                        />

                        {errors.primary_dressing_quantity && (
                            <FormFeedback>{errors.primary_dressing_quantity.message}</FormFeedback>
                        )}
                    </Col>

                    <Col className="col-md-6 mb-1">
                        <Label className="form-label" for="other_primary_dressing_quantity">Other Primary Dressing Quantity </Label>

                        <Controller
                            id="other_primary_dressing_quantity"
                            name="other_primary_dressing_quantity"
                            control={control}
                            placeholder="10,000"
                            render={({ field: { ref, ...field } }) => (
                                <MyCleave
                                    {...field}
                                    className={classnames("form-control", {
                                        "is-invalid": errors.other_primary_dressing_quantity && true,
                                    })}
                                    options={{
                                        numeral: true,
                                        numeralThousandsGroupStyle: "thousand",
                                    }}
                                />
                            )}
                        />

                        {errors.other_primary_dressing_quantity && (
                            <FormFeedback>{errors.other_primary_dressing_quantity.message}</FormFeedback>
                        )}
                    </Col>

                    <Col md="6" className="mb-1">
                        <Label className="form-label" for="secondary_dressing_quantity">Secondary Dressing Quantity </Label>
                        <Controller
                            id="secondary_dressing_quantity"
                            name="secondary_dressing_quantity"
                            control={control}
                            placeholder="10,000"
                            render={({ field: { ref, ...field } }) => (
                                <MyCleave
                                    {...field}
                                    className={classnames("form-control", {
                                        "is-invalid": errors.secondary_dressing_quantity && true,
                                    })}
                                    options={{
                                        numeral: true,
                                        numeralThousandsGroupStyle: "thousand",
                                    }}
                                />
                            )}
                        />

                        {errors.secondary_dressing_quantity && (
                            <FormFeedback>{errors.secondary_dressing_quantity.message}</FormFeedback>
                        )}
                    </Col>

                    <Col className="col-md-6 mb-1">
                        <Label className="form-label" for="peri_wound_skin_treatment_quantity">Peri Wound Skin Treatment Quantity </Label>

                        <Controller
                            id="peri_wound_skin_treatment_quantity"
                            name="peri_wound_skin_treatment_quantity"
                            control={control}
                            placeholder="10,000"
                            render={({ field: { ref, ...field } }) => (
                                <MyCleave
                                    {...field}
                                    className={classnames("form-control", {
                                        "is-invalid": errors.peri_wound_skin_treatment_quantity && true,
                                    })}
                                    options={{
                                        numeral: true,
                                        numeralThousandsGroupStyle: "thousand",
                                    }}
                                />
                            )}
                        />

                        {errors.peri_wound_skin_treatment_quantity && (
                            <FormFeedback>{errors.peri_wound_skin_treatment_quantity.message}</FormFeedback>
                        )}
                    </Col>

                    <Col md="6" className="mb-1">
                        <Label className="form-label" for="secure_dressing_quantity">Secure Dressing Quantity </Label>
                        <Controller
                            id="secure_dressing_quantity"
                            name="secure_dressing_quantity"
                            control={control}
                            placeholder="10,000"
                            render={({ field: { ref, ...field } }) => (
                                <MyCleave
                                    {...field}
                                    className={classnames("form-control", {
                                        "is-invalid": errors.secure_dressing_quantity && true,
                                    })}
                                    options={{
                                        numeral: true,
                                        numeralThousandsGroupStyle: "thousand",
                                    }}
                                />
                            )}
                        />

                        {errors.secure_dressing_quantity && (
                            <FormFeedback>{errors.secure_dressing_quantity.message}</FormFeedback>
                        )}
                    </Col>

                    <Col md="6" className="mb-1">
                        <Label className="form-label" for="tunneling_and_undermining_treatment_quantity">Tunneling And Undermining Treatment Quantity </Label>
                        <Controller
                            id="tunneling_and_undermining_treatment_quantity"
                            name="tunneling_and_undermining_treatment_quantity"
                            control={control}
                            placeholder="10,000"
                            render={({ field: { ref, ...field } }) => (
                                <MyCleave
                                    {...field}
                                    className={classnames("form-control", {
                                        "is-invalid": errors.tunneling_and_undermining_treatment_quantity && true,
                                    })}
                                    options={{
                                        numeral: true,
                                        numeralThousandsGroupStyle: "thousand",
                                    }}
                                />
                            )}
                        />

                        {errors.tunneling_and_undermining_treatment_quantity && (
                            <FormFeedback>{errors.tunneling_and_undermining_treatment_quantity.message}</FormFeedback>
                        )}
                    </Col>

                    <Col className="col-md-6 mb-1">
                        <Label className="form-label" for="procedure_performed_id">Procedure Performed Id </Label>

                        <Controller
                            name="procedure_performed_id"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="select"
                                    id="procedure_performed_id"
                                    invalid={errors.procedure_performed_id && true}
                                    {...field}
                                >
                                    {procedure_performed_options.map &&
                                        procedure_performed_options.map((item, index) => (
                                            <option value={item.value} key={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                </Input>
                            )}
                        />
                        {errors.procedure_performed_id && (
                            <FormFeedback>{errors.procedure_performed_id.message}</FormFeedback>
                        )}
                    </Col>

                    <Col md="6" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="folley_insert_change"
                                name="folley_insert_change"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <Input
                                        type="checkbox"
                                        invalid={errors.folley_insert_change && true}
                                        checked={!!value}
                                        {...field}
                                    />
                                )}
                            />
                            <Label className="form-label" for="folley_insert_change">Folley Insert Change </Label>
                            {errors.folley_insert_change && (
                                <FormFeedback>{errors.folley_insert_change.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                </Row>

            </Form>
        </>
    );

}
export default EditWoundNoteDressings;