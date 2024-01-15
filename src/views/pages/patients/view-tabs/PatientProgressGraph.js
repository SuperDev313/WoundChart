
import React, { useRef, useEffect, useState, } from "react"
import {
    CardText,
    Card
} from "reactstrap";
import UILoader from "../../../../components/ui-loader"
import LoadingSpinner from "../../../../components/spinner/LoadingSpinner"
import ProgressGraphCard from "./Cards/ProgressGraphCard"
import { ThemeColors } from '@src/utility/context/ThemeColors'
import { useSkin } from '@hooks/useSkin'

import { FileText, User, MapPin, Link } from 'react-feather'


// ** Custom Components
import Wizard from '@components/wizard'

const PatientProgressGraph = ({ patientId }) => {
    const [loading, setLoading] = useState(false);

    const { colors } = React.useContext(ThemeColors),
        { skin } = useSkin(),
        labelColor = skin === 'dark' ? '#b4b7bd' : '#6e6b7b',
        gridLineColor = 'rgba(200, 200, 200, 0.2)',
        lineChartPrimary = 'rgba(98, 168, 234, .1)',
        lineChartDanger = 'rgba(204, 213, 219, .1)',
        warningColorShade = 'rgba(250,122,122,0.25)'

    // ** Ref
    const ref = useRef(null)

    // ** State
    const [stepper, setStepper] = useState(null)

    const steps = [
        {
        id: 'active-wounds',
        title: 'Active Wounds',
        subtitle: 'This shows the chart of active Wounds.',
        content: <>
                <ProgressGraphCard
                    labelColor={labelColor}
                    gridLineColor={gridLineColor}
                    lineChartDanger={lineChartDanger}
                    lineChartPrimary={lineChartPrimary}
                    warningColorShade={warningColorShade}
                    title="Wound Progress Graph: (Right foot distal) W4"
                />
                <ProgressGraphCard
                    labelColor={labelColor}
                    gridLineColor={gridLineColor}
                    lineChartDanger={lineChartDanger}
                    lineChartPrimary={lineChartPrimary}
                    warningColorShade={warningColorShade}
                    title="Wound Progress Graph: (Right foot) W1"
                />
            </>

        },
        {
        id: 'closed-wounds',
        title: 'Closed Wounds',
        subtitle: 'This shows the chart of active Wounds.',
        icon: <User size={18} />,
        content: <ProgressGraphCard
                labelColor={labelColor}
                gridLineColor={gridLineColor}
                lineChartDanger={lineChartDanger}
                lineChartPrimary={lineChartPrimary}
                warningColorShade={warningColorShade}
                title="Wound Progress Graph: (Left foot) W2"
            />
        }
    ]

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

                <div className='modern-horizontal-wizard'>
                    <Wizard
                        type='modern-horizontal'
                        ref={ref}
                        steps={steps}
                        options={{
                        linear: false
                        }}
                        instance={el => setStepper(el)}
                    />
                </div>

            </UILoader>
        </>
    );
}

export default PatientProgressGraph;