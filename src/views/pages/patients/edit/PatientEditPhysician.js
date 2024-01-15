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

import EditPhysician from '../../../../components/edits/patients/EditPhysician';
import useApi from "../../../../api/useApi";
import { showAlertError } from "../../../../components/alerts/AlertUtils";
import UILoader from '../../../../components/ui-loader';
import { DefaultLoader } from "../../../../components/spinner/LoadingSpinner";

const PatientEditPhysician= ({ show, formData, callback, closeCallback }) => {

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

            useApi
                .put(`/patients/${formData.id}/physician`, {
                    id: parseInt(formData.id),
                    pcp: data.pcp,
                    pcp_phone: data.pcp_phone,
                    pcp_email: data.pcp_email,
                    pcp_fax: data.pcp_fax,
                    wcp: data.wcp,
                    wcp_phone: data.wcp_phone,
                    wcp_email: data.wcp_email,
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
                    <h1>Edit Physician</h1>
                    <p>Update Patient Physician</p>
                </div>
                <UILoader blocking={loading} loader={<DefaultLoader />}>
                    <EditPhysician callBack={saveCallback} doSubmit={doSubmit} formData={formData}></EditPhysician>
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

export default PatientEditPhysician;