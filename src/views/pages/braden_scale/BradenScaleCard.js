import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Edit, Trash } from 'react-feather'
import { formattedDate } from "@utils";


import useApi from "../../../api/useApi";
import PatientBradenScaleScoreEvaluationDialog from "./PatientBradenScaleScoreEvaluationDialog";
import ChildDataTable from '../../../components/datatables/ChildDataTable';
import * as alertUtils from "../../../components/alerts/AlertUtils";

import {
    Button,
    Card,
    CardHeader,
    CardTitle,
} from "reactstrap";


const BradenScaleCard = () => {
    const { id } = useParams();
    const [editOpen, setEditOpen] = useState(false);
    const [reload, setReload] = useState(false);
    const [recordId, setRecordId] = useState(0);

    const url = `/patients/${id}/patient_braden_scale_score_evaluation`

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

    const doEditRecord = (e, recordId) => {
        e.preventDefault();
        setRecordId(recordId);
        setEditOpen(!editOpen);
    }

    const doDeleteRecord = (e, recordId) => {
        alertUtils.showDeleteDialog(
            () => {
                useApi
                    .delete(`/patients/${id}/patient_braden_scale_score_evaluation/${recordId}`, {})
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
            name: "Data DATE",
            selector: (row) => [formattedDate(row.data_date)],
            column_name: "data_date",
            sortable: true,
        },
        {
            name: "Doctor",
            selector: (row) => [row.created_by],
            column_name: "created_by",
            sortable: true,
        },
        {
            name: "SCORE",
            selector: (row) => [row.score],
            column_name: "score",
            sortable: true,
        },
        {
            name: "PREDICTION",
            selector: (row) => [row.prediction],
            column_name: "prediction",
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
                    <CardTitle tag='h4'>Braden Scale Score Evaluation </CardTitle>
                    <div className='d-flex mt-md-0 mt-1'>
                        <Button className='ms-2' color='primary' onClick={doTogglePopup}>
                            <Plus size={15} />
                            <span className='align-middle ms-50'>Add Assessment</span>
                        </Button>
                    </div>
                </CardHeader>
                <div className='react-dataTable'>
                    <ChildDataTable columns={columns} url={url} reload={reload} />
                    <PatientBradenScaleScoreEvaluationDialog
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

export default BradenScaleCard;