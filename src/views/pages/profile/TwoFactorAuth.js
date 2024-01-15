// ** React Imports
import { Fragment, useState } from 'react'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Modal,
  Alert,
  Input,
  Button,
  CardBody,
  CardTitle,
  ModalBody,
  CardHeader,
  ModalHeader
} from 'reactstrap'

// ** Third Party Components
import Cleave from 'cleave.js/react'
import 'cleave.js/dist/addons/cleave-phone.us'
import { Settings, MessageSquare, ChevronRight } from 'react-feather'

// ** QR Code
import qrCode from '@src/assets/images/icons/qrcode.png'

const AppAuthComponent = ({ setShow, setShowDetailModal }) => {
  const toggle = () => {
    setShow(false)
    setShowDetailModal(false)
  }

  return (
    <Fragment>
      <h1 className='text-center mb-2 pb-50'>Add Authenticator App</h1>
      <h4>Authenticator Apps</h4>
      <p>
        Using an authenticator app like Google Authenticator, Microsoft Authenticator, Authy, or 1Password, scan the QR
        code. It will generate a 6 digit code for you to enter below.
      </p>
      <div className='d-flex justify-content-center my-2 py-50'>
        <img src={qrCode} alt='QR Code' className='img-fluid' width='122' />
      </div>
      <Alert color='warning'>
        <h4 className='alert-heading'>ASDLKNASDA9AHS678dGhASD78AB</h4>
        <div className='alert-body fw-normal'>
          If you having trouble using the QR code, select manual entry on your app
        </div>
      </Alert>
      <Row className='gy-1'>
        <Col xs={12}>
          <Input placeholder='Enter authentication code' />
        </Col>
        <Col className='d-flex justify-content-end mt-2' xs={12}>
          <Button outline color='secondary' className='me-1' onClick={toggle}>
            Cancel
          </Button>
          <Button color='primary' className='me-1' onClick={toggle}>
            <span className='me-50'>Continue</span>
            <ChevronRight className='rotate-rtl' size={14} />
          </Button>
        </Col>
      </Row>
    </Fragment>
  )
}

const AppSMSComponent = ({ setShow, setShowDetailModal }) => {
  const toggle = () => {
    setShow(false)
    setShowDetailModal(false)
  }
  return (
    <Fragment>
      <h1 className='text-center mb-2 pb-50'>Add your number</h1>
      <h4>Verify Your Mobile Number for SMS</h4>
      <p>Enter your mobile phone number with country code and we will send you a verification code.</p>
      <Row className='gy-1 mt-1'>
        <Col xs={12}>
          <Cleave
            className='form-control'
            placeholder='1 234 567 8900'
            options={{ phone: true, phoneRegionCode: 'US' }}
          />
        </Col>
        <Col className='d-flex justify-content-end mt-2' xs={12}>
          <Button outline color='secondary' className='me-1' onClick={toggle}>
            Cancel
          </Button>
          <Button color='primary' className='me-1' onClick={toggle}>
            <span className='me-50'>Continue</span>
            <ChevronRight className='rotate-rtl' size={14} />
          </Button>
        </Col>
      </Row>
    </Fragment>
  )
}

const TwoFactorAuth = () => {
  const [show, setShow] = useState(false)
  const [authType, setAuthType] = useState('authApp')
  const [showDetailModal, setShowDetailModal] = useState(false)

  const handleContinue = () => {
    setShow(false)
    setShowDetailModal(true)
  }
  return (
    <Fragment>
      <Card>
        <CardHeader className='border-bottom'>
          <CardTitle tag='h4'>Two-step verification</CardTitle>
        </CardHeader>
        <CardBody className='my-2 py-25'>
          <p className='fw-bolder'>Two factor authentication is not enabled yet.</p>
          <p>
            Two-factor authentication adds an additional layer of security to your account by requiring <br />
            more than just a password to log in. Learn more.
          </p>
          <Button color='primary' onClick={() => setShow(!show)}>
            Enable two-factor authentication
          </Button>
        </CardBody>
      </Card>
      <Modal isOpen={show} toggle={() => setShow(!show)} className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent' toggle={() => setShow(!show)}></ModalHeader>
        <ModalBody className='pb-5 px-sm-5 mx-50'>
          <h1 className='text-center mb-1'>Select Authentication Method</h1>
          <p className='text-center mb-3'>
            you also need to select a method by which the proxy
            <br />
            authenticates to the directory serve
          </p>
          <div className='custom-options-checkable'>
            <input
              type='radio'
              id='authApp'
              name='authType'
              checked={authType === 'authApp'}
              className='custom-option-item-check'
              onChange={() => setAuthType('authApp')}
            />
            <label
              htmlFor='authApp'
              className='custom-option-item d-flex align-items-center flex-column flex-sm-row px-3 py-2 mb-2'
            >
              <span>
                <Settings className='font-large-2 me-sm-2 mb-2 mb-sm-0' />
              </span>
              <span>
                <span className='custom-option-item-title d-block h3'>Authenticator Apps</span>
                <span className='mt-75'>
                  Get codes from an app like Google Authenticator, Microsoft Authenticator, Authy or 1Password.
                </span>
              </span>
            </label>
            <input
              type='radio'
              id='authSMS'
              name='authType'
              checked={authType === 'authSMS'}
              className='custom-option-item-check'
              onChange={() => setAuthType('authSMS')}
            />
            <label
              htmlFor='authSMS'
              className='custom-option-item d-flex align-items-center flex-column flex-sm-row px-3 py-2 mb-2'
            >
              <span>
                <MessageSquare className='font-large-2 me-sm-2 mb-2 mb-sm-0' />
              </span>
              <span>
                <span className='custom-option-item-title d-block h3'>SMS</span>
                <span className='mt-75'>We will send a code via SMS if you need to use your backup login method.</span>
              </span>
            </label>
          </div>
          <Button color='primary' className='float-end' onClick={handleContinue}>
            <span className='me-50'>Continue</span>
            <ChevronRight className='rotate-rtl' size={14} />
          </Button>
        </ModalBody>
      </Modal>
      <Modal
        isOpen={showDetailModal}
        toggle={() => setShowDetailModal(!showDetailModal)}
        className='modal-dialog-centered modal-lg'
      >
        <ModalHeader className='bg-transparent' toggle={() => setShowDetailModal(!showDetailModal)}></ModalHeader>
        <ModalBody className='pb-5 px-sm-5 mx-50'>
          {authType === 'authApp' ? (
            <AppAuthComponent setShow={setShow} setShowDetailModal={setShowDetailModal} />
          ) : (
            <AppSMSComponent setShow={setShow} setShowDetailModal={setShowDetailModal} />
          )}
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default TwoFactorAuth
