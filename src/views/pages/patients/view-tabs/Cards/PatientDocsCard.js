import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import useApi from '../../../../../api/useApi';

import { Edit, Trash } from 'react-feather';
import {
    Row,
    Col,
    Card,
    Button,
    CardBody,
    CardTitle,
    CardHeader,
} from 'reactstrap';
import * as alertUtils from '../../../../../components/alerts/AlertUtils';

import ChildDataTable from '../../../../../components/datatables/ChildDataTable';
import PatientDocDialog from '../../edit/PatientDocDialog';

const PatientDocsCard = () => {
    const { id } = useParams();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [reload, setReload] = useState(false);
    const [documentFormData, setDocumentFormData] = useState({
        id: '',
        document_title: '',
        document_file: '',
    });

    const url = `/patients/${id}/docs`;

    const doAddRecord = () => {
        setSidebarOpen(!sidebarOpen);
        if (sidebarOpen) {
            setDocumentFormData({
                id: '',
                document_title: '',
                document_file: '',
            });
        }
    };

    const doTogglePopup = () => {
        setSidebarOpen(!sidebarOpen);
        if (sidebarOpen) {
            setDocumentFormData({
                id: '',
                document_title: '',
                document_file: '',
            });
        }
    };

    const doReloadTable = () => {
        setReload(!reload);
        setSidebarOpen(!sidebarOpen);
    };

    const doEditRecord = (e, row) => {
        e.preventDefault();
        setDocumentFormData({
            id: row.id,
            document_title: row.document_title,
            document_file: row.document_file,
        });
        setSidebarOpen(!sidebarOpen);
    };

    const doDeleteRecord = (e, id) => {
        e.preventDefault();
        alertUtils.showDeleteDialog(() => {
            useApi
                .delete(`${url}/docs/${id}`, {})
                .then((res) => {
                    toast('Document deleted successfully');
                    setReload(!reload);
                })
                .catch((err) => {
                    alertUtils.showAlertError(err);
                });
        });
    };

    const columns = [
        {
            name: 'Document',
            selector: (row) => [row.document_file],
            column_name: 'document_file',
            sortable: true,
        },
        {
            name: 'Actions',
            width: '150px',
            cell: (row) => (
                <div className="column-action d-flex align-items-center">
                    <div className="d-flex align-items-center permissions-actions">
                        <Button
                            size="sm"
                            color="transparent"
                            className="btn btn-icon"
                            onClick={(e) => doDeleteRecord(e, row.id)}
                        >
                            <Trash className="font-medium-2" />
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
                    <CardTitle tag="h4">Documents</CardTitle>
                    <Button color="primary" size="sm" onClick={doAddRecord}>
                        Add Document
                    </Button>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col xl="12" xs="12">
                            {/* <ChildDataTable columns={columns} url={url} reload={reload} /> */}
                        </Col>
                    </Row>
                </CardBody>
            </Card>
            <PatientDocDialog
                open={sidebarOpen}
                doTogglePopup={doTogglePopup}
                formData={documentFormData}
                doHandleSaveAndClosePopup={doReloadTable}
            />
        </>
    );
};

export default PatientDocsCard;
