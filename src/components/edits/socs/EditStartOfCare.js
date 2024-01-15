
// ** React Imports
import React, { Fragment, useState } from "react";

import Flatpickr from 'react-flatpickr'
// ** Utils
import { isObjEmpty, isValidDate, minDateOfBirth } from "@utils";

import classnames from "classnames";
import { Check, X } from 'react-feather'

// ** Third Party Components
import * as yup from "yup";
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import MyCleave from "../../forms/MyCleave";
import useApi from "../../../api/useApi";

// ** Utils
import { showAlertError } from "../../alerts/AlertUtils";
import SwitchControl from "../../forms/SwitchControl";

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

import '@styles/react/libs/flatpickr/flatpickr.scss'

const EditStartOfCare = ({ id, formData, doSubmit, callBack, saveFieldCallback, loading }) => {

    const [locations, setLocations] = useState([{ label: "", value: "" }]);
    const [visit_types, setVisit_Types] = useState([{ label: "", value: "" }]);
    const [information_taken_from_options, setInformation_Taken_From_Options] = useState([{ label: "", value: "" }]);
    const [today] = useState(new Date().toISOString().substr(0, 10));


    const defaultFormValues = {
        data_date: '',
        information_taken_from_id: '',
        location_id: '',
        chief_complaint: '',
        condition_related_to_employment: '',
        condition_related_to_car_accident: '',
        condition_related_to_other_accident: '',
    };

    const CustomLabel = ({ htmlFor }) => {
        return (
            <Label className='form-check-label' htmlFor={htmlFor}>
                <span className='switch-icon-left'>
                <Check size={14} />
                </span>
                <span className='switch-icon-right'>
                <X size={14} />
                </span>
            </Label>
        )
    }

    const formSchema = yup.object().shape({
        data_date: yup
            .date()
            .required("Visit Date is required.")
            .label("Visit Date")
            .transform((value) => (isValidDate(value) ? value : null))
            .max(new Date(), 'Visit Date must be today or earlier')
            .min(minDateOfBirth(), 'Invalid Visit Date'),
        information_taken_from_id: yup
            .number()
            .transform((value) => (isNaN(value) || value === null || value === undefined ? null : value))
            .notRequired()
            .label("InformationTakenFromId"),
        location_id: yup
            .number()
            .transform((value) => (isNaN(value) || value === null || value === undefined ? null : value))
            .notRequired()
            .label("LocationId"),
            chief_complaint: yup.string().max(50).notRequired().label("ChiefComplaint"),
        condition_related_to_employment: yup
            .mixed()
            .default(false)
            .notRequired()
            .label("Condition Related to Employment")
            .test(
                "is-boolean",
                "Condition Related To Employment must be a boolean type",
            (value) => value === true || value === false || value === ""
        ),

        condition_related_to_car_accident: yup
            .mixed()
            .default(false)
            .notRequired()
            .label("ConditionRelatedToCarAccident")
            .test(
                "is-boolean",
                "ConditionRelatedToCarAccident must be a boolean type",
                (value) => value === true || value === false || value === ""
            ),
        condition_related_to_other_accident: yup
            .mixed()
            .default(false)
            .notRequired()
            .label("ConditionRelatedToOtherAccident")
            .test(
                "is-boolean",
                "ConditionRelatedToOtherAccident must be a boolean type",
                (value) => value === true || value === false || value === ""
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
    } = useForm(
        {
            resolver: yupResolver(formSchema)
        }
    );


    watch((data, { name }) => {
        console.log(name)
    });

    React.useEffect(() => {
        useApi
            .get("/lookup/locations", {})
            .then((res) => {
                var items = [{ label: "", value: "" }];
                res.data.data.map((r) => {
                    const option = { label: r.name, value: r.id };
                    items.push(option);
                    return option;
                });
                setLocations(items);
            })
            .catch((err) => {
                showAlertError(err);
            });
        useApi
            .get("/lookup/visit_types", {})
            .then((res) => {
                var items = [{ label: "", value: "" }];
                res.data.data.map((r) => {
                    const option = { label: r.description, value: r.id };
                    items.push(option);
                    return option;
                });
                setVisit_Types(items);
            })
            .catch((err) => {
                showAlertError(err);
            });
        useApi
            .get("/lookup/information_taken_from_options", {})
            .then((res) => {
                var items = [{ label: "", value: "" }];
                res.data.data.map((r) => {
                    const option = { label: r.description, value: r.id };
                    items.push(option);
                    return option;
                });
                setInformation_Taken_From_Options(items);
            })
            .catch((err) => {
                showAlertError(err);
            });

    }, []);

    React.useEffect(() => {
        const fetchFormData = () => {

            setValue("data_date", formData.data_date);
            setValue("information_taken_from_id", isNaN(formData.information_taken_from_id) ? "" : formData.information_taken_from_id);
            setValue("location_id", isNaN(formData.location_id) ? "" : formData.location_id);
            setValue("chief_complaint", formData.chief_complaint);
            setValue("condition_related_to_employment", formData.condition_related_to_employment);
            setValue("condition_related_to_car_accident", formData.condition_related_to_car_accident);
            setValue("condition_related_to_other_accident", formData.condition_related_to_other_accident);


        };
        if (formData) {
            fetchFormData();
        }
    }, [formData.data_date]);



    React.useEffect(() => {
        const doRun = async () => {
            const result = await trigger();
            callBack(getValues(), result)
        }
        if (doSubmit && callBack) {
            doRun()
        }

    }, [doSubmit]);

    const onSubmit = (data) => {
        callBack(data, isObjEmpty(errors))
    };

    return (
        <>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <Col md="6" className="mb-1">
                        <Label className="form-label" for="data_date">Date & Time of Evaluation </Label>
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
                    <Col className="col-md-6 mb-1">
                        <Label className="form-label" for="information_taken_from_id">Information Taken From </Label>

                        <Controller
                            name="information_taken_from_id"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="select"
                                    id="information_taken_from_id"
                                    invalid={errors.information_taken_from_id && true}
                                    {...field}
                                >
                                    {information_taken_from_options.map &&
                                        information_taken_from_options.map((item, index) => (
                                            <option value={item.value} key={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                </Input>
                            )}
                        />
                        {errors.information_taken_from_id && (
                            <FormFeedback>{errors.information_taken_from_id.message}</FormFeedback>
                        )}
                    </Col>

                    <Col className="col-md-6 mb-1">
                        <Label className="form-label" for="location_id">Location </Label>

                        <Controller
                            name="location_id"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="select"
                                    id="location_id"
                                    invalid={errors.location_id && true}
                                    {...field}
                                >
                                    {locations.map &&
                                        locations.map((item, index) => (
                                            <option value={item.value} key={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                </Input>
                            )}
                        />
                        {errors.location_id && (
                            <FormFeedback>{errors.location_id.message}</FormFeedback>
                        )}
                    </Col>

                    <Col md="6" className="mb-1">
                        <Label className="form-label" for="chief_complaint">Chief Complaint </Label>

                        <Controller
                            id="chief_complaint"
                            name="chief_complaint"
                            control={control}
                            render={({ field }) => (
                                <Input invalid={errors.chief_complaint && true} {...field} />
                            )}
                        />
                        {errors.chief_complaint && (
                            <FormFeedback>{errors.chief_complaint.message}</FormFeedback>
                        )}
                    </Col>

                    <Col md="4" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="condition_related_to_employment"
                                name="condition_related_to_employment"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <div className='d-flex flex-column'>
                                        <Label for='condition_related_to_employment' className='form-check-label mb-50'>
                                            Condition Related To Employment
                                        </Label>
                                        <div className='form-switch form-check-primary'>
                                            <Input 
                                                type='switch' 
                                                invalid={errors.condition_related_to_employment && true}
                                                checked={!!value}
                                                {...field} 
                                            />
                                            <CustomLabel htmlFor='condition_related_to_employment' />
                                        </div>
                                    </div>
                                )}
                            />
                            {errors.condition_related_to_employment && (
                                <FormFeedback>{errors.condition_related_to_employment.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="4" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="condition_related_to_car_accident"
                                name="condition_related_to_car_accident"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <div className='d-flex flex-column'>
                                        <Label for='condition_related_to_car_accident' className='form-check-label mb-50'>
                                            Condition Related To Car Accident
                                        </Label>
                                        <div className='form-switch form-check-primary'>
                                            <Input 
                                                type='switch' 
                                                invalid={errors.condition_related_to_car_accident && true}
                                                checked={!!value}
                                                {...field} 
                                            />
                                            <CustomLabel htmlFor='condition_related_to_car_accident' />
                                        </div>
                                    </div>
                                )}
                            />
                            {errors.condition_related_to_car_accident && (
                                <FormFeedback>{errors.condition_related_to_car_accident.message}</FormFeedback>
                            )}
                        </div>
                    </Col>

                    <Col md="4" className="mb-1">
                        <div className="form-check form-check-inline">
                            <Controller
                                id="condition_related_to_other_accident"
                                name="condition_related_to_other_accident"
                                control={control}
                                render={({ field: { value, ...field } }) => (
                                    <div className='d-flex flex-column'>
                                        <Label for='condition_related_to_other_accident' className='form-check-label mb-50'>
                                            Condition Related To Other Accident
                                        </Label>
                                        <div className='form-switch form-check-primary'>
                                            <Input 
                                                type='switch' 
                                                invalid={errors.condition_related_to_other_accident && true}
                                                checked={!!value}
                                                {...field} 
                                            />
                                            <CustomLabel htmlFor='condition_related_to_other_accident' />
                                        </div>
                                    </div>
                                )}
                            />
                            {errors.condition_related_to_other_accident && (
                                <FormFeedback>{errors.condition_related_to_other_accident.message}</FormFeedback>
                            )}
                        </div>
                    </Col>
                </Row>
            </Form>
        </>
    );

}


export default EditStartOfCare;
