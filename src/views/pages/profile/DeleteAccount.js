// ** Reactstrap Imports
import { Card, Button, CardHeader, CardTitle, CardBody, Alert, Form, Input, Label, FormFeedback } from 'reactstrap'

// ** Third Party Components
import Swal from 'sweetalert2'
import classnames from 'classnames'
import { useForm, Controller } from 'react-hook-form'
import withReactContent from 'sweetalert2-react-content'

// ** Styles
import '@styles/base/plugins/extensions/ext-component-sweet-alerts.scss'

const defaultValues = {
  confirmCheckbox: false
}

const MySwal = withReactContent(Swal)

const DeleteAccount = () => {
  // ** Hooks
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  const handleConfirmDelete = () => {
    return MySwal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you would like to deactivate your account?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger ms-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.value) {
        MySwal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Your account has been deactivated.',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        })
      } else if (result.dismiss === MySwal.DismissReason.cancel) {
        MySwal.fire({
          title: 'Cancelled',
          text: 'Deactivation Cancelled!!',
          icon: 'error',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        })
      }
    })
  }

  const onSubmit = data => {
    if (data.confirmCheckbox === true) {
      handleConfirmDelete()
    } else {
      setError('confirmCheckbox', { type: 'manual' })
    }
  }

  return (
    <Card>
      <CardHeader className='border-bottom'>
        <CardTitle tag='h4'>Delete Account</CardTitle>
      </CardHeader>
      <CardBody className='py-2 my-25'>
        <Alert color='warning'>
          <h4 className='alert-heading'>Are you sure you want to delete your account?</h4>
          <div className='alert-body fw-normal'>
            Once you delete your account, there is no going back. Please be certain.
          </div>
        </Alert>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className='form-check'>
            <Controller
              control={control}
              name='confirmCheckbox'
              render={({ field }) => (
                <Input
                  {...field}
                  type='checkbox'
                  id='confirmCheckbox'
                  checked={field.value}
                  invalid={errors.confirmCheckbox && true}
                />
              )}
            />
            <Label
              for='confirmCheckbox'
              className={classnames('form-check-label', {
                'text-danger': errors && errors.confirmCheckbox
              })}
            >
              I confirm my account deactivation
            </Label>
            {errors && errors.confirmCheckbox && (
              <FormFeedback>Please confirm that you want to delete account</FormFeedback>
            )}
          </div>
          <div className='mt-1'>
            <Button color='danger'>Deactivate Account</Button>
          </div>
        </Form>
      </CardBody>
    </Card>
  )
}

export default DeleteAccount
