
import { Fragment, useState } from 'react'
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import useApi from "../../../../../api/useApi";

import { Edit, Trash } from 'react-feather'
import {
    Row,
    Col,
    Card,
    Button,
    CardBody,
    CardTitle,
    CardHeader,

} from 'reactstrap'
import * as alertUtils from "../../../../../components/alerts/AlertUtils";

import ChildDataTable from '../../../../../components/datatables/ChildDataTable';
import PatientDrugDialog from '../../edit/PatientDrugDialog';

const PatientDrugCard = () => {

    const { id } = useParams();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [reload, setReload] = useState(false);
    const [tunnelingFormData, setTunnelingFormData] = useState({
        id: "",
        drug_id: "",
    });

    const url =  `/patients/${id}/drugs`

    const doAddRecord = () => {
        setSidebarOpen(!sidebarOpen);
        if (sidebarOpen) {
            setTunnelingFormData({
                id: "",
                drug_id: "",
            })
        }
    };

    const doTogglePopup = () => {
        setSidebarOpen(!sidebarOpen);
        if (sidebarOpen) {
            setTunnelingFormData({
                id: "",
                drug_id: "",
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
            drug_id: row.drug_id,
            drug_id_description: row.drug_id_description
        })
        setSidebarOpen(!sidebarOpen);
    }

    const doDeleteRecord = (e, id) => {
        e.preventDefault();
        alertUtils.showDeleteDialog(
            () => {
                useApi
                    .delete(`${url}/${id}`, {})
                    .then((res) => {
                        toast('Record deleted successfuly')
                        setReload(!reload)
                    })
                    .catch((err) => {
                         alertUtils.showAlertError(err);
                    });
            }
        )
    }

    const columns = [
        {
            name: "Medicine",
            selector: (row) => [row.drug_id_description],
            column_name: "drug_id_description",
            sortable: true,
        },
        {
            name: "Actions",
            width: "150px",
            cell: (row) => (
                <div className="column-action d-flex align-items-center">
                    <div className='d-flex align-items-center permissions-actions'>
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
                    <CardTitle tag='h4'>Medicines</CardTitle>
                    <Button color='primary' size='sm' onClick={doAddRecord}>
                        Add Drug
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
            <PatientDrugDialog
                open={sidebarOpen}
                doTogglePopup={doTogglePopup}
                formData={tunnelingFormData}
                doHandleSaveAndClosePopup={doReloadTable}
            />
        </>
    )
}

export default PatientDrugCard;
