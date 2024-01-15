// ** React Imports
import { useRef, useState } from 'react'

// ** Custom Components
import Wizard from '@components/wizard'
import { useParams, useNavigate } from 'react-router-dom'

import Address from './add-steps/Address'
import AccountDetails from './add-steps/AccountDetails'
import HealthInsurance from './add-steps/HealthInsurance'
import Physician from './add-steps/Physician'
import Contact from './add-steps/Contact'
import UploadFiles from './add-steps/UploadFiles'
import useApi from '../../../api/useApi'

// ** Third Party Components
import Breadcrumbs from '@components/breadcrumbs'
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import UILoader from '../../../components/ui-loader'
import { showAlertError } from '../../../components/alerts/AlertUtils'
import { DefaultLoader } from '../../../components/spinner/LoadingSpinner'

const PatientAddWizard = () => {
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  let formSchema = yup.object().shape({
    record_number: yup.string().max(255).required().label('Record Number'),
    first_name: yup.string().max(120).required().label('First Name'),
    middle_name: yup.string().max(120).notRequired().label('Middle Name'),
    last_name: yup.string().max(120).required().label('Last Name'),
    second_last_name: yup.string().max(120).notRequired().label('Second Last Name'),
    date_of_birth: yup.string().max(20).notRequired().label('Date of Birth'),
    gender_id: yup.number().nullable().default(null).typeError('Please select a valid gender').label('Gender'),
    address: yup.string().max(250).required().label('Address'),
    address1: yup.string().max(250).notRequired().label('Address 1'),
    city: yup.string().max(120).notRequired().label('City'),
    country: yup.string().max(120).required().label('Country'),
    zip_code: yup
      .string()
      .matches(/^[0-9]+$/, 'Must be only digits')
      .min(5)
      .max(5)
      .notRequired()
      .label('Zip Code'),
    fax: yup.string().max(120).notRequired().label('Fax'),
    phone: yup.string().max(120).notRequired().label('Phone'),
    email: yup.string().max(120).email().notRequired().label('Email'),
    state_id: yup.number().notRequired().label('State'),
    contact_name: yup.string().max(255).notRequired().label('Contact Name'),
    contact_number: yup.string().max(20).notRequired().label('Contact Number'),
    other_number: yup.string().max(255).notRequired().label('Other Number'),
    other_name: yup.string().max(255).notRequired().label('Other Name'),
    insurance_number: yup.string().max(20).required().label('Insurance Number'),
    insurance_group_number: yup.string().max(20).notRequired().label('Insurance Group Number'),
    insurance_coverage_date: yup.string().max(120).notRequired().label('Insurance Coverage Date'),
    insurance_company_id: yup.number().required().label('Insurance Company'),
    other_insured_name: yup.string().max(250).notRequired().label('Other Insured Name'),
    other_insured_policy_name: yup.string().max(250).notRequired().label('Other Insured Policy Name'),
    other_insured_policy_number: yup.string().max(250).notRequired().label('Other Insured Policy Number'),
    relationship_to_insured_id: yup.number().notRequired().label('Relationship To Insured'),
    insurance_card: yup.string().max(250).notRequired().label('Insurance Card'),
    insurance_category_id: yup.number().notRequired().label('Insurance Category'),
    pcp: yup.string().max(250).notRequired().label('PCP'),
    pcp_phone: yup.string().max(20).notRequired().label('PCP Phone'),
    pcp_fax: yup.string().max(20).notRequired().label('PCP Fax'),
    pcp_email: yup.string().max(250).notRequired().label('PCP Email'),
    wcp: yup.string().max(250).notRequired().label('WCP'),
    wcp_phone: yup.string().max(20).notRequired().label('WCP Phone'),
    wcp_email: yup.string().max(250).notRequired().label('WCP Email'),
    insurance_card_front_file_url: yup.string().max(2000).notRequired(),
    insurance_card_back_file_url: yup.string().max(2000).notRequired(),
    picture_file_url: yup.string().max(2000).notRequired(),
  })

  // ** Ref
  const ref = useRef(null)

  // ** State
  const [stepper, setStepper] = useState(null)
  const {
    reset,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(formSchema) })

  const callBackPatientDetails = (data) => {
    setValue('record_number', data.record_number)
    setValue('first_name', data.first_name)
    setValue('middle_name', data.middle_name)
    setValue('last_name', data.last_name)
    setValue('second_last_name', data.second_last_name)
    setValue('date_of_birth', data.date_of_birth)
    setValue('gender_id', data.gender_id)
  }

  const callBackAddress = (data) => {
    setValue('address', data.address)
    setValue('address1', data.address1)
    setValue('city', data.city)
    setValue('country', data.country)
    setValue('zip_code', data.zip_code)
    setValue('fax', data.fax)
    setValue('phone', data.phone)
    setValue('email', data.email)
    setValue('state_id', data.state_id != '' ? parseInt(data.state_id) : null)
  }

  const callBackContact = (data) => {
    setValue('contact_name', data.contact_name)
    setValue('contact_number', data.contact_number)
    setValue('other_number', data.other_number)
    setValue('other_name', data.other_name)
  }

  const callBackHealthInsurance = (data) => {
    setValue('insurance_number', data.insurance_number)
    setValue('insurance_group_number', data.insurance_group_number)
    setValue('insurance_coverage_date', data.insurance_coverage_date)
    setValue('insurance_company_id', data.insurance_company_id)
    setValue('other_insured_name', data.other_insured_name)
    setValue('other_insured_policy_name', data.other_insured_policy_name)
    setValue('other_insured_policy_number', data.other_insured_policy_number)
    setValue('relationship_to_insured_id', data.relationship_to_insured_id)
    setValue('insurance_card', data.insurance_card)
  }

  const callBackPhysician = (data) => {
    setValue('pcp', data.pcp)
    setValue('pcp_phone', data.pcp_phone)
    setValue('pcp_fax', data.pcp_fax)
    setValue('pcp_email', data.pcp_email)
    setValue('wcp', data.wcp)
    setValue('wcp_phone', data.wcp_phone)
    setValue('wcp_email', data.wcp_email)
  }

  const callBackUploadFiles = (field, file_url) => {
    setValue(field, file_url)
  }

  // ** Function to handle form submit
  const onSubmit = (data) => {
    setLoading(true)
    useApi
      .doRun('put', `/patients/${id}`, {
        id: parseInt(id),
        first_name: getValues('first_name'),
        middle_name: getValues('middle_name'),
        last_name: getValues('last_name'),
        second_last_name: getValues('second_last_name'),
        date_of_birth: getValues('date_of_birth'),
        address: getValues('address'),
        address1: getValues('address1'),
        city: getValues('city'),
        country: getValues('country'),
        zip_code: getValues('zip_code'),
        fax: getValues('fax'),
        phone: getValues('phone'),
        email: getValues('email'),
        insurance_number: getValues('insurance_number'),
        insurance_group_number: getValues('insurance_group_number'),
        insurance_coverage_date: getValues('insurance_coverage_date'),
        insurance_company_id: getValues('insurance_company_id'),
        other_insured_name: getValues('other_insured_name'),
        other_insured_policy_name: getValues('other_insured_policy_name'),
        other_insured_policy_number: getValues('other_insured_policy_number'),
        relationship_to_insured_id: getValues('relationship_to_insured_id'),
        insurance_card: getValues('insurance_card'),
        pcp: getValues('pcp'),
        pcp_phone: getValues('pcp_phone'),
        pcp_fax: getValues('pcp_fax'),
        pcp_email: getValues('pcp_email'),
        wcp: getValues('wcp'),
        wcp_phone: getValues('wcp_phone'),
        wcp_email: getValues('wcp_email'),
        contact_name: getValues('contact_name'),
        contact_number: getValues('contact_number'),
        social_security_number: getValues('social_security_number'),
        other_number: getValues('other_number'),
        other_name: getValues('other_name'),
        gender_id: getValues('gender_id'),
        state_id: getValues('state_id'),
        insurance_category_id: getValues('insurance_category_id'),
        insurance_card_front_file_url: getValues('insurance_card_front_file_url'),
        insurance_card_back_file_url: getValues('insurance_card_back_file_url'),
        picture_file_url: getValues('picture_file_url'),
      })
      .then((res) => {
        toast('Patient Updated Successfully!')
        setLoading(false)

        navigate(`/patients/${id}`)
      })
      .catch((err) => {
        setLoading(false)
        showAlertError(err)
      })
  }

  const steps = [
    {
      id: 'account-details',
      title: 'Account Details',
      subtitle: 'Enter Your Account Details.',
      content: <AccountDetails stepper={stepper} callBack={callBackPatientDetails} type='wizard-vertical' />,
    },
    {
      id: 'step-healt-address',
      title: 'Address',
      subtitle: 'Enter the Address Details.',
      content: <Address stepper={stepper} callBack={callBackAddress} type='wizard-vertical' />,
    },
    {
      id: 'step-insurance',
      title: 'Health Insurance',
      subtitle: 'Enter the Insurance Details.',
      content: <HealthInsurance stepper={stepper} callBack={callBackHealthInsurance} type='wizard-vertical' />,
    },
    {
      id: 'step-physician',
      title: 'Physician',
      subtitle: 'Enter the Physician Details.',
      content: <Physician stepper={stepper} callBack={callBackPhysician} type='wizard-vertical' />,
    },
    {
      id: 'step-contact',
      title: 'Contact',
      subtitle: 'Enter the Contact Details.',
      content: <Contact stepper={stepper} callBack={callBackContact} type='wizard-vertical' />,
    },
    {
      id: 'step-upload',
      title: 'Upload Files',
      subtitle: 'Add some files.',
      content: (
        <UploadFiles stepper={stepper} callBack={callBackUploadFiles} onSubmit={onSubmit} type='wizard-vertical' />
      ),
    },
  ]

  return (
    <>
      <Breadcrumbs title='Patients' data={[{ title: 'Add Patient Wizard' }]} />
      <div className='vertical-wizard'>
        <UILoader blocking={loading} loader={<DefaultLoader />}>
          <Wizard
            type='vertical'
            ref={ref}
            steps={steps}
            options={{
              linear: false,
            }}
            instance={(el) => setStepper(el)}
          />
        </UILoader>
      </div>
    </>
  )
}

export default PatientAddWizard
