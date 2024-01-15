// ** React Imports
import React, { Fragment, useState } from 'react'

import { ArrowLeft } from 'react-feather'
import FileUploaderSingle from '../../../../components/upload-files/FileUploaderSingle'

import 'cleave.js/dist/addons/cleave-phone.us'

// ** Reactstrap Imports
import {
  Form,
  Label,
  Input,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  FormFeedback,
  InputGroup,
  InputGroupText,
} from 'reactstrap'

const UploadFiles = ({ stepper, callBack, onSubmit }) => {
  const handleUploadCardFrontImage = (response) => {
    console.log('handleUploadCardFrontImage', response)
    callBack('insurance_card_front_file_url', response.file_url)
  }

  const handleUploadCardFBackImage = (response) => {
    console.log('handleUploadCardFBackImage', response)
    callBack('insurance_card_back_file_url', response.file_url)
  }

  const handleUploadPhoto = (response) => {
    console.log('handleUploadPhoto', response)
    callBack('picture_file_url', response.file_url)
  }

  return (
    <>
      <div className='content-header'>
        <h5 className='mb-0'>Upload Files</h5>
        <small className='text-muted'>Upload Patient Photo and Insurance Card.</small>
      </div>

      <Card>
        <CardBody>
          <Row className=' mb-8'>
            <Col className=' mb-5 mb-lg-0 drop ' lg={6} sm={12}>
              <h3 className='card-title'>Upload Patient's Photo or ID</h3>
              <FileUploaderSingle
                route='/files/upload_patient_picture'
                onResponseCallback={(res) => handleUploadPhoto(res)}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Row className=' mb-12'>
            <Col className=' mb-6 mb-lg-0 drop ' lg={6} sm={6}>
              <h3 className='card-title'>Upload Insurance Front Card Image</h3>
              <FileUploaderSingle
                route='/files/upload_patient_picture'
                onResponseCallback={(res) => handleUploadCardFrontImage(res)}
              />
            </Col>

            <Col className=' mb-6 mb-lg-0 drop ' lg={6} sm={6}>
              <h3 className='card-title'>Upload Insurance Back Card Image</h3>
              <FileUploaderSingle
                route='/files/upload_patient_picture'
                onResponseCallback={(res) => handleUploadCardFBackImage(res)}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>
      <div className='d-flex justify-content-between'>
        <Button color='primary' className='btn-prev' outline disabled>
          <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft>
          <span className='align-middle d-sm-inline-block d-none'>Previous</span>
        </Button>
        <Button type='submit' color='success' className='btn-submit' onClick={onSubmit}>
          Submit
        </Button>
      </div>
    </>
  )
}

export default UploadFiles
