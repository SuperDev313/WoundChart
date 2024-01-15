import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { formattedDate } from "@utils";
import SOCDetailsDialog from "../../../socs/dialogs/SOCDetailsDialog";
import ChildDataTable from '../../../../../components/datatables/ChildDataTable';
import {
    Button,
    Card,
    CardHeader,
    CardTitle,
} from "reactstrap";

import { Plus, Edit, Trash } from 'react-feather'

const SocCard = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [socEditOpen, setSocEditOpen] = useState(false);

    const url = `/patients/${id}/soc`

    const doTogglePopup = () => {
        setSocEditOpen(!socEditOpen);
        // if (socEditOpen) {
        //     setId(0);
        // }
    };

    const doHandleSaveAndClosePopup = (recordId) => {
        if (id > 0) {
            navigate(`/patients/${id}/socs/${recordId}`);
        }
    }

    const doEditRecord = (e, recordId) => {
        navigate(`/patients/${id}/socs/${recordId}`);
    }

    const columns = [
        {
            name: "ID",
            selector: (row) => [row.id],
            column_name: "id",
            sortable: true,
        },
        {
            name: "Clinician",
            selector: (row) => [row.clientcian],
            column_name: "clinician",
            sortable: true,
        },
        {
            name: "Date of Visit",
            selector: (row) => [row.date_visit],
            column_name: "data_visit",
            sortable: true,
        },
        {
            name: "Wound Type",
            selector: (row) => [row.wound_type],
            column_name: "wound_type",
            sortable: true,
        },
        {
            name: "Location",
            selector: (row) => [row.location],
            column_name: "location",
            sortable: true,
        },
        {
            name: "Trajectory",
            selector: (row) => [row.trajectory],
            column_name: "trajectory",
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
                    <CardTitle tag='h4'>Start of Care Evaluations</CardTitle>
                    <div className='d-flex mt-md-0 mt-1'>
                        <Button className='ms-2' color='primary' onClick={doTogglePopup}>
                            <Plus size={15} />
                            <span className='align-middle ms-50'>Add New Evaluation</span>
                        </Button>
                    </div>
                </CardHeader>
                <div className='react-dataTable'>
                    <ChildDataTable columns={columns} url={url} reload={() => { }} />
                    <SOCDetailsDialog
                        open={socEditOpen}
                        doTogglePopup={doTogglePopup}
                        recordId={id}
                        doHandleSaveAndClosePopup={doHandleSaveAndClosePopup}
                    />
                </div>
            </Card>
        </>
    )
}

export default SocCard;