import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// ** Custom Components
import toast from "react-hot-toast";
import useApi from "../../../api/useApi";
import Breadcrumbs from "@components/breadcrumbs";
import EditProfile from "../../../components/edits/patients/EditProfile";
import {
    Row,
    Col,
    Button
} from "reactstrap"; // ** Icons Imports

import { showAlertError } from "../../../components/alerts/AlertUtils";


// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";

export default function PatientAdd() {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [doNext, setDoNext] = useState(false);

    const [formData, setFormData] = useState({
        record_number: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        second_last_name: "",
        date_of_birth: "",
        gender_id: "",
    });

    const doHandleSaveAndClosePopup = (id) => {
        if (id > 0) {
            navigate(`/patients/add/${id}`);
        }
    }

    const saveCallback = (data, isValid) => {
        if (isValid) {
        setLoading(true);
        useApi
            .doRun("post", `/patients/0`, {
                first_name: data.first_name,
                middle_name: data.middle_name,
                last_name: data.last_name,
                second_last_name: data.second_last_name,
                date_of_birth: data.date_of_birth,
                gender_id: isNaN(data.gender_id) ? null: parseInt(data.gender_id),
                })
                .then((res) => {
                toast("Patient Added Successfully!");
                setLoading(false);
                doHandleSaveAndClosePopup(res.data.data.id);
            })
            .catch((err) => {
                setLoading(false);
                showAlertError(err);
            });
        }
        setDoNext(false)
    }

    return (
        <>
            <Breadcrumbs title="Patients" data={[{ title: "Add Patients" }]} />
            <Row>
                <Col>
                    <div className='text-center mb-4'>
                        <h1>Add new Patient</h1>
                        <p>Please fill out the form to add a new Patient.</p>
                    </div>

                    <EditProfile callBack={saveCallback} doSubmit={doNext} formData={formData}></EditProfile>
                    <Button type="button" className="me-1" color="primary" onClick={() => setDoNext(true)}>
                        Submit
                    </Button>
                    <Button
                        type="reset"
                        color="secondary"
                        outline
                        onClick={() => navigate('/patients')}
                    >
                        Cancel
                    </Button>
                </Col>
            </Row>
            
        </>
    );
}




