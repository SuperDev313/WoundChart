// ** React Imports
import React, { Fragment, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import useApi from "../../../../api/useApi";
import { showAlertError } from "../../../../components/alerts/AlertUtils";
import { ArrowLeft, ArrowRight } from "react-feather";
import EditWoundNotesTunneling from "../../../../components/edits/wound-notes/EditWoundNotesTunneling";
import UILoader from "../../../../components/ui-loader";
import { DefaultLoader } from "../../../../components/spinner/LoadingSpinner";
import * as alertUtils from "../../../../components/alerts/AlertUtils";
// ** Utils
import ChildDataTable from '../../../../components/datatables/ChildDataTable';
import { getFormatedDateFromISODate, dateToISOString } from "../../../../utility/Utils";
import {
    Button,
    Modal,
    ModalBody,
    ModalHeader,
    Row,
    Col,
    Card,
    CardBody,
    CardTitle,
    CardHeader,
} from "reactstrap";
import { ChevronDown, Edit, Trash } from 'react-feather'


const WoundNoteTunnelingStep = ({ stepper, callBack }) => {
    const { id, woundNoteId } = useParams();
    const [loading, setLoading] = useState(false);
    const [doNext, setDoNext] = useState(false);
    const [reload, setReload] = useState(false);
    const [open, setOpen] = useState(false);
    const url = `/wound_notes/${woundNoteId}/tunneling`
    const [formData, setFormData] = useState({
        id: "",
        position : "",
        distance : ""
    });


    const saveCallback = (data, isValid) => {
        const recordID = formData.id == "" ? 0: formData.id;
        console.log('formData, ', recordID)
        callBack(false);
        if (isValid) {
            callBack(true);
            useApi
                .doRun(( recordID == 0 ? "post" : "put"), `/wound_notes/${woundNoteId}/tunneling/` + recordID, {
                    position: data.position,
                    distance: isNaN(data.distance) ? null : parseInt(data.distance),
                })
                .then((res) => {
                    toast("WoundNote Saved Successfully!");
                    setReload(!reload)
                    callBack(false);
                })
                .catch((err) => {
                    callBack(false);
                    showAlertError(err);
                });

            stepper.next();
        }
        setDoNext(false)
    }

    const tooggleModal = () => {
        setOpen(!open);

    }

    const doAddRecord = () => {
        setFormData({
            id: "",
            position : "",
            distance : ""
        })
        tooggleModal();
    
    }

    
    const doEditRecord = (e, row) => {
        e.preventDefault();
        setFormData({
            id: row.id,
            position : row.position,
            distance : row.distance
        })
        tooggleModal();
    }

    const doDeleteRecord = (e, id) => {
        e.preventDefault();
        alertUtils.showDeleteDialog(
            () => {
                useApi
                    .delete(`/wound_notes/${woundNoteId}/tunneling/${id}`, {})
                    .then((res) => {
                        toast('Wound Tunneling deleted successfuly')
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
            name: "POSITION",
            selector: (row) => [row.position],
            column_name: "position",
            sortable: true,
        },
        {
            name: "DISTANCE",
            selector: (row) => [row.distance],
            column_name: "distance",
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
        <Fragment>
            {stepper &&
                <div className="content-header">
                    <h5 className="mb-0">Wound Tunnelling</h5>
                    <small className="text-muted">Enter the wound tunneling.</small>
                </div>
            }

            <Card>
                <CardHeader>
                    <CardTitle tag='h4'>WOUNDNOTE TUNNELING</CardTitle>
                    <Button color='primary' size='sm' onClick={doAddRecord}>
                        Add WoundNote Tunneling
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

            <div className="d-flex justify-content-between">
                <Button
                    type="button"
                    color="primary"
                    className="btn-prev"
                    onClick={() => stepper.previous()}
                >
                    <ArrowLeft
                        size={14}
                        className="align-middle me-sm-25 me-0"
                    ></ArrowLeft>
                    <span className="align-middle d-sm-inline-block d-none">
                        Previous
                    </span>
                </Button>
                <Button type="button" color="primary" className="btn-next" onClick={() => setDoNext(true)}>
                    <span className="align-middle d-sm-inline-block d-none">Next</span>
                    <ArrowRight
                        size={14}
                        className="align-middle ms-sm-25 ms-0"
                    ></ArrowRight>
                </Button>
            </div>

            <Modal
                isOpen={open}
                className="modal-dialog-centered modal-lg"
                toggle={tooggleModal}
            >
                <UILoader blocking={loading} loader={<DefaultLoader />}>
                    <ModalHeader
                        className="bg-transparent"
                        toggle={tooggleModal}
                    ></ModalHeader>
                    <ModalBody className="px-5 pb-5">
                        <div className='text-center mb-4'>
                            <h1>Add New Wound Notes Tunneling</h1>
                            <p>Enter the values to continue</p>
                        </div>

                        <EditWoundNotesTunneling callBack={saveCallback} doSubmit={doNext} formData={formData}></EditWoundNotesTunneling>

                        <Button type="button" className="me-1" color="primary" onClick={() => setDoNext(true)}>
                            Submit
                        </Button>
                        <Button
                            type="reset"
                            color="secondary"
                            outline
                            onClick={tooggleModal}
                        >
                            Cancel
                        </Button>
                    </ModalBody>
                </UILoader>
            </Modal>

        </Fragment>
    );
};

export default WoundNoteTunnelingStep;
