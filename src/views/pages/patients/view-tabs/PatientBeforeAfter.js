
import React, { useRef, useEffect, useState, } from "react"
import {
    CardText,
    Card
} from "reactstrap";
import UILoader from "../../../../components/ui-loader"
import LoadingSpinner from "../../../../components/spinner/LoadingSpinner"
import BeforeAfterCard from "./Cards/BeforeAfterCard"
import { ThemeColors } from '@src/utility/context/ThemeColors'
import useApi from "../../../../api/useApi";
import { useSkin } from '@hooks/useSkin'

import { FileText, User, MapPin, Link } from 'react-feather'


// ** Custom Components
import Wizard from '@components/wizard'

const PatientBeforeAfter = ({ patientId }) => {
    const [loading, setLoading] = useState(false);
    const [openWounds, setOpenWounds] = useState([]);
    const [openColseid, setColside] = useState([]);

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

    React.useEffect(() => {

        useApi
            .get("/patients/6/before_after", {})
            .then((res) => {
                console.log(res);
                setOpenWounds(res.data.data)
            })
            .catch((err) => {
                showAlertError(err);
            });
    
    }, []);

    console.log(openWounds)

    const closedWounds = [
        {
            id: 1,
            wound_title: 'Surgical Wound, (W4)',
            first_visit: {
                date: '2023-07-01',
                image: 'https://mso.woundcharts.app/emr/content/wound-photos/1679670449_21761.jpg',
                measurement: {
                    length: 10,
                    width: 5,
                    depth: 2,
                },
                type: 'Pressure Ulcer',
                granulation_tissue: 'Good',
                fibrin_tissue: 'Minimal',
                necrotic_tissue: 'None',
                exudate_type: 'Serous',
                exudate_amount: 'Low',
                periwound: 'Intact',
                wound_cleanser: 'Normal Saline',
                additional_cleanser: 'N/A',
                primary_dressing: 'Foam Dressing',
                other_primary_dressing: 'N/A',
                secondary_dressing: 'Transparent Film',
                secure_dressing: 'Adhesive Tape',
                peri_wound_skin_treatment: 'Moisturizer',
            },
            latest_visit: {
                date: '2023-07-07',
                image: 'https://mso.woundcharts.app/emr/content/wound-photos/1689250916_37794.jpg',
                measurement: {
                    length: 8,
                    width: 4,
                    depth: 1.5,
                },
                type: 'Burn Wound',
                granulation_tissue: 'Moderate',
                fibrin_tissue: 'Minimal',
                necrotic_tissue: 'None',
                exudate_type: 'Serosanguinous',
                exudate_amount: 'Moderate',
                periwound: 'Intact',
                wound_cleanser: 'Antiseptic Solution',
                additional_cleanser: 'N/A',
                primary_dressing: 'Hydrocolloid Dressing',
                other_primary_dressing: 'N/A',
                secondary_dressing: 'Gauze Dressing',
                secure_dressing: 'Medical Tape',
                peri_wound_skin_treatment: 'Barrier Cream',
            },
        },
    ];

    const steps = [
        {
            id: 'active-wounds',
            title: 'Active Wounds',
            subtitle: 'This shows the chart of active Wounds.',
            icon: <FileText size={18} />,
            content: <>
                    <BeforeAfterCard wounds={openWounds}
                    />
                </>
        
        },
        {
            id: 'closed-wounds',
            title: 'Closed Wounds',
            subtitle: 'This shows the chart of active Wounds.',
            icon: <User size={18} />,
            content: <>
                {/* <BeforeAfterCard wounds={closedWounds}
                /> */}
            </>

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

export default PatientBeforeAfter;