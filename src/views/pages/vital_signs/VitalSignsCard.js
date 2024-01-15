import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Edit, Trash } from 'react-feather'
import { formattedDate } from "@utils";

import useApi from "../../../api/useApi";
import PatientVitalSignDialog from "./PatientVitalSignDialog";
import ChildDataTable from '../../../components/datatables/ChildDataTable';
import * as alertUtils from "../../../components/alerts/AlertUtils";

import {
    Button,
    Card,
    CardHeader,
    CardTitle,
} from "reactstrap";


const VitalSignsCard = () => {
    const { id } = useParams();
    const [editOpen, setEditOpen] = useState(false);
    const [reload, setReload] = useState(false);
    const [recordId, setRecordId] = useState(0);

    const url = `/patients/${id}/patient_vital_signs`

    const doTogglePopup = () => {
        setEditOpen(!editOpen);
        if(editOpen){
            setRecordId(0);
        }
    };

    const doHandleSaveAndClosePopup = (recordId) => {
        setReload(!reload);
        doTogglePopup();

    }

    const doEditRecord = (e, rowId) => {
        e.preventDefault();
        setRecordId(rowId);
        setEditOpen(!editOpen);
    }

    const doDeleteRecord = (e, recordId) => {
        alertUtils.showDeleteDialog(
            () => {
                useApi
                    .delete(`/patients/${id}/patient_vital_signs/${recordId}`, {})
                    .then((res) => {
                        toast('Record deleted successfuly')
                        setReload(!reload)
                    })
                    .catch((err) => {
                        // alertUtils.showAlertError(err);
                    });
            }
        )
    }

    const columns = [
 
        {
            name: "Data DATE",
            selector: (row) => [formattedDate(row.data_date)],
            column_name: "data_date",
            sortable: true,
        },
        {
            name: "TEMPERATURE",
            selector: (row) => [row.temperature],
            column_name: "temperature",
            sortable: true,
        },
        {
            name: "PULSE",
            selector: (row) => [row.pulse],
            column_name: "pulse",
            sortable: true,
        },

        {
            name: "RESPIRATORY RATE",
            selector: (row) => [row.respiratory_rate],
            column_name: "respiratory_rate",
            sortable: true,
        },
        {
            name: "BLOOD PRESSURE SYSTOLIC",
            selector: (row) => [row.blood_pressure_systolic],
            column_name: "blood_pressure_systolic",
            sortable: true,
        },
        {
            name: "BLOOD PRESSURE DIASTOLIC",
            selector: (row) => [row.blood_pressure_diastolic],
            column_name: "blood_pressure_diastolic",
            sortable: true,
        },
        {
            name: "OXIGEN SATURATION",
            selector: (row) => [row.oxigen_saturation],
            column_name: "oxigen_saturation",
            sortable: true,
        },
        {
            name: "BLOOD GLUCOSE",
            selector: (row) => [row.blood_glucose],
            column_name: "blood_glucose",
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
                    <CardTitle tag='h4'>Patient Vital Sign</CardTitle>
                    <div className='d-flex mt-md-0 mt-1'>
                        <Button className='ms-2' color='primary' onClick={doTogglePopup}>
                            <Plus size={15} />
                            <span className='align-middle ms-50'>Add Assessment</span>
                        </Button>
                    </div>
                </CardHeader>
                <div className='react-dataTable'>
                    <ChildDataTable columns={columns} url={url} reload={reload} />
                    <PatientVitalSignDialog
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

export default VitalSignsCard;