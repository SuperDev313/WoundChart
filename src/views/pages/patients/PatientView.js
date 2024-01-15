import React, { useState } from 'react'

import { useParams, Link } from 'react-router-dom'
import useApi from '../../../api/useApi'
import { showAlertError } from '../../../components/alerts/AlertUtils'
// ** Third Party Components
import {
  FaClipboardList,
  FaHospitalUser,
  FaUser,
  FaNotesMedical,
  FaBookMedical,
  FaChartLine,
  FaClone,
} from 'react-icons/fa6'

import Breadcrumbs from '@components/breadcrumbs'
// ** Reactstrap Imports
import { Row, Col, Card, Button, Badge, CardBody, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'

import PatientHeader from '../../../components/edits/patients/PatientHeader'
import PatientNotes from './view-tabs/PatientNotes'
import PatientAssessments from './view-tabs/PatientAssessments'
import PatientProcedures from './view-tabs/PatientProcedures'
import PatientProfile from './view-tabs/PatientProfile'
import PatientProgressGraph from './view-tabs/PatientProgressGraph'
import PatientBeforeAfter from './view-tabs/PatientBeforeAfter.js'
import PatientDiagnosisCard from '../wound-notes/sections/PatientDiagnosisCard'
import PatientDrugCard from './view-tabs/Cards/PatientDrugCard'
import PatientDocsCard from './view-tabs/Cards/PatientDocsCard'

import '@styles/react/libs/tables/react-dataTable-component.scss'
import '@styles/base/pages/app-patient.scss'

const PatientView = () => {
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('1')
  const [allergies, setAllergies] = useState([])
  const [activeTabData, setActiveTabData] = useState(null)

  const [data, setData] = useState([])
  const [totalRows, setTotalRows] = useState(0)
  const [formData, setFormData] = useState({
    record_number: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    second_last_name: '',
    date_of_birth: '',
    address: '',
    address1: '',
    city: '',
    country: '',
    zip_code: '',
    fax: '',
    phone: '',
    email: '',
    insurance_number: '',
    insurance_group_number: '',
    insurance_coverage_date: '',
    insurance_company_id: '',
    other_insured_name: '',
    other_insured_policy_name: '',
    other_insured_policy_number: '',
    relationship_to_insured_id: '',
    insurance_card: '',
    pcp: '',
    pcp_phone: '',
    pcp_fax: '',
    pcp_email: '',
    wcp: '',
    wcp_phone: '',
    wcp_email: '',
    is_active: '',
    contact_name: '',
    contact_number: '',
    signature: '',
    signature_date: '',
    signature_image: '',
    signnature_file: '',
    signature_notify: '',
    whf_values: '',
    whf_score: '',
    whf_score_msg: '',
    whf_score_date: '',
    uar_values: '',
    uar_score: '',
    uar_score_msg: '',
    uar_score_date: '',
    social_security_number: '',
    alert_no_soc: '',
    other_number: '',
    other_name: '',
    gender_id: '',
    state_id: '',
    language_id: '',
    insurance_category_id: '',
    is_long_term_patient: '',
    location_id: '',
    clinic_id: '',
    gender: '',
    state_name: '',
    insurance_category: '',
    picture_file_url: '',
    relationship_to_insured: '',
  })

  const fetchTabData = (tabId) => {
    console.log(tabId)
    switch (tabId) {
      case 1:
        useApi
          .get(`/patients/${id}/notes/by_dates`)
          .then((res) => {
            setData(res.data.data.rows)
            setTotalRows(res.data.data.total)
          })
          .catch((err) => showAlertError(err))
      case 2:
        useApi
          .get(`/patients/${id}`, {})
          .then((res) => {
            const data = res.data.data
            console.log(data)
            setFormData({
              id: data.id,
              record_number: data.record_number,
              first_name: data.first_name,
              middle_name: data.middle_name,
              last_name: data.last_name,
              second_last_name: data.second_last_name,
              date_of_birth: data.date_of_birth,
              address: data.address,
              address1: data.address1,
              city: data.city,
              country: data.country,
              zip_code: data.zip_code,
              fax: data.fax,
              phone: data.phone,
              email: data.email,
              insurance_number: data.insurance_number,
              insurance_group_number: data.insurance_group_number,
              insurance_coverage_date: data.insurance_coverage_date,
              insurance_company_id: data.insurance_company_id,
              other_insured_name: data.other_insured_name,
              other_insured_policy_name: data.other_insured_policy_name,
              other_insured_policy_number: data.other_insured_policy_number,
              relationship_to_insured_id: data.relationship_to_insured_id,
              insurance_card: data.insurance_card,
              pcp: data.pcp,
              pcp_phone: data.pcp_phone,
              pcp_fax: data.pcp_fax,
              pcp_email: data.pcp_email,
              wcp: data.wcp,
              wcp_phone: data.wcp_phone,
              wcp_email: data.wcp_email,
              is_active: data.is_active,
              contact_name: data.contact_name,
              contact_number: data.contact_number,
              signature: data.signature,
              signature_date: data.signature_date,
              signature_image: data.signature_image,
              signnature_file: data.signnature_file,
              signature_notify: data.signature_notify,
              whf_values: data.whf_values,
              whf_score: data.whf_score,
              whf_score_msg: data.whf_score_msg,
              whf_score_date: data.whf_score_date,
              uar_values: data.uar_values,
              uar_score: data.uar_score,
              uar_score_msg: data.uar_score_msg,
              uar_score_date: data.uar_score_date,
              social_security_number: data.social_security_number,
              alert_no_soc: data.alert_no_soc,
              other_number: data.other_number,
              other_name: data.other_name,
              gender_id: data.gender_id,
              state_id: data.state_id,
              language_id: data.language_id,
              insurance_category_id: data.insurance_category_id,
              is_long_term_patient: data.is_long_term_patient,
              location_id: data.location_id,
              clinic_id: data.clinic_id,
              gender: data.gender,
              state_name: data.state_name,
              insurance_category: data.insurance_category,
              relationship_to_insured: data.relationship_to_insured,
              insurance_company: data.insurance_company,
              picture_file_url: data.picture_file_url,
            })
            setLoading(false)
          })
          .catch((err) => {
            showAlertError(err)
            setLoading(false)
          })
    }
  }
  const handleFieldChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab)
      fetchTabData(tab)
    }
  }

  const changePictureCallback = (url) => {
    if (url) {
      console.log(url)
      handleFieldChange('PictureFileUrl', url)
    }
    setShowPatientEditPicture(false)
  }

  const closeAllergiesDialog = (data) => {
    setShowAllergies(false)
  }

  const closeProfileCallback = (data) => {
    setShowEditProfile(false)
    if (data) {
      formData.first_name = data.first_name
      formData.middle_name = data.middle_name
      formData.last_name = data.last_name
      formData.second_last_name = data.second_last_name
      formData.date_of_birth = data.date_of_birth
      formData.gender_id = data.gender_id
      formData.gender = data.gender
    }
  }

  const addOrRemoveAllergy = (allergyId, value) => {
    allergies.forEach(function (item, index, theArray) {
      if (item.value == allergyId) {
        item.id = null
      }
    })
  }

  React.useEffect(() => {
    useApi
      .get(`/patients/${id}/allergies`, {})
      .then((res) => {
        var items = []
        res.data.data.rows.map((r) => {
          const option = { id: r.id, label: r.allergy, value: r.allergy_id }
          items.push(option)
          return option
        })
        setAllergies(items)
      })
      .catch((err) => {
        showAlertError(err)
      })
  }, [])

  return (
    <>
      <Breadcrumbs
        title='View Patient'
        data={[{ title: 'Patients', link: '/patients' }, { title: 'View Patient' }]}
        page='patients'
      />

      <PatientHeader />

      <Nav pills className='mb-2'>
        <NavItem>
          <NavLink active={activeTab === '1'} onClick={() => toggleTab('1')}>
            <FaHospitalUser size={18} className='me-50' />
            <span className='fw-bold'>Wound Notes</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={activeTab === '2'} onClick={() => toggleTab('2')}>
            <FaUser size={18} className='me-50' />
            <span className='fw-bold'>Profile</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={activeTab === '7'} onClick={() => toggleTab('7')}>
            <FaUser size={18} className='me-50' />
            <span className='fw-bold'>Dx</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={activeTab === '8'} onClick={() => toggleTab('8')}>
            <FaUser size={18} className='me-50' />
            <span className='fw-bold'>Rx</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={activeTab === '9'} onClick={() => toggleTab('9')}>
            <FaUser size={18} className='me-50' />
            <span className='fw-bold'>Docs</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={activeTab === '3'} onClick={() => toggleTab('3')}>
            <FaNotesMedical size={18} className='me-50' />
            <span className='fw-bold'>Medical Assessments</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={activeTab === '4'} onClick={() => toggleTab('4')}>
            <FaBookMedical size={18} className='me-50' />
            <span className='fw-bold'>Procedures</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={activeTab === '5'} onClick={() => toggleTab('5')}>
            <FaChartLine size={18} className='me-50' />
            <span className='fw-bold'>Progress Graph</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={activeTab === '6'} onClick={() => toggleTab('6')}>
            <FaClone size={18} className='me-50' />
            <span className='fw-bold'>Before After</span>
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent activeTab={activeTab}>
        <TabPane tabId='1'>
          <Row>
            <Col sm='12'>
              <PatientNotes patientId={id} data={data} totalRows={totalRows} />
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId='2'>
          <Row>
            <Col sm='12'>{formData.record_number === '' ? 'Loading...' : <PatientProfile formData={formData} />}</Col>
          </Row>
        </TabPane>
        <TabPane tabId='3'>
          <Row>
            <Col sm='12'>{activeTab === '3' && <PatientAssessments patientId={id} />}</Col>
          </Row>
        </TabPane>
        <TabPane tabId='4'>
          <Row>
            <Col sm='12'>{activeTab === '4' && <PatientProcedures patientId={id} />}</Col>
          </Row>
        </TabPane>
        <TabPane tabId='5'>
          <Row>
            <Col sm='12'>{activeTab === '5' && <PatientProgressGraph patientId={id} />}</Col>
          </Row>
        </TabPane>
        <TabPane tabId='6'>
          <Row>
            <Col sm='12'>{activeTab === '6' && <PatientBeforeAfter patientId={id} />}</Col>
          </Row>
        </TabPane>
        <TabPane tabId='7'>
          <Row>
            <Col sm='12'>{isNaN(id) ? <LoadingSpinner /> : <PatientDiagnosisCard />}</Col>
          </Row>
        </TabPane>
        <TabPane tabId='8'>
          <Row>
            <Col sm='12'>{isNaN(id) ? <LoadingSpinner /> : <PatientDrugCard />}</Col>
          </Row>
        </TabPane>
        <TabPane tabId='9'>
          <Row>
            <Col sm='12'>{isNaN(id) ? <LoadingSpinner /> : <PatientDocsCard />}</Col>
          </Row>
        </TabPane>
      </TabContent>
    </>
  )
}

export default PatientView
