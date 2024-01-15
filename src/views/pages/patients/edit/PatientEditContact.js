import React, { Fragment, useState } from "react";

import {
    Row,
    Col,
    Card,
    Label,
    Input,
    Table,
    Modal,
    Button,
    CardBody,
    ModalBody,
    ModalHeader,
    FormFeedback,
    UncontrolledTooltip
} from 'reactstrap'

import EditContact from '../../../../components/edits/patients/EditContact';
import useApi from "../../../../api/useApi";
import { showAlertError } from "../../../../components/alerts/AlertUtils";
import UILoader from '../../../../components/ui-loader';
import { DefaultLoader } from "../../../../components/spinner/LoadingSpinner";

const PatientEditContact = ({ show, formData, callback, closeCallback }) => {

    const [doSubmit, setDoSubmit] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleModalClosed = () => {
        if (closeCallback) {
            closeCallback();
        }
    }

    const saveCallback = (data, isValid) => {
        console.log('data', data)
        setDoSubmit(false)

        if (isValid) {
            setLoading(true);
            useApi
                .put(`/patients/${formData.id}/contact`, {
                    id: parseInt(formData.id),
                    contact_name: data.contact_name,
                    contact_number: data.contact_number,
                    other_name: data.other_name,
                    other_number: data.other_number,
                    email: data.email,
                })
                .then((res) => {

                    setLoading(false);
                    closeCallback(data)

                })
                .catch((err) => {
                    showAlertError(err);
                    setLoading(false);
                });
        }
    }

    return (
        <Modal
            isOpen={show}
            onClosed={handleModalClosed}
            className='modal-dialog-centered modal-lg'
        >
            <ModalHeader className='bg-transparent' toggle={() => handleModalClosed()}></ModalHeader>
            <ModalBody className='px-5 pb-5'>

                <div className='text-center mb-4'>
                    <h1>Edit Contact</h1>
                    <p>Update Patient Contact</p>
                </div>
                <UILoader blocking={loading} loader={<DefaultLoader />}>
                    <EditContact callBack={saveCallback} doSubmit={doSubmit} formData={formData}></EditContact>
                </UILoader>
                <Row>

                    <Col className='text-center mt-2' xs={12}>
                        <Button type='submit' color='primary' className='me-1' onClick={() => setDoSubmit(true)}>
                            Submit
                        </Button>
                        <Button type='buttob' color='primary' className='me-1' onClick={handleModalClosed}>
                            Close
                        </Button>

                    </Col>
                </Row>

            </ModalBody>
        </Modal>
    )

}

export default PatientEditContact;