// ** React Imports
import React, { Fragment, useState } from "react";
import { useParams } from "react-router-dom";

import useApi from "../../../../api/useApi";
import { showAlertError } from "../../../../components/alerts/AlertUtils";
import { ArrowLeft, ArrowRight } from "react-feather";
import EditWoundNoteBarrierForHealing from "../../../../components/edits/wound-notes/EditWoundNoteBarrierForHealing";
import { getFormatedDateFromISODate, dateToISOString } from "../../../../utility/Utils";
import {
    Button,
} from "reactstrap";

const WoundNoteBarrierForHealingStep = ({ stepper, callBack }) => {
    const { id, woundNoteId } = useParams();
    const [doNext, setDoNext] = useState(false);

    const saveCallback = (data, isValid) => {
        callBack(false);
        if (isValid) {
            callBack(true);
            useApi
                .doRun("post", `/wound_notes/${woundNoteId}/barrier_for_healing`, {
                    id: woundNoteId,
                    barrier_necrosis: data.barrier_necrosis,
                    barrier_infection: data.barrier_infection,
                    barrier_haemorrhage: data.barrier_haemorrhage,
                    barrier_mechanical_damage: data.barrier_mechanical_damage,
                    barrier_diet: data.barrier_diet,
                    barrier_medical_conditions: data.barrier_medical_conditions,
                    barrier_age: data.barrier_age,
                    barrier_medicines: data.barrier_medicines,
                    barrier_smoking: data.barrier_smoking,
                    barrier_varicose_veins: data.barrier_varicose_veins,
                    barrier_dryness: data.barrier_dryness,
                    barrier_bedridden: data.barrier_bedridden,
                    barrier_diabetic: data.barrier_diabetic,
                    barrier_immuno: data.barrier_immuno,

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
                    <h5 className="mb-0">Healing Barriers</h5>
                    <small className="text-muted">Select the healing Barriers</small>
                </div>
            }
            <EditWoundNoteBarrierForHealing callBack={saveCallback} doSubmit={doNext} />

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

export default WoundNoteBarrierForHealingStep;
