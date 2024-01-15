// ** React Import
import React, { useState, useEffect } from 'react'
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
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap'

import { dateToISOString } from '../../../utility/Utils'

// ** Utils
import { isObjEmpty, isValidDate, minDateOfBirth } from '@utils'

// ** Third Party Components
import * as yup from 'yup'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import MyCleave from '../../../components/forms/MyCleave'

import { getDateTimeLocal } from '../../../utility/Utils'

import 'cleave.js/dist/addons/cleave-phone.us'

import { Form, Label, Input, Row, Col, FormFeedback, InputGroup, InputGroupText } from 'reactstrap'

const PatientAnkleBrachialIndexDialog = ({ open, doTogglePopup, recordId, doHandleSaveAndClosePopup }) => {
  const { id } = useParams()

  const [loading, setLoading] = useState(false)
  const [doSubmit, setDoSubmit] = useState(false)

  const [formData, setFormData] = useState({
    patient_id: id,
    data_date: '',
    right_arm_brachial_systolic_blood_pressure: '',
    left_arm_brachial_systolic_blood_pressure: '',
    right_ankle_systolic_posterior_tibial: '',
    left_ankle_systolic_posterior_tibial: '',
    right_ankle_systolic_dorsalis_pedis: '',
    left_ankle_systolic_dorsalis_pedis: '',
    right_ankle_brachial_index: '',
    left_ankle_brachial_index: '',
    brachial_index: '',
    comments: '',
  })

  const saveCallback = (data, isValid) => {
    if (isValid) {
      setLoading(true)
      useApi
        .doRun(recordId > 0 ? 'put' : 'post', `patients/${id}/patient_ankle_brachial_index/${recordId}`, {
          patient_id: parseInt(id),
          data_date: dateToISOString(new Date(data.data_date)),
          right_arm_brachial_systolic_blood_pressure: isNaN(data.right_arm_brachial_systolic_blood_pressure)
            ? null
            : parseInt(data.right_arm_brachial_systolic_blood_pressure),
          left_arm_brachial_systolic_blood_pressure: isNaN(data.left_arm_brachial_systolic_blood_pressure)
            ? null
            : parseInt(data.left_arm_brachial_systolic_blood_pressure),
          right_ankle_systolic_posterior_tibial: isNaN(data.right_ankle_systolic_posterior_tibial)
            ? null
            : parseInt(data.right_ankle_systolic_posterior_tibial),
          left_ankle_systolic_posterior_tibial: isNaN(data.left_ankle_systolic_posterior_tibial)
            ? null
            : parseInt(data.left_ankle_systolic_posterior_tibial),
          right_ankle_systolic_dorsalis_pedis: isNaN(data.right_ankle_systolic_dorsalis_pedis)
            ? null
            : parseInt(data.right_ankle_systolic_dorsalis_pedis),
          left_ankle_systolic_dorsalis_pedis: isNaN(data.left_ankle_systolic_dorsalis_pedis)
            ? null
            : parseInt(data.left_ankle_systolic_dorsalis_pedis),
          right_ankle_brachial_index: isNaN(data.right_ankle_brachial_index)
            ? null
            : parseFloat(data.right_ankle_brachial_index),
          left_ankle_brachial_index: isNaN(data.left_ankle_brachial_index)
            ? null
            : parseFloat(data.left_ankle_brachial_index),
          brachial_index: data.brachial_index,
          comments: data.comments,
        })
        .then((res) => {
          toast('Patient Lower Extremities Assessment Saved Successfully!')
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
        .get(`/patients/${id}/patient_ankle_brachial_index/${recordId}`, {})
        .then((res) => {
          const data = res.data.data
          setFormData({
            data_date: data.data_date,
            right_arm_brachial_systolic_blood_pressure: isNaN(data.right_arm_brachial_systolic_blood_pressure)
              ? null
              : parseInt(data.right_arm_brachial_systolic_blood_pressure),
            left_arm_brachial_systolic_blood_pressure: isNaN(data.left_arm_brachial_systolic_blood_pressure)
              ? null
              : parseInt(data.left_arm_brachial_systolic_blood_pressure),
            right_ankle_systolic_posterior_tibial: isNaN(data.right_ankle_systolic_posterior_tibial)
              ? null
              : parseInt(data.right_ankle_systolic_posterior_tibial),
            left_ankle_systolic_posterior_tibial: isNaN(data.left_ankle_systolic_posterior_tibial)
              ? null
              : parseInt(data.left_ankle_systolic_posterior_tibial),
            right_ankle_systolic_dorsalis_pedis: isNaN(data.right_ankle_systolic_dorsalis_pedis)
              ? null
              : parseInt(data.right_ankle_systolic_dorsalis_pedis),
            left_ankle_systolic_dorsalis_pedis: isNaN(data.left_ankle_systolic_dorsalis_pedis)
              ? null
              : parseInt(data.left_ankle_systolic_dorsalis_pedis),
            right_ankle_brachial_index: isNaN(data.right_ankle_brachial_index)
              ? null
              : parseFloat(data.right_ankle_brachial_index),
            left_ankle_brachial_index: isNaN(data.left_ankle_brachial_index)
              ? null
              : parseFloat(data.left_ankle_brachial_index),
            brachial_index: data.brachial_index,
            comments: data.comments,
          })
          setLoading(false)
        })
        .catch((err) => {
          showAlertError(err)
          setLoading(false)
        })
    } else {
      setFormData({
        data_date: '',
        right_arm_brachial_systolic_blood_pressure: '',
        left_arm_brachial_systolic_blood_pressure: '',
        right_ankle_systolic_posterior_tibial: '',
        left_ankle_systolic_posterior_tibial: '',
        right_ankle_systolic_dorsalis_pedis: '',
        left_ankle_systolic_dorsalis_pedis: '',
        right_ankle_brachial_index: '',
        left_ankle_brachial_index: '',
        brachial_index: '',
        comments: '',
      })
    }
  }, [recordId])

  const [today] = useState(new Date().toISOString().substr(0, 10))
  const [prediction, setPrediction] = useState('')

  const formSchema = yup.object().shape({
    data_date: yup
      .date()
      .required('Visit Date is required.')
      .label('Visit Date')
      .transform((value) => (isValidDate(value) ? value : null))
      .max(new Date(), 'Visit Date must be today or earlier')
      .min(minDateOfBirth(), 'Invalid Visit Date'),
    right_arm_brachial_systolic_blood_pressure: yup
      .number()
      .transform((value) => (isNaN(value) || value === null || value === undefined ? null : value))
      .notRequired()
      .max(999, 'Maximum value allowed is 999.')
      .typeError('Only digits should be entered in this field.')
      .label('Right Arm Brachial Systolic Blood Pressure'),
    left_arm_brachial_systolic_blood_pressure: yup
      .number()
      .transform((value) => (isNaN(value) || value === null || value === undefined ? null : value))
      .notRequired()
      .max(999, 'Maximum value allowed is 999.')
      .typeError('Only digits should be entered in this field.')
      .label('Left Arm Brachial Systolic Blood Pressure'),
    right_ankle_systolic_posterior_tibial: yup
      .number()
      .transform((value) => (isNaN(value) || value === null || value === undefined ? null : value))
      .notRequired()
      .max(999, 'Maximum value allowed is 999.')
      .typeError('Only digits should be entered in this field.')
      .label('Right Ankle Systolic Posterior Tibial'),
    left_ankle_systolic_posterior_tibial: yup
      .number()
      .transform((value) => (isNaN(value) || value === null || value === undefined ? null : value))
      .notRequired()
      .max(999, 'Maximum value allowed is 999.')
      .typeError('Only digits should be entered in this field.')
      .label('Left Ankle Systolic Posterior Tibial'),
    right_ankle_systolic_dorsalis_pedis: yup
      .number()
      .transform((value) => (isNaN(value) || value === null || value === undefined ? null : value))
      .notRequired()
      .max(999, 'Maximum value allowed is 999.')
      .typeError('Only digits should be entered in this field.')
      .label('Right Ankle Systolic Dorsalis Pedis'),
    left_ankle_systolic_dorsalis_pedis: yup
      .number()
      .transform((value) => (isNaN(value) || value === null || value === undefined ? null : value))
      .notRequired()
      .max(999, 'Maximum value allowed is 999.')
      .typeError('Only digits should be entered in this field.')
      .label('Left Ankle Systolic Dorsalis Pedis'),
    brachial_index: yup.string().max(50).notRequired().label('Brachial Index'),
    comments: yup.string().max(50).notRequired().label('Comments'),
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
      setValue('data_date', getDateTimeLocal(formData.data_date))
      setValue(
        'right_arm_brachial_systolic_blood_pressure',
        isNaN(formData.right_arm_brachial_systolic_blood_pressure)
          ? ''
          : formData.right_arm_brachial_systolic_blood_pressure
      )
      setValue(
        'left_arm_brachial_systolic_blood_pressure',
        isNaN(formData.left_arm_brachial_systolic_blood_pressure)
          ? ''
          : formData.left_arm_brachial_systolic_blood_pressure
      )
      setValue(
        'right_ankle_systolic_posterior_tibial',
        isNaN(formData.right_ankle_systolic_posterior_tibial) ? '' : formData.right_ankle_systolic_posterior_tibial
      )
      setValue(
        'left_ankle_systolic_posterior_tibial',
        isNaN(formData.left_ankle_systolic_posterior_tibial) ? '' : formData.left_ankle_systolic_posterior_tibial
      )
      setValue(
        'right_ankle_systolic_dorsalis_pedis',
        isNaN(formData.right_ankle_systolic_dorsalis_pedis) ? '' : formData.right_ankle_systolic_dorsalis_pedis
      )
      setValue(
        'left_ankle_systolic_dorsalis_pedis',
        isNaN(formData.left_ankle_systolic_dorsalis_pedis) ? '' : formData.left_ankle_systolic_dorsalis_pedis
      )
      setValue(
        'right_ankle_brachial_index',
        isNaN(formData.right_ankle_brachial_index) ? '' : formData.right_ankle_brachial_index
      )
      setValue(
        'left_ankle_brachial_index',
        isNaN(formData.left_ankle_brachial_index) ? '' : formData.left_ankle_brachial_index
      )
      setValue('brachial_index', formData.brachial_index)
      setValue('comments', formData.comments)
    }
    if (formData) {
      fetchFormData()
    }
  }, [formData])

  useEffect(() => {
    const ltArm = getValues('left_arm_brachial_systolic_blood_pressure')
    const rtArm = getValues('right_arm_brachial_systolic_blood_pressure')
    const rtAnkpt = getValues('right_ankle_systolic_posterior_tibial')
    const rtAnkdp = getValues('right_ankle_systolic_dorsalis_pedis')
    const ltAnkpt = getValues('left_ankle_systolic_posterior_tibial')
    const ltAnkdp = getValues('left_ankle_systolic_dorsalis_pedis')
    let prediction
    let y
    let x
    let z
    let rtResult = 0
    let ltResult = 0

    if (rtArm > ltArm) {
      x = rtArm
    } else {
      x = ltArm
    }

    if (rtAnkpt > rtAnkdp) {
      y = rtAnkpt
    } else {
      y = rtAnkdp
    }

    if (ltAnkpt > ltAnkdp) {
      z = ltAnkpt
    } else {
      z = ltAnkdp
    }

    if (x && y && z) {
      rtResult = y / x
      ltResult = z / x
    }

    let result

    if (rtResult >= ltResult) {
      result = ltResult
    } else {
      result = rtResult
    }

    setValue('left_ankle_brachial_index', isNaN(ltResult) ? '' : ltResult)
    setValue('right_ankle_brachial_index', isNaN(rtResult) ? '' : rtResult)
    setValue('brachial_index', isNaN(result) ? '' : result)

    let msg = ''
    let message
    if (result > 1.3) {
      message = 'Poorly compressible vessels, arterial calcification'
    } else if (result <= 1.3 && result >= 0.9) {
      message = 'Normal ABI'
    } else if (result <= 0.89 && result >= 0.6) {
      message = 'Mild arterial obstruction'
    } else if (result <= 0.59 && result >= 0.41) {
      message = 'Moderate obstruction'
    } else {
      message = 'Severe obstruction'
    }

    setPrediction(message)
  }, [
    watch('left_arm_brachial_systolic_blood_pressure'),
    watch('right_arm_brachial_systolic_blood_pressure'),
    watch('left_ankle_systolic_posterior_tibial'),
    watch('right_ankle_systolic_posterior_tibial'),
    watch('left_ankle_systolic_dorsalis_pedis'),
    watch('right_ankle_systolic_dorsalis_pedis'),
  ])

  React.useEffect(() => {
    const doRun = async () => {
      const result = await trigger()
      saveCallback(getValues(), result)
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
            <h1>Add New Patient Ankle Brachial Index</h1>
            <p>Enter the values to continue</p>
          </div>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md='12' className='mb-1'>
                <Label className='form-label' for='data_date'>
                  {' '}
                  Date of Visit{' '}
                </Label>

                <Controller
                  id='data_date'
                  name='data_date'
                  control={control}
                  render={({ field }) => (
                    <Input maxDate={today} type='datetime-local' invalid={errors.data_date && true} {...field} />
                  )}
                />

                {errors.data_date && <FormFeedback>{errors.data_date.message}</FormFeedback>}
              </Col>

              <small class='text-muted'>Arm Brachial Systolic Blood Pressure</small>
              <Col md='6' className='mb-1'>
                <Label className='form-label' for='left_arm_brachial_systolic_blood_pressure'>
                  Left Arm
                </Label>
                <Controller
                  id='left_arm_brachial_systolic_blood_pressure'
                  name='left_arm_brachial_systolic_blood_pressure'
                  control={control}
                  placeholder='10,000'
                  render={({ field: { ref, ...field } }) => (
                    <MyCleave
                      {...field}
                      inputMode='numeric'
                      maxLength='3'
                      className={classnames('form-control', {
                        'is-invalid': errors.left_arm_brachial_systolic_blood_pressure && true,
                      })}
                      options={{
                        numeral: true,
                        numeralThousandsGroupStyle: 'thousand',
                      }}
                    />
                  )}
                />

                {errors.left_arm_brachial_systolic_blood_pressure && (
                  <FormFeedback>{errors.left_arm_brachial_systolic_blood_pressure.message}</FormFeedback>
                )}
              </Col>
              <Col md='6' className='mb-1'>
                <Label className='form-label' for='right_arm_brachial_systolic_blood_pressure'>
                  Right Arm{' '}
                </Label>
                <Controller
                  id='right_arm_brachial_systolic_blood_pressure'
                  name='right_arm_brachial_systolic_blood_pressure'
                  control={control}
                  placeholder='10,000'
                  render={({ field: { ref, ...field } }) => (
                    <MyCleave
                      {...field}
                      inputMode='numeric'
                      maxLength='3'
                      className={classnames('form-control', {
                        'is-invalid': errors.right_arm_brachial_systolic_blood_pressure && true,
                      })}
                      options={{
                        numeral: true,
                        numeralThousandsGroupStyle: 'thousand',
                      }}
                    />
                  )}
                />

                {errors.right_arm_brachial_systolic_blood_pressure && (
                  <FormFeedback>{errors.right_arm_brachial_systolic_blood_pressure.message}</FormFeedback>
                )}
              </Col>

              <small class='text-muted'>Ankle Systolic Posterior Tibial</small>

              <Col md='6' className='mb-1'>
                <Label className='form-label' for='left_ankle_systolic_posterior_tibial'>
                  Left Ankle
                </Label>
                <Controller
                  id='left_ankle_systolic_posterior_tibial'
                  name='left_ankle_systolic_posterior_tibial'
                  control={control}
                  placeholder='10,000'
                  render={({ field: { ref, ...field } }) => (
                    <MyCleave
                      {...field}
                      inputMode='numeric'
                      maxLength='3'
                      className={classnames('form-control', {
                        'is-invalid': errors.left_ankle_systolic_posterior_tibial && true,
                      })}
                      options={{
                        numeral: true,
                        numeralThousandsGroupStyle: 'thousand',
                      }}
                    />
                  )}
                />

                {errors.left_ankle_systolic_posterior_tibial && (
                  <FormFeedback>{errors.left_ankle_systolic_posterior_tibial.message}</FormFeedback>
                )}
              </Col>

              <Col md='6' className='mb-1'>
                <Label className='form-label' for='right_ankle_systolic_posterior_tibial'>
                  Right Ankle{' '}
                </Label>
                <Controller
                  id='right_ankle_systolic_posterior_tibial'
                  name='right_ankle_systolic_posterior_tibial'
                  control={control}
                  placeholder='10,000'
                  render={({ field: { ref, ...field } }) => (
                    <MyCleave
                      {...field}
                      inputMode='numeric'
                      maxLength='3'
                      className={classnames('form-control', {
                        'is-invalid': errors.right_ankle_systolic_posterior_tibial && true,
                      })}
                      options={{
                        numeral: true,
                        numeralThousandsGroupStyle: 'thousand',
                      }}
                    />
                  )}
                />

                {errors.right_ankle_systolic_posterior_tibial && (
                  <FormFeedback>{errors.right_ankle_systolic_posterior_tibial.message}</FormFeedback>
                )}
              </Col>

              <small class='text-muted'>Ankle Systolic Dorsalis Pedis</small>

              <Col md='6' className='mb-1'>
                <Label className='form-label' for='left_ankle_systolic_dorsalis_pedis'>
                  Left Ankle{' '}
                </Label>
                <Controller
                  id='left_ankle_systolic_dorsalis_pedis'
                  name='left_ankle_systolic_dorsalis_pedis'
                  control={control}
                  placeholder='10,000'
                  render={({ field: { ref, ...field } }) => (
                    <MyCleave
                      {...field}
                      inputMode='numeric'
                      maxLength='3'
                      className={classnames('form-control', {
                        'is-invalid': errors.left_ankle_systolic_dorsalis_pedis && true,
                      })}
                      options={{
                        numeral: true,
                        numeralThousandsGroupStyle: 'thousand',
                      }}
                    />
                  )}
                />

                {errors.left_ankle_systolic_dorsalis_pedis && (
                  <FormFeedback>{errors.left_ankle_systolic_dorsalis_pedis.message}</FormFeedback>
                )}
              </Col>

              <Col md='6' className='mb-1'>
                <Label className='form-label' for='right_ankle_systolic_dorsalis_pedis'>
                  Right Ankle{' '}
                </Label>
                <Controller
                  id='right_ankle_systolic_dorsalis_pedis'
                  name='right_ankle_systolic_dorsalis_pedis'
                  control={control}
                  placeholder='10,000'
                  render={({ field: { ref, ...field } }) => (
                    <MyCleave
                      {...field}
                      inputMode='numeric'
                      maxLength='3'
                      className={classnames('form-control', {
                        'is-invalid': errors.right_ankle_systolic_dorsalis_pedis && true,
                      })}
                      options={{
                        numeral: true,
                        numeralThousandsGroupStyle: 'thousand',
                      }}
                    />
                  )}
                />

                {errors.right_ankle_systolic_dorsalis_pedis && (
                  <FormFeedback>{errors.right_ankle_systolic_dorsalis_pedis.message}</FormFeedback>
                )}
              </Col>

              <Col md='12' className='mb-1'>
                <Label className='form-label'>
                  Left Ankle Brachial Index:{' '}
                  <strong>
                    {getValues('left_ankle_brachial_index') > 0 && getValues('left_ankle_brachial_index')}
                    {getValues('left_ankle_brachial_index') <= 0 && '-'}
                  </strong>
                </Label>
              </Col>

              <Col md='12' className='mb-1'>
                <Label className='form-label'>
                  Right Ankle Brachial Index:{' '}
                  <strong>
                    {getValues('left_ankle_brachial_index') > 0 && getValues('right_ankle_brachial_index')}
                    {getValues('right_ankle_brachial_index') <= 0 && '-'}
                  </strong>
                </Label>
              </Col>

              <Col md='12' className='mb-1'>
                <Label className='form-label'>
                  Brachial Index:{' '}
                  <strong>
                    {getValues('brachial_index') > 0 && getValues('brachial_index')}
                    {getValues('brachial_index') <= 0 && '-'}
                  </strong>
                </Label>
              </Col>

              <Col md='12' className='mb-1'>
                <Label className='form-label' for='prediction'>
                  Score: <strong>{prediction}</strong>
                </Label>
              </Col>

              <Col md='12' className='mb-1'>
                <Label className='form-label' for='comments'>
                  Comments{' '}
                </Label>

                <Controller
                  id='comments'
                  name='comments'
                  control={control}
                  render={({ field }) => <Input invalid={errors.comments && true} {...field} />}
                />
                {errors.comments && <FormFeedback>{errors.comments.message}</FormFeedback>}
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

export default PatientAnkleBrachialIndexDialog
