// ** React Imports
import React, { Fragment, useState } from 'react'

// ** Utils
import { isObjEmpty } from '@utils'

// ** Third Party Components
import * as yup from 'yup'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import MyCleave from '../../forms/MyCleave'
import useApi from '../../../api/useApi'

// ** Utils
import { showAlertError } from '../../alerts/AlertUtils'
import AsyncSelect from 'react-select/async'
import 'cleave.js/dist/addons/cleave-phone.us'

// ** Reactstrap Imports
import { Form, Label, Input, Row, Col, Button, FormFeedback, InputGroup, InputGroupText } from 'reactstrap'

const EditPatientDiagnosis = ({ id, formData, doSubmit, callBack }) => {
  const [diagnoses, setDiagnoses] = useState([{ label: '', value: '' }])
  const [selectedDiagnoses, setSelectedDiagnoses] = useState([])

  const [loading, setLoading] = useState(false)

  const formSchema = yup.object().shape({
    diagnosis_id: yup.array().of(yup.number().required()).required().label('Diagnosis ID'),
    diagnosis_id_description: yup.array().of(yup.string().required()).label('Diagnosis Description'),
  })

  const [page, setPage] = useState(0)
  const [payload, setPayload] = useState({
    q: '',
    limit: 30,
    offset: page,
    sortColumn: 'description',
    sort: 'ASC',
  })

  // ** Hooks
  const {
    trigger,
    control,
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(formSchema) })

  const diagnosis_id = watch('diagnosis_id')

  const getDiagnosisData = (q) => {
    return new Promise((resolve) => {
      setLoading(true)
      useApi
        .post('diagnoses', {
          q,
          limit: payload.limit,
          offset: payload.offset,
          sortColumn: payload.sortColumn,
          sort: payload.sort,
        })
        .then((res) => {
          const data = res.data.data
          const items = [{ label: '', value: '' }]
          data.rows.map((r) => {
            const option = { label: `${r.description} ${r.code}`, value: r.id }
            items.push(option)
            return option
          })
          resolve(() => {
            setLoading(false)
            return items
          })
        })
        .catch((err) => {
          setLoading(false)
          resolve(() => {
            return [{ label: '', value: '' }]
          })
        })
    })
  }

  React.useEffect(() => {
    const fetchFormData = () => {
      setValue('diagnosis_id', isNaN(formData.diagnosis_id) ? [] : formData.diagnosis_id)
      setValue('diagnosis_id_description', formData.diagnosis_id_description)
    }
    if (formData) {
      fetchFormData()
    }
  }, [])

  React.useEffect(() => {
    const doRun = async () => {
      const result = await trigger()

      callBack(selectedDiagnoses, !isObjEmpty(selectedDiagnoses))
    }
    if (doSubmit) {
      doRun()
    }
  }, [doSubmit])

  const onSubmit = (data) => {
    if (isObjEmpty(selectedDiagnoses)) {
      //Show error message if empty
    }
  }

  React.useEffect(() => {
    const value = diagnoses.find((r) => r.value === parseInt(diagnosis_id))
    if (value) {
      setValue('diagnosis_id_description', value.label)
    }
  }, [diagnosis_id])

  const handleSelectedDiagnoses = (value) => {
    setSelectedDiagnoses(value)
  }

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col className='col-md-12 mb-1'>
            <Label className='form-label' for='diagnosis_id'>
              Diagnosis{' '}
            </Label>

            <Controller
              name='diagnosis_id'
              control={control}
              render={({ field: { onChange, ...field } }) => (
                <AsyncSelect
                  id='diagnosis_id'
                  invalid={errors.diagnosis_id && true}
                  isMulti
                  {...register('diagnosis_id', selectedDiagnoses)}
                  isClearable={true}
                  className='react-select'
                  classNamePrefix='select'
                  loadOptions={(v) => getDiagnosisData(v)}
                  onChange={handleSelectedDiagnoses}
                  value={selectedDiagnoses}
                  cacheOptions
                  defaultOptions
                  isLoading={loading}
                />
              )}
            />

            {errors.diagnosis_id && <FormFeedback>{errors.diagnosis_id.message}</FormFeedback>}
          </Col>
        </Row>
      </Form>
    </>
  )
}

export default EditPatientDiagnosis
