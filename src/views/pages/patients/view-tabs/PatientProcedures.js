
import React, { useEffect, useState } from "react";
import {
    CardText,
    Card,
} from "reactstrap";
import UILoader from "../../../../components/ui-loader";
import LoadingSpinner from "../../../../components/spinner/LoadingSpinner";
import VitalSignsCard from "../../vital_signs/VitalSignsCard";
import ProgressNoteCard from "../../progress_note/ProgressNoteCard";
import ProceduresCard from "../../procedures/ProceduresCard";
import PatientReferralCard from "../../referrals/PatientReferralCard";
import PatientTransferCard from "../../transfers/PatientTransferCard";
import PatientConsultNoteCard from "../../consult_notes/PatientConsultNoteCard";
import PatientPhysicianOrderCard from "../../physician_orders/PatientPhysicianOrderCard";
import PatientPrescriptionCard from "../../prescriptions/PatientPrescriptionCard";
import PatientAppointmentCard from "../../patient_appointments/PatientAppointmentCard";
import IctCard from "../../ict/IctCard";

const PatientProcedures = ({ patientId }) => {
    const [loading, setLoading] = useState(false);

    const Loader = () => {
        return (
            <>
                <LoadingSpinner />
                <CardText className="mb-0 mt-1 text-white">Please Wait...</CardText>
            </>
        );
    };

    return (
        <>
            <UILoader blocking={loading} loader={<Loader />}>

                <VitalSignsCard></VitalSignsCard>

                <ProgressNoteCard></ProgressNoteCard>

                <ProceduresCard></ProceduresCard>
                
                <PatientReferralCard></PatientReferralCard>

                <PatientTransferCard></PatientTransferCard>

                <PatientConsultNoteCard></PatientConsultNoteCard>

                <PatientPhysicianOrderCard></PatientPhysicianOrderCard>

                <PatientPrescriptionCard></PatientPrescriptionCard>
                
                <PatientAppointmentCard></PatientAppointmentCard>
                
                <IctCard />

            </UILoader>
        </>
    );
}

export default PatientProcedures;