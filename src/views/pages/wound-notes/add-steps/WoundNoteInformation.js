// ** React Imports
import React, { Fragment, useState } from "react";

// ** Utils
import { ArrowLeft, ArrowRight } from "react-feather";

import useApi from "../../../../api/useApi";
import { useParams } from "react-router-dom";
import { Form, Label, Input, Row, Col, Button, FormFeedback } from "reactstrap";
// ** Utils
import { showAlertError } from "../../../../components/alerts/AlertUtils";
import EditWoundNoteDetails from "../../../../components/edits/wound-notes/EditWoundNoteDetails";
import { getFormatedDateFromISODate, dateToISOString } from "../../../../utility/Utils";
import toast from "react-hot-toast";

const WoundNoteInformation = ({ callBack }) => {
    const { id, woundNoteId } = useParams();
    const [doNext, setDoNext] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        patient_id: id,
        visit_date: "",
        wound_location: "",
        pain_grade_id: "",
        visit_type_id: "",
        location_id: "",
        wound_type_id: "",
    });

    React.useEffect(() => {

        setLoading(true);
        useApi
            .get(`/wound_notes/${woundNoteId}`, {})
            .then((res) => {
                const data = res.data.data;
                formData.patient_id = data.patient_id;
                formData.visit_date = data.visit_date;
                formData.wound_location = data.wound_location;
                formData.pain_grade_id = data.pain_grade_id;
                formData.visit_type_id = data.visit_type_id;
                formData.location_id = data.location_id;
                formData.wound_type_id = data.wound_type_id;

                setLoading(false);
            })
            .catch((err) => {
                showAlertError(err);
                setLoading(false);
            });

    }, [id]);


    const saveCallback = (data, isValid) => {
        if (isValid) {

            setLoading(true);
            useApi
                .doRun("put", `/wound_notes/{id}/details`, {
                    patient_id: isNaN(data.patient_id) ? null : parseInt(data.patient_id),
                    visit_date: dateToISOString(new Date(data.visit_date)),
                    wound_location: data.wound_location,
                    pain_grade_id: isNaN(data.pain_grade_id) ? null : parseInt(data.pain_grade_id),
                    visit_type_id: isNaN(data.visit_type_id) ? null : parseInt(data.visit_type_id),
                    location_id: isNaN(data.location_id) ? null : parseInt(data.location_id),
                    wound_type_id: isNaN(data.wound_type_id) ? null : parseInt(data.wound_type_id),

                })
                .then((res) => {
                    toast("WoundNote Saved Successfully!");
                    setLoading(false);
                    // doHandleSaveAndClosePopup(res.data.data.id);
                    callBack(data)
                })
                .catch((err) => {
                    setLoading(false);
                    showAlertError(err);
                });

        }
        setDoNext(false)
    }

    return (
        <Fragment>
            <div className="content-header">
                <h5 className="mb-0">Wound Note Information</h5>
                <small className="text-muted">Enter the Wound Information.</small>
            </div>

            <EditWoundNoteDetails callBack={saveCallback} doSubmit={doNext} formData={formData}></EditWoundNoteDetails>

            <div className="d-flex justify-content-between">
                <Button color="secondary" className="btn-prev" outline disabled>
                    <ArrowLeft
                        size={14}
                        className="align-middle me-sm-25 me-0"
                    ></ArrowLeft>
                    <span className="align-middle d-sm-inline-block d-none">
                        Previous
                    </span>
                </Button>
                <Button type="submit" color="primary" className="btn-next" onClick={() => setDoNext(true)}>
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

export default WoundNoteInformation;
