// ** React Imports
import React, { Fragment, useState } from "react";
import { useParams } from "react-router-dom";

import useApi from "../../../../api/useApi";
import { showAlertError } from "../../../../components/alerts/AlertUtils";
import { ArrowLeft, ArrowRight } from "react-feather";
import EditWoundNoteTreatment from "../../../../components/edits/wound-notes/EditWoundNoteTreatment";
import { getFormatedDateFromISODate, dateToISOString } from "../../../../utility/Utils";
import {
    Button,
} from "reactstrap";

const WoundNoteTreatmentStep = ({ stepper, callBack }) => {
    const { id, woundNoteId } = useParams();
    const [doNext, setDoNext] = useState(false);

    const saveCallback = (data, isValid) => {
        callBack(false);
        if (isValid) {
            callBack(true);
            useApi
                .doRun("post", `/wound_notes/${woundNoteId}/treatment`, {
                    id: woundNoteId,
                    tod_autolytic: data.tod_autolytic,
                    tod_enzymatic: data.tod_enzymatic,
                    tod_mechanical: data.tod_mechanical,
                    tod_sharp: data.tod_sharp,
                    tod_biological: data.tod_biological,
                    tod_other: data.tod_other,
                    tod_other_text: data.tod_other_text,
                    tod_applied_product: data.tod_applied_product,

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
                    <h5 className="mb-0">Treatment</h5>
                    <small className="text-muted">Select Treatment.</small>
                </div>
            }
            <EditWoundNoteTreatment callBack={saveCallback} doSubmit={doNext} />

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

export default WoundNoteTreatmentStep;
