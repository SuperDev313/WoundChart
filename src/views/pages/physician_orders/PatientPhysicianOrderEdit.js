
// ** React Imports
import React, { Fragment, useState, useEffect } from "react";
import useApi from "../../../api/useApi";
// ** Utils
import { isObjEmpty, isValidDate, minDateOfBirth } from "@utils";

// ** Third Party Components
import * as yup from "yup";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { X, Plus } from 'react-feather'

import { getDateTimeLocal, transformValue } from "../../../utility/Utils";
// ** Reactstrap Imports
import {
    Form,
    Label,
    Input,
    Row,
    Col,
    Button,
    FormFeedback,
    Card, CardHeader, CardBody, CardText,
} from "reactstrap";

const PatientPhysicianOrderEdit = ({ id, formData, doSubmit, callBack }) => {

    const [today] = useState(new Date().toISOString().substr(0, 10))

    const [physician_order_type_options, setPhysician_Order_Type_Options] = useState([{ label: "", value: "" }]);


    const formSchema = yup.object().shape({
        patient_id: yup
            .number().transform((value) => (isNaN(value) || value === null || value === undefined) ? null : value).notRequired().label("Patient"),
        order_type_id: yup
            .number().transform((value) => (isNaN(value) || value === null || value === undefined) ? null : value).notRequired().label("Order Type"),
        data_date: yup
            .date()
            .required("Order Date is required.")
            .transform((value) => (isValidDate(value) ? value : null))
            .label("Order Date")
            .max(new Date(), "Order Date must be today or earlier")
            .min(minDateOfBirth(), "Invalid Order Date"),
        items: yup.array().of(
            yup.object().shape({
                id: yup.number(),
                item_description: yup.string().required("Description is required"),
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
    } = useFieldArray({ control, name: "items" });


    React.useEffect(() => {
        const fetchFormData = () => {
            setValue("patient_id", isNaN(formData.patient_id) ? "" : formData.patient_id);
            setValue("order_type_id", isNaN(formData.order_type_id) ? "" : formData.order_type_id);
            setValue("data_date", getDateTimeLocal(formData.data_date));
            setValue("items", formData.items);

        };
        if (formData) {
            fetchFormData();
        }
    }, [formData]);

    React.useEffect(() => {
        useApi
            .get("/lookup/physician_order_type_options", {})
            .then((res) => {
                var items = [{ text: "", value: "" }];
                res.data.data.map((r) => {
                    const option = { label: r.description, value: r.id };
                    items.push(option);
                    return option;
                });
                setPhysician_Order_Type_Options(items);
            })
            .catch((err) => {
                showAlertError(err);
            });


    }, []);


    React.useEffect(() => {
        const doRun = async () => {
            const result = await trigger()
            callBack(getValues(), result)
        }
        if (doSubmit) {
            doRun()
        }

    }, [doSubmit])

    const onSubmit = (data) => {
        callBack(data, isObjEmpty(errors))
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

                    <Col md="12" className="mb-1">
                        <Label className="form-label" for="order_type_id">Order Type Id </Label>

                        <Controller
                            name="order_type_id"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="select"
                                    id="order_type_id"
                                    invalid={errors.order_type_id && true}
                                    {...field}
                                >
                                    {physician_order_type_options.map &&
                                        physician_order_type_options.map((item, index) => (
                                            <option value={item.value} key={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                </Input>
                            )}
                        />
                        {errors.order_type_id && (
                            <FormFeedback>{errors.order_type_id.message}</FormFeedback>
                        )}
                    </Col>

                    <Card>
                        <CardHeader>
                            <h4 className='card-title'>Items</h4>
                        </CardHeader>
                        <CardBody>
                            {itemFields.map((item, i) => (
                                <span key={item.id} >
                                    <Row className='row-container justify-content-between align-items-center'>
                                        <Col md={10} className='mb-md-0 mb-1'>
                                            <Controller
                                                id={`items[${i}].item_description`}
                                                name={`items[${i}].item_description`}
                                                control={control}
                                                render={({ field: { onBlur, value, ...field } }) => (
                                                    <Input invalid={errors.items?.[i]?.item_description && true} {...field}
                                                        value={value} />
                                                )}
                                            />

                                            {errors.items?.[i]?.item_description && (
                                                <FormFeedback>{errors.items?.[i]?.item_description?.message}</FormFeedback>
                                            )}
                                        </Col>

                                        <Col md={2}>
                                            <Button color='danger' className='text-nowrap px-1' onClick={() => removeItem(i)} outline>
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

                            <Button className='btn-icon' color='primary' onClick={addItem}>
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

export default PatientPhysicianOrderEdit;

