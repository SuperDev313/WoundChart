// ** React Imports
import React, { Fragment, useState } from "react";
import { useParams } from "react-router-dom";

import useApi from "../../../../api/useApi";
import { showAlertError } from "../../../../components/alerts/AlertUtils";
import { ArrowLeft, ArrowRight } from "react-feather";
import EditWoundNoteDeveloped from "../../../../components/edits/wound-notes/EditWoundNoteDeveloped";
import { getFormatedDateFromISODate, dateToISOString } from "../../../../utility/Utils";
import {
    Button,
} from "reactstrap";

const WoundNoteDevelopedStep = ({ stepper, callBack }) => {
    const { id, woundNoteId } = useParams();
    const [doNext, setDoNext] = useState(false);

    const saveCallback = (data, isValid) => {
        if (isValid) {
            callBack(true);
            useApi
                .doRun("post", `/wound_notes/${woundNoteId}/wounddeveloped`, {
                    id: woundNoteId,
                    date_wound_developed: dateToISOString(new Date(data.date_wound_developed)),
                    wound_at_facility: data.wound_at_facility,
                    wound_recurrence: data.wound_recurrence,

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
                    <h5 className="mb-0">Wound Developed Date</h5>
                    <small className="text-muted">Enter details about the wound development.</small>
                </div>
            }
            <EditWoundNoteDeveloped callBack={saveCallback} doSubmit={doNext}></EditWoundNoteDeveloped>

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

export default WoundNoteDevelopedStep;
