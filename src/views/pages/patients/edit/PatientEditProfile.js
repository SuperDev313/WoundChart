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

import EditProfile from '../../../../components/edits/patients/EditProfile';
import useApi from "../../../../api/useApi";
import { showAlertError } from "../../../../components/alerts/AlertUtils";
import UILoader from '../../../../components/ui-loader';
import { DefaultLoader } from "../../../../components/spinner/LoadingSpinner";

const PatientEditProfile = ({ show, formData, callback, closeCallback }) => {

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
                .put(`/patients/${formData.id}/profile`, {
                    id: parseInt(formData.id),
                    first_name: data.first_name,
                    middle_name: data.middle_name,
                    last_name: data.last_name,
                    second_last_name: data.second_last_name,
                    date_of_birth: data.date_of_birth,
                    gender_id: parseInt(data.gender_id),
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
                    <h1>Edit Profile</h1>
                    <p>Update Patient Profile</p>
                </div>
                <UILoader blocking={loading} loader={<DefaultLoader />}>
                    <EditProfile callBack={saveCallback} doSubmit={doSubmit} formData={formData}></EditProfile>
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

export default PatientEditProfile;