// ** React Imports
import React, { Fragment, useState } from "react"

// ** Utils
import { isObjEmpty, isValidDate, minDateOfBirth } from "@utils"

// ** Third Party Components
import * as yup from "yup"
import { useForm, Controller, useWatch } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"

import useApi from "../../../api/useApi"

// ** Utils
import { showAlertError } from "../../alerts/AlertUtils"

import "cleave.js/dist/addons/cleave-phone.us"

// ** Reactstrap Imports
import {
    Form,
    Label,
    Input,
    Row,
    Col,
    FormFeedback
} from "reactstrap"

const EditProfile = ({ id, formData, doSubmit, callBack }) => {
    const [genders, setGenders] = useState([{ label: "", value: "" }])
    const [today] = useState(new Date().toISOString().substr(0, 10))

    const formSchema = yup.object().shape({
        first_name: yup
            .string()
            .max(120, "First Name must not exceed 120 characters")
            .required("First Name is a Required Field, Please fill it")
            .label("First Name"),
        middle_name: yup
            .string()
            .max(120, "Middle Name must not exceed 120 characters")
            .notRequired()
            .label("Middle Name"),
        last_name: yup
            .string()
            .max(120, "Last Name must not exceed 120 characters")
            .required("Last Name is a Required Field, Please fill it")
            .label("Last Name"),
        second_last_name: yup
            .string()
            .max(120, "Second Last Name must not exceed 120 characters")
            .notRequired()
            .label("Second Last Name"),
        date_of_birth: yup
            .date()
            .required("Date of Birth is a Required Field, Please fill it")
            .transform((value) => (isValidDate(value) ? value : null))
            .label("Date of Birth")
            .max(new Date(), "Date of Birth must be today or earlier")
            .min(minDateOfBirth(), "Invalid Date of Birth"),
        gender_id: yup
            .number()
            .nullable()
            .default(null)
            .typeError("Please select a valid gender")
            .required("Gender is a required field")
            .label("Gender"),
        gender: yup.string(),
    });

    // ** Hooks
    const {
        trigger,
        control,
        setValue,
        getValues,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm({ resolver: yupResolver(formSchema) })

    const gender_id = watch("gender_id")

    React.useEffect(() => {
        useApi
            .get("/lookup/genders", {})
            .then((res) => {
                let items = [{ label: "", value: "" }]
                res.data.data.map((r) => {
                    const option = { label: r.description ?? r.name, value: r.id }
                    items.push(option)
                    return option
                })
                setGenders(items)
            })
            .catch((err) => {
                showAlertError(`kkk${err}`)
            })
    }, [])

    React.useEffect(() => {
        const fetchFormData = () => {
            setValue("first_name", formData.first_name)
            setValue("middle_name", formData.middle_name)
            setValue("last_name", formData.last_name)
            setValue("second_last_name", formData.second_last_name)
            setValue("date_of_birth", formData.date_of_birth)
            setValue("gender_id", formData.gender_id)
        }
        fetchFormData()
    }, [formData.record_number])

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

    React.useEffect(() => {
        try {
            const gender = genders.find(subject => subject.value === parseInt(gender_id)).label
            setValue("gender", gender)
        } catch (e) {
            setValue("gender", "")
        }
    }, [gender_id])

    return (
        <>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>

                    <Col md="6" className="mb-1">
                        <Label className="form-label" for="date_of_birth">
                            Date Of Birth
                        </Label>

                        <Controller
                            id="date_of_birth"
                            name="date_of_birth"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    maxDate={today}
                                    type="date"
                                    invalid={errors.date_of_birth && true}
                                    {...field}
                                />
                            )}
                        />
                        {errors.date_of_birth && (
                            <FormFeedback>{errors.date_of_birth.message}</FormFeedback>
                        )}
                    </Col>

                    <Col>
                        <div className="col-md-12 mb-1">
                            <Label className="form-label" for="gender_id">
                                Select Gender <span className="text-danger">*</span>
                            </Label>

                            <Controller
                                name="gender_id"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="select"
                                        id="gender_id"
                                        invalid={errors.gender_id && true}
                                        {...field}
                                    >
                                        {genders.map &&
                                            genders.map((item, index) => (
                                                <option value={item.value} key={item.value}>
                                                    {item.label}
                                                </option>
                                            ))}
                                    </Input>
                                )}
                            />
                            {errors.gender_id && (
                                <FormFeedback>{errors.gender_id.message}</FormFeedback>
                            )}
                        </div>
                    </Col>
                </Row>
                <Row>
                    <div className="col-md-6 mb-1">
                        <Label className="form-label" for="first_name">
                            First Name
                        </Label>

                        <Controller
                            id="first_name"
                            name="first_name"
                            control={control}
                            render={({ field }) => (
                                <Input invalid={errors.first_name && true} {...field} />
                            )}
                        />
                        {errors.first_name && (
                            <FormFeedback>{errors.first_name.message}</FormFeedback>
                        )}
                    </div>
                    <div className="col-md-6 mb-1">
                        <Label className="form-label" for="middle_name">
                            Middle Name
                        </Label>

                        <Controller
                            id="middle_name"
                            name="middle_name"
                            control={control}
                            render={({ field }) => (
                                <Input invalid={errors.middle_name && true} {...field} />
                            )}
                        />
                        {errors.middle_name && (
                            <FormFeedback>{errors.middle_name.message}</FormFeedback>
                        )}
                    </div>
                </Row>

                <Row>
                    <div className="col-md-6 mb-1">
                        <Label className="form-label" for="last_name">
                            Last Name
                        </Label>
                        <Controller
                            id="last_name"
                            name="last_name"
                            control={control}
                            render={({ field }) => (
                                <Input invalid={errors.last_name && true} {...field} />
                            )}
                        />
                        {errors.last_name && (
                            <FormFeedback>{errors.last_name.message}</FormFeedback>
                        )}
                    </div>
                    <div className="col-md-6 mb-1">
                        <Label className="form-label" for="second_last_name">
                            Second Last Name
                        </Label>

                        <Controller
                            id="second_last_name"
                            name="second_last_name"
                            control={control}
                            render={({ field }) => (
                                <Input invalid={errors.second_last_name && true} {...field} />
                            )}
                        />
                        {errors.second_last_name && (
                            <FormFeedback>{errors.second_last_name.message}</FormFeedback>
                        )}
                    </div>
                </Row>

            </Form>
        </>
    )

}

export default EditProfile