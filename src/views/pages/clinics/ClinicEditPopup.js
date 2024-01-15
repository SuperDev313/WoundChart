// ** React Import
import React, { useState } from 'react'
import classnames from 'classnames'
// ** Custom Components
import Sidebar from '@components/sidebar'
import useApi from '../../../api/useApi'
import { DefaultLoader } from '../../../components/spinner/LoadingSpinner'
import UILoader from '../../../components/ui-loader'
import MyCleave from '../../../components/forms/MyCleave'

// ** Utils
import { showAlertError } from '../../../components/alerts/AlertUtils'

// ** Third Party Components
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import FileUploaderSingle from '../../../components/upload-files/FileUploaderSingle'

// ** Reactstrap Imports
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Form,
  Label,
  Input,
  Row,
  Col,
  FormFeedback,
  InputGroup,
  InputGroupText,
} from 'reactstrap'

const ClinicEditPopup = ({ open, doTogglePopup, recordId, doReloadTable }) => {
  const formSchema = yup.object().shape({
    name: yup.string().max(200).required().label('Name'),
    npi: yup
      .number()
      .transform((value) => (isNaN(value) || value === null || value === undefined ? null : value))
      .required()
      .label('Npi'),
    logo: yup.string().max(1000).required().label('Logo'),
    address: yup.string().max(200).required().label('Address'),
    phone: yup.string().max(100).required().label('Phone'),
    fax: yup.string().max(100).required().label('Fax'),
    email: yup.string().max(100).required().label('Email'),
    status_id: yup
      .number()
      .transform((value) => (isNaN(value) || value === null || value === undefined ? null : value))
      .required()
      .label('StatusId'),
    advance: yup
      .bool()
      .transform((value) => (value == '' || value === undefined ? null : value))
      .required()
      .label('Advance'),
  })

  // ** States
  const [loading, setLoading] = useState(false)
  const [clinic_status, setClinic_Status] = useState([{ label: '', value: '' }])

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
    if (recordId > 0) {
      useApi
        .get(`/clinics/${recordId}`, {})
        .then((res) => {
          const data = res.data.data
          setValue('name', data.name)
          setValue('npi', isNaN(data.npi) ? null : parseInt(data.npi))
          setValue('logo', data.logo)
          setValue('address', data.address)
          setValue('phone', data.phone)
          setValue('fax', data.fax)
          setValue('email', data.email)
          setValue('status_id', isNaN(data.status_id) ? null : parseInt(data.status_id))
          setValue('advance', data.advance)
          setLoading(false)
        })
        .catch((err) => {
          showAlertError(err)
          setLoading(false)
        })
    } else {
      setValue('name', null)
      setValue('npi', null)
      setValue('logo', null)
      setValue('address', null)
      setValue('phone', null)
      setValue('fax', null)
      setValue('email', null)
      setValue('status_id', null)
      setValue('advance', null)
    }
  }, [recordId])

  React.useEffect(() => {
    useApi
      .get('/lookup/clinic_status', {})
      .then((res) => {
        var items = [{ text: '', value: '' }]
        res.data.data.map((r) => {
          const option = { label: r.description, value: r.id }
          items.push(option)
          return option
        })
        setClinic_Status(items)
      })
      .catch((err) => {
        showAlertError(err)
      })
  }, [])

  const onSubmit = (data, isValid) => {
    if (isValid) {
      setLoading(true)
      useApi
        .doRun(recordId > 0 ? 'put' : 'post', `clinics/${recordId}`, {
          name: data.name,
          npi: isNaN(data.npi) ? null : parseInt(data.npi),
          logo: data.logo,
          address: data.address,
          phone: data.phone,
          fax: data.fax,
          email: data.email,
          status_id: isNaN(data.status_id) ? null : parseInt(data.status_id),
          advance: data.advance,
        })
        .then((res) => {
          toast('Clinic Saved Successfully!')
          doReloadTable()
          setLoading(false)
        })
        .catch((err) => {
          setLoading(false)
          showAlertError(err)
        })
    }
  }

  const doSubmit = async () => {
    const result = await trigger()

    onSubmit(getValues(), result)
  }

  const handleUploadAgencyLogo = (response) => {
    console.log('handleUploadAgencyLogo', response.file_url)

    setValue('logo', response.file_url)
  }

  return (
    <Modal isOpen={open} className='modal-dialog-centered modal-lg' toggle={doTogglePopup}>
      <UILoader blocking={loading} loader={<DefaultLoader />}>
        <ModalHeader className='bg-transparent' toggle={doTogglePopup}></ModalHeader>
        <ModalBody className='px-5 pb-5'>
          <div className='text-center mb-4'>
            <h1>Add New Clinic</h1>
            <p>Enter the values to continue</p>
          </div>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md='6' className='mb-1'>
                <Label className='form-label' for='name'>
                  Name{' '}
                </Label>

                <Controller
                  id='name'
                  name='name'
                  control={control}
                  render={({ field: { onBlur, value, ...field } }) => (
                    <Input invalid={errors.name && true} {...field} value={value} />
                  )}
                />

                {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
              </Col>

              <Col md='6' className='mb-1'>
                <Label className='form-label' for='npi'>
                  Npi{' '}
                </Label>
                <Controller
                  id='npi'
                  name='npi'
                  control={control}
                  placeholder='10,000'
                  render={({ field: { onBlur, value, ...field } }) => (
                    <MyCleave
                      {...field}
                      value={value}
                      className={classnames('form-control', {
                        'is-invalid': errors.npi && true,
                      })}
                      options={{
                        numeral: true,
                        numeralThousandsGroupStyle: 'thousand',
                      }}
                    />
                  )}
                />

                {errors.npi && <FormFeedback>{errors.npi.message}</FormFeedback>}
              </Col>

              <Col md='6' className='mb-1'>
                <Label className='form-label' for='address'>
                  Address{' '}
                </Label>

                <Controller
                  id='address'
                  name='address'
                  control={control}
                  render={({ field: { onBlur, value, ...field } }) => (
                    <Input invalid={errors.address && true} {...field} value={value} />
                  )}
                />

                {errors.address && <FormFeedback>{errors.address.message}</FormFeedback>}
              </Col>

              <Col md='6' className='mb-1'>
                <Label className='form-label' for='phone'>
                  Phone{' '}
                </Label>

                <Controller
                  id='phone'
                  name='phone'
                  control={control}
                  render={({ field: { onBlur, value, ...field } }) => (
                    <Input invalid={errors.phone && true} {...field} value={value} />
                  )}
                />

                {errors.phone && <FormFeedback>{errors.phone.message}</FormFeedback>}
              </Col>

              <Col md='6' className='mb-1'>
                <Label className='form-label' for='fax'>
                  Fax{' '}
                </Label>

                <Controller
                  id='fax'
                  name='fax'
                  control={control}
                  render={({ field: { onBlur, value, ...field } }) => (
                    <Input invalid={errors.fax && true} {...field} value={value} />
                  )}
                />

                {errors.fax && <FormFeedback>{errors.fax.message}</FormFeedback>}
              </Col>

              <Col md='6' className='mb-1'>
                <Label className='form-label' for='email'>
                  Email{' '}
                </Label>

                <Controller
                  id='email'
                  name='email'
                  control={control}
                  render={({ field: { onBlur, value, ...field } }) => (
                    <Input invalid={errors.email && true} {...field} value={value} />
                  )}
                />

                {errors.email && <FormFeedback>{errors.email.message}</FormFeedback>}
              </Col>

              <Col className='col-md-6 mb-1'>
                <Label className='form-label' for='status_id'>
                  Status Id{' '}
                </Label>

                <Controller
                  name='status_id'
                  control={control}
                  render={({ field }) => (
                    <Input type='select' id='status_id' invalid={errors.status_id && true} {...field}>
                      {clinic_status.map &&
                        clinic_status.map((item, index) => (
                          <option value={item.value} key={item.value}>
                            {item.label}
                          </option>
                        ))}
                    </Input>
                  )}
                />
                {errors.status_id && <FormFeedback>{errors.status_id.message}</FormFeedback>}
              </Col>

              <Col md='12' className='mb-1'>
                <Controller
                  id='logo'
                  name='logo'
                  control={control}
                  render={({ field: { onBlur, value, ...field } }) => <img src={value} height='80' />}
                />
              </Col>
              <Col className='pb-2 mb-lg-0 drop ' lg={12} sm={12}>
                <div style={{ border: '1px solid', padding: '10px', borderRadius: '8px' }}>
                  <Label className='form-label' for='document_file'>
                    Agency Logo
                  </Label>
                  <FileUploaderSingle
                    route='/files/upload/agency_logo'
                    autoUpload={true}
                    onResponseCallback={(res) => handleUploadAgencyLogo(res)}
                  />
                </div>
              </Col>
            </Row>
          </Form>

          <Button type='button' className='me-1' color='primary' onClick={() => doSubmit()}>
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

export default ClinicEditPopup
