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

import EditAddress from '../../../../components/edits/patients/EditAddress';
import useApi from "../../../../api/useApi";
import { showAlertError } from "../../../../components/alerts/AlertUtils";
import UILoader from '../../../../components/ui-loader';
import { DefaultLoader } from "../../../../components/spinner/LoadingSpinner";

const PatientEditAddress = ({ show, formData, callback, closeCallback }) => {

    const [doSubmit, setDoSubmit] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleModalClosed = () => {
        if (closeCallback) {
            closeCallback();
        }
    }

    const saveCallback = (data, isValid) => {
        setDoSubmit(false)

        if (isValid) {

            useApi
                .put(`/patients/${formData.id}/address`, {
                    id: parseInt(formData.id),
                    address: data.address,
                    address1: data.address1,
                    city: data.city,
                    zip_code: data.zip_code,
                    phone: data.phone,
                    email: data.email,
                    country: data.country,
                    state_id: parseInt(data.state_id),
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
                    <h1>Edit Address</h1>
                    <p>Update Patient Address</p>
                </div>
                <UILoader blocking={loading} loader={<DefaultLoader />}>
                    <EditAddress callBack={saveCallback} doSubmit={doSubmit} formData={formData}></EditAddress>
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

export default PatientEditAddress;