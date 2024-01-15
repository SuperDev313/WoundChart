import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash } from 'react-feather'
import { formattedDate } from "@utils";


import useApi from "../../../api/useApi";
import MessageDialog from "./MessageDialog";
import ChildDataTable from '../../../components/datatables/ChildDataTable';
import * as alertUtils from "../../../components/alerts/AlertUtils";

import {
    Button,
    Card,
    CardHeader,
    CardTitle,
} from "reactstrap";


const MessageSearch = () => {
    const navigate = useNavigate();
    const [editOpen, setEditOpen] = useState(false);
    const [reload, setReload] = useState(false);
    const [recordId, setRecordId] = useState(0);

    const url = `/all_messages`

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
        setRecordId(rowId);
        setEditOpen(!editOpen);
    }

    const doDeleteRecord = (e, rowId) => {
        alertUtils.showDeleteDialog(
            () => {
                useApi
                    .delete(`/all_messages/${rowId}`, {})
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
            name: "CLINIC ID",
            selector: (row) => [row.clinic_id],
            column_name: "clinic_id",
            sortable: true,
        },
        {
            name: "MESSAGE",
            selector: (row) => [row.message],
            column_name: "message",
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
                    <CardTitle tag='h4'>messages</CardTitle>
                    <div className='d-flex mt-md-0 mt-1'>
                        <Button className='ms-2' color='primary' onClick={doTogglePopup}>
                            <Plus size={15} />
                            <span className='align-middle ms-50'>Add Record</span>
                        </Button>
                    </div>
                </CardHeader>
                <div className='react-dataTable'>
                    <ChildDataTable columns={columns} url={url} reload={reload} />
                    <MessageDialog
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

export default MessageSearch;