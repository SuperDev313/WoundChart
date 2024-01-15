// ** Third Party Components
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import { useForm, Controller } from 'react-hook-form'

// ** Reactstrap Imports
import { Row, Col, Card, Form, Label, Input, Button, CardBody, CardTitle, CardHeader, FormFeedback } from 'reactstrap'

// ** Images
import illustration from '@src/assets/images/illustration/pricing-Illustration.svg'

const keyOptions = [
  { value: 'full-control', label: 'Full Control' },
  { value: 'modify', label: 'Modify' },
  { value: 'read-execute', label: 'Read & Execute' },
  { value: 'list-folder', label: 'List Folder Contents' },
  { value: 'read-only', label: 'Read Only' },
  { value: 'read-write', label: 'Read Write' }
]

const defaultValues = {
  apiKeyName: ''
}

const CreateApiKey = () => {
  // ** Hooks
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  const onSubmit = data => {
    if (data.apiKeyName.length) {
      return null
    } else {
      setError('apiKeyName', {
        type: 'manual'
      })
    }
  }

  return (
    <Card>
      <CardHeader className='pb-0'>
        <CardTitle tag='h4'>Create an API Key</CardTitle>
      </CardHeader>
      <Row>
        <Col md={{ size: 5, order: 0 }} xs={{ size: 12, order: 1 }}>
          <CardBody>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <div className='mb-2'>
                <Label className='form-label'>Choose the Api key type you want to create</Label>
                <Select
                  isClearable={false}
                  options={keyOptions}
                  className='react-select'
                  classNamePrefix='select'
                  theme={selectThemeColors}
                  defaultValue={keyOptions[0]}
                />
              </div>
              <div className='mb-2'>
                <Label className='form-label' for='api-key-name'>
                  Name the API key
                </Label>
                <Controller
                  id='apiKeyName'
                  name='apiKeyName'
                  control={control}
                  render={({ field }) => (
                    <Input placeholder='Server Key' invalid={errors.apiKeyName && true} {...field} />
                  )}
                />
                {errors && errors.apiKeyName && <FormFeedback>Please enter a valid API key name</FormFeedback>}
              </div>
              <div>
                <Button block type='submit' color='primary'>
                  Create Key
                </Button>
              </div>
            </Form>
          </CardBody>
        </Col>
        <Col md={{ size: 7, order: 1 }} xs={{ size: 12, order: 0 }}>
          <div className='text-center'>
            <img className='img-fluid text-center' src={illustration} alt='illustration' width='310' />
          </div>
        </Col>
      </Row>
    </Card>
  )
}

export default CreateApiKey
