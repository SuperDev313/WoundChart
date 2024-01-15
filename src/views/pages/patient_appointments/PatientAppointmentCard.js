

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash } from 'react-feather'
import { formattedDate } from "@utils";


import useApi from "../../../api/useApi";
import PatientAppointmentDialog from "./PatientAppointmentDialog";
import ChildDataTable from '../../../components/datatables/ChildDataTable';
import * as alertUtils from "../../../components/alerts/AlertUtils";

import {
    Button,
    Card,
    CardHeader,
    CardTitle,
} from "reactstrap";


const PatientAppointmentCard = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [editOpen, setEditOpen] = useState(false);
    const [reload, setReload] = useState(false);
    const [recordId, setRecordId] = useState(0);

    const url = `/patients/${id}/appointments`

    const doTogglePopup = () => {
        setEditOpen(!editOpen);
        if (editOpen) {
            setRecordId(0);
        }
    };

    const doHandleSaveAndClosePopup = (rowId) => {
        setReload(!reload);
        doTogglePopup();

    }

    const doEditRecord = (e, rowId) => {
        e.preventDefault();
        setEditOpen(!editOpen);
        setRecordId(rowId);

    }

    const doDeleteRecord = (e, rowId) => {
        alertUtils.showDeleteDialog(
            () => {
                useApi
                    .delete(`/patients/${id}/appointments/${rowId}`, {})
                    .then((res) => {
                        toast('Record deleted successfuly')
                        setReload(true)
                    })
                    .catch((err) => {
                        // alertUtils.showAlertError(err);
                    });
            }
        )
    }

    const columns = [

        {
            name: "DOCTOR NAME",
            selector: (row) => [row.doctor_name],
            column_name: "doctor_name",
            sortable: true,
        },
        {
            name: "APPOINTMENT DATE",
            selector: (row) => [row.appointment_date],
            column_name: "appointment_date",
            sortable: true,
        },
        {
            name: "RESCHEDULE DATE",
            selector: (row) => [row.reschedule_date],
            column_name: "reschedule_date",
            sortable: true,
        },
        {
            name: "RESCHEDULE REAZON ID",
            selector: (row) => [row.reschedule_reazon_id],
            column_name: "reschedule_reazon_id",
            sortable: true,
        },
        {
            name: "APPOINTMENT PURPOSE ID",
            selector: (row) => [row.appointment_purpose_id],
            column_name: "appointment_purpose_id",
            sortable: true,
        },
        {
            name: "APPOINTMENT STATUS ID",
            selector: (row) => [row.appointment_status_id],
            column_name: "appointment_status_id",
            sortable: true,
        },
        {
            name: "Actions",
            maxWidth: "120px",
            cell: (row) => (
                <div className="column-action d-flex align-items-center">
                    <div className='d-flex align-items-center permissions-actions'>
                        <Button size='sm' color='transparent' className='btn btn-icon' onClick={(e) => doEditRecord(e, row.id)}>
                            <Edit className='font-medium-2' />
                        </Button>
                        <Button
                            size='sm'
                            color='transparent'
                            className='btn btn-icon'
                            onClick={(e) => doDeleteRecord(e, row.id)}
                        >
                            <Trash className='font-medium-2' />
                        </Button>
                    </div>

                </div>
            ),
        },
    ]

    return (
        <>
            <Card>
                <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
                    <CardTitle tag='h4'>Patient Appointment</CardTitle>
                    <div className='d-flex mt-md-0 mt-1'>
                        <Button className='ms-2' color='primary' onClick={doTogglePopup}>
                            <Plus size={15} />
                            <span className='align-middle ms-50'>Add Record</span>
                        </Button>
                    </div>
                </CardHeader>
                <div className='react-dataTable'>
                    <ChildDataTable columns={columns} url={url} reload={reload} />
                    <PatientAppointmentDialog
                        open={editOpen}
                        doTogglePopup={doTogglePopup}
                        recordId={recordId}
                        doHandleSaveAndClosePopup={doHandleSaveAndClosePopup}
                    />
                </div>
            </Card>
        </>
    )
}

export default PatientAppointmentCard;