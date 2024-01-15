// ** React Imports
import React, { Fragment, useState } from 'react'

// ** Utils
import { isObjEmpty } from '@utils'

import classnames from 'classnames'

// ** Third Party Components
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import useApi from '../../../api/useApi'

// ** Utils
import { showAlertError } from '../../alerts/AlertUtils'
import FileUploaderSingle from '../../upload-files/FileUploaderSingle'
import UILoader from '../../ui-loader'
import { DefaultLoader } from '../../spinner/LoadingSpinner'

// ** Reactstrap Imports
import { Form, Label, Row, Col, FormFeedback, Input, Button } from 'reactstrap'

const EditPatientDoc = ({ id, formData, doSubmit, callBack }) => {
  const [document, setDocument] = useState([{ label: '', value: '' }])
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [loading, setLoading] = useState(false)

  const formSchema = yup.object().shape({
    document_title: yup.string().required().label('Document Title'),
    document_file: yup.string().required('Document File is required.').max(255).label('Document File Description'),
  })

  // ** Hooks
  const {
    trigger,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(formSchema) })

  const document_title = getValues('document_title')

  const handleUploadPhoto = (response) => {
    console.log('handleUploadPhoto', response.file_url)

    setLoading(true)

    useApi
      .put(`/patients/${id}/picture`, {
        id: parseInt(id),
        picture_file_url: response.file_url,
      })
      .then((res) => {
        setLoading(false)
        callBack(response.file_url)
      })
      .catch((err) => {
        showAlertError(err)
        setLoading(false)
      })
  }

  React.useEffect(() => {
    const fetchFormData = () => {
      setValue('document_title', isNaN(formData.document_title) ? '' : formData.document_title)
      setValue('document_file', formData.document_file)

      setSelectedDocument({
        label: formData.document_file,
        value: isNaN(formData.document_title) ? '' : formData.document_title,
      })
    }
    if (formData) {
      fetchFormData()
    }
  }, [formData])

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
    const value = document.find((r) => r.value === parseInt(document_title))
    if (value) {
      setValue('document_file', value.label)
    }
  }, [document_title])

  const handleSelectedDocument = (value) => {
    setSelectedDocument(value)

    if (value != null) {
      setValue('document_title', value.value)
      setValue('document_file', value.label)
    } else {
      setValue('document_title', '')
      setValue('document_file', '')
    }
  }

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col className='col-md-12 mb-1'>
            <Label className='form-label' for='document_title'>
              Document Title
            </Label>
            <Controller
              id='document_title'
              name='document_title'
              control={control}
              render={({ field }) => <Input type='text' invalid={errors.document_title && true} {...field} />}
            />
            {errors.document_title && <FormFeedback>{errors.document_title.message}</FormFeedback>}
          </Col>
          <Col className='pb-2 mb-lg-0 drop ' lg={12} sm={12}>
            <div style={{ border: '1px solid', padding: '10px', borderRadius: '8px' }}>
              <Label className='form-label' for='document_file'>
                Document File
              </Label>
              <UILoader blocking={loading} loader={<DefaultLoader />}>
                <FileUploaderSingle
                  route='/files/upload_patient_picture'
                  onResponseCallback={(res) => handleUploadPhoto(res)}
                />
              </UILoader>
            </div>
          </Col>
        </Row>
      </Form>
    </>
  )
}

export default EditPatientDoc
