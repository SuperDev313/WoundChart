import React, { Fragment, useState, useEffect } from 'react'

import useApi from '../../../api/useApi'
// ** Reactstrap Imports
import { Row, Col, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'

// ** Illustrations Imports
import illustrationsLight from '@src/assets/images/pages/coming-soon.svg'
import illustrationsDark from '@src/assets/images/pages/coming-soon-dark.svg'
import Breadcrumbs from '@components/breadcrumbs'
import StatsDataTable from '../../../components/datatables/StatsDataTable'
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'
import {
  FaUserCheck,
  FaUser,
  FaUserClock,
  FaHospitalUser,
  FaPersonWalkingArrowLoopLeft,
  FaPersonWalking,
} from 'react-icons/fa6'
import { showAlertError } from '../../../components/alerts/AlertUtils'
// ** Styles
import '@styles/base/pages/page-misc.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import 'bootstrap-daterangepicker/daterangepicker.css'

const StatsCard = () => {
  // ** Hooks
  const { skin } = useSkin()
  const source = skin === 'dark' ? illustrationsDark : illustrationsLight

  const [fortmStats, setFormStats] = useState({
    total_patients: 0,
  })
  const [activeTab, setActiveTab] = useState('1')

  const barriers = [
    {
      barrier: 'Necrosis (Dead Skin)',
      number: 10,
    },
    {
      barrier: 'Infection',
      number: 15,
    },
    {
      barrier: 'Haemorrhage',
      number: 5,
    },
    {
      barrier: 'Mechanical damage',
      number: 8,
    },
    {
      barrier: 'Diet',
      number: 12,
    },
    {
      barrier: 'Medical conditions',
      number: 3,
    },
    {
      barrier: 'Age',
      number: 40,
    },
    {
      barrier: 'Medicines',
      number: 7,
    },
    {
      barrier: 'Smoking',
      number: 6,
    },
    {
      barrier: 'Varicose veins',
      number: 5,
    },
    {
      barrier: 'Dryness',
      number: 2,
    },
    {
      barrier: 'Bedridden',
      number: 8,
    },
  ]

  const woundType = [
    {
      type: 'Surgical Wound',
      percentage: 17.86,
    },
    {
      type: 'Venous Ulcer',
      percentage: 17.86,
    },
    {
      type: 'Arterial Ulcer',
      percentage: 10.71,
    },
    {
      type: 'Diabetic Foot Ulcer',
      percentage: 10.71,
    },
    {
      type: 'Pressure Injury',
      percentage: 10.71,
    },
    {
      type: 'Abrasion',
      percentage: 7.14,
    },
    {
      type: 'Trauma Wound',
      percentage: 7.14,
    },
    {
      type: 'Dermatitis',
      percentage: 3.57,
    },
    {
      type: 'Insect Bite',
      percentage: 3.57,
    },
    {
      type: 'Malignant Wound',
      percentage: 3.57,
    },
    {
      type: 'Pyoderma Gangrenosum',
      percentage: 3.57,
    },
    {
      type: 'Unspecified Wound',
      percentage: 3.57,
    },
  ]

  const visitsPerMonth = [
    {
      month: 'September, 2023',
      visits: 18,
    },
    {
      month: 'August, 2023',
      visits: 137,
    },
    {
      month: 'July, 2023',
      visits: 122,
    },
    {
      month: 'June, 2023',
      visits: 97,
    },
    {
      month: 'May, 2023',
      visits: 64,
    },
    {
      month: 'April, 2023',
      visits: 57,
    },
    {
      month: 'March, 2023',
      visits: 76,
    },
    {
      month: 'February, 2023',
      visits: 62,
    },
    {
      month: 'January, 2023',
      visits: 70,
    },
    {
      month: 'December, 2022',
      visits: 74,
    },
    {
      month: 'November, 2022',
      visits: 88,
    },
    {
      month: 'October, 2022',
      visits: 99,
    },
  ]

  const entryPerMonth = [
    {
      month: 'September, 2023',
      entry: 18,
    },
    {
      month: 'August, 2023',
      entry: 137,
    },
    {
      month: 'July, 2023',
      entry: 122,
    },
    {
      month: 'June, 2023',
      entry: 97,
    },
    {
      month: 'May, 2023',
      entry: 64,
    },
    {
      month: 'April, 2023',
      entry: 57,
    },
    {
      month: 'March, 2023',
      entry: 70,
    },
    {
      month: 'February, 2023',
      entry: 62,
    },
    {
      month: 'January, 2023',
      entry: 70,
    },
    {
      month: 'December, 2022',
      entry: 74,
    },
    {
      month: 'November, 2022',
      entry: 88,
    },
    {
      month: 'October, 2022',
      entry: 99,
    },
  ]

  const topICDS = [
    {
      tag: 1,
      ICDs: 'Essential (primary) hypertension I10',
    },
    {
      tag: 2,
      ICDs: 'Mixed hyperlipidemia E782',
    },
    {
      tag: 3,
      ICDs: 'Essentials (primary) hypertension I10',
    },
    {
      tag: 4,
      ICDs: 'Hypothyroidism, unspecified E039',
    },
    {
      tag: 5,
      ICDs: 'Chronic venous hypertension (idiopathic) with ulcer of left lower extremity I87312',
    },
    {
      tag: 6,
      ICDs: 'Venous insufficiency (chronic) (peripheral) I872',
    },
    {
      tag: 7,
      ICDs: 'Non-pressure chronic ulcer of other part of left foot with unspecified severity L97529',
    },
    {
      tag: 8,
      ICDs: "Alzheimer's disease, unspecified G309",
    },
    {
      tag: 9,
      ICDs: 'Morbid (severe) obesity due to excess calories E6601',
    },
    {
      tag: 10,
      ICDs: 'Type II diabetes mellitus with foot ulcer E11.621',
    },
    {
      tag: 11,
      ICDs: 'Anemia, unspecified D64.9',
    },
    {
      tag: 12,
      ICDs: "Charcot's joint, left ankle and foot M14.672",
    },
    {
      tag: 13,
      ICDs: "Charcot's joint, right ankle and foot M14.671",
    },
    {
      tag: 14,
      ICDs: 'Hypothyroidism, unspecified E03.9',
    },
    {
      tag: 15,
      ICDs: 'Type 2 diabetes mellitus with diabetic neuropathy, unspecified E11.40',
    },
  ]

  const clinicianPerfomance = [
    {
      tag: 1,
      name: 'Luis Otero',
      average_days_under_six: 10,
      average_days_over_six: 5,
    },
    {
      tag: 2,
      name: 'Samiris Santiago',
      average_days_under_six: 15,
      average_days_over_six: 8,
    },
    {
      tag: 3,
      name: 'Fernando J Torres Martinez',
      average_days_under_six: 20,
      average_days_over_six: 10,
    },
    {
      tag: 4,
      name: 'Maria Rodriguez',
      average_days_under_six: 5,
      average_days_over_six: 3,
    },
    {
      tag: 5,
      name: 'Carlos Perez',
      average_days_under_six: 12,
      average_days_over_six: 6,
    },
  ]

  const barriersColumns = [
    {
      name: 'Barriers',
      selector: (row) => row.barrier,
      sortable: true,
    },
    {
      name: '# of Patients Affected by Barriers',
      selector: (row) => row.number,
      sortable: true,
    },
  ]

  const woundTypeColumns = [
    {
      name: 'Wound Type',
      selector: (row) => row.type,
      sortable: true,
    },
    {
      name: 'Percentage',
      selector: (row) => row.percentage,
      sortable: true,
    },
  ]

  const visitsColumns = [
    {
      name: 'Month',
      selector: (row) => row.month,
      sortable: true,
    },
    {
      name: '# of Visits',
      selector: (row) => row.visits,
      sortable: true,
    },
  ]

  const entryColumns = [
    {
      name: 'Month',
      selector: (row) => row.month,
      sortable: true,
    },
    {
      name: '# of Visits',
      selector: (row) => row.entry,
      sortable: true,
    },
  ]

  const topICDColumns = [
    {
      name: 'S/N',
      selector: (row) => row.tag,
      sortable: true,
    },
    {
      name: 'ICDs',
      selector: (row) => row.ICDs,
      sortable: true,
    },
  ]

  const clinicianPerfomanceColumns = [
    {
      name: 'S/N',
      selector: (row) => row.tag,
      sortable: true,
    },
    {
      name: 'Name of Clinician',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Average Days (Recent 6 months)',
      selector: (row) => row.average_days_under_six,
      sortable: true,
    },
    {
      name: 'Average Days (Previous 6 months)',
      selector: (row) => row.average_days_over_six,
      sortable: true,
    },
  ]

  React.useEffect(() => {
    useApi
      .get(`/stats/all_patients`, {})
      .then((res) => {
        const data = res.data.data
        setFormStats({
          total_patients: data.total,
        })
        console.log(total_patient)
      })
      .catch((err) => {
        showAlertError(err)
        setLoading(false)
      })
  }, [])

  const toggleTab = (tab) => {
    setActiveTab(tab)
  }

  return (
    <>
      <Breadcrumbs title='Stats' data={[{ title: 'Stats' }]} />

      <Nav pills className='mb-2' style={{ display: 'flex', justifyContent: 'space-between' }}>
        <NavItem>
          <NavLink active={activeTab === '1'} onClick={() => toggleTab('1')}>
            <span className='fw-bold'>Status</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={activeTab === '2'} onClick={() => toggleTab('2')}>
            <span className='fw-bold'>Patients Affected by Barriers</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={activeTab === '3'} onClick={() => toggleTab('3')}>
            {' '}
            <span className='fw-bold'>Wound Type</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={activeTab === '4'} onClick={() => toggleTab('4')}>
            <span className='fw-bold'>The visits done by month</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={activeTab === '5'} onClick={() => toggleTab('5')}>
            <span className='fw-bold'>The visits was entered by month</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={activeTab === '6'} onClick={() => toggleTab('6')}>
            <span className='fw-bold'>Top 15 ICD-10 Codes</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={activeTab === '7'} onClick={() => toggleTab('7')}>
            <span className='fw-bold'>Clinicians Visit/Documentation Performance</span>
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent activeTab={activeTab}>
        <TabPane tabId='1'>
          <Row>
            <Col sm='12'>
              {' '}
              <Row>
                <Col lg='3' sm='6'>
                  <StatsHorizontal
                    icon={<FaUserCheck size={21} />}
                    color='primary'
                    stats={fortmStats.total_patients}
                    statTitle='ACTIVE PATIENTS'
                  />
                </Col>
                <Col lg='3' sm='6'>
                  <StatsHorizontal
                    icon={<FaUser size={21} />}
                    color='success'
                    stats='71'
                    statTitle='ACTIVE PATIENTS AVG AGE'
                  />
                </Col>
                <Col lg='3' sm='6'>
                  <StatsHorizontal
                    icon={<FaUserClock size={21} />}
                    color='danger'
                    stats='70'
                    statTitle='LIFETIME PATIENTS AVG AGE'
                  />
                </Col>
                <Col lg='3' sm='6'>
                  <StatsHorizontal
                    icon={<FaHospitalUser size={21} />}
                    color='warning'
                    stats='1,626'
                    statTitle='PATIENTS TREATED'
                  />
                </Col>
              </Row>
              <Row>
                <Col lg='3' sm='6'>
                  <StatsHorizontal
                    icon={<FaHospitalUser size={21} />}
                    color='primary'
                    stats='1793'
                    statTitle='PATIENTS TREATED'
                  />
                </Col>
                <Col lg='3' sm='6'>
                  <StatsHorizontal
                    icon={<FaUserCheck size={21} />}
                    color='success'
                    stats='51%'
                    statTitle='312 ACTIVE MALES'
                  />
                </Col>
                <Col lg='3' sm='6'>
                  <StatsHorizontal
                    icon={<FaUser size={21} />}
                    color='danger'
                    stats='49%'
                    statTitle='303 ACTIVE FEMALES'
                  />
                </Col>
                <Col lg='3' sm='6'>
                  <StatsHorizontal
                    icon={<FaUser size={21} />}
                    color='warning'
                    stats='50%'
                    statTitle='806 ACTIVE MALES WITHIN RANGE'
                  />
                </Col>
              </Row>
              <Row>
                <Col lg='3' sm='6'>
                  <StatsHorizontal
                    icon={<FaUser size={21} />}
                    color='primary'
                    stats='52%'
                    statTitle='839 ACTIVE FEMALES WITHIN RANGE'
                  />
                </Col>
                <Col lg='3' sm='6'>
                  <StatsHorizontal
                    icon={<FaUser size={21} />}
                    color='success'
                    stats='49%'
                    statTitle='872 LIFETIME MALES'
                  />
                </Col>
                <Col lg='3' sm='6'>
                  <StatsHorizontal
                    icon={<FaUser size={21} />}
                    color='danger'
                    stats='51%'
                    statTitle='921 LIFETIME FEMALES'
                  />
                </Col>
                <Col lg='3' sm='6'>
                  <StatsHorizontal
                    icon={<FaUser size={21} />}
                    color='warning'
                    stats='3,043'
                    statTitle='TOTAL WOUNDS TREATED'
                  />
                </Col>
              </Row>
              <Row>
                <Col lg='3' sm='6'>
                  <StatsHorizontal
                    icon={<FaUserCheck size={21} />}
                    color='primary'
                    stats='240'
                    statTitle='PATIENTS WITH STALLED AND DECLINING WOUNDS'
                  />
                </Col>
                <Col lg='3' sm='6'>
                  <StatsHorizontal
                    icon={<FaUser size={21} />}
                    color='success'
                    stats='1.2gb'
                    statTitle='PATIENTS EVALUATED BUT NOT TREATED'
                  />
                </Col>
                <Col lg='3' sm='6'>
                  <StatsHorizontal
                    icon={<FaUserClock size={21} />}
                    color='danger'
                    stats='3043'
                    statTitle='NET WOUNDS TREATED'
                  />
                </Col>
                <Col lg='3' sm='6'>
                  <StatsHorizontal
                    icon={<FaHospitalUser size={21} />}
                    color='warning'
                    stats='101'
                    statTitle='DAYS TO CLOSE WOUNDS'
                  />
                </Col>
              </Row>
              <Row>
                <Col lg='3' sm='6'>
                  <StatsHorizontal
                    icon={<FaPersonWalking size={21} />}
                    color='primary'
                    stats='1.76'
                    statTitle='AVERAGE VISITS/WEEK'
                  />
                </Col>
                <Col lg='3' sm='6'>
                  <StatsHorizontal
                    icon={<FaPersonWalkingArrowLoopLeft size={21} />}
                    color='success'
                    stats='703'
                    statTitle='RESCHEDULED VISITS'
                  />
                </Col>
                <Col lg='3' sm='6'>
                  <StatsHorizontal
                    icon={<FaUserClock size={21} />}
                    color='danger'
                    stats='891'
                    statTitle='SHARP DEBRIDEMENTS'
                  />
                </Col>
                <Col lg='3' sm='6'>
                  <StatsHorizontal
                    icon={<FaHospitalUser size={21} />}
                    color='warning'
                    stats='263'
                    statTitle='WOUND CULTURES'
                  />
                </Col>
              </Row>
              <Row>
                <Col lg='3' sm='6'>
                  <StatsHorizontal
                    icon={<FaUserCheck size={21} />}
                    color='primary'
                    stats='-'
                    statTitle='WOUND BIOPSIES'
                  />
                </Col>
                <Col lg='3' sm='6'>
                  <StatsHorizontal icon={<FaUser size={21} />} color='success' stats='1' statTitle='BIOLOGIC GRAFTS' />
                </Col>
                <Col lg='3' sm='6'>
                  <StatsHorizontal
                    icon={<FaUserClock size={21} />}
                    color='danger'
                    stats='547'
                    statTitle='# VOIDED NOTES PER MONTH'
                  />
                </Col>
                <Col lg='3' sm='6'></Col>
              </Row>
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId='2'>
          <Row>
            <Col sm='12'>
              {' '}
              <StatsDataTable columns={barriersColumns} data={barriers} title='# Patients Affected By Barriers' />
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId='3'>
          <Row>
            <Col sm='12'>
              {' '}
              <StatsDataTable columns={woundTypeColumns} data={woundType} title='% Wound Type' />
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId='4'>
          <Row>
            <Col sm='12'>
              {' '}
              <StatsDataTable columns={visitsColumns} data={visitsPerMonth} title='The # of visits done by month' />
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId='5'>
          <Row>
            <Col sm='12'>
              <StatsDataTable
                columns={entryColumns}
                data={entryPerMonth}
                title='The # of visits was entered by month'
              />
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId='6'>
          <Row>
            <Col sm='12'>
              {' '}
              <StatsDataTable columns={topICDColumns} data={topICDS} title='Top 15 ICD-10 Codes' />
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId='7'>
          <Row>
            <Col sm='12'>
              {' '}
              <StatsDataTable
                columns={clinicianPerfomanceColumns}
                data={clinicianPerfomance}
                title='Clinicians Visit/Documentation Performance'
              />
            </Col>
          </Row>
        </TabPane>
      </TabContent>
    </>
  )
}

export default StatsCard
