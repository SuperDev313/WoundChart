
import React, { useEffect, useState } from "react";
import {
    CardText,
    Card,
} from "reactstrap";
import UILoader from "../../../../components/ui-loader";
import LoadingSpinner from "../../../../components/spinner/LoadingSpinner";
import SocCard from "./Cards/SocCard";
import LeaCard from "../../lea/LeaCard";
import AbiCard from "../../abi/AbiCard";
import BradenScaleCard from "../../braden_scale/BradenScaleCard";
import MnaCard from "../../mna/MnaCard";

const PatientAssessments = ({ patientId }) => {
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
                <SocCard></SocCard>

                <LeaCard></LeaCard>

                <AbiCard></AbiCard>

                <BradenScaleCard></BradenScaleCard>

                <MnaCard></MnaCard>

            </UILoader>
        </>
    );
}

export default PatientAssessments;