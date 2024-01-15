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

import EditHealthInsurance from '../../../../components/edits/patients/EditHealthInsurance';
import useApi from "../../../../api/useApi";
import { showAlertError } from "../../../../components/alerts/AlertUtils";
import UILoader from '../../../../components/ui-loader';
import { DefaultLoader } from "../../../../components/spinner/LoadingSpinner";

const PatientEditInsurance = ({ show, formData, callback, closeCallback }) => {

    const [doSubmit, setDoSubmit] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleModalClosed = () => {
        if (closeCallback) {
            closeCallback();
        }
    }
    const saveCallback = (data, isValid) => {
        // console.log('data', data)
        
        setDoSubmit(false)

        if (isValid) {

            useApi
                .put(`/patients/${formData.id}/insurance`, {
                    id: parseInt(formData.id),
                    insurance_company_id: data.insurance_company_id == null ? null: parseInt(data.insurance_company_id),
                    insurance_number: data.insurance_number,
                    insurance_group_number: data.insurance_group_number,
                    insurance_category_id: data.insurance_category_id == null ? null: parseInt(data.insurance_category_id),
                    insurance_coverage_date: data.insurance_coverage_date,
                    other_insured_name: data.other_insured_name,
                    other_insured_policy_name: data.other_insured_policy_name,
                    other_insured_policy_number: data.other_insured_policy_number,
                    relationship_to_insured_id: data.relationship_to_insured_id == null ? null: parseInt(data.relationship_to_insured_id),
                    insurance_card: data.insurance_card,
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
                    <h1>Edit Insurance</h1>
                    <p>Update Patient Insurance</p>
                </div>
                <UILoader blocking={loading} loader={<DefaultLoader />}>
                    <EditHealthInsurance callBack={saveCallback} doSubmit={doSubmit} formData={formData}></EditHealthInsurance>
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

export default PatientEditInsurance;