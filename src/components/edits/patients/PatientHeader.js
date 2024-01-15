
import React, { useState } from 'react'

import { useParams, Link } from "react-router-dom";
import useApi from "../../../api/useApi";
import { showAlertError } from "../../../components/alerts/AlertUtils";
// ** Third Party Components
import { User, Lock, Check, List, Calendar } from 'react-feather'
import { PatientPicture, PatientPicture2 } from '../../../utility/Utils'


import Breadcrumbs from '@components/breadcrumbs'
// ** Reactstrap Imports
import { Row, Col, Card, Button, Badge, CardBody } from 'reactstrap'

import { getFullName } from '../../../utility/Utils';
import PatientEditPicture from '../../../views/pages/patients/edit/PatientEditPicture';
import PatientEditAllergies from '../../../views/pages/patients/edit/PatientEditAllergies';
import PatientEditProfile from '../../../views/pages/patients/edit/PatientEditProfile';
import StatsCard from '../../../views/pages/patients/view-tabs/Cards/StatsCard';

import '@styles/react/libs/tables/react-dataTable-component.scss'
import '@styles/base/pages/app-patient.scss'


const PatientHeader = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [showPatientEditPicture, setShowPatientEditPicture] = useState(false);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [showAllergies, setShowAllergies] = useState(false);
    const [activeTab, setActiveTab] = useState('1')
    const [allergies, setAllergies] = useState([]);

    const [formData, setFormData] = useState({
        record_number: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        second_last_name: "",
        date_of_birth: "",
        address: "",
        address1: "",
        city: "",
        country: "",
        zip_code: "",
        fax: "",
        phone: "",
        email: "",
        insurance_number: "",
        insurance_group_number: "",
        insurance_coverage_date: "",
        insurance_company_id: "",
        other_insured_name: "",
        other_insured_policy_name: "",
        other_insured_policy_number: "",
        relationship_to_insured_id: "",
        insurance_card: "",
        pcp: "",
        pcp_phone: "",
        pcp_fax: "",
        pcp_email: "",
        wcp: "",
        wcp_phone: "",
        wcp_email: "",
        is_active: "",
        contact_name: "",
        contact_number: "",
        signature: "",
        signature_date: "",
        signature_image: "",
        signnature_file: "",
        signature_notify: "",
        whf_values: "",
        whf_score: "",
        whf_score_msg: "",
        whf_score_date: "",
        uar_values: "",
        uar_score: "",
        uar_score_msg: "",
        uar_score_date: "",
        social_security_number: "",
        alert_no_soc: "",
        other_number: "",
        other_name: "",
        gender_id: "",
        state_id: "",
        language_id: "",
        insurance_category_id: "",
        is_long_term_patient: "",
        location_id: "",
        clinic_id: "",
        gender: "",
        state_name: "",
        insurance_category: "",
        picture_file_url: "",
        relationship_to_insured: "",
    });

    React.useEffect(() => {
        useApi
            .get(`/patients/${id}`, {})
            .then((res) => {
                const data = res.data.data;
                setFormData({
                    id: data.id,
                    record_number: data.record_number,
                    first_name: data.first_name,
                    middle_name: data.middle_name,
                    last_name: data.last_name,
                    second_last_name: data.second_last_name,
                    date_of_birth: data.date_of_birth,
                    address: data.address,
                    address1: data.address1,
                    city: data.city,
                    country: data.country,
                    zip_code: data.zip_code,
                    fax: data.fax,
                    phone: data.phone,
                    email: data.email,
                    insurance_number: data.insurance_number,
                    insurance_group_number: data.insurance_group_number,
                    insurance_coverage_date: data.insurance_coverage_date,
                    insurance_company_id: data.insurance_company_id,
                    other_insured_name: data.other_insured_name,
                    other_insured_policy_name: data.other_insured_policy_name,
                    other_insured_policy_number: data.other_insured_policy_number,
                    relationship_to_insured_id: data.relationship_to_insured_id,
                    insurance_card: data.insurance_card,
                    pcp: data.pcp,
                    pcp_phone: data.pcp_phone,
                    pcp_fax: data.pcp_fax,
                    pcp_email: data.pcp_email,
                    wcp: data.wcp,
                    wcp_phone: data.wcp_phone,
                    wcp_email: data.wcp_email,
                    is_active: data.is_active,
                    contact_name: data.contact_name,
                    contact_number: data.contact_number,
                    signature: data.signature,
                    signature_date: data.signature_date,
                    signature_image: data.signature_image,
                    signnature_file: data.signnature_file,
                    signature_notify: data.signature_notify,
                    whf_values: data.whf_values,
                    whf_score: data.whf_score,
                    whf_score_msg: data.whf_score_msg,
                    whf_score_date: data.whf_score_date,
                    uar_values: data.uar_values,
                    uar_score: data.uar_score,
                    uar_score_msg: data.uar_score_msg,
                    uar_score_date: data.uar_score_date,
                    social_security_number: data.social_security_number,
                    alert_no_soc: data.alert_no_soc,
                    other_number: data.other_number,
                    other_name: data.other_name,
                    gender_id: data.gender_id,
                    state_id: data.state_id,
                    language_id: data.language_id,
                    insurance_category_id: data.insurance_category_id,
                    is_long_term_patient: data.is_long_term_patient,
                    location_id: data.location_id,
                    clinic_id: data.clinic_id,
                    gender: data.gender,
                    state_name: data.state_name,
                    insurance_category: data.insurance_category,
                    relationship_to_insured: data.relationship_to_insured,
                    insurance_company: data.insurance_company,
                    picture_file_url: data.picture_file_url,
                });
                setLoading(false);
            })
            .catch((err) => {
                showAlertError(err);
                setLoading(false);
            });

    }, [id]);

    const handleFieldChange = (field, value) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    const toggleTab = tab => {
        setActiveTab(tab)
    }

    const changePictureCallback = (url) => {
        if (url) {
            console.log(url)
            handleFieldChange('PictureFileUrl', url)
        }
        setShowPatientEditPicture(false)
    }

    const showAllergiesDialog = (e) => {
        e.preventDefault();
        setShowAllergies(true);
    }
    const closeAllergiesDialog = (data) => {
        setShowAllergies(false)
    }

    const showEditProfileModal = (e) => {
        e.preventDefault();
        setShowEditProfile(true);
    }



    const closeProfileCallback = (data) => {
        setShowEditProfile(false)
        if (data) {
            formData.first_name = data.first_name;
            formData.middle_name = data.middle_name;
            formData.last_name = data.last_name;
            formData.second_last_name = data.second_last_name;
            formData.date_of_birth = data.date_of_birth;
            formData.gender_id = data.gender_id;
            formData.gender = data.gender;
        }
    }

    const addOrRemoveAllergy = (allergyId, value) => {
        console.log(allergyId, value)
        allergies.forEach(function (item, index, theArray) {
            if (item.value == allergyId) {
                item.id = null;
            }
        });
    }

    React.useEffect(() => {
        useApi
            .get(`/patients/${id}/allergies`, {})
            .then((res) => {
                var items = [];
                res.data.data.rows.map((r) => {
                    const option = { id: r.id, label: r.allergy, value: r.allergy_id };
                    items.push(option);
                    return option;
                });
                setAllergies(items);
            })
            .catch((err) => {
                showAlertError(err);
            });
    }, []);

    return (
        <>
            {/* <Breadcrumbs title='View Patient' data={[{ title: 'Patients', link: '/patients' }, { title: 'View Patient' }]} /> */}
            <Row>
                <Col lg={{ size: 4, order: 1 }} sm={{ size: 12 }} xs={{ order: 2 }}>
                    <Card>
                        <CardBody>
                            <div className='user-avatar-section'>
                                <div className='d-flex align-items-center flex-column' onClick={() => setShowPatientEditPicture(true)}>
                                    <PatientPicture2 url={formData.picture_file_url} name={getFullName(formData.first_name, formData.middle_name, formData.last_name, formData.second_last_name)}></PatientPicture2>
                                    <div className='d-flex flex-column align-items-center text-center'>
                                        <div className='user-info'>
                                            <h4>{getFullName(formData.first_name, formData.middle_name, formData.last_name, formData.second_last_name)}</h4>
                                            <Badge color='light-info' className='text-capitalize'>
                                                {formData.gender}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='d-flex justify-content-around my-2 pt-75'>
                                <div className='d-flex align-items-start me-2'>
                                    <Badge color='light-primary' className='rounded p-75'>
                                        <Calendar className='font-medium-2' />
                                    </Badge>
                                    <div className='ms-75'>
                                        <h4 className='mb-0' style={{ fontSize: '1rem' }}>{formData.date_of_birth}</h4>
                                        <small>Birth Date</small>
                                    </div>
                                </div>
                                <div className='d-flex align-items-start'>
                                    <Badge color='light-primary' className='rounded p-75'>
                                        <List className='font-medium-2' />
                                    </Badge>
                                    <div className='ms-75'>
                                        <h4 className='mb-0' style={{ fontSize: '1rem' }}>{formData.record_number}</h4>
                                        <small>Record No</small>
                                    </div>
                                </div>
                            </div>

                            <div className='d-flex justify-content-center pt-2'>
                                <Button color='primary' onClick={showEditProfileModal} >
                                    Edit Profile
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                <Col lg={{ size: 8, order: 2 }} sm={{ size: 12 }} xs={{ order: 1 }}>
                    <Card>
                        <CardBody className='patient-padding pb-10'>
                            <Row>
                                <Col>
                                    <StatsCard title={'Wound Heal Fail Score'} subtitle={'Will heal (02-07-2023)'} icon={<Check size={18} />} />
                                </Col>
                                <Col>
                                    <StatsCard title={'Braden Scale Score:'} subtitle={'High Risk'} icon={<Check size={18} />} />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <StatsCard title={'Estimated Wound Closure Date'} subtitle={'23'} icon={<Check size={18} />} />
                                </Col>
                                <Col>
                                    <StatsCard title={'On Anticoagulant use'} subtitle={'No'} icon={<Check size={18} />} />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <StatsCard title={'ICT Note'} subtitle={'Yes (07/17/2023)'} icon={<Check size={18} />} />
                                </Col>
                                <Col>
                                    <StatsCard title={'Ulcer amputation risk score'} subtitle={'23 (07/17/2023)'} icon={<Check size={18} />} />
                                </Col>
                            </Row>
                            <Row>
                                <Col>

                                    <h4 className='fw-bolder border-bottom pb-50 mt-2'>
                                        Allergies&nbsp;&nbsp;
                                        <Link onClick={(e) => {showAllergiesDialog(e)}}>
                                            <small className='fw-bolder'>Edit</small>
                                        </Link>
                                    </h4>

                                    <Row>
                                        <Col>
                                            <div className='info-container'>
                                                <ul className='list-unstyled'>
                                                    {allergies.filter(r => r.id != null).map((allergy, index) => (
                                                        index % 2 === 0 && (
                                                            <li className='mb-75' key={allergy.value}>
                                                                <span className='fw-bolder me-25'>{allergy.label}</span>
                                                            </li>
                                                        )
                                                    ))}
                                                    {
                                                        allergies.filter(r => r.id != null).length == 0 && (
                                                            <li className='mb-75'>
                                                                <span className='fw-bolder me-25'>**No known allergies**</span>
                                                            </li>
                                                        )
                                                    }
                                                </ul>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className='info-container'>
                                                <ul className='list-unstyled'>
                                                    {allergies.filter(r => r.id != null).map((allergy, index) => (
                                                        index % 2 === 1 && (
                                                            <li className='mb-75' key={allergy.value}>
                                                                <span className='fw-bolder me-25'>{allergy.label}</span>
                                                            </li>
                                                        )
                                                    ))}
                                                </ul>
                                            </div>
                                        </Col>

                                    </Row>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <PatientEditPicture show={showPatientEditPicture} id={id} callback={changePictureCallback}></PatientEditPicture>
            <PatientEditProfile show={showEditProfile} formData={formData} closeCallback={closeProfileCallback}></PatientEditProfile>
            <PatientEditAllergies show={showAllergies} allergies={allergies} closeCallback={closeAllergiesDialog} callback={addOrRemoveAllergy}></PatientEditAllergies>
        </>
    )
}

export default PatientHeader