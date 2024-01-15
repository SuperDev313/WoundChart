// ** React Imports
import React, { Fragment, useState } from "react";
import { useParams } from "react-router-dom";

import useApi from "../../../../api/useApi";
import { showAlertError } from "../../../../components/alerts/AlertUtils";
import { ArrowLeft, ArrowRight } from "react-feather";
import EditWoundNoteMeasurement from "../../../../components/edits/wound-notes/EditWoundNoteMeasurement";
import { getFormatedDateFromISODate, dateToISOString } from "../../../../utility/Utils";
import {
    Button,
} from "reactstrap";

const WoundNoteMeasurementStep = ({ stepper, callBack }) => {
    const { id, woundNoteId } = useParams();
    const [doNext, setDoNext] = useState(false);

    const saveCallback = (data, isValid) => {
        callBack(false);
        if (isValid) {
            callBack(true);
            useApi
            .doRun("post", `/wound_notes/${woundNoteId}/measurement`, {
                id: woundNoteId,
                wound_length: isNaN(data.wound_length) ? null : parseFloat(data.wound_length),
                wound_width: isNaN(data.wound_width) ? null : parseFloat(data.wound_width),
                wound_depth: isNaN(data.wound_depth) ? null : parseFloat(data.wound_depth),
                wound_lxw: isNaN(data.wound_lxw) ? null : parseFloat(data.wound_lxw),
                wound_lxwxd: isNaN(data.wound_lxwxd) ? null : parseFloat(data.wound_lxwxd),

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
                    <h5 className="mb-0">Wound measurement</h5>
                    <small className="text-muted">Enter the measurement information.</small>
                </div>
            }
            <EditWoundNoteMeasurement callBack={saveCallback} doSubmit={doNext}></EditWoundNoteMeasurement>

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

export default WoundNoteMeasurementStep;
