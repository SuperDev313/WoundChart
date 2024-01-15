// ** React Imports
import React, { Fragment, useState } from "react";
import { useParams } from "react-router-dom";

import useApi from "../../../../api/useApi";
import { showAlertError } from "../../../../components/alerts/AlertUtils";
import { ArrowLeft, ArrowRight } from "react-feather";
import EditWoundNoteEdges from "../../../../components/edits/wound-notes/EditWoundNoteEdges";
import { getFormatedDateFromISODate, dateToISOString } from "../../../../utility/Utils";
import {
    Button,
} from "reactstrap";

const WoundNoteEdgeStep = ({ stepper, callBack }) => {
    const { id, woundNoteId } = useParams();
    const [doNext, setDoNext] = useState(false);

    const saveCallback = (data, isValid) => {
        callBack(false);
        if (isValid) {
            callBack(true);
            useApi
            .doRun("post", `/wound_notes/${woundNoteId}/edge`, {
                id: woundNoteId,
                wound_edges_irregular: data.wound_edges_irregular,
                wound_edges_epibole: data.wound_edges_epibole,
                wound_edges_well: data.wound_edges_well,
                wound_edges_good: data.wound_edges_good,
                wound_edges_hyperkeratosis: data.wound_edges_hyperkeratosis,
                wound_edges_fibrotic: data.wound_edges_fibrotic,
                wound_edges_not_deter: data.wound_edges_not_deter,


            })
                .then((res) => {
                    toast("WoundNote Saved Successfully!");
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


    return (
        <Fragment>
            {stepper &&
                <div className="content-header">
                    <h5 className="mb-0">Wound Edges</h5>
                    <small className="text-muted">Select the appropriate wound edges.</small>
                </div>
            }
            <EditWoundNoteEdges callBack={saveCallback} doSubmit={doNext}></EditWoundNoteEdges>

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
        </Fragment>
    );
};

export default WoundNoteEdgeStep;
