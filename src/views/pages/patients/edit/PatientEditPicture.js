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

const PatientEditPicture = ({ show, id, callback }) => {
    const [loading, setLoading] = useState(false);

    const handleModalClosed = () => {
        if (callback) {
            callback();
        }
    }

    const handleUploadPhoto = (response) => {
        // console.log('handleUploadPhoto', response.file_url)

        setLoading(true);

        useApi
            .put(`/patients/${id}/picture`, {
                id: parseInt(id),
                picture_file_url: response.file_url
            })
            .then((res) => {

                setLoading(false);
                callback(response.file_url)

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
                    <h1>Change Picture</h1>
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

export default PatientEditPicture;