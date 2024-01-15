// ** Reactstrap Imports
import { Row, Col, Form, Input, Label, Button, Card, CardHeader, CardTitle, CardBody, FormFeedback } from 'reactstrap'

// ** Third Party Components
import Select from 'react-select'
import Cleave from 'cleave.js/react'
import 'cleave.js/dist/addons/cleave-phone.us'
import { useForm, Controller } from 'react-hook-form'

// ** Utils
import { selectThemeColors } from '@utils'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'

const countryOptions = [
  { value: 'uk', label: 'UK' },
  { value: 'usa', label: 'USA' },
  { value: 'france', label: 'France' },
  { value: 'russia', label: 'Russia' },
  { value: 'canada', label: 'Canada' }
]

const defaultValues = {
  companyName: '',
  billingEmail: ''
}

const BillingAddress = () => {
  // ** Hooks
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  const onSubmit = data => {
    if (Object.values(data).every(field => field.length > 0)) {
      return null
    } else {
      for (const key in data) {
        if (data[key].length === 0) {
          setError(key, {
            type: 'manual'
          })
        }
      }
    }
  }

  return (
    <Card>
      <CardHeader className='border-bottom'>
        <CardTitle tag='h4'>Billing Address</CardTitle>
      </CardHeader>
      <CardBody className='my-2 py-50'>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md='6' className='mb-1'>
              <Label className='form-label' for='companyName'>
                Company Name
              </Label>
              <Controller
                id='companyName'
                control={control}
                name='companyName'
                render={({ field }) => (
                  <Input placeholder='PIXINVENT' invalid={errors.companyName && true} {...field} />
                )}
              />
              {errors.companyName && <FormFeedback>Please enter a valid Company Name</FormFeedback>}
            </Col>
            <Col md='6' className='mb-1'>
              <Label className='form-label' for='billingEmail'>
                Billing Email
              </Label>
              <Controller
                id='billingEmail'
                control={control}
                name='billingEmail'
                render={({ field }) => (
                  <Input
                    type='email'
                    placeholder='company@email.com'
                    invalid={errors.billingEmail && true}
                    {...field}
                  />
                )}
              />
              {errors.billingEmail && <FormFeedback>Please enter a valid Billing Email</FormFeedback>}
            </Col>
            <Col md='6' className='mb-1'>
              <Label className='form-label' for='taxID'>
                Tax ID
              </Label>
              <Input id='taxID' name='taxID' placeholder='Tax-6548' />
            </Col>
            <Col md='6' className='mb-1'>
              <Label className='form-label' for='vatNumber'>
                VAT Number
              </Label>
              <Input id='vatNumber' name='vatNumber' placeholder='#US1234567891012' />
            </Col>
            <Col md='6' className='mb-1'>
              <Label className='form-label' for='mobileNumber'>
                Mobile
              </Label>
              <Cleave
                id='phone-number'
                className='form-control'
                placeholder='1 234 567 8900'
                options={{ phone: true, phoneRegionCode: 'US' }}
              />
            </Col>
            <Col md='6' className='mb-1'>
              <Label className='form-label' for='country'>
                Country
              </Label>
              <Select
                id='country'
                isClearable={false}
                className='react-select'
                classNamePrefix='select'
                options={countryOptions}
                theme={selectThemeColors}
                defaultValue={countryOptions[0]}
              />
            </Col>
            <Col xs='12' className='mb-1'>
              <Label className='form-label' for='billingAddress'>
                Billing Address
              </Label>
              <Input id='billingAddress' name='billingAddress' placeholder='12, Business Park' />
            </Col>
            <Col md='6' className='mb-1'>
              <Label className='form-label' for='billingState'>
                State
              </Label>
              <Input id='billingState' name='state' placeholder='California' />
            </Col>
            <Col md='6' className='mb-2'>
              <Label className='form-label' for='zipCodeAddress'>
                Zip Code
              </Label>
              <Input type='number' id='zipCodeAddress' name='zipCodeAddress' placeholder='123456' maxLength='6' />
            </Col>
            <Col xs='12'>
              <Button type='submit' className='me-1' color='primary'>
                Submit
              </Button>
              <Button type='reset' color='secondary' outline>
                Discard
              </Button>
            </Col>
          </Row>
        </Form>
      </CardBody>
    </Card>
  )
}

export default BillingAddress
