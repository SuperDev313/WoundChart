// ** React Import
import React, { useState } from "react";
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

import FileUploaderSingle from "../../../../components/upload-files/FileUploaderSingle";
import useApi from "../../../../api/useApi";
import { showAlertError } from "../../../../components/alerts/AlertUtils";
import UILoader from '../../../../components/ui-loader';
import { DefaultLoader } from "../../../../components/spinner/LoadingSpinner";

const PatientEditInsuranceCard = ({ show, formData, closeCallback }) => {
    const [loading, setLoading] = useState(false);

    const handleModalClosed = () => {
        if (closeCallback) {
            closeCallback();
        }
    }

    const handleUploadPhoto = (response) => {
        // console.log('handleUploadPhoto', response.file_url)

        setLoading(true);

        useApi
            .put(`/patients/${formData.id}/insurance`, {
                id: parseInt(formData.id),
                insurance_company: formData.insurance_company,
                insurance_company_id: formData.insurance_company_id === null ? null : parseInt(formData.insurance_company_id),
                insurance_card: response.file_url
            })
            .then((res) => {

                setLoading(false);
                closeCallback(response.file_url)

            })
            .catch((err) => {
                showAlertError(err);
                setLoading(false);
            });
    }


    return (
        <Modal
            isOpen={show}
            onClosed={handleModalClosed}
            toggle={() => setShow(!show)}
            className='modal-dialog-centered modal-lg'
        >
            <ModalHeader className='bg-transparent' toggle={() => handleModalClosed()}></ModalHeader>
            <ModalBody className='px-5 pb-5'>

                <div className='text-center mb-4'>
                    <h1>Change Insurance Card</h1>
                    <p>Uplaod a new picture for the patient</p>
                </div>
                <Row>
                    <Row className=" mb-8">
                        <Col className=" mb-5 mb-lg-0 drop " lg={12} sm={12}>
                            <UILoader blocking={loading} loader={<DefaultLoader />}>
                                <FileUploaderSingle route="/files/upload_patient_picture" onResponseCallback={(res) => handleUploadPhoto(res)} />
                            </UILoader>
                        </Col>
                    </Row>
                    <Col className='text-center mt-2' xs={12}>
                        <Button type='buttob' color='primary' className='me-1' onClick={handleModalClosed}>
                            Close
                        </Button>

                    </Col>
                </Row>

            </ModalBody>
        </Modal>
    )
}

export default PatientEditInsuranceCard;