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
import AsyncSelect from 'react-select/async'
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

const EditWoundNotesCleanser = ({ id, formData, doSubmit, callBack }) => {
    const [products, setProducts] = useState([{ label: "", value: "" }]);
    const [selectedDiagnoses, setSelectedDiagnoses] = useState(null)

    const [loading, setLoading] = useState(false);
    const formSchema = yup.object().shape({
        product_id: yup.number().required().label("Cleanser"),
        product_id_product_name: yup.string(),
    });

    const [page, setPage] = useState(0);
    const [payload, setPayload] = useState({
        q: "",
        limit: 50,
        offset: page,
        sortColumn: "product_name",
        sort: "ASC",
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

    const product_id = watch("product_id");

    const getProductsData = (q) => {
        return new Promise(resolve => {
            setLoading(true);
            useApi
                .post("/lookup/products/cleansers", {
                    q: q,
                    limit: payload.limit,
                    offset: payload.offset,
                    sortColumn: payload.sortColumn,
                    sort: payload.sort,
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


    React.useEffect(() => {
        const fetchFormData = () => {
            setValue("product_id", isNaN(formData.product_id) ? "" : formData.product_id);
            setValue("product_id_product_name", formData.product_id_product_name);

            setSelectedDiagnoses({
                "label": formData.product_id_product_name,
                "value": (isNaN(formData.product_id) ? "" : formData.product_id)
            })
     
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
        const value = products.find(r => r.value === parseInt(product_id));
        if (value) {
            setValue("product_id_product_name", value.label);
        }
    }, [product_id])

    const handleSelectedProducts = (value) => {
        setSelectedDiagnoses(value)

        if (value != null) {
            setValue("product_id", value.value);
            setValue("product_id_product_name", value.label);
        }
        else {
            setValue("product_id", '');
            setValue("product_id_product_name", '');
        }
    }

    return (
        <>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>

                    <Col className="col-md-12 mb-1">
                        <Label className="form-label" for="product_id">Products </Label>

                        <Controller
                            name="product_id"
                            control={control}
                            render={({ field: { onChange, ...field } }) => (
                                <AsyncSelect
                                    id="product_id"
                                    invalid={errors.product_id && true}
                                    {...field}
                                    isClearable={true}
                                    className='react-select'
                                    classNamePrefix='select'
                                    loadOptions={(v) => getProductsData(v)}
                                    onChange={handleSelectedProducts}
                                    value={selectedDiagnoses}
                                    cacheOptions
                                    defaultOptions
                                    isLoading={loading}
                                />
                            )}
                        />

                        {errors.product_id && (
                            <FormFeedback>{errors.product_id.message}</FormFeedback>
                        )}
                    </Col>

                </Row>

            </Form>
        </>
    );

}


export default EditWoundNotesCleanser;