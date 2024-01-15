
// ** React Imports
import { Fragment, useState } from 'react'
import toast from "react-hot-toast";
import useApi from "../../../../api/useApi";

import { ChevronDown, Edit, Trash } from 'react-feather'
import {
    Row,
    Col,
    Card,
    Button,
    CardBody,
    CardTitle,
    CardHeader,

} from 'reactstrap'
import * as alertUtils from "../../../../components/alerts/AlertUtils";

import ChildDataTable from '../../../../components/datatables/ChildDataTable';
import WoundNotesCleanserDialog from '../dialogs/WoundNotesCleanserDialog';

export default function WoundNotesCleanserCard({ formData }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [reload, setReload] = useState(false);
    const [tunnelingFormData, setTunnelingFormData] = useState({
        id: "",
        product_id: "",
        product_id_product_name: "",
    });

    const url = `/wound_notes/${formData.id}/wound_notes_cleansers`


    const doTogglePopup = () => {
        setSidebarOpen(!sidebarOpen);
        if (sidebarOpen) {
            setTunnelingFormData({
                id: "",
                product_id: "",
                product_id_product_name: "",
            })
        }
    };


    const doReloadTable = () => {
        setReload(!reload);
        setSidebarOpen(!sidebarOpen);
    };


    const doEditRecord = (e, row) => {
        e.preventDefault();
        setTunnelingFormData({
            id: row.id,
            product_id: row.product_id,
            product_id_product_name: row.product_id_product_name,
        })
        setSidebarOpen(!sidebarOpen);
    }


    const doDeleteRecord = (e, id) => {
        e.preventDefault();
        alertUtils.showDeleteDialog(
            () => {
                useApi
                    .delete(`/wound_notes/${formData.id}/wound_notes_cleansers/${id}`, {})
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
            name: "PRODUCT ID",
            selector: (row) => [row.product_id_product_name],
            column_name: "product_name",
            sortable: true,
        },
        {
            name: "Actions",
            maxWidth: "120px",
            cell: (row) => (
                <div className="column-action d-flex align-items-center">
                    <div className='d-flex align-items-center permissions-actions'>
                        <Button size='sm' color='transparent' className='btn btn-icon' onClick={(e) => doEditRecord(e, row)}>
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
    ];

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle tag='h4'>WOUND NOTES CLEANSER</CardTitle>
                    <Button color='primary' size='sm' onClick={doTogglePopup}>
                        Add wound notes cleansers
                    </Button>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col xl='12' xs='12'>
                            <ChildDataTable columns={columns} url={url} reload={reload} />
                        </Col>

                    </Row>
                </CardBody>
            </Card>
            <WoundNotesCleanserDialog
                open={sidebarOpen}
                doTogglePopup={doTogglePopup}
                recordId={formData.id}
                formData={tunnelingFormData}
                doHandleSaveAndClosePopup={doReloadTable}
            />
        </>
    );
}




