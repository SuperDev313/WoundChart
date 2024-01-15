

import React, { useEffect, useState } from "react";

import useApi from "../../../../api/useApi";
import UILoader from "../../../../components/ui-loader";
import { DefaultLoader } from "../../../../components/spinner/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import classnames from "classnames";
import {
    Table,
    Card,
    Row,
    Col,
    Button,
    Badge
} from "reactstrap";

import { ChevronDown, Edit, Trash } from 'react-feather'


import { showAlertError } from "../../../../components/alerts/AlertUtils";
import { getDateFromISODate, getFormatedDateAsyyyyMMdd } from "../../../../utility/Utils";

export default function PatientNotesTableDetails({ id, date }) {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    React.useEffect(() => {
        setLoading(true);
        useApi
            .get(`/patients/${id}/notes/${date}`, {})
            .then((res) => {
                setData(res.data.data)
                setLoading(false);

            })
            .catch((err) => {
                showAlertError(err);
                setLoading(false);
            });

    }, []);

    const doEditRecord = (e, noteId) => {
        e.preventDefault();
        navigate(`/patients/${id}/wound-notes/${noteId}/view`);
    }


    const doPrintRecord = (e, noteId) => {
        e.preventDefault();

        setLoading(true);
        useApi
            .downloadFile(`/reports/wound_notes/1`)
            .then(response => {
                const file = new Blob(
                    [response.data],
                    { type: 'application/pdf' });

                const fileURL = URL.createObjectURL(file);//Open the URL on new Window
                window.open(fileURL);
            })
            .catch((err) => {
                console.log(err)
                showAlertError(err);
                setLoading(false);
            });


    }
    return (
        <UILoader blocking={loading} loader={<DefaultLoader />}>
            <div className='expandable-content p-2'>

                <Row>
                    <Col lg='6' className='mt-2 mt-lg-0'>
                        <div className='added-cards'>
                            {data.map((list, index) => {
                                const isLastCard = index === data[data.length - 1]
                                return (
                                    <>

                                        <div
                                            key={index}
                                            className={classnames('cardMaster rounded border p-2', {
                                                'mb-1': !isLastCard
                                            })}
                                        >
                                            <div className='d-flex justify-content-between flex-sm-row flex-column'>
                                                <table className="table  text-nowrap text-md-nowrap mg-b-0">
                                                    <tr>
                                                        <td>ID:  {list.id}</td>
                                                        <td><h6 className='mb-0'>Date: {getFormatedDateAsyyyyMMdd(list.visit_date)}</h6></td>
                                                        <td>
                                                            <div className='d-flex align-items-center mt-2'>
                                                                <Badge color='light-primary' className='ms-50'>
                                                                    Trajectory: {list.trajectory}
                                                                </Badge>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan={2}>Clinician Name:  {list.clinician_name}</td>
                                                        <td></td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan={3}>Wound Location: {list.gwn_wound_location}</td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan={2}>Wound Type: {list.gwn_wound_type}</td>

                                                        <td>

                                                        </td>
                                                    </tr>
                                                    <tr rowspan="2">
                                                        <Button outline color='primary' className='me-75' onClick={(e) => doEditRecord(e, list.id)}>
                                                            Follow Up
                                                        </Button>
                                                        <Button outline color='primary' className='me-75' onClick={(e) => doEditRecord(e, list.id)}>
                                                            Edit
                                                        </Button>
                                                        <Button outline color='primary' className='me-75' onClick={(e) => doPrintRecord(e, list.id)}>
                                                            Print
                                                        </Button>
                                                        <Button outline>Delete</Button>
                                                    </tr>
                                                </table>
                                            </div>
                                        </div>
                                    </>

                                )
                            })}
                        </div>
                    </Col>
                </Row>


            </div>
        </UILoader>
    );
}



