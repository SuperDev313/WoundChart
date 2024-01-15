// ** React Imports
import React, { Fragment, useState } from "react";
import { useParams } from "react-router-dom";

import useApi from "../../../../api/useApi";
import { showAlertError } from "../../../../components/alerts/AlertUtils";
import { ArrowLeft, ArrowRight } from "react-feather";
import EditWoundNoteTissueExposure from "../../../../components/edits/wound-notes/EditWoundNoteTissueExposure";
import { getFormatedDateFromISODate, dateToISOString } from "../../../../utility/Utils";
import {
    Button,
} from "reactstrap";

const WoundNoteTissueExposureStep = ({ stepper, callBack }) => {
    const { id, woundNoteId } = useParams();
    const [doNext, setDoNext] = useState(false);

    const saveCallback = (data, isValid) => {
        callBack(false);
        if (isValid) {
            callBack(true);
            useApi
            .doRun("post", `/wound_notes/${woundNoteId}/tissueexposure`, {
                id: woundNoteId,
                tissue_exposure_bone: data.tissue_exposure_bone,
                tissue_exposure_tendon: data.tissue_exposure_tendon,
                tissue_exposure_vessel: data.tissue_exposure_vessel,
                tissue_exposure_muscle: data.tissue_exposure_muscle,
                tissue_exposure_fat: data.tissue_exposure_fat,
                tissue_exposure_hardware: data.tissue_exposure_hardware,
                tissue_exposure_fascia: data.tissue_exposure_fascia,
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
                    <h5 className="mb-0">Wound Tissue Exposure</h5>
                    <small className="text-muted">Select the right tissue exposure .</small>
                </div>
            }
            <EditWoundNoteTissueExposure callBack={saveCallback} doSubmit={doNext}></EditWoundNoteTissueExposure>

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

export default WoundNoteTissueExposureStep;
