// ** React Imports
import { Fragment, useState } from 'react'
import toast from "react-hot-toast"
import useApi from "../../../../api/useApi"

import { ChevronDown, Edit, Trash } from 'react-feather'
import {
    Row,
    Col,
    Card,
    Button,
    CardBody,
    CardTitle,
    CardHeader

} from 'reactstrap'
import * as alertUtils from "../../../../components/alerts/AlertUtils"

import ChildDataTable from '../../../../components/datatables/ChildDataTable'
import WoundNotesFistulaDialog from '../dialogs/WoundNotesFistulaDialog'

const WoundNoteFistulaCard = ({ formData }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [reload, setReload] = useState(false)
    const [fistulaFormData, setFistulaFormData] = useState({
        id: "",
        position : "",
        distance : ""
    })

    const url = `/wound_notes/${formData.id}/fistula`

    const doAddRecord = () => {
        setSidebarOpen(!sidebarOpen)
        if (sidebarOpen) {
            setFistulaFormData({
                id: "",
                position : "",
                distance : ""
            })
        }
    }

    const doTogglePopup = () => {
        setSidebarOpen(!sidebarOpen)
        if (sidebarOpen) {
            setFistulaFormData({
                id: "",
                position : "",
                distance : ""
            })
        }
    }

    const doReloadTable = () => {
        setReload(!reload)
        setSidebarOpen(!sidebarOpen)
    }

    const doEditRecord = (e, row) => {
        e.preventDefault()
        setFistulaFormData({
            id: row.id,
            position : row.position,
            distance : row.distance
        })
        setSidebarOpen(!sidebarOpen)
    }

    const doDeleteRecord = (e, id) => {
        e.preventDefault()
        alertUtils.showDeleteDialog(
            () => {
                useApi
                    .delete(`/wound_notes/${formData.id}/fistula/${id}`, {})
                    .then((res) => {
                        toast('Wound Fistula deleted successfuly')
                        setReload(!reload)
                        console.log(res)
                    })
                    .catch((err) => {
                        alertUtils.showAlertError(err)
                    })
            }
        )
    }

    const columns = [
        {
            name: "POSITION",
            selector: (row) => [row.position],
            column_name: "position",
            sortable: true
        },
        {
            name: "DISTANCE",
            selector: (row) => [row.distance],
            column_name: "distance",
            sortable: true
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
            )
        }
    ]

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle tag='h4'>WOUND NOTE FISTULA</CardTitle>
                    <Button color='primary' size='sm' onClick={doAddRecord}>
                        Add Wound Note Fistula
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
            <WoundNotesFistulaDialog
                open={sidebarOpen}
                doTogglePopup={doTogglePopup}
                recordId={formData.id}
                formData={fistulaFormData}
                doHandleSaveAndClosePopup={doReloadTable}
            />
        </>
    )
}

export default WoundNoteFistulaCard