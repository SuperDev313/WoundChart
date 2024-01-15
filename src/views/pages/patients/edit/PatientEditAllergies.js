import React, { Fragment, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

import {
  Row,
  Col,
  Modal,
  Button,
  ModalBody,
  ModalHeader,
  Input,
  Label,
} from 'reactstrap'

import { Check, X } from 'react-feather'
import UILoader from '../../../../components/ui-loader'
import { DefaultLoader } from '../../../../components/spinner/LoadingSpinner'
import useApi from '../../../../api/useApi'

const PatientEditAllergies = ({ show, allergies, callback, closeCallback }) => {
  const { id } = useParams()
  const [loading, setLoading] = useState(false)

  const handleModalClosed = () => {
    if (closeCallback) {
      closeCallback()
    }
  }

  const checkBoxValueChange = (e) => {
    const { name, checked } = e.target

    console.log(name)

    if (checked) {
      useApi
        .doRun('post', `/patients/${id}/allergies`, {
          patient_id: parseInt(id),
          allergy_id: parseInt(name),
        })
        .then((res) => {
          allergies.forEach(function (item, index, theArray) {
            if (item.value === name) {
              item.id = res.data.data.id
            }
          })
          setLoading(false)
        })
        .catch((err) => {
          setLoading(false)
          console.log(err)
        })
    } else {
      allergies.forEach(function (item, index, theArray) {
        if (item.value === name) {
          useApi
            .delete(`/patients/${id}/allergies/${item.id}`, {})
            .then((res) => {
              item.id = null
            })
            .catch((err) => {
              console.log(err)
            })
        }
      })
    }
    //
  }

  return (
    <Modal
      isOpen={show}
      onClosed={handleModalClosed}
      className='modal-dialog-centered modal-lg'
    >
      <ModalHeader
        className='bg-transparent'
        toggle={() => handleModalClosed()}
      ></ModalHeader>
      <ModalBody className='px-5 pb-5'>
        <div className='text-center mb-4'>
          <h1>Add Remove Allergies</h1>
          <p>Check or Uncheck to add remove allergies</p>
        </div>
        <UILoader blocking={loading} loader={<DefaultLoader />}>
          <Row>
            {allergies.map((item, index) => (
              <Col key={index} md={6} lg={4}>
                <div className='mt-50 mt-sm-0 mb-2'>
                  <Input
                    type='checkbox'
                    name={item.value}
                    defaultChecked={item.id !== null}
                    onChange={checkBoxValueChange}
                  />
                  <span className='px-1'>{item.label}</span>
                </div>
              </Col>
            ))}
          </Row>
        </UILoader>
        <Row>
          <Col className='text-center mt-2' xs={12}>
            <Button
              type='buttob'
              color='primary'
              className='me-1'
              onClick={handleModalClosed}
            >
              Close
            </Button>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  )
}

export default PatientEditAllergies
