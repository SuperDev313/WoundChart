// ** React Imports
import React, { Fragment, useState } from "react";
import { useParams } from "react-router-dom";

import useApi from "../../../../api/useApi";
import { showAlertError } from "../../../../components/alerts/AlertUtils";
import { ArrowLeft, ArrowRight } from "react-feather";
import EditWoundNoteLowerExtremityAssessment from "../../../../components/edits/wound-notes/EditWoundNoteLowerExtremityAssessment";
import { getFormatedDateFromISODate, dateToISOString } from "../../../../utility/Utils";
import {
    Button,
} from "reactstrap";

const WoundNoteLowerExtremityAssessmentStep = ({ stepper, callBack }) => {
    const { id, woundNoteId } = useParams();
    const [doNext, setDoNext] = useState(false);

    const saveCallback = (data, isValid) => {
        callBack(false);
        if (isValid) {
            callBack(true);
            useApi
            .doRun("post", `/wound_notes/${woundNoteId}/lower_extremity_assessment`, {
                id: woundNoteId,
                dorsalis_pedis_pulses_id: isNaN(data.dorsalis_pedis_pulses_id) ? null : parseInt(data.dorsalis_pedis_pulses_id),
                posterior_tibialis_pulses_id: isNaN(data.posterior_tibialis_pulses_id) ? null : parseInt(data.posterior_tibialis_pulses_id),
                radial_pulses_id: isNaN(data.radial_pulses_id) ? null : parseInt(data.radial_pulses_id),
                capillary_refill_id: isNaN(data.capillary_refill_id) ? null : parseInt(data.capillary_refill_id),
                dependant_rubor_id: isNaN(data.dependant_rubor_id) ? null : parseInt(data.dependant_rubor_id),
                venous_filling_time: data.venous_filling_time,
                ankle_brachial_index: data.ankle_brachial_index,
                edema_id: isNaN(data.edema_id) ? null : parseInt(data.edema_id),
                compression_in_use: data.compression_in_use,
                sensation_id: isNaN(data.sensation_id) ? null : parseInt(data.sensation_id),
                claudication_in_use: data.claudication_in_use,
                temperature_of_extremity_id: isNaN(data.temperature_of_extremity_id) ? null : parseInt(data.temperature_of_extremity_id),
                hair_growth_on_extremity: data.hair_growth_on_extremity,
                erythema: data.erythema,
                hyperpigmentation: data.hyperpigmentation,
                lipodermatosclerosis: data.lipodermatosclerosis,
                varicose_veins: data.varicose_veins,
                off_loading_device_in_use: data.off_loading_device_in_use,

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
                    <h5 className="mb-0">Extremities Assessment</h5>
                    <small className="text-muted">Enter the Wound Extremities Assessment.</small>
                </div>
            }
            <EditWoundNoteLowerExtremityAssessment callBack={saveCallback} doSubmit={doNext}></EditWoundNoteLowerExtremityAssessment>

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

export default WoundNoteLowerExtremityAssessmentStep;
