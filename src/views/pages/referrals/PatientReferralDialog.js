// ** React Import
import React, { useState } from 'react'
import classnames from 'classnames'

import { useParams } from 'react-router-dom'
// ** Custom Components
import useApi from '../../../api/useApi'
import { DefaultLoader } from '../../../components/spinner/LoadingSpinner'
import UILoader from '../../../components/ui-loader'
// ** Utils
import { showAlertError } from '../../../components/alerts/AlertUtils'

// ** Third Party Components
import toast from 'react-hot-toast'
// ** Reactstrap Imports
import { Modal, ModalBody, ModalHeader } from 'reactstrap'

import { dateToISOString } from '../../../utility/Utils'
import { Fragment, useEffect } from 'react'
// ** Utils
import { isObjEmpty, isValidDate, minDateOfBirth } from '@utils'

// ** Third Party Components
import * as yup from 'yup'
import { useForm, Controller, useWatch, useFieldArray } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { getDateTimeLocal, transformValue } from '../../../utility/Utils'
import { X, Plus } from 'react-feather'
// ** Utils

import 'cleave.js/dist/addons/cleave-phone.us'

// ** Reactstrap Imports
import { Form, Label, Input, Row, Col, Button, FormFeedback, Card, CardHeader, CardBody, CardText } from 'reactstrap'

const PatientReferralDialog = ({ open, doTogglePopup, recordId, doHandleSaveAndClosePopup }) => {
  const { id } = useParams()

  const [loading, setLoading] = useState(false)
  const [doSubmit, setDoSubmit] = useState(false)

  const [formData, setFormData] = useState({
    patient_id: id,
    referred_to: '',
    referred_to_service: '',
    referral_reason: '',
    patient_condition: '',
    medical_history: '',
  })

  const saveCallback = (data, isValid) => {
    if (isValid) {
      setLoading(true)
      useApi
        .doRun(recordId > 0 ? 'put' : 'post', `patients/${id}/referrals/${recordId}`, {
          patient_id: parseInt(id),
          referral_date: dateToISOString(new Date(data.referral_date)),
          referred_to: data.referred_to,
          referred_to_service: data.referred_to_service,
          referral_reason: data.referral_reason,
          patient_condition: data.patient_condition,
          medical_history: data.medical_history,
        })
        .then((res) => {
          toast('PatientReferral Saved Successfully!')
          doHandleSaveAndClosePopup()
          setLoading(false)
        })
        .catch((err) => {
          setLoading(false)
          showAlertError(err)
        })
    }
    setDoSubmit(false)
  }

  React.useEffect(() => {
    if (recordId > 0) {
      useApi
        .get(`/patients/${id}/referrals/${recordId}`, {})
        .then((res) => {
          const data = res.data.data
          setFormData({
            patient_id: isNaN(data.patient_id) ? null : parseInt(data.patient_id),
            referral_date: data.referral_date,
            referred_to: data.referred_to,
            referred_to_service: data.referred_to_service,
            referral_reason: data.referral_reason,
            patient_condition: data.patient_condition,
            medical_history: data.medical_history,
          })
          setLoading(false)
        })
        .catch((err) => {
          showAlertError(err)
          setLoading(false)
        })
    } else {
      setFormData({
        patient_id: id,
        referred_to: '',
        referred_to_service: '',
        referral_reason: '',
        patient_condition: '',
        medical_history: '',
      })
    }
  }, [recordId])

  const [today] = useState(new Date().toISOString().substr(0, 10))
  // State to store labs/culture/studies fields
  const [labsStudiesFields, setLabsStudiesFields] = useState([formData.labs_culture_studies])

  const formSchema = yup.object().shape({
    referral_date: yup
      .date()
      .notRequired()
      .label('Referral Date')
      .max(new Date(), 'Referral Date must be today or earlier')
      .min(minDateOfBirth(), 'Invalid Referral Date'),
    referred_to: yup.string().max(255).notRequired().label('Referred To'),
    referred_to_service: yup.string().max(520).notRequired().label('Referred To Service'),
    referral_reason: yup.string().max(520).notRequired().label('Referral Reason'),
    patient_condition: yup.string().max(255).notRequired().label('Patient Condition'),
    medical_history: yup.string().max(5000).notRequired().label('Medical History'),
    laboratories: yup.array().of(
      yup.object().shape({
        id: yup.number(),
        laboratory: yup.string().required('Laboratory is required'),
      })
    ),
  })

  // ** Hooks
  const {
    trigger,
    control,
    setValue,
    getValues,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(formSchema) })

  React.useEffect(() => {
    const fetchFormData = () => {
      setValue('referral_date', getDateTimeLocal(formData.referral_date))
      setValue('referred_to', formData.referred_to)
      setValue('referred_to_service', formData.referred_to_service)
      setValue('referral_reason', formData.referral_reason)
      setValue('patient_condition', formData.patient_condition)
      setValue('medical_history', formData.medical_history)
      setValue('laboratories', formData.laboratories)
    }
    if (formData) {
      fetchFormData()
    }
  }, [formData])

  const {
    fields: laboratoryFields,
    append: addLaboratory,
    remove: removeLaboratory,
  } = useFieldArray({ control, name: 'laboratories' })

  const {
    fields: recomendaTionFields,
    append: addRecommendation,
    remove: removeRecommendation,
  } = useFieldArray({ control, name: 'recomendations' })

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
    saveCallback(data, isObjEmpty(errors))
  }

  return (
    <Modal isOpen={open} className='modal-dialog-centered modal-lg' toggle={doTogglePopup}>
      <UILoader blocking={loading} loader={<DefaultLoader />}>
        <ModalHeader className='bg-transparent' toggle={doTogglePopup}></ModalHeader>
        <ModalBody className='px-5 pb-5'>
          <div className='text-center mb-4'>
            <h1>Add New Patient Referral</h1>
            <p>Enter the values to continue</p>
          </div>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md='12' className='mb-1'>
                <Label className='form-label' for='referral_date'>
                  Referral Date{' '}
                </Label>
                <Controller
                  id='referral_date'
                  name='referral_date'
                  control={control}
                  render={({ field }) => (
                    <Input maxDate={today} type='datetime-local' invalid={errors.referral_date && true} {...field} />
                  )}
                />
                {errors.referral_date && <FormFeedback>{errors.referral_date.message}</FormFeedback>}
              </Col>

              <Col md='6' className='mb-1'>
                <Label className='form-label' for='referred_to'>
                  Referred To{' '}
                </Label>

                <Controller
                  id='referred_to'
                  name='referred_to'
                  control={control}
                  render={({ field: { onBlur, value, ...field } }) => (
                    <Input invalid={errors.referred_to && true} {...field} value={value} />
                  )}
                />

                {errors.referred_to && <FormFeedback>{errors.referred_to.message}</FormFeedback>}
              </Col>

              <Col md='6' className='mb-1'>
                <Label className='form-label' for='referred_to_service'>
                  Referred To Service{' '}
                </Label>

                <Controller
                  id='referred_to_service'
                  name='referred_to_service'
                  control={control}
                  render={({ field: { onBlur, value, ...field } }) => (
                    <Input invalid={errors.referred_to_service && true} {...field} value={value} />
                  )}
                />

                {errors.referred_to_service && <FormFeedback>{errors.referred_to_service.message}</FormFeedback>}
              </Col>

              <Col md='6' className='mb-1'>
                <Label className='form-label' for='referral_reason'>
                  Referral Reason{' '}
                </Label>

                <Controller
                  id='referral_reason'
                  name='referral_reason'
                  control={control}
                  render={({ field: { onBlur, value, ...field } }) => (
                    <Input invalid={errors.referral_reason && true} {...field} value={value} />
                  )}
                />

                {errors.referral_reason && <FormFeedback>{errors.referral_reason.message}</FormFeedback>}
              </Col>

              <Col md='6' className='mb-1'>
                <Label className='form-label' for='patient_condition'>
                  Patient Condition{' '}
                </Label>

                <Controller
                  id='patient_condition'
                  name='patient_condition'
                  control={control}
                  render={({ field: { onBlur, value, ...field } }) => (
                    <Input invalid={errors.patient_condition && true} {...field} value={value} />
                  )}
                />

                {errors.patient_condition && <FormFeedback>{errors.patient_condition.message}</FormFeedback>}
              </Col>

              <Col md='6' className='mb-1'>
                <Label className='form-label' for='medical_history'>
                  Medical History{' '}
                </Label>

                <Controller
                  id='medical_history'
                  name='medical_history'
                  control={control}
                  render={({ field: { onBlur, value, ...field } }) => (
                    <Input invalid={errors.medical_history && true} {...field} value={value} />
                  )}
                />
                {errors.medical_history && <FormFeedback>{errors.medical_history.message}</FormFeedback>}
              </Col>

              <Col md='6' className='mb-1'>
                <Card>
                  <CardHeader>
                    <h4 className='card-title'>Labs</h4>
                  </CardHeader>
                  <CardBody>
                    {laboratoryFields.map((item, i) => (
                      <span key={item.id}>
                        <Row className='row-container justify-content-between align-items-center'>
                          <Col md={10} className='mb-md-0 mb-1'>
                            <Controller
                              id={`laboratories[${i}].laboratory`}
                              name={`laboratories[${i}].laboratory`}
                              control={control}
                              render={({ field: { onBlur, value, ...field } }) => (
                                <Input
                                  invalid={errors.laboratories?.[i]?.laboratory && true}
                                  {...field}
                                  value={value}
                                />
                              )}
                            />

                            {errors.laboratories?.[i]?.laboratory && (
                              <FormFeedback>{errors.laboratories?.[i]?.laboratory?.message}</FormFeedback>
                            )}
                          </Col>

                          <Col md={2}>
                            <Button
                              color='danger'
                              className='text-nowrap px-1'
                              onClick={() => removeLaboratory(i)}
                              outline
                            >
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

                    <Button className='btn-icon' color='primary' onClick={addLaboratory}>
                      <Plus size={14} />
                      <span className='align-middle ms-25'>Add New</span>
                    </Button>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Form>

          <Button type='button' className='me-1' color='primary' onClick={() => setDoSubmit(true)}>
            Submit
          </Button>
          <Button type='reset' color='secondary' outline onClick={doTogglePopup}>
            Cancel
          </Button>
        </ModalBody>
      </UILoader>
    </Modal>
  )
}

export default PatientReferralDialog
