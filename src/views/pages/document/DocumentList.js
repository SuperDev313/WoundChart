import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import useApi from '../../../api/useApi';
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
import * as alertUtils from '../../../components/alerts/AlertUtils';
import ChildDataTable from '../../../components/datatables/ChildDataTable';
import Breadcrumbs from '@components/breadcrumbs';
import PatientDocumentsViewDialog from './DocumentDialog';

const DocumentList = () => {
    
    const url = `/data/patient_files`;
    const [editOpen, setEditOpen] = useState(false);
    const [reload, setReload] = useState(false);
    const [recordId, setRecordId] = useState(0);


    const doTogglePopup = () => {
        setEditOpen(!editOpen);
        if(editOpen){
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
            .delete(`/files/${rowId}`, {})
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
            name: 'Patient Name',
            selector: (row) => [row.full_name],
            column_name: 'full_name',
            sortable: true,
        },
        {
            name: 'Document',
            selector: (row) => [row.file_url],
            column_name: 'file_url',
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
            <Breadcrumbs title='View Documents' data={[{ title: 'View Documents' }]} />

            <Card>
                <CardHeader>
                    <CardTitle tag="h4">Documents</CardTitle>
                    <Button color="primary" size="sm" onClick={doTogglePopup}>
                        Add Document
                    </Button>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col xl="12" xs="12">
                            <ChildDataTable columns={columns} url={url} reload={reload} />
                        </Col>
                    </Row>
                </CardBody>
            </Card>

            <PatientDocumentsViewDialog
                open={editOpen}
                doTogglePopup={doTogglePopup}
                recordId={recordId}
                doHandleSaveAndClosePopup={doHandleSaveAndClosePopup}
            />
        </>
    );
};

export default DocumentList;
