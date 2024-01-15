
// ** React Imports
import React, { Fragment, useState, useEffect } from "react";
import useApi from "../../../api/useApi";
// ** Utils
import { isObjEmpty, isValidDate, minDateOfBirth } from "@utils";

// ** Third Party Components
import * as yup from "yup";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import MyCleave from "../../../components/forms/MyCleave";

import { getDateTimeLocal, transformValue } from "../../../utility/Utils";
// ** Utils
import { showAlertError } from "../../../components/alerts/AlertUtils";
import SwitchControl from "../../../components/forms/SwitchControl"

import classnames from "classnames";
import AsyncSelect from 'react-select/async'


import { X, Plus } from 'react-feather'
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
    Card,
    CardBody,
    CardHeader,
} from "reactstrap";

const PatientPrescriptionEdit = ({ id, formData, doSubmit, callBack }) => {

    const [today] = useState(new Date().toISOString().substr(0, 10))
    const [drug, setDrug] = useState([{ label: "", value: "" }]);
    const [selectedDrug, setSelectedDrug] = useState([])
    const [loading, setLoading] = useState(false);
    
    const [page, setPage] = useState(0);
    const [payload, setPayload] = useState({
        q: "",
        limit: 50,
        offset: page,
        sortColumn: "drug_name",
        sort: "ASC",
    });


    const formSchema = yup.object().shape({
        patient_id: yup
            .number().transform((value) => (isNaN(value) || value === null || value === undefined) ? null : value).notRequired().label("PatientId"),
            data_date: yup
            .date()
            .required("Prescription Date is required.")
            .transform((value) => (isValidDate(value) ? value : null))
            .label("Prescription Date")
            .max(new Date(), "Prescription Date must be today or earlier"),
        dispense_as_written: yup
            .string().max(5).notRequired().label("Dispense As Written"),
        may_substitute: yup
            .bool().notRequired().label("Ma ySubstitute"),
        prescriptions: yup.array().of(
            yup.object().shape({
                id: yup.number(),
                medicine_id: yup
                    .number().transform((value) => ((isNaN(value) || value === null || value === undefined) ? null : value)).required('Please select a medicine').label("Medicine"),
                amount: yup
                    .string().max(250).required('Please fill in Amount').label("Amount"),
                refill_total: yup
                    .number().transform((value) => ((isNaN(value) || value === null || value === undefined) ? null : value)).required().label("Refill Total"),
                form: yup
                    .string().max(250).required('Enter Refill Value').label("Form"),
                drug_name: yup.string(),
            })
        ),

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

    const {
        fields: itemFields,
        append: addItem,
        remove: removeItem
    } = useFieldArray({ control, name: "prescriptions" });


    React.useEffect(() => {
        const fetchFormData = () => {
            setValue("patient_id", isNaN(formData.patient_id) ? "" : formData.patient_id);
            setValue("data_date", getDateTimeLocal(formData.data_date));
            setValue("dispense_as_written", formData.dispense_as_written);
            setValue("may_substitute", formData.may_substitute);
            setValue("prescriptions", formData.prescriptions);

            const items = []
            formData.prescriptions.forEach(r => {
                items.push({
                    value: r.medicine_id,
                    label: r.drug_name,
                })

            });

            setSelectedDrug(current => [...current, ...items])

        };
        if (formData) {
            fetchFormData();
        }
    }, [formData]);


    const getDrugData = (q, e) => {
        return new Promise(resolve => {
            setLoading(true);
            
            useApi
                .post("/lookup/medicine_options", {
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
                        const option = { label: r.drug_name + ' ' + r.strength, value: r.id };
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
        const doRun = async () => {
            const result = await trigger()

            callBack(getValues(), result)
        }
        doRun()
        console.log('doSubmit', doSubmit)

    }, [doSubmit])

    const onSubmit = (data) => {
        callBack(data, isObjEmpty(errors))
    }

    const checkBoxValueChange = (e) => {
        const { value, name } = e.target;
        setValue(name, e.target.checked && true);
    }

    const handleSelectedDrug = (value, e, i) => {

        if (!selectedDrug[i]){
            setSelectedDrug([...selectedDrug, value]);
        }
        else{
            selectedDrug[i] = value;
        }
        

        console.log( i, selectedDrug[i])

        if (value != null) {
            setValue(e.name, value.value);
            setValue(`${e.name}_description`, value.label);
        }
        else {
            setValue(e.name, '');
            setValue(`${e.name}_description`, '');
        }
        console.log('data', getValues())
    }

    const doRemoveItem = (i) => {
        const temp = [...selectedDrug];
        temp.splice(i, 1);
        setSelectedDrug(temp);

        removeItem(i)
    }

    const doAddItem = () => {
        addItem();
    }

    return (
        <>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>


                    <Col md="12" className="mb-1">
                        <Label className="form-label" for="data_date">Data Date </Label>
                        <Controller
                            id="data_date"
                            name="data_date"
                            control={control}
                            render={({ field }) => (

                                <Input
                                    maxDate={today}
                                    type="datetime-local"
                                    invalid={errors.data_date && true}
                                    {...field}
                                />
                            )}
                        />
                        {errors.data_date && (
                            <FormFeedback>{errors.data_date.message}</FormFeedback>
                        )}
                    </Col>

                    <Col md="6" className="mb-1">

                        <SwitchControl
                            control={control}
                            name="dispense_as_written"
                            label="Dispense as written"
                            onValueChange={checkBoxValueChange}
                        />
                    </Col>

                    <Col md="6" className="mb-1">
                        <SwitchControl
                            control={control}
                            name="may_substitute"
                            label="May Substitute"
                            onValueChange={checkBoxValueChange}
                        />
                    </Col>

                    <Card>
                        <CardHeader>
                            <h4 className='card-title'>Prescriptions</h4>
                        </CardHeader>
                        <CardBody>
                            {itemFields.map((item, i) => (
                                <span key={item.id} >
                                    <Row className='row-container justify-content-between align-items-center'>
                                        <Col md={10} className='mb-md-0 mb-1'>
                                            <Row>

                                                <Col className="col-md-12 mb-1">
                                                    <Label className="form-label" for={`prescriptions[${i}].medicine_id`}>Medicine Id </Label>

                                                    <Controller
                                                        name={`prescriptions[${i}].medicine_id`}
                                                        control={control}
                                                        render={({ field: { onChange, ...field } }) => (
                                                            <AsyncSelect
                                                                id={`prescriptions[${i}].medicine_id`}
                                                                {...field}
                                                                isClearable={true}
                                                                className='react-select'
                                                                classNamePrefix='select'
                                                                loadOptions={(v, e) => getDrugData(v, e)}
                                                                onChange={(v,e) => handleSelectedDrug (v,e, i)}
                                                                cacheOptions
                                                                defaultOptions
                                                                value={selectedDrug[i]}
                                                                isLoading={loading}
                                                            />
                                                        )}
                                                    />
                                                    {errors.medicine_id && (
                                                        <FormFeedback>{errors.prescriptions?.[i]?.medicine_id.message}</FormFeedback>
                                                    )}
                                                </Col>

                                               <Col md="4" className="mb-1">
                                                    <Label className="form-label" for={`prescriptions[${i}].amount`}>Amount </Label>

                                                    <Controller
                                                        id={`prescriptions[${i}].amount`}
                                                        name={`prescriptions[${i}].amount`}
                                                        control={control}
                                                        render={({ field: { onBlur, value, ...field } }) => (
                                                            <MyCleave
                                                                {...field}
                                                                value={value ? value : 0}
                                                                maxLength="3"
                                                                className={classnames("form-control", {
                                                                    "is-invalid": errors.prescriptions?.[i]?.amount.message && true,
                                                                })}
                                                                options={{
                                                                    numeral: true,
                                                                    numeralThousandsGroupStyle: "thousand",
                                                                }}
                                                            />
                                                        )}
                                                    />

                                                    {errors.amount && (
                                                        <FormFeedback>{errors.prescriptions?.[i]?.amount.message}</FormFeedback>
                                                    )}
                                                </Col>

                                                <Col md="4" className="mb-1">
                                                    <Label className="form-label" for={`prescriptions[${i}].refill_total`}>Refill Total </Label>
                                                    <Controller
                                                        id={`prescriptions[${i}].refill_total`}
                                                        name={`prescriptions[${i}].refill_total`}
                                                        control={control}
                                                        placeholder="10,000"
                                                        render={({ field: { onBlur, value, ...field } }) => (
                                                            <MyCleave
                                                                {...field}
                                                                value={value ? value : 0}
                                                                maxLength="3"
                                                                className={classnames("form-control", {
                                                                    "is-invalid": errors.prescriptions?.[i]?.refill_total.message && true,
                                                                })}
                                                                options={{
                                                                    numeral: true,
                                                                    numeralThousandsGroupStyle: "thousand",
                                                                }}
                                                            />
                                                        )}
                                                    />


                                                    {errors.refill_total && (
                                                        <FormFeedback>{errors.prescriptions?.[i]?.refill_total.message}</FormFeedback>
                                                    )}
                                                </Col>

                                                <Col md="4" className="mb-1">
                                                    <Label className="form-label" for={`prescriptions[${i}].form`}>Form </Label>

                                                    <Controller
                                                        id={`prescriptions[${i}].form`}
                                                        name={`prescriptions[${i}].form`}
                                                        control={control}
                                                        render={({ field: { onBlur, value, ...field } }) => (
                                                            <Input invalid={errors.prescriptions?.[i]?.form.message && true} {...field}
                                                            value={value ? value : 0} />
                                                        )}
                                                    />

                                                    {errors.form && (
                                                        <FormFeedback>{errors.prescriptions?.[i].form.message}</FormFeedback>
                                                    )}
                                                </Col> 

                                            </Row>
                                        </Col>

                                        <Col md={2}>
                                            <Button color='danger' className='text-nowrap px-1' onClick={() => doRemoveItem(i)} outline>
                                                <X size={14} className='me-50' />
                                                <span>Delete</span>
                                            </Button>
                                        </Col>
                                        <Col sm={12}>
                                            <hr />
                                        </Col>
                                    </Row>
                                </span>
                            ))}

                            <Button className='btn-icon' color='primary' onClick={doAddItem}>
                                <Plus size={14} />
                                <span className='align-middle ms-25'>Add New</span>
                            </Button>
                        </CardBody>
                    </Card>
                </Row>

            </Form>
        </>
    );

}

export default PatientPrescriptionEdit;