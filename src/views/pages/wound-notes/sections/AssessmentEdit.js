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
 
import EditWoundNoteDetails from "../../../../components/edits/wound-notes/EditWoundNoteDetails";
import useApi from "../../../../api/useApi";
import { showAlertError } from "../../../../components/alerts/AlertUtils";
import UILoader from '../../../../components/ui-loader';
import { DefaultLoader } from "../../../../components/spinner/LoadingSpinner";

import { getFormatedDateFromISODate, dateToISOString } from "../../../../utility/Utils";

const AssessmentEdit = ({ show, formData, closeCallback }) => {

    const [doSubmit, setDoSubmit] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleModalClosed = () => {
        if (closeCallback) {
            closeCallback();
        }
    }

    React.useEffect(() => {
        console.log(formData)
    })

    const saveCallback = (data, isValid) => {
        setDoSubmit(false)

        if (isValid) {

            useApi
                .put(`/wound_notes/${formData.id}/assessment`, {
                    patient_id: isNaN(data.patient_id) ? null : parseInt(data.patient_id),
                    visit_date: dateToISOString(new Date(data.visit_date)),
                    wound_location: data.wound_location,
                    pain_grade_id: isNaN(data.pain_grade_id) ? null : parseInt(data.pain_grade_id),
                    visit_type_id: isNaN(data.visit_type_id) ? null : parseInt(data.visit_type_id),
                    location_id: isNaN(data.location_id) ? null : parseInt(data.location_id),
                    wound_type_id: isNaN(data.wound_type_id) ? null : parseInt(data.wound_type_id),
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
                    <h1>Edit Wound Assessment</h1>
                    <p>Update Wound Assessment</p>
                </div>
                <UILoader blocking={loading} loader={<DefaultLoader />}>
                    <EditWoundNoteDetails callBack={saveCallback} doSubmit={doSubmit} formData={formData}></EditWoundNoteDetails>
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

export default AssessmentEdit;