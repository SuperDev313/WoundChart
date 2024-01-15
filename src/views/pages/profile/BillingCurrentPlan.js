// ** React Imports
import { Fragment, useState, useEffect } from 'react'
// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Badge,
  Alert,
  Modal,
  Input,
  Button,
  CardBody,
  Progress,
  CardTitle,
  ModalBody,
  CardHeader,
  ModalHeader
} from 'reactstrap'

// ** Demo Components
import PricingCard from '@src/views/pages/pricing/PricingCards'

// ** Third Party Components
import axios from 'axios'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

// ** Styles
import '@styles/base/pages/page-pricing.scss'
import '@styles/base/plugins/extensions/ext-component-sweet-alerts.scss'

const MySwal = withReactContent(Swal)

const BillingCurrentPlan = () => {
  // ** States
  const [show, setShow] = useState(false)
  const [data, setData] = useState(null)
  const [duration, setDuration] = useState('monthly')

  useEffect(() => {
    axios.get('/pricing/data').then(res => {
      const dataArr = []

      Object.entries(res.data).forEach(([key, val]) => {
        if (key !== 'qandA') {
          dataArr.push(val)
          setData([...dataArr])
        }
      })
    })
  }, [])

  const onChange = e => {
    if (e.target.checked) {
      setDuration('yearly')
    } else {
      setDuration('monthly')
    }
  }

  const handleConfirmCancel = () => {
    return MySwal.fire({
      title: '',
      text: 'Are you sure you would like to cancel your subscription?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.value) {
        MySwal.fire({
          icon: 'success',
          title: 'Unsubscribed!',
          text: 'Your subscription cancelled successfully.',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        })
      } else if (result.dismiss === MySwal.DismissReason.cancel) {
        MySwal.fire({
          title: 'Cancelled',
          text: 'Unsubscription Cancelled!!',
          icon: 'error',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        })
      }
    })
  }

  return (
    <Fragment>
      <Card>
        <CardHeader className='border-bottom'>
          <CardTitle tag='h4'>Current plan</CardTitle>
        </CardHeader>
        <CardBody className='my-2 py-25'>
          <Row>
            <Col md='6'>
              <div className='mb-2 pb-50'>
                <h5>
                  Your Current Plan is <strong>Basic</strong>
                </h5>
                <span>A simple start for everyone</span>
              </div>
              <div className='mb-2 pb-50'>
                <h5>Active until Dec 09, 2021</h5>
                <span>We will send you a notification upon Subscription expiration</span>
              </div>
              <div className='mb-2 mb-md-1'>
                <h5>
                  $199 Per Month{' '}
                  <Badge color='light-primary' className='ms-50'>
                    Popular
                  </Badge>
                </h5>
                <span>Standard plan for small to medium businesses</span>
              </div>
            </Col>
            <Col md='6'>
              <Alert color='warning'>
                <h4 className='alert-heading'>We need your attention!</h4>
                <div className='alert-body'>your plan requires update</div>
              </Alert>
              <div className='plan-statistics pt-1'>
                <div className='d-flex justify-content-between'>
                  <h5 className='fw-bolder'>Days</h5>
                  <h5 className='fw-bolder'>4 of 30 Days</h5>
                </div>
                <Progress className='mb-50' value={75} />
                <p className='mt-50'>4 days remaining until your plan requires update</p>
              </div>
            </Col>
            <Col xs={12}>
              <Button color='primary' className='me-1 mt-1' onClick={() => setShow(true)}>
                Upgrade Plan
              </Button>
              <Button outline color='danger' className='mt-1' onClick={handleConfirmCancel}>
                Cancel Subscription
              </Button>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Modal isOpen={show} toggle={() => setShow(!show)} className='modal-dialog-centered modal-xl'>
        <ModalHeader className='bg-transparent' toggle={() => setShow(!show)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <h1 className='text-center mb-1'>Subscription Plan</h1>
          <p className='text-center mb-3'>
            All plans include 40+ advanced tools and features to boost your product. Choose the best plan to fit your
            needs.
          </p>
          <div className='d-flex align-items-center justify-content-center mb-5 pb-50'>
            <h6 className='me-50 mb-0'>Monthly</h6>
            <div className='form-switch'>
              <Input id='plan-switch' type='switch' checked={duration === 'yearly'} onChange={onChange} />
            </div>
            <h6 className='ms-50 mb-0'>Annually</h6>
          </div>
          <PricingCard bordered data={data} duration={duration} />
          <div className='text-center'>
            <p>Still not convinced? Start with a 14-day FREE trial!</p>
            <Button color='primary' onClick={() => setShow(!show)}>
              Start your trial
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default BillingCurrentPlan
