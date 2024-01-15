// ** React Imports
import { Fragment, useState } from 'react'

// ** Reactstrap Imports
import { Row, Col, Card, Button, CardBody, CardTitle, CardHeader } from 'reactstrap'

import { formattedDate } from '@utils'
import 'react-datetime/css/react-datetime.css'
import Datetime from 'react-datetime'
import moment from 'moment'

import AssessmentEdit from './AssessmentEdit'

const AssessmentCard = ({ formData }) => {
  const [showAssessment, setShowAssessment] = useState(false)

  const closeAssessmentCallback = (data) => {
    setShowAssessment(false)
    if (data) {
      console.log('callbak data', data)
      formData.visit_type_id_description = data.visit_type_id_description
      formData.visit_date = data.visit_date
      formData.location_id_name = data.location_id_name
      formData.wound_location = data.wound_location
      formData.wound_type_id_description = data.wound_type_id_description
      formData.pain_grade_id_description = data.pain_grade_id_description
    }
  }

  const showEditAssessmentModal = (e) => {
    e.preventDefault()
    setShowAssessment(true)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle tag='h4'>WOUND ASSESSMENTS</CardTitle>
          <Button color='primary' size='sm' onClick={showEditAssessmentModal}>
            Edit Wound Assessments
          </Button>
        </CardHeader>
        <CardBody>
          <Row>
            <Col xl='12' xs='12'>
              <Row tag='dl' className='mb-0'>
                <Col tag='dt' sm='3' className='fw-bolder mb-1'>
                  Date & Time of Visit
                </Col>
                <Col tag='dd' sm='9' className='mb-1'>
                  <Row>
                    <Col>
                      <Datetime />
                    </Col>
                    <Col>
                      <Datetime value={new Date()} timeFormat={false} dateFormat={false} />
                    </Col>
                  </Row>
                  {formattedDate(formData.visit_date)}
                </Col>

                <Col tag='dt' sm='3' className='fw-bolder mb-1'>
                  Type of Visit:
                </Col>
                <Col tag='dd' sm='9' className='mb-1'>
                  {formData.visit_type_id_description}
                </Col>

                <Col tag='dt' sm='3' className='fw-bolder mb-1'>
                  Location/Facility
                </Col>
                <Col tag='dd' sm='9' className='mb-1'>
                  {formData.location_id_name}
                </Col>

                <Col tag='dt' sm='3' className='fw-bolder mb-1'>
                  Wound Location
                </Col>
                <Col tag='dd' sm='9' className='mb-1'>
                  {formData.wound_location}
                </Col>

                <Col tag='dt' sm='3' className='fw-bolder mb-1'>
                  Wound Type:
                </Col>
                <Col tag='dd' sm='9' className='mb-1'>
                  {formData.wound_type_id_description}
                </Col>

                <Col tag='dt' sm='3' className='fw-bolder mb-1'>
                  Pain Degree:
                </Col>
                <Col tag='dd' sm='9' className='mb-1'>
                  {formData.pain_grade_id_description}
                </Col>
              </Row>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <AssessmentEdit
        show={showAssessment}
        formData={formData}
        closeCallback={closeAssessmentCallback}
      ></AssessmentEdit>
    </>
  )
}

export default AssessmentCard
