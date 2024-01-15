// ** React Import
import React, { useState } from 'react'
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

import PatientConsultNoteEdit from './PatientConsultNoteEdit'
import { dateToISOString } from '../../../utility/Utils'

const PatientConsultNoteDialog = ({ open, doTogglePopup, recordId, doHandleSaveAndClosePopup }) => {
  const { id } = useParams()

  const [loading, setLoading] = useState(false)
  const [doSubmit, setDoSubmit] = useState(false)

  const [formData, setFormData] = useState({
    patient_id: id,
    chief_complaint: '',
    assessment: '',
    comments: '',
    laboratories: [],
    recomendations: [],
  })

  const saveCallback = (data, isValid) => {
    var laboratories = []
    data.laboratories.map((r) => {
      laboratories.push({
        id: r.id,
        laboratory: r.laboratory,
      })
      return {}
    })

    var recomendations = []
    data.recomendations.map((r) => {
      recomendations.push({
        id: r.id,
        recommendation: r.recommendation,
      })
      return {}
    })

    if (isValid) {
      setLoading(true)
      useApi
        .doRun(recordId > 0 ? 'put' : 'post', `patients/${id}/consult_notes/${recordId}`, {
          // patient_id: parseInt(id),
          patient_id: isNaN(data.patient_id) ? null : parseInt(data.patient_id),
          chief_complaint: data.chief_complaint,
          assessment: data.assessment,
          comments: data.comments,
          laboratories: laboratories,
          recomendations: recomendations,
        })
        .then((res) => {
          toast('Consult Note Saved Successfully!')
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
        .get(`/patients/${id}/consult_notes/${recordId}`, {})
        .then((res) => {
          const data = res.data.data
          setFormData({
            patient_id: id,
            chief_complaint: data.chief_complaint,
            assessment: data.assessment,
            comments: data.comments,
            laboratories: data.laboratories,
            recomendations: data.recomendations,
          })
          setLoading(false)
        })
        .catch((err) => {
          showAlertError(err)
          setLoading(false)
        })
    } else {
      setFormData({
        patient_id: id,
        chief_complaint: '',
        assessment: '',
        comments: '',
        laboratories: [],
        recomendations: [],
      })
    }
  }, [recordId])

  return (
    <Modal isOpen={open} className='modal-dialog-centered modal-lg' toggle={doTogglePopup}>
      <UILoader blocking={loading} loader={<DefaultLoader />}>
        <ModalHeader className='bg-transparent' toggle={doTogglePopup}></ModalHeader>
        <ModalBody className='px-5 pb-5'>
          <div className='text-center mb-4'>
            <h1>Add New Patient Consult Note</h1>
            <p>Enter the values to continue</p>
          </div>

          <PatientConsultNoteEdit
            callBack={saveCallback}
            doSubmit={doSubmit}
            formData={formData}
          ></PatientConsultNoteEdit>

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

export default PatientConsultNoteDialog
