// ** React Imports
import React, { Fragment, useState } from "react";
import { useParams } from "react-router-dom";

import useApi from "../../../../api/useApi";
import { showAlertError } from "../../../../components/alerts/AlertUtils";
import { ArrowLeft, ArrowRight } from "react-feather";
import EditWoundNotePeriwound from "../../../../components/edits/wound-notes/EditWoundNotePeriwound";
import { getFormatedDateFromISODate, dateToISOString } from "../../../../utility/Utils";
import {
    Button,
} from "reactstrap";

const WoundNotePeriWoundStep = ({ stepper, callBack }) => {
    const { id, woundNoteId } = useParams();
    const [doNext, setDoNext] = useState(false);

    const saveCallback = (data, isValid) => {
        callBack(false);
        if (isValid) {
            callBack(true);
            useApi
            .doRun("post", `/wound_notes/${woundNoteId}/periwound`, {
                id: woundNoteId,
                periwound_healthy: data.periwound_healthy,
                periwound_blistered: data.periwound_blistered,
                periwound_cayosed: data.periwound_cayosed,
                periwound_discolored: data.periwound_discolored,
                periwound_contact: data.periwound_contact,
                periwound_dry_scaly: data.periwound_dry_scaly,
                periwound_edema: data.periwound_edema,
                periwound_erythema: data.periwound_erythema,
                periwound_indurated: data.periwound_indurated,
                periwound_macerated: data.periwound_macerated,
                periwound_hyperpigmented: data.periwound_hyperpigmented,
                periwound_hyperemic: data.periwound_hyperemic,
                periwound_skin_irritation: data.periwound_skin_irritation,
                periwound_not_determined: data.periwound_not_determined,
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
                    <h5 className="mb-0">Periwound</h5>
                    <small className="text-muted">Select the appropriate periwound.</small>
                </div>
            }
            <EditWoundNotePeriwound callBack={saveCallback} doSubmit={doNext}></EditWoundNotePeriwound>

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

export default WoundNotePeriWoundStep;
