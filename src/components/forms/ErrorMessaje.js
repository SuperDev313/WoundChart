import React from "react";
import { AlertCircle } from 'react-feather'
import { Alert } from 'reactstrap'

const ErrorMessaje = ({ message }) => {
    return <>
        {message && (
            <Alert color='danger'>
                <div className='alert-body'>
                    <AlertCircle size={15} />{' '}
                    <span className='ms-1'>
                        {message}
                    </span>
                </div>
            </Alert>
        )}
    </>
}

export default ErrorMessaje;