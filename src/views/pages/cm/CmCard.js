import React, { Fragment, useState, useEffect } from "react";
// ** Reactstrap Imports
import { Button, Form, Input, Row, Col, Card } from 'reactstrap';

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin';

// ** Illustrations Imports
import illustrationsLight from '@src/assets/images/pages/coming-soon.svg';
import illustrationsDark from '@src/assets/images/pages/coming-soon-dark.svg';
import Breadcrumbs from "@components/breadcrumbs";
import CmSearch from "./CmSearch";
import {  FaUserCheck, FaUser, FaUserClock, FaHospitalUser, FaPersonWalkingArrowLoopLeft, FaPersonWalking } from "react-icons/fa6";
import { Woman } from 'healthicons-react/dist/filled'

// ** Styles
import '@styles/base/pages/page-misc.scss';
import "@styles/react/libs/tables/react-dataTable-component.scss";

const CmCard = () => {
    // ** Hooks
    const { skin } = useSkin();
    const source = skin === 'dark' ? illustrationsDark : illustrationsLight;

    return (
        <>
            <Breadcrumbs title='Case Monitoring' data={[{ title: 'Case Monitoring' }]} page='cm'/>
            <CmSearch />
        </>
    )

}

export default CmCard;