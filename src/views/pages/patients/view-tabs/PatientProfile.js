
import React, { useState } from 'react'

// ** Reactstrap Imports
import { Card, CardBody, CardText, Button, CardTitle, CardHeader, Row, Col, Table } from 'reactstrap'
import { Link } from 'react-router-dom'
import PatientEditAddress from '../edit/PatientEditAddress'
import PatientEditContact from '../edit/PatientEditContact'
import PatientEditInsurance from '../edit/PatientEditInsurance'
import PatientEditInsuranceCard from '../edit/PatientEditInsuranceCard'
import PatientEditPhysician from '../edit/PatientEditPhysician'
import { C } from 'healthicons-react/dist/filled'
import { ChevronDown, Plus } from 'react-feather'

const PatientProfile = ({ formData }) => {

    console.log(formData)

    const [showEditAddress, setShowEditAddress] = useState(false);
    const [showEditContact, setShowEditContact] = useState(false);
    const [showEditInsurance, setShowEditInsurance] = useState(false);
    const [showEditPhysician, setShowEditPhysician] = useState(false);
    const [showEditInsuranceCard, setShowEditInsuranceCard] = useState(false);

    const showEditAddressModal = (e) => {
        e.preventDefault();
        setShowEditAddress(true);
    }

    const showEditContactModal = (e) => {
        e.preventDefault();
        setShowEditContact(true);
    }

    const showEditInsuranceModal = (e) => {
        e.preventDefault();
        setShowEditInsurance(true);
    }

    const showEditInsuranceCardModal = (e) => {
        e.preventDefault();
        setShowEditInsuranceCard(true);
    }

    const showEditPhysicianModal = (e) => {
        e.preventDefault();
        setShowEditPhysician(true);
    }

    const closeAddressCallback = (data) => {
        setShowEditAddress(false)
        if (data) {
            formData.address = data.address;
            formData.address1 = data.address1;
            formData.city = data.city;
            formData.country = data.country;
            formData.zip_code = data.zip_code;
            formData.phone = data.phone;
            formData.email = data.email;
            formData.state_id = data.state_id;
            formData.country = data.country;
            formData.state_name = data.state_name;
        }
    }

    const closeContactCallback = (data) => {
        setShowEditContact(false)
        if (data) {
            formData.contact_name = data.contact_name;
            formData.contact_number = data.contact_number;
            formData.other_name = data.other_name;
            formData.other_number = data.other_number;
            formData.email = data.email;
        }
    }

    const closeInsuranceCallback = (data) => {
        setShowEditInsurance(false)
        if (data) {
            formData.insurance_number = data.insurance_number;
            formData.insurance_group_number = data.insurance_group_number;
            formData.insurance_coverage_date = data.insurance_coverage_date;
            formData.insurance_company_id = data.insurance_company_id;
            formData.other_insured_name = data.other_insured_name;
            formData.other_insured_policy_name = data.other_insured_policy_name;
            formData.other_insured_policy_number = data.other_insured_policy_number;
            formData.relationship_to_insured_id = data.relationship_to_insured_id;
            formData.insurance_card = data.insurance_card;
            formData.insurance_category_id = data.insurance_category_id;

            formData.insurance_category = data.insurance_category;
            formData.relationship_to_insured = data.relationship_to_insured;
            formData.insurance_company = data.insurance_company;
        }
    }

    const closeInsuranceCardCallback = (data) => {
        setShowEditInsuranceCard(false)
        if (data) {
            console.log(data.insurance_company)
            formData.insurance_card = data.insurance_card;
        }
    }

    const closePhysicianCallback = (data) => {
        setShowEditPhysician(false)
        if (data) {
            formData.pcp = data.pcp;
            formData.pcp_phone = data.pcp_phone;
            formData.pcp_email = data.pcp_email;
            formData.pcp_fax = data.pcp_fax;
            formData.wcp = data.wcp;
            formData.wcp_phone = data.wcp_phone;
            formData.wcp_email = data.wcp_email;
        }
    }

    return (
        <>
            <div className='patient-preview-wrapper'>
                <Row className='patient-preview'>
                    <Col xl={12} md={12} sm={12}>
                        <Card className='patient-preview-card'>
                            <CardBody className='patient-padding pt-0'>
                                <Row className='patient-spacing'>
                                    <Col className='p-0' xl='6'>
                                        <CardTitle tag='h4'>Address</CardTitle>
                                        <CardText className='mb-25'>{formData.address} {formData.address1}</CardText>
                                        <CardText className='mb-25'>{formData.city} {formData.state_name}, {formData.zip_code} {formData.country}</CardText>
                                        <CardText className='mb-25'>{formData.phone}</CardText>
                                        <CardText className='mb-25'>{formData.fax}</CardText>
                                        <Link onClick={showEditAddressModal}>
                                            <small className='fw-bolder'>Edit Address</small>
                                        </Link>
                                    </Col>
                                    <Col className='p-0' xl='6'>
                                        <CardTitle tag='h4'>Physician</CardTitle>
                                        <CardText className='mb-25'><b>Primary Care Physician: </b>{formData.pcp || '-'}</CardText>
                                        <CardText className='mb-25'><b>Primary Care Physician Phone: </b>{formData.pcp_phone || '-'}</CardText>
                                        <CardText className='mb-25'><b>Primary Care Physician Email: </b>{formData.pcp_email || '-'}</CardText>
                                        <CardText className='mb-25'><b>Primary Care Physician Fax: </b>{formData.pcp_fax || '-'}</CardText>
                                        <hr className='patient-spacing' />
                                        <CardText className='mb-25'><b>Wound Care Physician: </b>{formData.wcp || '-'}</CardText>
                                        <CardText className='mb-25'><b>Wound Care Physician Phone: </b>{formData.wcp_phone || '-'}</CardText>
                                        <CardText className='mb-25'><b>Wound Care Physician Email: </b>{formData.wcp_email || '-'}</CardText>
                                        <Link onClick={showEditPhysicianModal}>
                                            <small className='fw-bolder'>Edit Physician</small>
                                        </Link>
                                    </Col>

                                </Row>
                                <hr className='patient-spacing' />
                                <Row className='patient-spacing'>

                                    <Col className='p-0' xl='6'>
                                        <CardTitle tag='h4'>Insurance</CardTitle>
                                        <CardText className='mb-25'><b>Insurance Company: </b>{formData.insurance_company || '-'}</CardText>
                                        <CardText className='mb-25'><b>Insurance Number: </b>{formData.insurance_number || '-'}</CardText>
                                        <CardText className='mb-25'><b>Insurance Group Number: </b>{formData.insurance_group_number || '-'}</CardText>
                                        <CardText className='mb-25'><b>Insurance Category: </b>{formData.insurance_category || '-'}</CardText>
                                        <CardText className='mb-25'><b>Insurance Coverage Date: </b>{formData.insurance_coverage_date || '-'}</CardText>
                                        <Link onClick={showEditInsuranceModal}>
                                            <small className='fw-bolder'>Edit Insurance</small>
                                        </Link>
                                    </Col>
                                    <Col className='p-0' xl='6'>
                                        <CardTitle tag='h4'>Contact</CardTitle>
                                        <CardText className='mb-25'><b>Contact Name: </b>{formData.contact_name || '-'}</CardText>
                                        <CardText className='mb-25'><b>Contact Number: </b>{formData.contact_number || '-'}</CardText>
                                        <CardText className='mb-25'><b>Email: </b>{formData.email || '-'}</CardText>
                                        <hr className='patient-spacing' />
                                        <CardText className='mb-25'><b>Other Name: </b>{formData.other_name || '-'}</CardText>
                                        <CardText className='mb-25'><b>Other Number: </b>{formData.other_number || '-'}</CardText>
                                        <Link onClick={showEditContactModal}>
                                            <small className='fw-bolder'>Edit Contact</small>
                                        </Link>
                                    </Col>
                                </Row>

                            </CardBody>
                        </Card>
                    </Col>

                </Row>
                <Row>
                    <Col>
                        <Card>
                            <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
                                <CardTitle tag='h4'>Insurance Card</CardTitle>
                                <div className='d-flex mt-md-0 mt-1'>
                                    <Button className='ms-2' color='primary' onClick={showEditInsuranceCardModal}>
                                        <Plus size={15} />
                                        <span className='align-middle ms-50'>Add / Update Insurance card</span>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardBody>
                                { formData.insurance_card ? (
                                    <Row>
                                        <Col>
                                            <img
                                                src={formData.insurance_card}
                                                alt={formData.insurance_number}
                                                className='img-fluid rounded mb-75'
                                            />
                                        </Col>
                                        <Col>
                                            <img
                                                src='https://storage.googleapis.com/woundcharts/patients/d5c54720db24486f8b46f07ef79a4293.jpeg'
                                                alt={formData.insurance_number}
                                                className='img-fluid rounded mb-75'
                                            />
                                        </Col>
                                    </Row>
                                ) : (
                                    <p>No insurance card uploaded.</p>
                                ) }
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

            </div>

            <PatientEditAddress show={showEditAddress} formData={formData} closeCallback={closeAddressCallback}></PatientEditAddress>
            <PatientEditContact show={showEditContact} formData={formData} closeCallback={closeContactCallback}></PatientEditContact>
            <PatientEditInsurance show={showEditInsurance} formData={formData} closeCallback={closeInsuranceCallback}></PatientEditInsurance>
            <PatientEditInsuranceCard show={showEditInsuranceCard} formData={formData} closeCallback={closeInsuranceCardCallback}></PatientEditInsuranceCard>
            <PatientEditPhysician show={showEditPhysician} formData={formData} closeCallback={closePhysicianCallback}></PatientEditPhysician>

        </>
    )
}

export default PatientProfile;