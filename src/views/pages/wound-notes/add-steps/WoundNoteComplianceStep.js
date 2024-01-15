// ** React Imports
import React, { Fragment, useState } from "react";
import { useParams } from "react-router-dom";

import useApi from "../../../../api/useApi";
import { showAlertError } from "../../../../components/alerts/AlertUtils";
import { ArrowLeft, ArrowRight } from "react-feather";
import EditWoundNoteCompliance from "../../../../components/edits/wound-notes/EditWoundNoteCompliance";
import { getFormatedDateFromISODate, dateToISOString } from "../../../../utility/Utils";
import {
    Button,
} from "reactstrap";

const WoundNoteComplianceStep = ({ stepper, callBack }) => {
    const { id, woundNoteId } = useParams();
    const [doNext, setDoNext] = useState(false);

    const saveCallback = (data, isValid) => {
        callBack(false);
        if (isValid) {
            callBack(true);
            useApi
                .doRun("post", `/wound_notes/${woundNoteId}/compliance`, {
                    id: woundNoteId,
                    ncw_limb_elevation: data.ncw_limb_elevation,
                    ncw_offloading: data.ncw_offloading,
                    ncw_keep_intact_dressings: data.ncw_keep_intact_dressings,
                    ncw_compression: data.ncw_compression,
                    ncw_meds: data.ncw_meds,
                    ncw_glucose_control: data.ncw_glucose_control,
                    ncw_visits: data.ncw_visits,
                    ncw_other: data.ncw_other,

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
                    <h5 className="mb-0">Compliance</h5>
                    <small className="text-muted">Select Wound Compliance.</small>
                </div>
            }
            <EditWoundNoteCompliance callBack={saveCallback} doSubmit={doNext} />

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

export default WoundNoteComplianceStep;
