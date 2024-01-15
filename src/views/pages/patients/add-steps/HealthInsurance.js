// ** React Imports
import React, { Fragment, useState } from 'react'

// ** Utils
import { isObjEmpty } from '@utils'
import classnames from 'classnames'

// ** Third Party Components
import { ArrowLeft, ArrowRight } from 'react-feather'
// ** Utils
import EditHealthInsurance from '../../../../components/edits/patients/EditHealthInsurance'

// ** Reactstrap Imports
import { Button } from 'reactstrap'

const HealthInsurance = ({ stepper, callBack }) => {
  const [doNext, setDoNext] = useState(false)

  const saveCallback = (data, isValid) => {
    if (isValid) {
      callBack(data)
      stepper.next()
    }
    setDoNext(false)
  }

  return (
    <Fragment>
      <div className='content-header'>
        <h5 className='mb-0'>Health Insurance</h5>
        <small className='text-muted'>Enter the Patient Health Insurance Details.</small>
      </div>

      <EditHealthInsurance callBack={saveCallback} doSubmit={doNext}></EditHealthInsurance>

      <div className='d-flex justify-content-between'>
        <Button type='button' color='primary' className='btn-prev' outline disabled>
          <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft>
          <span className='align-middle d-sm-inline-block d-none'>Previous</span>
        </Button>
        <Button type='button' color='primary' className='btn-next' onClick={() => setDoNext(true)}>
          <span className='align-middle d-sm-inline-block d-none'>Next</span>
          <ArrowRight size={14} className='align-middle ms-sm-25 ms-0'></ArrowRight>
        </Button>
      </div>
    </Fragment>
  )
}

export default HealthInsurance
