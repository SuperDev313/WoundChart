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
    Row,
    Col,
    FormFeedback,
} from "reactstrap";

const EditPatientDrug = ({ id, formData, doSubmit, callBack }) => {
    const [drug, setDrug] = useState([{ label: "", value: "" }]);
    const [selectedDrug, setSelectedDrug] = useState(null)


    const [loading, setLoading] = useState(false);
    
    const formSchema = yup.object().shape({
        drug_id: yup.number().required("Drug is required.").label("Drug"),
        drug_id_description: yup.string().required("Drug Description is required.").max(255).label("Drug Description"),
    });

    const [page, setPage] = useState(0);
    const [payload, setPayload] = useState({
        q: "",
        limit: 50,
        offset: page,
        sortColumn: "description",
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

    const drug_id = watch("drug_id");

    const getDrugData = (q) => {
        return new Promise(resolve => {
            setLoading(true);
            useApi
                .post("/lookups/drugs", {
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
                        const option = { label: r.description, value: r.id };
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
            setValue("drug_id", isNaN(formData.drug_id) ? "" : formData.drug_id);
            setValue("drug_id_description", formData.drug_id_description);

            setSelectedDrug({
                "label": formData.drug_id_description,
                "value": (isNaN(formData.drug_id) ? "" : formData.drug_id)
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
        const value = drug.find(r => r.value === parseInt(drug_id));
        if (value) {
            setValue("drug_id_description", value.label);
        }
    }, [drug_id])

    const handleSelectedDrug = (value) => {
        setSelectedDrug(value)

        if (value != null) {
            setValue("drug_id", value.value);
            setValue("drug_id_description", value.label);
        }
        else {
            setValue("drug_id", '');
            setValue("drug_id_description", '');
        }
    }

    return (
        <>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>

                    <Col className="col-md-12 mb-1">
                        <Label className="form-label" for="drug_id">Drug Id </Label>

                        <Controller
                            name="drug_id"
                            control={control}
                            render={({ field: { onChange, ...field } }) => (
                                <AsyncSelect
                                    id="drug_id"
                                    invalid={errors.drug_id && true}
                                    {...field}
                                    isClearable={true}
                                    className='react-select'
                                    classNamePrefix='select'
                                    loadOptions={(v) => getDrugData(v)}
                                    onChange={handleSelectedDrug}
                                    value={selectedDrug}
                                    cacheOptions
                                    defaultOptions
                                    isLoading={loading}
                                />
                            )}
                        />

                        {errors.drug_id && (
                            <FormFeedback>{errors.drug_id.message}</FormFeedback>
                        )}
                    </Col>

                </Row>

            </Form>
        </>
    );

}


export default EditPatientDrug;