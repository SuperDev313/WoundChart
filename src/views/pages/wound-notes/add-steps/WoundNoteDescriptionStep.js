// ** React Imports
import React, { Fragment, useState } from "react";
import { useParams } from "react-router-dom";

import useApi from "../../../../api/useApi";
import { showAlertError } from "../../../../components/alerts/AlertUtils";
import { ArrowLeft, ArrowRight } from "react-feather";
import EditWoundNoteDescription from "../../../../components/edits/wound-notes/EditWoundNoteDescription";
import { getFormatedDateFromISODate, dateToISOString } from "../../../../utility/Utils";
import {
    Button,
} from "reactstrap";

const WoundNoteDescriptionStep = ({ stepper, callBack }) => {
    const { id, woundNoteId } = useParams();
    const [doNext, setDoNext] = useState(false);

    const saveCallback = (data, isValid) => {
        callBack(false);
        if (isValid) {
            callBack(true);
            useApi
            .doRun("post", `/wound_notes/${woundNoteId}/description`, {
                id: woundNoteId,
                signs_infected_wound: data.signs_infected_wound,
                granulation_tissue: isNaN(data.granulation_tissue) ? null : parseInt(data.granulation_tissue),
                slough_tissue: isNaN(data.slough_tissue) ? null : parseInt(data.slough_tissue),
                neurotic_tissue: isNaN(data.neurotic_tissue) ? null : parseInt(data.neurotic_tissue),
                other_tissue: isNaN(data.other_tissue) ? null : parseInt(data.other_tissue),
                type_of_exudate_id: isNaN(data.type_of_exudate_id) ? null : parseInt(data.type_of_exudate_id),
                amount_of_exudate_id: isNaN(data.amount_of_exudate_id) ? null : parseInt(data.amount_of_exudate_id),
                odor_id: isNaN(data.odor_id) ? null : parseInt(data.odor_id),

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
                    <h5 className="mb-0">Wound Description</h5>
                    <small className="text-muted">Enter the information matching the wound description.</small>
                </div>
            }
            <EditWoundNoteDescription callBack={saveCallback} doSubmit={doNext}></EditWoundNoteDescription>

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

export default WoundNoteDescriptionStep;
