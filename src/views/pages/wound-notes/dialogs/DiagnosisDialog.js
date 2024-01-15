// ** React Import
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
// ** Custom Components
import useApi from '../../../../api/useApi'
import { DefaultLoader } from '../../../../components/spinner/LoadingSpinner'
import UILoader from '../../../../components/ui-loader'
// ** Utils
import { showAlertError } from '../../../../components/alerts/AlertUtils'

// ** Third Party Components
import toast from 'react-hot-toast'
// ** Reactstrap Imports
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap'

import EditPatientDiagnosis from '../../../../components/edits/patients/EditPatientDiagnosis'

const PatientDiagnosisDialog = ({ open, doTogglePopup, formData, doHandleSaveAndClosePopup }) => {
  const { id, woundNoteId } = useParams()

  const [loading, setLoading] = useState(false)
  const [doSubmit, setDoSubmit] = useState(false)

  const saveUrl =
    woundNoteId
      ? `/wound_notes/${woundNoteId}/patient_diagnosis/0`
      : `/patients/${id}/diagnosis/0`

  const saveCallback = (data, isValid) => {

    if (isValid) {
      console.log('data', data)

      setLoading(true)
      data.forEach((item) => {
        console.log(item)
        useApi
          .doRun('post', `${saveUrl}`, {
            diagnosis_id: item.value,
            patient_id: id,
          })
          .then((res) => {
            toast('PatientDiagnosis Saved Successfully!')
            setLoading(false)
            doHandleSaveAndClosePopup()
          })
          .catch((err) => {
            setLoading(false)
            showAlertError(err)
          })
      })

    }
    setDoSubmit(false)
  }

  return (
    <Modal isOpen={open} className='modal-dialog-centered modal-lg' toggle={doTogglePopup}>
      <UILoader blocking={loading} loader={<DefaultLoader />}>
        <ModalHeader className='bg-transparent' toggle={doTogglePopup}></ModalHeader>
        <ModalBody className='px-5 pb-5'>
          <div className='text-center mb-4'>
            <h1>Add New Diagnosis</h1>
            <p>Enter the values to continue</p>
          </div>

          <EditPatientDiagnosis callBack={saveCallback} doSubmit={doSubmit} formData={formData}></EditPatientDiagnosis>

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

export default PatientDiagnosisDialog
