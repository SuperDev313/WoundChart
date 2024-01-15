import React, { useState } from 'react'
import { useParams } from "react-router-dom";
import useApi from "../../../api/useApi";
import { showAlertError } from "../../../components/alerts/AlertUtils";
import { selectThemeColors } from '@utils'
import Flatpickr from 'react-flatpickr'
import SocImage from './SocImage';
import PatientHeader from '../../../components/edits/patients/PatientHeader';
import EditStartOfCare from "../../../components/edits/socs/EditStartOfCare";
import { ConeTestOnNets } from 'healthicons-react/dist/filled'

import * as yup from "yup";
import { User, Lock, Bookmark } from 'react-feather'
// ** Reactstrap Imports
import {
    Row, Col, TabContent, TabPane, Nav, NavItem, NavLink, Card, CardTitle, CardBody, CardHeader, Form,
    Label,
    Input,
} from 'reactstrap'
import Select, { components } from 'react-select' // eslint-disable-line
import Breadcrumbs from '@components/breadcrumbs'
import { dateToISOString, getFullName } from '../../../utility/Utils';
import SwitchInput from '../../../components/forms/SwitchInput';

import { Check, X } from 'react-feather'

const SOCView = () => {

    const { id, socId } = useParams();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('1')
    const [locations, setLocations] = useState([{ label: "", value: "" }]);
    const [visit_types, setVisit_Types] = useState([{ label: "", value: "" }]);
    const [information_taken_from_options, setInformation_Taken_From_Options] = useState([{ label: "", value: "" }]);

    const CustomLabel = ({ htmlFor }) => {
        return (
            <Label className='form-check-label' htmlFor={htmlFor}>
                <span className='switch-icon-left'>
                    <Check size={14} />
                </span>
                <span className='switch-icon-right'>
                    <X size={14} />
                </span>
            </Label>
        )
    }

    const medsOptions = [
        { value: 'meds_anticoagulant_use', label: 'ON ANTICOAGULANT USE?' },
        { value: 'meds_steroidal_use', label: 'ON STEROIDAL USE?' },
        { value: 'meds_hx_rad_at_wound_site', label: 'HX OF RADIATION AT THE SITE OF THE WOUND OR ULCER?' },
        { value: 'meds_diabetics_med_use', label: 'ON DIABETIC MEDS?' },
        { value: 'meds_immunosupression_therapy', label: 'RECEIVING CHEMOTHERAPY?' },
    ]
    const [selectedMeds, setSelectedMeds] = useState([]);

    const generalOptions = [
        { value: 'general_no_complaints_or_symptoms', label: 'General No Complaints Or Symptom' },
        { value: 'general_info_weakness', label: 'Weakness' },
        { value: 'general_info_weight_loss', label: 'General Info Weight Loss' },
        { value: 'general_info_weight_gain', label: 'General Info Weight Gain' },
        { value: 'general_info_trouble_sleeping', label: 'General Info Trouble Sleeping' },
        { value: 'general_info_fever', label: 'General Info Fever' },
        { value: 'general_info_fatigue', label: 'General Info Fatigue' },
        { value: 'general_info_loss_of_apetite', label: 'General Info Loss Of Appetite' },
        { value: 'general_info_cancer', label: 'General Info Cancer' },
    ];
    const [selectedGeneral, setSelectedGeneral] = useState([]);

    const allergiesOptions = [
        { value: 'allergy_not_known', label: 'Allergy Not Known' },
        { value: 'allergy_to_aspirin', label: 'Allergy To Aspirin' },
        { value: 'allergy_to_penicillin', label: 'Allergy To Penicillin' },
        { value: 'allergy_to_sulfa', label: 'Allergy To Sulfa' },
        { value: 'allergy_to_iodine', label: 'Allergy To Iodine' },
        { value: 'allergy_to_anticonsulsants', label: 'Allergy To Anticonvulsants' },
        { value: 'allergy_to_cows_milk', label: 'Allergy To Cow\'s Milk' },
        { value: 'allergy_to_as_arterial_venous_duplex', label: 'Allergy To As Arterial Venous Duplex' },
        { value: 'allergy_to_eggs', label: 'Allergy To Eggs' },
        { value: 'allergy_to_nuts', label: 'Allergy To Nuts' },
        { value: 'allergy_to_seafoods', label: 'Allergy To Seafoods' },
        { value: 'allergy_to_shellfish', label: 'Allergy To Shellfish' },
        { value: 'allergy_to_peanuts', label: 'Allergy To Peanuts' },
        { value: 'allergy_to_wheat', label: 'Allergy To Wheat' },
        { value: 'allergy_to_fish', label: 'Allergy To Fish' },
        { value: 'allergy_to_gluten', label: 'Allergy To Gluten' },
        { value: 'allergy_to_arterial_venous_duplex', label: 'Allergy To Arterial Venous Duplex' },
    ];

    const [selectedAllergies, setSelectedAllergies] = useState([]);

    const activityMobilityOptions = [
        { value: 'activity_bedbound', label: 'Activity Bedbound' },
        { value: 'activity_bedbound_but_can_turn_on_bed', label: 'Activity Bedbound But Can Turn on Bed' },
        { value: 'activity_can_only_sit_on_bed', label: 'Activity Can Only Sit on Bed' },
        { value: 'activity_can_only_sit_on_chair', label: 'Activity Can Only Sit on Chair' },
        { value: 'activity_can_only_uses_wheelchair', label: 'Activity Can Only Use Wheelchair' },
        { value: 'activity_can_only_uses_walker', label: 'Activity Can Only Use Walker' },
        { value: 'activity_uses_crutches', label: 'Activity Uses Crutches' },
        { value: 'activity_uses_cane', label: 'Activity Uses Cane' },
        { value: 'activity_can_walk', label: 'Activity Can Walk' },
        { value: 'activity_can_jog', label: 'Activity Can Jog' },
        { value: 'activity_can_run', label: 'Activity Can Run' },
    ];

    const [selectedActivityMobility, setSelectedActivityMobility] = useState([]);

    const skinOptions = [
        { value: 'skin_ulcer', label: 'Skin Ulcer' },
        { value: 'skin_lesion', label: 'Skin Lesion' },
        { value: 'skin_rashes', label: 'Skin Rash' },
        { value: 'skin_dryness', label: 'Skin Dryness' },
        { value: 'skin_dermatitis', label: 'Skin Dermatitis' },
        { value: 'skin_change_in_hair', label: 'Skin Change In Hair' },
        { value: 'skin_easy_bruising', label: 'Skin Easy Bruising' },
        { value: 'skin_color_changes', label: 'Skin Color Change' },
        { value: 'skin_hair_loss', label: 'Skin Hair Loss' },
        { value: 'skin_change_in_nails', label: 'Skin Change In Nail' },
        { value: 'skin_lumps', label: 'Skin Lump' },
        { value: 'skin_nodules', label: 'Skin Nodule' },
        { value: 'skin_hx_malignancy', label: 'Skin Hx Malignancy' },
    ];

    const [selectedSkin, setSelectedSkin] = useState([]);


    const neuroPsychiatricOptions = [
        { value: 'np_no_complaints_or_symptoms', label: 'Np No Complaints Or Symptom' },
        { value: 'np_alert', label: 'Np Alert' },
        { value: 'np_oriented', label: 'Np Oriented' },
        { value: 'np_disoriented', label: 'Np Disoriented' },
        { value: 'np_depression', label: 'Np Depression' },
        { value: 'np_anxiety', label: 'Np Anxiety' },
        { value: 'np_hearing_voices', label: 'Np Hearing Voice' },
        { value: 'np_thoughts_of_suicide', label: 'Np Thoughts Of Suicide' },
        { value: 'np_problems_concentrating', label: 'Np Problems Concentrating' },
        { value: 'np_hallucinations', label: 'Np Hallucination' },
        { value: 'np_seizures', label: 'Np Seizure' },
        { value: 'np_headaches', label: 'Np Headache' },
        { value: 'np_dizziness', label: 'Np Dizziness' },
        { value: 'np_memory_loss', label: 'Np Memory Loss' },
        { value: 'np_paralysis', label: 'Np Paralysis' },
        { value: 'np_weakness', label: 'Np Weakness' },
        { value: 'np_unilateral_weakness', label: 'Np Unilateral Weakness' },
        { value: 'np_neuropathic_pain', label: 'Np Neuropathic Pain' },
        { value: 'np_loss_of_protective_sensation', label: 'Np Loss Of Protective Sensation' },
        { value: 'np_alzheimers_disease', label: 'Np Alzheimer\'s Disease' },
        { value: 'np_unspecified_dementia', label: 'Np Unspecified Dementia' },
    ];

    const [selectedNeuroPsychiatric, setSelectedNeuroPsychiatric] = useState([]);

    const eyesOptions = [
        { value: 'eyes_no_complaints_or_symptoms', label: 'Eyes No Complaints Or Symptom' },
        { value: 'eyes_pain', label: 'Eyes Pain' },
        { value: 'eyes_redness', label: 'Eyes Redness' },
        { value: 'eyes_loss_of_vision', label: 'Eyes Loss Of Vision' },
        { value: 'eyes_double_vision', label: 'Eyes Double Vision' },
        { value: 'eyes_blurred_vision', label: 'Eyes Blurred Vision' },
        { value: 'eyes_dryness', label: 'Eyes Dryness' },
        { value: 'eyes_change_in_vision', label: 'Eyes Change In Vision' },
        { value: 'eyes_glasses', label: 'Eyes Glass' },
        { value: 'eyes_hx_of_cataracts', label: 'Eyes Hx Of Cataract' },
        { value: 'eyes_hx_glaucoma', label: 'Eyes Hx Glaucoma' },
    ];

    const [selectedEyes, setSelectedEyes] = useState([]);


    const earsOptions = [
        { value: 'ears_no_complaints_or_symptoms', label: 'Ears No Complaints Or Symptom' },
        { value: 'ears_ringing', label: 'Ears Ringing' },
        { value: 'ears_hearing_loss', label: 'Ears Hearing Loss' },
        { value: 'ears_vertigo', label: 'Ears Vertigo' },
    ]
    const [selectedEars, setSelectedEars] = useState([]);

    const noseMouthOptions = [
        { value: 'nose_no_complaints_or_symptoms', label: 'Nose No Complaints Or Symptom' },
        { value: 'nose_bleeds', label: 'Nose Bleed' },
        { value: 'nose_loss_of_smell', label: 'Nose Loss Of Smell' },
        { value: 'nose_dry_sinuses', label: 'Nose Dry Sinus' },
        { value: 'noses_inusitis', label: 'Nose Sinusitis' },
        { value: 'nose_bleeding_gums', label: 'Nose Bleeding Gum' },
        { value: 'nose_mouth_sores', label: 'Nose Mouth Sore' },
        { value: 'nose_hoarseness', label: 'Nose Hoarseness' },
        { value: 'nose_trouble_swallowing', label: 'Nose Trouble Swallowing' },
    ];

    const [selectedNoseMouth, setSelectedNoseMouth] = useState([]);

    const cardioOptions = [
        { value: 'cardio_no_complaints_or_symptoms', label: 'Cardio No Complaints Or Symptom' },
        { value: 'cardio_heart_murmur', label: 'Cardio Heart Murmur' },
        { value: 'cardio_chest_pain', label: 'Cardio Chest Pain' },
        { value: 'cardio_high_blood_pressure', label: 'Cardio High Blood Pressure' },
        { value: 'cardio_palpitations', label: 'Cardio Palpitations' },
        { value: 'cardio_edema', label: 'Cardio Edema' },
        { value: 'cardio_lower_extremity_swelling', label: 'Cardio Lower Extremity Swelling' },
        { value: 'cardio_var_vein_lower_extremity_swelling', label: 'Cardio Varicose Vein Lower Extremity Swelling' },
        { value: 'cardio_lower_extremity_resting_pain', label: 'Cardio Lower Extremity Resting Pain' },
        { value: 'cardio_lower_extremity_at_exertion_pain', label: 'Cardio Lower Extremity At Exertion Pain' },
        { value: 'cardio_varicose_veins', label: 'Cardio Varicose Veins' },
        { value: 'cardio_hx_of_lung_ca', label: 'Cardio Hx Of Lung Ca' },
        { value: 'cardio_hx_of_pneumothorax', label: 'Cardio Hx Of Pneumothorax' },
        { value: 'cardio_hypertension', label: 'Cardio Hypertension' },
        { value: 'cardio_hx_open_heart_surgery', label: 'Cardio Hx Open Heart Surgery' },
    ];

    const [selectedCardio, setSelectedCardio] = useState([]);


    const respiratoryOptions = [
        { value: 'respiratory_no_complaints_or_symptoms', label: 'Respiratory No Complaints Or Symptom' },
        { value: 'respiratory_shortness_of_breath', label: 'Respiratory Shortness Of Breath' },
        { value: 'respiratory_wheezing', label: 'Respiratory Wheezing' },
        { value: 'respiratory_asthma', label: 'Respiratory Asthma' },
        { value: 'respiratory_cough', label: 'Respiratory Cough' },
        { value: 'respiratory_seasonal_allergy', label: 'Respiratory Seasonal Allergy' },
        { value: 'respiratory_needs_supplemental_oxygen', label: 'Respiratory Needs Supplemental Oxygen' },
        { value: 'respiratory_night_sweats', label: 'Respiratory Night Sweats' },
        { value: 'respiratory_chest_pain_with_breathing', label: 'Respiratory Chest Pain With Breathing' },
        { value: 'respiratory_atelectasis', label: 'Respiratory Atelectasis' },
    ];

    const [selectedRespiratory, setSelectedRespiratory] = useState([]);


    const gastrointestinalOptions = [
        { value: 'gastrointestinal_no_complaints_or_symptoms', label: 'Gastrointestinal No Complaints Or Symptom' },
        { value: 'gastrointestinal_abdominal_pain', label: 'Gastrointestinal Abdominal Pain' },
        { value: 'gastrointestinal_nausea', label: 'Gastrointestinal Nausea' },
        { value: 'gastrointestinal_vomiting_food', label: 'Gastrointestinal Vomiting Food' },
        { value: 'gastrointestinal_heartburn', label: 'Gastrointestinal Heartburn' },
        { value: 'gastrointestinal_belching', label: 'Gastrointestinal Belching' },
        { value: 'gastrointestinal_yellow_skin', label: 'Gastrointestinal Yellow Skin' },
        { value: 'gastrointestinal_diarrhea', label: 'Gastrointestinal Diarrhea' },
        { value: 'gastrointestinal_constipation', label: 'Gastrointestinal Constipation' },
        { value: 'gastrointestinal_excessive_gas', label: 'Gastrointestinal Excessive Gas' },
        { value: 'gastrointestinal_blood_in_stool', label: 'Gastrointestinal Blood In Stool' },
        { value: 'gastrointestinal_hemorrhoids', label: 'Gastrointestinal Hemorrhoids' },
        { value: 'gastrointestinal_incontinence', label: 'Gastrointestinal Incontinence' },
        { value: 'gastrointestinal_hx_ulcers', label: 'Gastrointestinal Hx Ulcer' },
        { value: 'gastrointestinal_hx_of_diverticulitis', label: 'Gastrointestinal Hx Of Diverticulitis' },
        { value: 'gastrointestinal_hx_of_irritable_bowel_syndrome', label: 'Gastrointestinal Hx Of Irritable Bowel Syndrome' },
        { value: 'gastrointestinal_hx_of_crohns_disease', label: 'Gastrointestinal Hx Of Crohns Disease' },
        { value: 'gastrointestinal_hx_of_ulcerative_colitis', label: 'Gastrointestinal Hx Of Ulcerative Colitis' },
    ];

    const [selectedGastrointestinal, setSelectedGastrointestinal] = useState([]);

    const genitourinaryOptions = [
        { value: 'genitourinary_no_complaints_or_symptoms', label: 'Genitourinary No Complaints Or Symptom' },
        { value: 'genitourinary_trouble_urinating', label: 'Genitourinary Trouble Urinating' },
        { value: 'genitourinary_blood_in_urine', label: 'Genitourinary Blood In Urine' },
        { value: 'genitourinary_cloudy_urine', label: 'Genitourinary Cloudy Urine' },
        { value: 'genitourinary_frequent_urination_at_night', label: 'Genitourinary Frequent Urination At Night' },
        { value: 'genitourinary_urinary_incontinence', label: 'Genitourinary Urinary Incontinence' },
        { value: 'genitourinary_requires_folley', label: 'Genitourinary Requires Folley' },
        { value: 'genitourinary_rash_in_genitals', label: 'Genitourinary Rash In Genital' },
        { value: 'genitourinary_sexual_problems', label: 'Genitourinary Sexual Problem' },
        { value: 'genitourinary_vaginal_discharge', label: 'Genitourinary Vaginal Discharge' },
        { value: 'genitourinary_painful_ejaculations', label: 'Genitourinary Painful Ejaculation' },
        { value: 'genitourinary_penile_discharge', label: 'Genitourinary Penile Discharge' },
    ];

    const [selectedGenitourinary, setSelectedGenitourinary] = useState([]);

    const hemaOncoOptions = [
        { value: 'hema_onco_no_complaints_or_symptoms', label: 'Hema Onco No Complaints Or Symptom' },
        { value: 'hema_onco_easily_bleed', label: 'Hema Onco Easily Bleed' },
        { value: 'hema_onco_anemia', label: 'Hema Onco Anemia' },
        { value: 'hema_onco_coagulation_problems', label: 'Hema Onco Coagulation Problem' },
        { value: 'hema_onco_hx_of_cancer_other', label: 'Hema Onco Hx Of Cancer Other' },
        { value: 'hema_onco_hx_of_breast_cancer', label: 'Hema Onco Hx Of Breast Cancer' },
        { value: 'hema_onco_hx_of_prostate_cancer', label: 'Hema Onco Hx Of Prostate Cancer' },
        { value: 'hema_onco_hx_of_thyroid_cancer', label: 'Hema Onco Hx Of Thyroid Cancer' },
        { value: 'hema_onco_hx_of_lymphoma', label: 'Hema Onco Hx Of Lymphoma' },
        { value: 'hema_onco_hx_of_leukemia', label: 'Hema Onco Hx Of Leukemia' },
        { value: 'hema_onco_hx_of_hemophilia', label: 'Hema Onco Hx Of Hemophilia' },
        { value: 'hema_onco_hiv_positive', label: 'Hema Onco HIV Positive' },
        { value: 'hema_onco_hx_of_hepatitis', label: 'Hema Onco Hx Of Hepatitis' },
        { value: 'hema_onco_unspecified_immunodeficiency', label: 'Hema Onco Unspecified Immunodeficiency' },
        { value: 'hema_onco_sickle_cell_disease', label: 'Hema Onco Sickle Cell Disease' },
    ];

    const [selectedHemaOnco, setSelectedHemaOnco] = useState([]);

    const musculoskeletalOptions = [
        { value: 'musculoskeletal_no_complaints_or_symptoms', label: 'Musculoskeletal No Complaints Or Symptom' },
        { value: 'musculoskeletal_cramps', label: 'Musculoskeletal Cramp' },
        { value: 'musculoskeletal_joint_pain', label: 'Musculoskeletal Joint Pain' },
        { value: 'musculoskeletal_weak_muscles', label: 'Musculoskeletal Weak Muscles' },
        { value: 'musculoskeletal_joint_swelling', label: 'Musculoskeletal Joint Swelling' },
        { value: 'musculoskeletal_neck_pain', label: 'Musculoskeletal Neck Pain' },
        { value: 'musculoskeletal_back_pain', label: 'Musculoskeletal Back Pain' },
        { value: 'musculoskeletal_fractures', label: 'Musculoskeletal Fracture' },
        { value: 'musculoskeletal_joint_replacement', label: 'Musculoskeletal Joint Replacement' },
        { value: 'musculoskeletal_osteoporosis', label: 'Musculoskeletal Osteoporosis' },
    ];

    const [selectedMusculoskeletal, setSelectedMusculoskeletal] = useState([]);

    const endocrineOptions = [
        { value: 'endocrine_no_complaints_or_symptoms', label: 'No Complaints Or Symptoms' },
        { value: 'endocrine_sensitive_to_cold', label: 'Sensitive To Cold' },
        { value: 'endocrine_sensitive_to_hot', label: 'Sensitive To Hot' },
        { value: 'endocrine_increased_thirst', label: 'Increased Thirst' },
        { value: 'endocrine_increased_hunger', label: 'Increased Hunger' },
        { value: 'endocrine_decreased_sex_drive', label: 'Decreased Sex Drive' },
        { value: 'endocrine_diabetes', label: 'Diabetes' },
        { value: 'endocrine_esrd', label: 'Endocrine Esrd' },
        { value: 'endocrine_receiving_hemodialysis', label: 'Receiving Hemodialysis' },
    ];

    const [selectedEndocrine, setSelectedEndocrine] = useState([]);


    const goalOptions = [
        { value: 'goal_wound_mgt_for_wound_closure', label: 'Wound Management for Wound Closure' },
        { value: 'goal_improve_nutritional_status', label: 'Improve Nutritional Status' },
        { value: 'goal_minimize_risk_for_hospitalization', label: 'Minimize Risk for Hospitalization' },
        { value: 'goal_education_about_medical_condition', label: 'Education About Medical Condition' },
        { value: 'goal_identify_high_risk', label: 'Identify High Risk' },
        { value: 'goal_medications_reconciled', label: 'Medications Reconciled' },
        { value: 'goal_importance_smoking_cessation', label: 'Importance of Smoking Cessation' },
        { value: 'goal_importance_keep_dressing', label: 'Importance of Keeping Dressing' },
        { value: 'goal_minimize_walking_amount', label: 'Minimize Walking Amount' },
        { value: 'goal_protecting_dressing_bathing', label: 'Protecting Dressing and Bathing' },
        { value: 'goal_measures_for_pressure_injury', label: 'Measures for Pressure Injury' },
        { value: 'goal_compliance_importance', label: 'Compliance Importance' },
        { value: 'goal_family_member_understood_recommendations', label: 'Family Member Understood Recommendations' },
        { value: 'goal_patient_understood_recommendations', label: 'Patient Understood Recommendations' },
        { value: 'goal_notify_clinician_or_pcp', label: 'Notify Clinician or PCP' },
        { value: 'goal_pain_control', label: 'Pain Control' },
        { value: 'goal_educate_about_infection_control', label: 'Educate About Infection Control' },
        { value: 'goal_provide_plan_of_care_to_patient', label: 'Provide Plan of Care to Patient' },
        { value: 'goal_provide_plan_of_care_after_closure', label: 'Provide Plan of Care After Closure' },
        { value: 'goal_maintain_level_of_care', label: 'Maintain Level of Care' },
        { value: 'goal_remove_devitalized_tissue', label: 'Remove 50%-75% of devitalized tissue through dressings, evidencing a growth of 25% of granular tissue within the next 8 weeks.' },
        { value: 'goal_promote_granulation_epithelialization', label: 'Promote the process of granulation and epithelialization by dressings evidenced by 20% epithelial tissue on the wound surface within the next 8 weeks.' },
        { value: 'goal_fill_dead_spaces', label: 'Fill dead spaces by using a dressing to prevent abscess formation and promote granulation, evidenced by an increase in granular tissue of 1 to 2 centimeters in the next 8 weeks.' },
        { value: 'goal_maintain_moist_environment', label: 'Maintain a balanced moist environment through the use of dressings that promotes evidenced by positive progress clinical changes over the next 8 weeks.' },
        { value: 'goal_reduce_bacterial_growth', label: 'Reduce bacterial growth using a dressing evidenced by no signs of infection for the next 8 weeks.' },
        { value: 'goal_control_hypergranulation', label: 'Control hypergranulation by using a dressing evidenced by a decrease in hypergranular tissue in the next 15 days.' },
        { value: 'goal_reduce_bleeding', label: 'Reduce bleeding through the use of a dressing evidenced by changes from exudate to serous in the next 15 days.' },
        { value: 'goal_identify_signs_symptoms_infection_education', label: 'Provide education on identifying signs and symptoms of infection.' },
        { value: 'goal_guide_caregiver_keep_skin_intact', label: 'Guide the caregiver into taking measures to keep the skin intact.' },
        { value: 'goal_educate_risk_factors_for_injuries', label: 'Educate about the risk factors that favor the appearance of injuries.' },
        { value: 'goal_protect_skin_pressure_friction_shearing', label: 'Protect the skin from the adverse effects of pressure, friction and shearing.' },
        { value: 'goal_position_changes_importance', label: 'Patient and/or relative recognize the importance of position changes to prevent pressure injuries.' },
        { value: 'goal_monitor_glucose_levels_importance', label: 'Patient knows the importance of monitoring glucose levels and how they influence the healing process.' },
        
    ];

    const [selectedGoal, setSelectedGoal] = useState([]);



    const initializeValues = (data) => {
        console.log(data)
        for (var key of Object.keys(data)) {
            const value = data[key];
            if (value == true) {
                console.log(key + " -> " + data[key])
                switch (key) {
                    case "meds_anticoagulant_use":
                    case "meds_steroidal_use":
                    case "meds_hx_rad_at_wound_site":
                    case "meds_diabetics_med_use":
                    case "meds_immunosupression_therapy":
                        const selectedOption = medsOptions.filter(i => i.value === key)[0];
                        setSelectedMeds((selectedMeds) => [...selectedMeds, selectedOption]);
                        break;
                    case "allergy_not_known":
                    case "allergy_to_aspirin":
                    case "allergy_to_penicillin":
                    case "allergy_to_sulfa":
                    case "allergy_to_iodine":
                    case "allergy_to_anticonsulsants":
                    case "allergy_to_cows_milk":
                    case "allergy_to_as_arterial_venous_duplex":
                    case "allergy_to_eggs":
                    case "allergy_to_nuts":
                    case "allergy_to_seafoods":
                    case "allergy_to_shellfish":
                    case "allergy_to_peanuts":
                    case "allergy_to_wheat":
                    case "allergy_to_fish":
                    case "allergy_to_gluten":
                    case "allergy_to_arterial_venous_duplex":
                        const selectedAllergiesOption = allergiesOptions.filter(i => i.value === key)[0];
                        setSelectedAllergies((selectedAllergies) => [...selectedAllergies, selectedAllergiesOption]);
                        break;
                    case "general_no_complaints_or_symptoms":
                    case "general_info_weakness":
                    case "general_info_weight_loss":
                    case "general_info_weight_gain":
                    case "general_info_trouble_sleeping":
                    case "general_info_fever":
                    case "general_info_fatigue":
                    case "general_info_loss_of_apetite":
                    case "general_info_cancer":
                        const selectedgeneralOption = generalOptions.filter(i => i.value === key)[0];
                        setSelectedGeneral((selectedGeneral) => [...selectedGeneral, selectedgeneralOption]);
                        break;
                    case "activity_bedbound":
                    case "activity_bedbound_but_can_turn_on_bed":
                    case "activity_can_only_sit_on_bed":
                    case "activity_can_only_sit_on_chair":
                    case "activity_can_only_uses_wheelchair":
                    case "activity_can_only_uses_walker":
                    case "activity_uses_crutches":
                    case "activity_uses_cane":
                    case "activity_can_walk":
                    case "activity_can_jog":
                    case "activity_can_run":
                        const selectedactivityMobilityOption = activityMobilityOptions.filter(i => i.value === key)[0];
                        setSelectedActivityMobility((selectedActivityMobility) => [...selectedActivityMobility, selectedactivityMobilityOption]);
                        break;
                    case "skin_ulcer":
                    case "skin_lesion":
                    case "skin_rashes":
                    case "skin_dryness":
                    case "skin_dermatitis":
                    case "skin_change_in_hair":
                    case "skin_easy_bruising":
                    case "skin_color_changes":
                    case "skin_hair_loss":
                    case "skin_change_in_nails":
                    case "skin_lumps":
                    case "skin_nodules":
                    case "skin_hx_malignancy":
                        const selectedskinOption = skinOptions.filter(i => i.value === key)[0];
                        setSelectedSkin((selectedSkin) => [...selectedSkin, selectedskinOption]);
                        break;
                    case "np_no_complaints_or_symptoms":
                    case "np_alert":
                    case "np_oriented":
                    case "np_disoriented":
                    case "np_depression":
                    case "np_anxiety":
                    case "np_hearing_voices":
                    case "np_thoughts_of_suicide":
                    case "np_problems_concentrating":
                    case "np_hallucinations":
                    case "np_seizures":
                    case "np_headaches":
                    case "np_dizziness":
                    case "np_memory_loss":
                    case "np_paralysis":
                    case "np_weakness":
                    case "np_unilateral_weakness":
                    case "np_neuropathic_pain":
                    case "np_loss_of_protective_sensation":
                    case "np_alzheimers_disease":
                    case "np_unspecified_dementia":
                        const selectedneuroPsychiatricOption = neuroPsychiatricOptions.filter(i => i.value === key)[0];
                        setSelectedNeuroPsychiatric((selectedNeuroPsychiatric) => [...selectedNeuroPsychiatric, selectedneuroPsychiatricOption]);
                        break;
                    case "eyes_no_complaints_or_symptoms":
                    case "eyes_pain":
                    case "eyes_redness":
                    case "eyes_loss_of_vision":
                    case "eyes_double_vision":
                    case "eyes_blurred_vision":
                    case "eyes_dryness":
                    case "eyes_change_in_vision":
                    case "eyes_glasses":
                    case "eyes_hx_of_cataracts":
                    case "eyes_hx_glaucoma":
                        const selectedeyesOption = eyesOptions.filter(i => i.value === key)[0];
                        setSelectedEyes((selectedEyes) => [...selectedEyes, selectedeyesOption]);
                        break;
                    case "ears_no_complaints_or_symptoms":
                    case "ears_ringing":
                    case "ears_hearing_loss":
                    case "ears_vertigo":
                        const selectedearsOption = earsOptions.filter(i => i.value === key)[0];
                        setSelectedEars((selectedEars) => [...selectedEars, selectedearsOption]);
                        break;
                    case "nose_no_complaints_or_symptoms":
                    case "nose_bleeds":
                    case "nose_loss_of_smell":
                    case "nose_dry_sinuses":
                    case "noses_inusitis":
                    case "nose_bleeding_gums":
                    case "nose_mouth_sores":
                    case "nose_hoarseness":
                    case "nose_trouble_swallowing":
                        const selectednoseMouthOption = noseMouthOptions.filter(i => i.value === key)[0];
                        setSelectedNoseMouth((selectedNoseMouth) => [...selectedNoseMouth, selectednoseMouthOption]);
                        break;
                    case "cardio_no_complaints_or_symptoms":
                    case "cardio_heart_murmur":
                    case "cardio_chest_pain":
                    case "cardio_high_blood_pressure":
                    case "cardio_palpitations":
                    case "cardio_edema":
                    case "cardio_lower_extremity_swelling":
                    case "cardio_var_vein_lower_extremity_swelling":
                    case "cardio_lower_extremity_resting_pain":
                    case "cardio_lower_extremity_at_exertion_pain":
                    case "cardio_varicose_veins":
                    case "cardio_hx_of_lung_ca":
                    case "cardio_hx_of_pneumothorax":
                    case "cardio_hypertension":
                    case "cardio_hx_open_heart_surgery":
                        const selectedcardioOption = cardioOptions.filter(i => i.value === key)[0];
                        setSelectedCardio((selectedCardio) => [...selectedCardio, selectedcardioOption]);
                        break;
                    case "respiratory_no_complaints_or_symptoms":
                    case "respiratory_shortness_of_breath":
                    case "respiratory_wheezing":
                    case "respiratory_asthma":
                    case "respiratory_cough":
                    case "respiratory_seasonal_allergy":
                    case "respiratory_needs_supplemental_oxygen":
                    case "respiratory_night_sweats":
                    case "respiratory_chest_pain_with_breathing":
                    case "respiratory_atelectasis":
                        const selectedrespiratoryOption = respiratoryOptions.filter(i => i.value === key)[0];
                        setSelectedRespiratory((selectedRespiratory) => [...selectedRespiratory, selectedrespiratoryOption]);
                        break;
                    case "gastrointestinal_no_complaints_or_symptoms":
                    case "gastrointestinal_abdominal_pain":
                    case "gastrointestinal_nausea":
                    case "gastrointestinal_vomiting_food":
                    case "gastrointestinal_heartburn":
                    case "gastrointestinal_belching":
                    case "gastrointestinal_yellow_skin":
                    case "gastrointestinal_diarrhea":
                    case "gastrointestinal_constipation":
                    case "gastrointestinal_excessive_gas":
                    case "gastrointestinal_blood_in_stool":
                    case "gastrointestinal_hemorrhoids":
                    case "gastrointestinal_incontinence":
                    case "gastrointestinal_hx_ulcers":
                    case "gastrointestinal_hx_of_diverticulitis":
                    case "gastrointestinal_hx_of_irritable_bowel_syndrome":
                    case "gastrointestinal_hx_of_crohns_disease":
                    case "gastrointestinal_hx_of_ulcerative_colitis":
                        const selectedgastrointestinalOption = gastrointestinalOptions.filter(i => i.value === key)[0];
                        setSelectedGastrointestinal((selectedGastrointestinal) => [...selectedGastrointestinal, selectedgastrointestinalOption]);
                        break;
                    case "genitourinary_no_complaints_or_symptoms":
                    case "genitourinary_trouble_urinating":
                    case "genitourinary_blood_in_urine":
                    case "genitourinary_cloudy_urine":
                    case "genitourinary_frequent_urination_at_night":
                    case "genitourinary_urinary_incontinence":
                    case "genitourinary_requires_folley":
                    case "genitourinary_rash_in_genitals":
                    case "genitourinary_sexual_problems":
                    case "genitourinary_vaginal_discharge":
                    case "genitourinary_painful_ejaculations":
                    case "genitourinary_penile_discharge":
                        const selectedgenitourinaryOption = genitourinaryOptions.filter(i => i.value === key)[0];
                        setSelectedGenitourinary((selectedGenitourinary) => [...selectedGenitourinary, selectedgenitourinaryOption]);
                        break;
                    case "hema_onco_no_complaints_or_symptoms":
                    case "hema_onco_easily_bleed":
                    case "hema_onco_anemia":
                    case "hema_onco_coagulation_problems":
                    case "hema_onco_hx_of_cancer_other":
                    case "hema_onco_hx_of_breast_cancer":
                    case "hema_onco_hx_of_prostate_cancer":
                    case "hema_onco_hx_of_thyroid_cancer":
                    case "hema_onco_hx_of_lymphoma":
                    case "hema_onco_hx_of_leukemia":
                    case "hema_onco_hx_of_hemophilia":
                    case "hema_onco_hiv_positive":
                    case "hema_onco_hx_of_hepatitis":
                    case "hema_onco_unspecified_immunodeficiency":
                    case "hema_onco_sickle_cell_disease":
                        const selectedhemaOncoOption = hemaOncoOptions.filter(i => i.value === key)[0];
                        setSelectedHemaOnco((selectedHemaOnco) => [...selectedHemaOnco, selectedhemaOncoOption]);
                        break;
                    case "musculoskeletal_no_complaints_or_symptoms":
                    case "musculoskeletal_cramps":
                    case "musculoskeletal_joint_pain":
                    case "musculoskeletal_weak_muscles":
                    case "musculoskeletal_joint_swelling":
                    case "musculoskeletal_neck_pain":
                    case "musculoskeletal_back_pain":
                    case "musculoskeletal_fractures":
                    case "musculoskeletal_joint_replacement":
                    case "musculoskeletal_osteoporosis":
                        const selectedmusculoskeletalOption = musculoskeletalOptions.filter(i => i.value === key)[0];
                        setSelectedMusculoskeletal((selectedMusculoskeletal) => [...selectedMusculoskeletal, selectedmusculoskeletalOption]);
                        break;
                    case "endocrine_no_complaints_or_symptoms":
                    case "endocrine_sensitive_to_cold":
                    case "endocrine_sensitive_to_hot":
                    case "endocrine_increased_thirst":
                    case "endocrine_increased_hunger":
                    case "endocrine_decreased_sex_drive":
                    case "endocrine_diabetes":
                    case "endocrine_esrd":
                    case "endocrine_receiving_hemodialysis":
                        const selectedendocrineOption = endocrineOptions.filter(i => i.value === key)[0];
                        setSelectedEndocrine((selectedEndocrine) => [...selectedEndocrine, selectedendocrineOption]);
                        break;
                    case "goal_wound_mgt_for_wound_closure":
                    case "goal_improve_nutritional_status":
                    case "goal_minimize_risk_for_hospitalization":
                    case "goal_education_about__medical_condition":
                    case "goal_identify_high_risk":
                    case "goal_medications_reconcilied":
                    case "goal_importance_smoking_cessation":
                    case "goal_importance_keep_dressing":
                    case "goal_minimize_walking_amount":
                    case "goal_protecting_dressing_bathing":
                    case "goal_measures_for_pressure_injury":
                    case "goal_compliance_importance":
                    case "goal_family_member_understood_recomendatrions":
                    case "goal_patient_understood_recommendations":
                    case "goal_notify_clinician_or_pcp":
                    case "goal_pain_control":
                    case "goal_aeducate_about_infection_control":
                    case "goal_provide_plan_of_care_to_patient":
                    case "goal_provide_plan_of_care_after_closure":
                    case "goal_maintain_level_of_care":
                    case "goal_remove_devitalized_tissue":
                    case "goal_promote_granulation_epithelialization":
                    case "goal_fill_dead_spaces":
                    case "goal_maintain_moist_environment":
                    case "goal_reduce_bacterial_growth":
                    case "goal_control_hypergranulation":
                    case "goal_reduce_bleeding":
                    case "goal_identify_signs_symptoms_infection_education":
                    case "goal_guide_caregiver_keep_skin_intact":
                    case "goal_educate_risk_factors_for_injuries":
                    case "goal_protect_skin_pressure_friction_shearing":
                    case "goal_position_changes_importance":
                    case "goal_monitor_glucose_levels_importance":
                        const selectedgoalOption = goalOptions.filter(i => i.value === key)[0];
                        setSelectedGoal((selectedGoal) => [...selectedGoal, selectedgoalOption]);
                        break;
                }
            }
        }
    }

    const toggleTab = tab => {
        setActiveTab(tab)
    }

    const [formData, setFormData] = useState({
        record_number: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        second_last_name: "",
        date_of_birth: "",
        picture_file_url: "",
    });

    React.useEffect(() => {
        useApi
            .get(`/patients/${id}`, {})
            .then((res) => {
                const data = res.data.data;
                setFormData({
                    id: data.id,
                    record_number: data.record_number,
                    first_name: data.first_name,
                    middle_name: data.middle_name,
                    last_name: data.last_name,
                    second_last_name: data.second_last_name,
                    date_of_birth: data.date_of_birth,
                    picture_file_url: data.picture_file_url,
                });
            })
            .catch((err) => {
                showAlertError(err);
            });

    }, [id]);

    const [socFormData, setSOCFormData] = useState({
        patient_id: "",
        data_date: "",
        wound_note_id: "",
        information_taken_from_id: "",
        type_of_visit_id: "",
        location_id: "",
        chief_complaint: "",
        condition_related_to_employment: "",
        condition_related_to_car_accident: "",
        condition_related_to_other_accident: "",
        patient_weight_unit_id: "",
        patient_height_id: "",
        patient_weight: "",
        patient_bmi: "",
        meds_anticoagulant_use: "",
        meds_steroidal_use: "",
        meds_hx_rad_at_wound_site: "",
        meds_diabetics_med_use: "",
        meds_recieving_chemo: "",
        meds_immunosupression_therapy: "",
        social_rx_smoking_id: "",
        social_rx_substance_abuse_id: "",
        social_rx_alcohol_use_id: "",
        social_rx_lives_with_id: "",
        social_rx_self_care_id: "",
        social_rx_comments: "",
        goal_wound_mgt_for_wound_closure: "",
        goal_improve_nutritional_status: "",
        goal_minimize_risk_for_hospitalization: "",
        goal_education_about__medical_condition: "",
        goal_identify_high_risk: "",
        goal_medications_reconcilied: "",
        goal_importance_smoking_cessation: "",
        goal_importance_keep_dressing: "",
        goal_minimize_walking_amount: "",
        goal_protecting_dressing_bathing: "",
        goal_measures_for_pressure_injury: "",
        goal_compliance_importance: "",
        goal_family_member_understood_recomendatrions: "",
        goal_patient_understood_recommendations: "",
        goal_notify_clinician_or_pcp: "",
        goal_pain_control: "",
        goal_aeducate_about_infection_control: "",
        goal_provide_plan_of_care_to_patient: "",
        goal_provide_plan_of_care_after_closure: "",
        goal_maintain_level_of_care: "",
        goal_remove_devitalized_tissue: "",
        goal_promote_granulation_epithelialization: "",
        goal_fill_dead_spaces: "",
        goal_maintain_moist_environment: "",
        goal_reduce_bacterial_growth: "",
        goal_control_hypergranulation: "",
        goal_reduce_bleeding: "",
        goal_identify_signs_symptoms_infection_education: "",
        goal_guide_caregiver_keep_skin_intact: "",
        goal_educate_risk_factors_for_injuries: "",
        goal_protect_skin_pressure_friction_shearing: "",
        goal_position_changes_importance: "",
        goal_monitor_glucose_levels_importance: "",
        allergy_not_known: "",
        allergy_to_aspirin: "",
        allergy_to_penicillin: "",
        allergy_to_sulfa: "",
        allergy_to_iodine: "",
        allergy_to_anticonsulsants: "",
        allergy_to_cows_milk: "",
        allergy_to_as_arterial_venous_duplex: "",
        allergy_to_eggs: "",
        allergy_to_nuts: "",
        allergy_to_seafoods: "",
        allergy_to_shellfish: "",
        allergy_to_peanuts: "",
        allergy_to_wheat: "",
        allergy_to_fish: "",
        allergy_to_gluten: "",
        allergy_to_arterial_venous_duplex: "",
        allergy_others: "",
        skin_ulcer: "",
        skin_lesion: "",
        skin_rashes: "",
        skin_dryness: "",
        skin_dermatitis: "",
        skin_change_in_hair: "",
        skin_easy_bruising: "",
        skin_color_changes: "",
        skin_hair_loss: "",
        skin_change_in_nails: "",
        skin_lumps: "",
        skin_nodules: "",
        skin_hx_malignancy: "",
        skin_others: "",
        signature_clinician: "",
        signature_physician: "",
        physician_id: "",
        signature_date: "",
        clinician_id: "",
        dedicated_signature: "",
        np_no_complaints_or_symptoms: "",
        np_alert: "",
        np_oriented: "",
        np_disoriented: "",
        np_depression: "",
        np_anxiety: "",
        np_hearing_voices: "",
        np_thoughts_of_suicide: "",
        np_problems_concentrating: "",
        np_hallucinations: "",
        np_seizures: "",
        np_headaches: "",
        np_dizziness: "",
        np_memory_loss: "",
        np_paralysis: "",
        np_weakness: "",
        np_unilateral_weakness: "",
        np_neuropathic_pain: "",
        np_loss_of_protective_sensation: "",
        np_alzheimers_disease: "",
        np_unspecified_dementia: "",
        np_others: "",
        eyes_no_complaints_or_symptoms: "",
        eyes_pain: "",
        eyes_redness: "",
        eyes_loss_of_vision: "",
        eyes_double_vision: "",
        eyes_blurred_vision: "",
        eyes_dryness: "",
        eyes_change_in_vision: "",
        eyes_glasses: "",
        eyes_hx_of_cataracts: "",
        eyes_hx_glaucoma: "",
        eyes_others: "",
        ears_no_complaints_or_symptoms: "",
        ears_ringing: "",
        ears_hearing_loss: "",
        ears_vertigo: "",
        ears_others: "",
        nose_no_complaints_or_symptoms: "",
        nose_bleeds: "",
        nose_loss_of_smell: "",
        nose_dry_sinuses: "",
        noses_inusitis: "",
        nose_bleeding_gums: "",
        nose_mouth_sores: "",
        nose_hoarseness: "",
        nose_trouble_swallowing: "",
        nose_others: "",
        cardio_no_complaints_or_symptoms: "",
        cardio_heart_murmur: "",
        cardio_chest_pain: "",
        cardio_high_blood_pressure: "",
        cardio_palpitations: "",
        cardio_edema: "",
        cardio_lower_extremity_swelling: "",
        cardio_var_vein_lower_extremity_swelling: "",
        cardio_lower_extremity_resting_pain: "",
        cardio_lower_extremity_at_exertion_pain: "",
        cardio_varicose_veins: "",
        cardio_hx_of_lung_ca: "",
        cardio_hx_of_pneumothorax: "",
        cardio_hypertension: "",
        cardio_hx_open_heart_surgery: "",
        cardio_others: "",
        respiratory_no_complaints_or_symptoms: "",
        respiratory_shortness_of_breath: "",
        respiratory_wheezing: "",
        respiratory_asthma: "",
        respiratory_cough: "",
        respiratory_seasonal_allergy: "",
        respiratory_needs_supplemental_oxygen: "",
        respiratory_night_sweats: "",
        respiratory_chest_pain_with_breathing: "",
        respiratory_atelectasis: "",
        respiratory_others: "",
        gastrointestinal_no_complaints_or_symptoms: "",
        gastrointestinal_abdominal_pain: "",
        gastrointestinal_nausea: "",
        gastrointestinal_vomiting_food: "",
        gastrointestinal_heartburn: "",
        gastrointestinal_belching: "",
        gastrointestinal_yellow_skin: "",
        gastrointestinal_diarrhea: "",
        gastrointestinal_constipation: "",
        gastrointestinal_excessive_gas: "",
        gastrointestinal_blood_in_stool: "",
        gastrointestinal_hemorrhoids: "",
        gastrointestinal_incontinence: "",
        gastrointestinal_hx_ulcers: "",
        gastrointestinal_hx_of_diverticulitis: "",
        gastrointestinal_hx_of_irritable_bowel_syndrome: "",
        gastrointestinal_hx_of_crohns_disease: "",
        gastrointestinal_hx_of_ulcerative_colitis: "",
        gastrointestinal_others: "",
        genitourinary_no_complaints_or_symptoms: "",
        genitourinary_trouble_urinating: "",
        genitourinary_blood_in_urine: "",
        genitourinary_cloudy_urine: "",
        genitourinary_frequent_urination_at_night: "",
        genitourinary_urinary_incontinence: "",
        genitourinary_requires_folley: "",
        genitourinary_rash_in_genitals: "",
        genitourinary_sexual_problems: "",
        genitourinary_vaginal_discharge: "",
        genitourinary_painful_ejaculations: "",
        genitourinary_penile_discharge: "",
        genitourinary_others: "",
        hema_onco_no_complaints_or_symptoms: "",
        hema_onco_easily_bleed: "",
        hema_onco_anemia: "",
        hema_onco_coagulation_problems: "",
        hema_onco_hx_of_cancer_other: "",
        hema_onco_hx_of_breast_cancer: "",
        hema_onco_hx_of_prostate_cancer: "",
        hema_onco_hx_of_thyroid_cancer: "",
        hema_onco_hx_of_lymphoma: "",
        hema_onco_hx_of_leukemia: "",
        hema_onco_hx_of_hemophilia: "",
        hema_onco_hiv_positive: "",
        hema_onco_hx_of_hepatitis: "",
        hema_onco_unspecified_immunodeficiency: "",
        hema_onco_sickle_cell_disease: "",
        hema_onco_others: "",
        musculoskeletal_no_complaints_or_symptoms: "",
        musculoskeletal_cramps: "",
        musculoskeletal_joint_pain: "",
        musculoskeletal_weak_muscles: "",
        musculoskeletal_joint_swelling: "",
        musculoskeletal_neck_pain: "",
        musculoskeletal_back_pain: "",
        musculoskeletal_fractures: "",
        musculoskeletal_joint_replacement: "",
        musculoskeletal_osteoporosis: "",
        musculoskeletal_others: "",
        endocrine_no_complaints_or_symptoms: "",
        endocrine_sensitive_to_cold: "",
        endocrine_sensitive_to_hot: "",
        endocrine_increased_thirst: "",
        endocrine_increased_hunger: "",
        endocrine_decreased_sex_drive: "",
        endocrine_diabetes: "",
        endocrine_esrd: "",
        endocrine_receiving_hemodialysis: "",
        endocrine_others: "",
        general_no_complaints_or_symptoms: "",
        general_info_weakness: "",
        general_info_weight_loss: "",
        general_info_weight_gain: "",
        general_info_trouble_sleeping: "",
        general_info_fever: "",
        general_info_fatigue: "",
        general_info_loss_of_apetite: "",
        general_info_cancer: "",
        general_info_others: "",
        sample_taken: "",
        activity_bedbound: "",
        activity_bedbound_but_can_turn_on_bed: "",
        activity_can_only_sit_on_bed: "",
        activity_can_only_sit_on_chair: "",
        activity_can_only_uses_wheelchair: "",
        activity_can_only_uses_walker: "",
        activity_uses_crutches: "",
        activity_uses_cane: "",
        activity_can_walk: "",
        activity_can_jog: "",
        activity_can_run: "",
        complete: "",
        notify: "",
        additional_comments: "",
        status_id: "",

        location_id_name: "",
        type_of_visit_id_description: "",
        information_taken_from_id_description: "",
        patient_weight_unit_id_description: "",
        patient_height_id_description: "",
        social_rx_smoking_id_description: "",
        social_rx_substance_abuse_id_description: "",
        social_rx_alcohol_use_id_description: "",
        social_rx_lives_with_id_description: "",
        social_rx_self_care_id_description: "",
        status_id_description: "",

    });

    React.useEffect(() => {
        setLoading(true);
        useApi
            .get(`/start_of_care/${socId}`, {})
            .then((res) => {
                const data = res.data.data;
                setSOCFormData({
                    data_date: dateToISOString(new Date(data.data_date)),
                    information_taken_from_id: isNaN(data.information_taken_from_id) ? null : parseInt(data.information_taken_from_id),
                    type_of_visit_id: isNaN(data.type_of_visit_id) ? null : parseInt(data.type_of_visit_id),
                    location_id: isNaN(data.location_id) ? null : parseInt(data.location_id),
                    chief_complaint: data.chief_complaint,
                    condition_related_to_employment: data.condition_related_to_employment,
                    condition_related_to_car_accident: data.condition_related_to_car_accident,
                    condition_related_to_other_accident: data.condition_related_to_other_accident,
                    patient_weight_unit_id: isNaN(data.patient_weight_unit_id) ? null : parseInt(data.patient_weight_unit_id),
                    patient_height_id: isNaN(data.patient_height_id) ? null : parseInt(data.patient_height_id),
                    patient_weight: isNaN(data.patient_weight) ? null : parseInt(data.patient_weight),
                    patient_bmi: isNaN(data.patient_bmi) ? null : parseInt(data.patient_bmi),
                    meds_anticoagulant_use: data.meds_anticoagulant_use,
                    meds_steroidal_use: data.meds_steroidal_use,
                    meds_hx_rad_at_wound_site: data.meds_hx_rad_at_wound_site,
                    meds_diabetics_med_use: data.meds_diabetics_med_use,
                    meds_recieving_chemo: data.meds_recieving_chemo,
                    meds_immunosupression_therapy: data.meds_immunosupression_therapy,
                    social_rx_smoking_id: isNaN(data.social_rx_smoking_id) ? null : parseInt(data.social_rx_smoking_id),
                    social_rx_substance_abuse_id: isNaN(data.social_rx_substance_abuse_id) ? null : parseInt(data.social_rx_substance_abuse_id),
                    social_rx_alcohol_use_id: isNaN(data.social_rx_alcohol_use_id) ? null : parseInt(data.social_rx_alcohol_use_id),
                    social_rx_lives_with_id: isNaN(data.social_rx_lives_with_id) ? null : parseInt(data.social_rx_lives_with_id),
                    social_rx_self_care_id: isNaN(data.social_rx_self_care_id) ? null : parseInt(data.social_rx_self_care_id),
                    social_rx_comments: data.social_rx_comments,
                    goal_wound_mgt_for_wound_closure: data.goal_wound_mgt_for_wound_closure,
                    goal_improve_nutritional_status: data.goal_improve_nutritional_status,
                    goal_minimize_risk_for_hospitalization: data.goal_minimize_risk_for_hospitalization,
                    goal_education_about__medical_condition: data.goal_education_about__medical_condition,
                    goal_identify_high_risk: data.goal_identify_high_risk,
                    goal_medications_reconcilied: data.goal_medications_reconcilied,
                    goal_importance_smoking_cessation: data.goal_importance_smoking_cessation,
                    goal_importance_keep_dressing: data.goal_importance_keep_dressing,
                    goal_minimize_walking_amount: data.goal_minimize_walking_amount,
                    goal_protecting_dressing_bathing: data.goal_protecting_dressing_bathing,
                    goal_measures_for_pressure_injury: data.goal_measures_for_pressure_injury,
                    goal_compliance_importance: data.goal_compliance_importance,
                    goal_family_member_understood_recomendatrions: data.goal_family_member_understood_recomendatrions,
                    goal_patient_understood_recommendations: data.goal_patient_understood_recommendations,
                    goal_notify_clinician_or_pcp: data.goal_notify_clinician_or_pcp,
                    goal_pain_control: data.goal_pain_control,
                    goal_aeducate_about_infection_control: data.goal_aeducate_about_infection_control,
                    goal_provide_plan_of_care_to_patient: data.goal_provide_plan_of_care_to_patient,
                    goal_provide_plan_of_care_after_closure: data.goal_provide_plan_of_care_after_closure,
                    goal_maintain_level_of_care: data.goal_maintain_level_of_care,
                    goal_remove_devitalized_tissue: data.goal_remove_devitalized_tissue,
                    goal_promote_granulation_epithelialization: data.goal_promote_granulation_epithelialization,
                    goal_fill_dead_spaces: data.goal_fill_dead_spaces,
                    goal_maintain_moist_environment: data.goal_maintain_moist_environment,
                    goal_reduce_bacterial_growth: data.goal_reduce_bacterial_growth,
                    goal_control_hypergranulation: data.goal_control_hypergranulation,
                    goal_reduce_bleeding: data.goal_reduce_bleeding,
                    goal_identify_signs_symptoms_infection_education: data.goal_identify_signs_symptoms_infection_education,
                    goal_guide_caregiver_keep_skin_intact: data.goal_guide_caregiver_keep_skin_intact,
                    goal_educate_risk_factors_for_injuries: data.goal_educate_risk_factors_for_injuries,
                    goal_protect_skin_pressure_friction_shearing: data.goal_protect_skin_pressure_friction_shearing,
                    goal_position_changes_importance: data.goal_position_changes_importance,
                    goal_monitor_glucose_levels_importance: data.goal_monitor_glucose_levels_importance,
                    allergy_not_known: data.allergy_not_known,
                    allergy_to_aspirin: data.allergy_to_aspirin,
                    allergy_to_penicillin: data.allergy_to_penicillin,
                    allergy_to_sulfa: data.allergy_to_sulfa,
                    allergy_to_iodine: data.allergy_to_iodine,
                    allergy_to_anticonsulsants: data.allergy_to_anticonsulsants,
                    allergy_to_cows_milk: data.allergy_to_cows_milk,
                    allergy_to_as_arterial_venous_duplex: data.allergy_to_as_arterial_venous_duplex,
                    allergy_to_eggs: data.allergy_to_eggs,
                    allergy_to_nuts: data.allergy_to_nuts,
                    allergy_to_seafoods: data.allergy_to_seafoods,
                    allergy_to_shellfish: data.allergy_to_shellfish,
                    allergy_to_peanuts: data.allergy_to_peanuts,
                    allergy_to_wheat: data.allergy_to_wheat,
                    allergy_to_fish: data.allergy_to_fish,
                    allergy_to_gluten: data.allergy_to_gluten,
                    allergy_to_arterial_venous_duplex: data.allergy_to_arterial_venous_duplex,
                    allergy_others: data.allergy_others,
                    skin_ulcer: data.skin_ulcer,
                    skin_lesion: data.skin_lesion,
                    skin_rashes: data.skin_rashes,
                    skin_dryness: data.skin_dryness,
                    skin_dermatitis: data.skin_dermatitis,
                    skin_change_in_hair: data.skin_change_in_hair,
                    skin_easy_bruising: data.skin_easy_bruising,
                    skin_color_changes: data.skin_color_changes,
                    skin_hair_loss: data.skin_hair_loss,
                    skin_change_in_nails: data.skin_change_in_nails,
                    skin_lumps: data.skin_lumps,
                    skin_nodules: data.skin_nodules,
                    skin_hx_malignancy: data.skin_hx_malignancy,
                    skin_others: data.skin_others,
                    signature_clinician: data.signature_clinician,
                    signature_physician: data.signature_physician,
                    physician_id: isNaN(data.physician_id) ? null : parseInt(data.physician_id),
                    signature_date: data.signature_date,
                    clinician_id: isNaN(data.clinician_id) ? null : parseInt(data.clinician_id),
                    dedicated_signature: isNaN(data.dedicated_signature) ? null : parseInt(data.dedicated_signature),
                    np_no_complaints_or_symptoms: data.np_no_complaints_or_symptoms,
                    np_alert: data.np_alert,
                    np_oriented: data.np_oriented,
                    np_disoriented: data.np_disoriented,
                    np_depression: data.np_depression,
                    np_anxiety: data.np_anxiety,
                    np_hearing_voices: data.np_hearing_voices,
                    np_thoughts_of_suicide: data.np_thoughts_of_suicide,
                    np_problems_concentrating: data.np_problems_concentrating,
                    np_hallucinations: data.np_hallucinations,
                    np_seizures: data.np_seizures,
                    np_headaches: data.np_headaches,
                    np_dizziness: data.np_dizziness,
                    np_memory_loss: data.np_memory_loss,
                    np_paralysis: data.np_paralysis,
                    np_weakness: data.np_weakness,
                    np_unilateral_weakness: data.np_unilateral_weakness,
                    np_neuropathic_pain: data.np_neuropathic_pain,
                    np_loss_of_protective_sensation: data.np_loss_of_protective_sensation,
                    np_alzheimers_disease: data.np_alzheimers_disease,
                    np_unspecified_dementia: data.np_unspecified_dementia,
                    np_others: data.np_others,
                    eyes_no_complaints_or_symptoms: data.eyes_no_complaints_or_symptoms,
                    eyes_pain: data.eyes_pain,
                    eyes_redness: data.eyes_redness,
                    eyes_loss_of_vision: data.eyes_loss_of_vision,
                    eyes_double_vision: data.eyes_double_vision,
                    eyes_blurred_vision: data.eyes_blurred_vision,
                    eyes_dryness: data.eyes_dryness,
                    eyes_change_in_vision: data.eyes_change_in_vision,
                    eyes_glasses: data.eyes_glasses,
                    eyes_hx_of_cataracts: data.eyes_hx_of_cataracts,
                    eyes_hx_glaucoma: data.eyes_hx_glaucoma,
                    eyes_others: data.eyes_others,
                    ears_no_complaints_or_symptoms: data.ears_no_complaints_or_symptoms,
                    ears_ringing: data.ears_ringing,
                    ears_hearing_loss: data.ears_hearing_loss,
                    ears_vertigo: data.ears_vertigo,
                    ears_others: data.ears_others,
                    nose_no_complaints_or_symptoms: data.nose_no_complaints_or_symptoms,
                    nose_bleeds: data.nose_bleeds,
                    nose_loss_of_smell: data.nose_loss_of_smell,
                    nose_dry_sinuses: data.nose_dry_sinuses,
                    noses_inusitis: data.noses_inusitis,
                    nose_bleeding_gums: data.nose_bleeding_gums,
                    nose_mouth_sores: data.nose_mouth_sores,
                    nose_hoarseness: data.nose_hoarseness,
                    nose_trouble_swallowing: data.nose_trouble_swallowing,
                    nose_others: data.nose_others,
                    cardio_no_complaints_or_symptoms: data.cardio_no_complaints_or_symptoms,
                    cardio_heart_murmur: data.cardio_heart_murmur,
                    cardio_chest_pain: data.cardio_chest_pain,
                    cardio_high_blood_pressure: data.cardio_high_blood_pressure,
                    cardio_palpitations: data.cardio_palpitations,
                    cardio_edema: data.cardio_edema,
                    cardio_lower_extremity_swelling: data.cardio_lower_extremity_swelling,
                    cardio_var_vein_lower_extremity_swelling: data.cardio_var_vein_lower_extremity_swelling,
                    cardio_lower_extremity_resting_pain: data.cardio_lower_extremity_resting_pain,
                    cardio_lower_extremity_at_exertion_pain: data.cardio_lower_extremity_at_exertion_pain,
                    cardio_varicose_veins: data.cardio_varicose_veins,
                    cardio_hx_of_lung_ca: data.cardio_hx_of_lung_ca,
                    cardio_hx_of_pneumothorax: data.cardio_hx_of_pneumothorax,
                    cardio_hypertension: data.cardio_hypertension,
                    cardio_hx_open_heart_surgery: data.cardio_hx_open_heart_surgery,
                    cardio_others: data.cardio_others,
                    respiratory_no_complaints_or_symptoms: data.respiratory_no_complaints_or_symptoms,
                    respiratory_shortness_of_breath: data.respiratory_shortness_of_breath,
                    respiratory_wheezing: data.respiratory_wheezing,
                    respiratory_asthma: data.respiratory_asthma,
                    respiratory_cough: data.respiratory_cough,
                    respiratory_seasonal_allergy: data.respiratory_seasonal_allergy,
                    respiratory_needs_supplemental_oxygen: data.respiratory_needs_supplemental_oxygen,
                    respiratory_night_sweats: data.respiratory_night_sweats,
                    respiratory_chest_pain_with_breathing: data.respiratory_chest_pain_with_breathing,
                    respiratory_atelectasis: data.respiratory_atelectasis,
                    respiratory_others: data.respiratory_others,
                    gastrointestinal_no_complaints_or_symptoms: data.gastrointestinal_no_complaints_or_symptoms,
                    gastrointestinal_abdominal_pain: data.gastrointestinal_abdominal_pain,
                    gastrointestinal_nausea: data.gastrointestinal_nausea,
                    gastrointestinal_vomiting_food: data.gastrointestinal_vomiting_food,
                    gastrointestinal_heartburn: data.gastrointestinal_heartburn,
                    gastrointestinal_belching: data.gastrointestinal_belching,
                    gastrointestinal_yellow_skin: data.gastrointestinal_yellow_skin,
                    gastrointestinal_diarrhea: data.gastrointestinal_diarrhea,
                    gastrointestinal_constipation: data.gastrointestinal_constipation,
                    gastrointestinal_excessive_gas: data.gastrointestinal_excessive_gas,
                    gastrointestinal_blood_in_stool: data.gastrointestinal_blood_in_stool,
                    gastrointestinal_hemorrhoids: data.gastrointestinal_hemorrhoids,
                    gastrointestinal_incontinence: data.gastrointestinal_incontinence,
                    gastrointestinal_hx_ulcers: data.gastrointestinal_hx_ulcers,
                    gastrointestinal_hx_of_diverticulitis: data.gastrointestinal_hx_of_diverticulitis,
                    gastrointestinal_hx_of_irritable_bowel_syndrome: data.gastrointestinal_hx_of_irritable_bowel_syndrome,
                    gastrointestinal_hx_of_crohns_disease: data.gastrointestinal_hx_of_crohns_disease,
                    gastrointestinal_hx_of_ulcerative_colitis: data.gastrointestinal_hx_of_ulcerative_colitis,
                    gastrointestinal_others: data.gastrointestinal_others,
                    genitourinary_no_complaints_or_symptoms: data.genitourinary_no_complaints_or_symptoms,
                    genitourinary_trouble_urinating: data.genitourinary_trouble_urinating,
                    genitourinary_blood_in_urine: data.genitourinary_blood_in_urine,
                    genitourinary_cloudy_urine: data.genitourinary_cloudy_urine,
                    genitourinary_frequent_urination_at_night: data.genitourinary_frequent_urination_at_night,
                    genitourinary_urinary_incontinence: data.genitourinary_urinary_incontinence,
                    genitourinary_requires_folley: data.genitourinary_requires_folley,
                    genitourinary_rash_in_genitals: data.genitourinary_rash_in_genitals,
                    genitourinary_sexual_problems: data.genitourinary_sexual_problems,
                    genitourinary_vaginal_discharge: data.genitourinary_vaginal_discharge,
                    genitourinary_painful_ejaculations: data.genitourinary_painful_ejaculations,
                    genitourinary_penile_discharge: data.genitourinary_penile_discharge,
                    genitourinary_others: data.genitourinary_others,
                    hema_onco_no_complaints_or_symptoms: data.hema_onco_no_complaints_or_symptoms,
                    hema_onco_easily_bleed: data.hema_onco_easily_bleed,
                    hema_onco_anemia: data.hema_onco_anemia,
                    hema_onco_coagulation_problems: data.hema_onco_coagulation_problems,
                    hema_onco_hx_of_cancer_other: data.hema_onco_hx_of_cancer_other,
                    hema_onco_hx_of_breast_cancer: data.hema_onco_hx_of_breast_cancer,
                    hema_onco_hx_of_prostate_cancer: data.hema_onco_hx_of_prostate_cancer,
                    hema_onco_hx_of_thyroid_cancer: data.hema_onco_hx_of_thyroid_cancer,
                    hema_onco_hx_of_lymphoma: data.hema_onco_hx_of_lymphoma,
                    hema_onco_hx_of_leukemia: data.hema_onco_hx_of_leukemia,
                    hema_onco_hx_of_hemophilia: data.hema_onco_hx_of_hemophilia,
                    hema_onco_hiv_positive: data.hema_onco_hiv_positive,
                    hema_onco_hx_of_hepatitis: data.hema_onco_hx_of_hepatitis,
                    hema_onco_unspecified_immunodeficiency: data.hema_onco_unspecified_immunodeficiency,
                    hema_onco_sickle_cell_disease: data.hema_onco_sickle_cell_disease,
                    hema_onco_others: data.hema_onco_others,
                    musculoskeletal_no_complaints_or_symptoms: data.musculoskeletal_no_complaints_or_symptoms,
                    musculoskeletal_cramps: data.musculoskeletal_cramps,
                    musculoskeletal_joint_pain: data.musculoskeletal_joint_pain,
                    musculoskeletal_weak_muscles: data.musculoskeletal_weak_muscles,
                    musculoskeletal_joint_swelling: data.musculoskeletal_joint_swelling,
                    musculoskeletal_neck_pain: data.musculoskeletal_neck_pain,
                    musculoskeletal_back_pain: data.musculoskeletal_back_pain,
                    musculoskeletal_fractures: data.musculoskeletal_fractures,
                    musculoskeletal_joint_replacement: data.musculoskeletal_joint_replacement,
                    musculoskeletal_osteoporosis: data.musculoskeletal_osteoporosis,
                    musculoskeletal_others: data.musculoskeletal_others,
                    endocrine_no_complaints_or_symptoms: data.endocrine_no_complaints_or_symptoms,
                    endocrine_sensitive_to_cold: data.endocrine_sensitive_to_cold,
                    endocrine_sensitive_to_hot: data.endocrine_sensitive_to_hot,
                    endocrine_increased_thirst: data.endocrine_increased_thirst,
                    endocrine_increased_hunger: data.endocrine_increased_hunger,
                    endocrine_decreased_sex_drive: data.endocrine_decreased_sex_drive,
                    endocrine_diabetes: data.endocrine_diabetes,
                    endocrine_esrd: data.endocrine_esrd,
                    endocrine_receiving_hemodialysis: data.endocrine_receiving_hemodialysis,
                    endocrine_others: data.endocrine_others,
                    general_no_complaints_or_symptoms: data.general_no_complaints_or_symptoms,
                    general_info_weakness: data.general_info_weakness,
                    general_info_weight_loss: data.general_info_weight_loss,
                    general_info_weight_gain: data.general_info_weight_gain,
                    general_info_trouble_sleeping: data.general_info_trouble_sleeping,
                    general_info_fever: data.general_info_fever,
                    general_info_fatigue: data.general_info_fatigue,
                    general_info_loss_of_apetite: data.general_info_loss_of_apetite,
                    general_info_cancer: data.general_info_cancer,
                    general_info_others: data.general_info_others,
                    sample_taken: data.sample_taken,
                    activity_bedbound: data.activity_bedbound,
                    activity_bedbound_but_can_turn_on_bed: data.activity_bedbound_but_can_turn_on_bed,
                    activity_can_only_sit_on_bed: data.activity_can_only_sit_on_bed,
                    activity_can_only_sit_on_chair: data.activity_can_only_sit_on_chair,
                    activity_can_only_uses_wheelchair: data.activity_can_only_uses_wheelchair,
                    activity_can_only_uses_walker: data.activity_can_only_uses_walker,
                    activity_uses_crutches: data.activity_uses_crutches,
                    activity_uses_cane: data.activity_uses_cane,
                    activity_can_walk: data.activity_can_walk,
                    activity_can_jog: data.activity_can_jog,
                    activity_can_run: data.activity_can_run,
                    complete: isNaN(data.complete) ? null : parseInt(data.complete),
                    notify: isNaN(data.notify) ? null : parseInt(data.notify),
                    additional_comments: data.additional_comments,
                    status_id: isNaN(data.status_id) ? null : parseInt(data.status_id),
                });

                initializeValues(data);

                setLoading(false);
            })
            .catch((err) => {
                showAlertError(err);
                setLoading(false);
            });

    }, [id]);

    const saveFieldCallback = (field, value) => {
        console.log(field, value)
        useApi
            .doRun("put", `/start_of_care/${socId}/update_field`, {
                field_name: field,
                field_value: value === '' ? null : value,
            })
            .then((res) => {

            })
            .catch((err) => {
                showAlertError(err);
            });
    }

    React.useEffect(() => {

        useApi
            .get("/lookup/locations", {})
            .then((res) => {
                var items = [{ label: "", value: "" }];
                res.data.data.map((r) => {
                    const option = { label: r.name, value: r.id };
                    items.push(option);
                    return option;
                });
                setLocations(items);
            })
            .catch((err) => {
                showAlertError(err);
            });
        useApi
            .get("/lookup/visit_types", {})
            .then((res) => {
                var items = [{ label: "", value: "" }];
                res.data.data.map((r) => {
                    const option = { label: r.description, value: r.id };
                    items.push(option);
                    return option;
                });
                setVisit_Types(items);
            })
            .catch((err) => {
                showAlertError(err);
            });
        useApi
            .get("/lookup/information_taken_from_options", {})
            .then((res) => {
                var items = [{ label: "", value: "" }];
                res.data.data.map((r) => {
                    const option = { label: r.description, value: r.id };
                    items.push(option);
                    return option;
                });
                setInformation_Taken_From_Options(items);
            })
            .catch((err) => {
                showAlertError(err);
            });
    }, []);

    const handleChange = (evt) => {
        if (evt.target.type === 'checkbox') {
            const value = evt.target.type === 'checkbox' ? evt.target.checked : evt.target.value;
            setSOCFormData({
                ...socFormData,
                [evt.target.name]: value,
            });

            saveFieldCallback(evt.target.name, value === 'on' ? "true" : "false")
        }
        else {
            setSOCFormData({
                ...socFormData,
                [evt.target.name]: evt.target.value,
            });
            if (evt.target.type !== 'text') {
                saveFieldCallback(evt.target.name, evt.target.value)
            }
        }
    }

    const handleInputChange = (evt) => {
        saveFieldCallback(evt.target.name, evt.target.value)
    }

    const handleDataDateChange = (evt) => {
        const val = dateToISOString(new Date(evt));
        console.log(val)
        setSOCFormData({
            ...socFormData,
            ['data_date']: val,
        });

        saveFieldCallback('data_date', val)

    }

    const handleSelectChange = (value, e) => {
        switch (e.action) {
            case "remove-value":
                setSelectedMeds((selectedMeds) => selectedMeds.filter((x) => x.value !== e.removedValue.value));
                saveFieldCallback(e.removedValue.value, "false");
                break;
            case "select-option":
                setSelectedMeds((selectedMeds) => [...selectedMeds, e.option]);
                saveFieldCallback(e.option.value, "true");
                break;
        }

    }

    const handleAllergiesSelectChange = (value, e) => {
        switch (e.action) {
            case "remove-value":
                setSelectedAllergies((selectedAllergies) => selectedAllergies.filter((x) => x.value !== e.removedValue.value));
                saveFieldCallback(e.removedValue.value, "false");
                break;
            case "select-option":
                setSelectedAllergies((selectedAllergies) => [...selectedAllergies, e.option]);
                saveFieldCallback(e.option.value, "true");
                break;
        }

    }

    const handleGeneralSelectChange = (value, e) => {
        switch (e.action) {
            case "remove-value":
                setSelectedGeneral((selectedGeneral) => selectedGeneral.filter((x) => x.value !== e.removedValue.value));
                saveFieldCallback(e.removedValue.value, "false");
                break;
            case "select-option":
                setSelectedGeneral((selectedGeneral) => [...selectedGeneral, e.option]);
                saveFieldCallback(e.option.value, "true");
                break;
        }

    }
    const handleActivityMobilitySelectChange = (value, e) => {
        switch (e.action) {
            case "remove-value":
                setSelectedActivityMobility((selectedActivityMobility) => selectedActivityMobility.filter((x) => x.value !== e.removedValue.value));
                saveFieldCallback(e.removedValue.value, "false");
                break;
            case "select-option":
                setSelectedActivityMobility((selectedActivityMobility) => [...selectedActivityMobility, e.option]);
                saveFieldCallback(e.option.value, "true");
                break;
        }
    }
    const handleSkinSelectChange = (value, e) => {
        switch (e.action) {
            case "remove-value":
                setSelectedSkin((selectedSkin) => selectedSkin.filter((x) => x.value !== e.removedValue.value));
                saveFieldCallback(e.removedValue.value, "false");
                break;
            case "select-option":
                setSelectedSkin((selectedSkin) => [...selectedSkin, e.option]);
                saveFieldCallback(e.option.value, "true");
                break;
        }

    }

    const handleNeuroPsychiatricSelectChange = (value, e) => {
        switch (e.action) {
            case "remove-value":
                setSelectedNeuroPsychiatric((selectedNeuroPsychiatric) => selectedNeuroPsychiatric.filter((x) => x.value !== e.removedValue.value));
                saveFieldCallback(e.removedValue.value, "false");
                break;
            case "select-option":
                setSelectedNeuroPsychiatric((selectedNeuroPsychiatric) => [...selectedNeuroPsychiatric, e.option]);
                saveFieldCallback(e.option.value, "true");
                break;
        }

    }

    const handleEyesSelectChange = (value, e) => {
        switch (e.action) {
            case "remove-value":
                setSelectedEyes((selectedEyes) => selectedEyes.filter((x) => x.value !== e.removedValue.value));
                saveFieldCallback(e.removedValue.value, "false");
                break;
            case "select-option":
                setSelectedEyes((selectedEyes) => [...selectedEyes, e.option]);
                saveFieldCallback(e.option.value, "true");
                break;
        }

    }

    const handleEarsSelectChange = (value, e) => {
        switch (e.action) {
            case "remove-value":
                setSelectedEars((selectedEars) => selectedEars.filter((x) => x.value !== e.removedValue.value));
                saveFieldCallback(e.removedValue.value, "false");
                break;
            case "select-option":
                setSelectedEars((selectedEars) => [...selectedEars, e.option]);
                saveFieldCallback(e.option.value, "true");
                break;
        }
    }

    const handleNoseMouthSelectChange = (value, e) => {
        switch (e.action) {
            case "remove-value":
                setSelectedNoseMouth((selectedNoseMouth) => selectedNoseMouth.filter((x) => x.value !== e.removedValue.value));
                saveFieldCallback(e.removedValue.value, "false");
                break;
            case "select-option":
                setSelectedNoseMouth((selectedNoseMouth) => [...selectedNoseMouth, e.option]);
                saveFieldCallback(e.option.value, "true");
                break;
        }
    }
    const handleCardioSelectChange = (value, e) => {
        switch (e.action) {
            case "remove-value":
                setSelectedCardio((selectedCardio) => selectedCardio.filter((x) => x.value !== e.removedValue.value));
                saveFieldCallback(e.removedValue.value, "false");
                break;
            case "select-option":
                setSelectedCardio((selectedCardio) => [...selectedCardio, e.option]);
                saveFieldCallback(e.option.value, "true");
                break;
        }

    }

    const handleRespiratorySelectChange = (value, e) => {
        switch (e.action) {
            case "remove-value":
                setSelectedRespiratory((selectedRespiratory) => selectedRespiratory.filter((x) => x.value !== e.removedValue.value));
                saveFieldCallback(e.removedValue.value, "false");
                break;
            case "select-option":
                setSelectedRespiratory((selectedRespiratory) => [...selectedRespiratory, e.option]);
                saveFieldCallback(e.option.value, "true");
                break;
        }

    }

    const handleGastrointestinalSelectChange = (value, e) => {
        switch (e.action) {
            case "remove-value":
                setSelectedGastrointestinal((selectedGastrointestinal) => selectedGastrointestinal.filter((x) => x.value !== e.removedValue.value));
                saveFieldCallback(e.removedValue.value, "false");
                break;
            case "select-option":
                setSelectedGastrointestinal((selectedGastrointestinal) => [...selectedGastrointestinal, e.option]);
                saveFieldCallback(e.option.value, "true");
                break;
        }

    }

    const handleGenitourinarySelectChange = (value, e) => {
        switch (e.action) {
            case "remove-value":
                setSelectedGenitourinary((selectedGenitourinary) => selectedGenitourinary.filter((x) => x.value !== e.removedValue.value));
                saveFieldCallback(e.removedValue.value, "false");
                break;
            case "select-option":
                setSelectedGenitourinary((selectedGenitourinary) => [...selectedGenitourinary, e.option]);
                saveFieldCallback(e.option.value, "true");
                break;
        }

    }

    const handleHemaOncoSelectChange = (value, e) => {
        switch (e.action) {
            case "remove-value":
                setSelectedHemaOnco((selectedHemaOnco) => selectedHemaOnco.filter((x) => x.value !== e.removedValue.value));
                saveFieldCallback(e.removedValue.value, "false");
                break;
            case "select-option":
                setSelectedHemaOnco((selectedHemaOnco) => [...selectedHemaOnco, e.option]);
                saveFieldCallback(e.option.value, "true");
                break;
        }

    }
    const handleMusculoskeletalSelectChange = (value, e) => {
        switch (e.action) {
            case "remove-value":
                setSelectedMusculoskeletal((selectedMusculoskeletal) => selectedMusculoskeletal.filter((x) => x.value !== e.removedValue.value));
                saveFieldCallback(e.removedValue.value, "false");
                break;
            case "select-option":
                setSelectedMusculoskeletal((selectedMusculoskeletal) => [...selectedMusculoskeletal, e.option]);
                saveFieldCallback(e.option.value, "true");
                break;
        }

    }

    const handleEndocrineSelectChange = (value, e) => {
        switch (e.action) {
            case "remove-value":
                setSelectedEndocrine((selectedEndocrine) => selectedEndocrine.filter((x) => x.value !== e.removedValue.value));
                saveFieldCallback(e.removedValue.value, "false");
                break;
            case "select-option":
                setSelectedEndocrine((selectedEndocrine) => [...selectedEndocrine, e.option]);
                saveFieldCallback(e.option.value, "true");
                break;
        }

    }

    const handleGoalCheckboxChange = (option) => {
        const isSelected = selectedGoal.some((selectedOption) => selectedOption.value === option.value);

        if (isSelected) {
            setSelectedGoal(selectedGoal.filter((selectedOption) => selectedOption.value !== option.value));
            saveFieldCallback(option.value, "false");
        } else {
            setSelectedGoal([...selectedGoal, option]);
            saveFieldCallback(option.value, "true");
        }
    };


    return (
        <>
            <Breadcrumbs title='View Patient' data={[{ title: 'Patients', link: '/patients' }, { title: getFullName(formData.first_name, formData.middle_name, formData.last_name, formData.second_last_name), link: `/patients/${id}` }, { title: 'View Wound Note' }]} />

            <section>
                <Row>
                    <Col lg={{ size: 12, order: 1 }} sm={{ size: 12 }} xs={{ order: 1 }}>
                        <PatientHeader />
                    </Col>
                </Row>
                <Row>
                    <Col lg={{ size: 12, order: 2 }} sm={{ size: 12 }} xs={{ order: 2 }}>
                        <Nav pills className='mb-2'>
                            <NavItem>
                                <NavLink active={activeTab === '1'} onClick={() => toggleTab('1')}>
                                    <User size={18} className='me-50' />
                                    <span className='fw-bold'>Details</span>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink active={activeTab === '2'} onClick={() => toggleTab('2')}>
                                    <Lock size={18} className='me-50' />
                                    <span className='fw-bold'>Sections 1</span>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink active={activeTab === '3'} onClick={() => toggleTab('3')}>
                                    <Lock size={18} className='me-50' />
                                    <span className='fw-bold'>Sections 2</span>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink active={activeTab === '4'} onClick={() => toggleTab('4')}>
                                    <Lock size={18} className='me-50' />
                                    <span className='fw-bold'>Sections 3</span>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink active={activeTab === '5'} onClick={() => toggleTab('5')}>
                                    <Lock size={18} className='me-50' />
                                    <span className='fw-bold'>Sections 4</span>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink active={activeTab === '6'} onClick={() => toggleTab('6')}>
                                    <Lock size={18} className='me-50' />
                                    <span className='fw-bold'>Goals</span>
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={activeTab}>
                            <TabPane tabId='1'>
                                <Row>
                                    <Col sm='12'>
                                        <Card>
                                            <CardHeader className='border-bottom'>
                                                <CardTitle tag='h4'>SOC Details</CardTitle>
                                            </CardHeader>
                                            <CardBody className='py-2 my-25'>

                                                <Row>

                                                    <Col md="6" className="mb-1">
                                                        <Label className="form-label" for="data_date">Data Date </Label>
                                                        <Flatpickr
                                                            data-enable-time
                                                            className='form-control'
                                                            options={{
                                                                enableTime: true,
                                                                dateFormat: "Y-m-d H:i",
                                                                altFormat: "DD-MM-YYYY",
                                                                allowInput: true,
                                                                maxDate: "today"
                                                            }}
                                                            value={socFormData.data_date}
                                                            name='data_date'
                                                            onChange={handleDataDateChange}
                                                        />

                                                    </Col>
                                                    <Col className="col-md-6 mb-1">
                                                        <Label className="form-label" for="information_taken_from_id">Information Taken From Id </Label>
                                                        <Input
                                                            type="select"
                                                            name="information_taken_from_id"
                                                            value={socFormData.information_taken_from_id}
                                                            onChange={handleChange}
                                                        >
                                                            {information_taken_from_options.map &&
                                                                information_taken_from_options.map((item, index) => (
                                                                    <option value={item.value} key={item.value}>
                                                                        {item.label}
                                                                    </option>
                                                                ))}
                                                        </Input>
                                                    </Col>



                                                    <Col className="col-md-6 mb-1">
                                                        <Label className="form-label" for="location_id">Location Id </Label>

                                                        <Input
                                                            type="select"
                                                            name="location_id"
                                                            value={socFormData.location_id}
                                                            onChange={handleChange}
                                                        >
                                                            {locations.map &&
                                                                locations.map((item, index) => (
                                                                    <option value={item.value} key={item.value}>
                                                                        {item.label}
                                                                    </option>
                                                                ))}
                                                        </Input>
                                                    </Col>

                                                    <Col md="6" className="mb-1">
                                                        <Label className="form-label" for="chief_complaint">Chief Complaint </Label>

                                                        <Input
                                                            value={socFormData.chief_complaint}
                                                            name="chief_complaint"
                                                            onChange={handleChange}
                                                            onBlur={handleInputChange}
                                                        />
                                                    </Col>

                                                    <Col md="6" className="mb-1">
                                                        <div className="form-check form-check-inline">
                                                            <Input
                                                                type="checkbox"
                                                                name="condition_related_to_employment"
                                                                checked={!!socFormData.condition_related_to_employment}
                                                                onChange={handleChange}
                                                                style={{ width: "20px", height: "20px" }}
                                                            />
                                                            <div className='d-flex flex-column'>
                                                                <Label for='condition_related_to_employment' className='form-check-label mb-50'>
                                                                    Condition Related To Employment
                                                                </Label>
                                                            </div>
                                                        </div>
                                                    </Col>

                                                    <Col md="6" className="mb-1">
                                                        <div className="form-check form-check-inline">
                                                            <Input
                                                                type="checkbox"
                                                                name="condition_related_to_car_accident"
                                                                checked={!!socFormData.condition_related_to_car_accident}
                                                                onChange={handleChange}
                                                                style={{ width: "20px", height: "20px" }}
                                                            />
                                                            <div className='d-flex flex-column'>
                                                                <Label for='condition_related_to_car_accident' className='form-check-label mb-50'>
                                                                    Condition Related To Car Accident
                                                                </Label>
                                                            </div>
                                                        </div>
                                                    </Col>

                                                    <Col md="6" className="mb-1">
                                                        <div className="form-check form-check-inline">
                                                            <Input
                                                                type="checkbox"
                                                                name="condition_related_to_other_accident"
                                                                checked={!!socFormData.condition_related_to_other_accident}
                                                                onChange={handleChange}
                                                                style={{ width: "20px", height: "20px" }}
                                                            />
                                                            <div className='d-flex flex-column'>
                                                                <Label for='condition_related_to_other_accident' className='form-check-label mb-50'>
                                                                    Condition Related To Other Accident
                                                                </Label>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                </Row>


                                            </CardBody>
                                        </Card>

                                    </Col>


                                </Row>
                            </TabPane>
                            <TabPane tabId='2'>
                                <Row>
                                    <Col>
                                        <Card>
                                            <CardHeader className='border-bottom'>
                                                <CardTitle tag='h4'>
                                                    <Check size={18} className='me-50' />
                                                    Medicines & Allergies
                                                </CardTitle>
                                            </CardHeader>
                                            <CardBody className='py-2 my-25'>
                                                <Col md="12" className="mb-1">
                                                    <Label className="form-label" for="data_date">Meds </Label>
                                                    <Select
                                                        isClearable={false}
                                                        theme={selectThemeColors}
                                                        value={selectedMeds}
                                                        isMulti
                                                        name='meds_xxx'
                                                        options={medsOptions}
                                                        onChange={handleSelectChange}
                                                        className='react-select'
                                                        classNamePrefix='select'
                                                    />

                                                </Col>
                                                <Col md="12" className="mb-1">
                                                    <Label className="form-label" for="data_date">Allergies </Label>
                                                    <Select
                                                        isClearable={false}
                                                        theme={selectThemeColors}
                                                        value={selectedAllergies}
                                                        isMulti
                                                        name='allergies_xxx'
                                                        options={allergiesOptions}
                                                        onChange={handleAllergiesSelectChange}
                                                        className='react-select'
                                                        classNamePrefix='select'
                                                    />

                                                </Col>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                    <Col>
                                        <Card>
                                            <CardHeader className='border-bottom'>
                                                <CardTitle tag='h4'>
                                                    <Check size={18} className='me-50' />
                                                    General & Activity/Mobility
                                                </CardTitle>
                                            </CardHeader>
                                            <CardBody className='py-2 my-25'>
                                                <Col md="12" className="mb-1">
                                                    <Label className="form-label" for="data_date">General </Label>
                                                    <Select
                                                        isClearable={false}
                                                        theme={selectThemeColors}
                                                        value={selectedGeneral}
                                                        isMulti
                                                        name='general_xxx'
                                                        options={generalOptions}
                                                        onChange={handleGeneralSelectChange}
                                                        className='react-select'
                                                        classNamePrefix='select'
                                                    />

                                                </Col>
                                                <Col md="12" className="mb-1">
                                                    <Label className="form-label" for="data_date">Activity Mobility </Label>
                                                    <Select
                                                        isClearable={false}
                                                        theme={selectThemeColors}
                                                        value={selectedActivityMobility}
                                                        isMulti
                                                        name='activityMobility_xxx'
                                                        options={activityMobilityOptions}
                                                        onChange={handleActivityMobilitySelectChange}
                                                        className='react-select'
                                                        classNamePrefix='select'
                                                    />

                                                </Col>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                                {/* <Row>
                                    <Col sm='12'>
                                        <SocImage formData={formData} />
                                    </Col>
                                </Row> */}
                            </TabPane>
                            <TabPane tabId='3'>
                                <Row>
                                    <Col>
                                        <Card>
                                            <CardHeader className='border-bottom'>
                                                <CardTitle tag='h4'>
                                                    <Check size={18} className='me-50' />
                                                    Skin & NeuroPsychiatric
                                                </CardTitle>
                                            </CardHeader>
                                            <CardBody className='py-2 my-25'>
                                                <Col md="12" className="mb-1">
                                                    <Label className="form-label" for="data_date">Skin </Label>
                                                    <Select
                                                        isClearable={false}
                                                        theme={selectThemeColors}
                                                        value={selectedSkin}
                                                        isMulti
                                                        name='skin_xxx'
                                                        options={skinOptions}
                                                        onChange={handleSkinSelectChange}
                                                        className='react-select'
                                                        classNamePrefix='select'
                                                    />

                                                </Col>

                                                <Col md="12" className="mb-1">
                                                    <Label className="form-label" for="data_date">NeuroPsychiatric </Label>
                                                    <Select
                                                        isClearable={false}
                                                        theme={selectThemeColors}
                                                        value={selectedNeuroPsychiatric}
                                                        isMulti
                                                        name='neuroPsychiatric_xxx'
                                                        options={neuroPsychiatricOptions}
                                                        onChange={handleNeuroPsychiatricSelectChange}
                                                        className='react-select'
                                                        classNamePrefix='select'
                                                    />

                                                </Col>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                    <Col>
                                        <Card>
                                            <CardHeader className='border-bottom'>
                                                <CardTitle tag='h4'>
                                                    <Check size={18} className='me-50' />
                                                    Eyes & Ears
                                                </CardTitle>
                                            </CardHeader>
                                            <CardBody className='py-2 my-25'>
                                                <Col md="12" className="mb-1">
                                                    <Label className="form-label" for="data_date">Eyes </Label>
                                                    <Select
                                                        isClearable={false}
                                                        theme={selectThemeColors}
                                                        value={selectedEyes}
                                                        isMulti
                                                        name='eyes_xxx'
                                                        options={eyesOptions}
                                                        onChange={handleEyesSelectChange}
                                                        className='react-select'
                                                        classNamePrefix='select'
                                                    />

                                                </Col>

                                                <Col md="12" className="mb-1">
                                                    <Label className="form-label" for="data_date">Ears </Label>
                                                    <Select
                                                        isClearable={false}
                                                        theme={selectThemeColors}
                                                        value={selectedEars}
                                                        isMulti
                                                        name='ears_xxx'
                                                        options={earsOptions}
                                                        onChange={handleEarsSelectChange}
                                                        className='react-select'
                                                        classNamePrefix='select'
                                                    />

                                                </Col>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tabId='4'>
                                <Row>
                                    <Col>
                                        <Card>
                                            <CardHeader className='border-bottom'>
                                                <CardTitle tag='h4'>
                                                    <Check size={18} className='me-50' />
                                                    Nose Mouth & Cardio
                                                </CardTitle>
                                            </CardHeader>
                                            <CardBody className='py-2 my-25'>
                                                <Col md="12" className="mb-1">
                                                    <Label className="form-label" for="data_date">Nose / Mouth </Label>
                                                    <Select
                                                        isClearable={false}
                                                        theme={selectThemeColors}
                                                        value={selectedNoseMouth}
                                                        isMulti
                                                        name='noseMouth_xxx'
                                                        options={noseMouthOptions}
                                                        onChange={handleNoseMouthSelectChange}
                                                        className='react-select'
                                                        classNamePrefix='select'
                                                    />

                                                </Col>

                                                <Col md="12" className="mb-1">
                                                    <Label className="form-label" for="data_date">Cardio </Label>
                                                    <Select
                                                        isClearable={false}
                                                        theme={selectThemeColors}
                                                        value={selectedCardio}
                                                        isMulti
                                                        name='cardio_xxx'
                                                        options={cardioOptions}
                                                        onChange={handleCardioSelectChange}
                                                        className='react-select'
                                                        classNamePrefix='select'
                                                    />

                                                </Col>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                    <Col>
                                        <Card>
                                            <CardHeader className='border-bottom'>
                                                <CardTitle tag='h4'>
                                                    <Check size={18} className='me-50' />
                                                    Respiratory & Gastrointestinal
                                                </CardTitle>
                                            </CardHeader>
                                            <CardBody className='py-2 my-25'>
                                                <Col md="12" className="mb-1">
                                                    <Label className="form-label" for="data_date">Respiratory </Label>
                                                    <Select
                                                        isClearable={false}
                                                        theme={selectThemeColors}
                                                        value={selectedRespiratory}
                                                        isMulti
                                                        name='respiratory_xxx'
                                                        options={respiratoryOptions}
                                                        onChange={handleRespiratorySelectChange}
                                                        className='react-select'
                                                        classNamePrefix='select'
                                                    />

                                                </Col>
                                                <Col md="12" className="mb-1">
                                                    <Label className="form-label" for="data_date">Gastrointestinal </Label>
                                                    <Select
                                                        isClearable={false}
                                                        theme={selectThemeColors}
                                                        value={selectedGastrointestinal}
                                                        isMulti
                                                        name='gastrointestinal_xxx'
                                                        options={gastrointestinalOptions}
                                                        onChange={handleGastrointestinalSelectChange}
                                                        className='react-select'
                                                        classNamePrefix='select'
                                                    />

                                                </Col>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tabId="5">
                                <Row>
                                    <Col>
                                        <Card>
                                            <CardHeader className='border-bottom'>
                                                <CardTitle tag='h4'>
                                                    <Check size={18} className='me-50' />
                                                    Genitourinary & HemaOnco
                                                </CardTitle>
                                            </CardHeader>
                                            <CardBody className='py-2 my-25'>
                                                <Col md="12" className="mb-1">
                                                    <Label className="form-label" for="data_date">Genitourinary </Label>
                                                    <Select
                                                        isClearable={false}
                                                        theme={selectThemeColors}
                                                        value={selectedGenitourinary}
                                                        isMulti
                                                        name='genitourinary_xxx'
                                                        options={genitourinaryOptions}
                                                        onChange={handleGenitourinarySelectChange}
                                                        className='react-select'
                                                        classNamePrefix='select'
                                                    />

                                                </Col>

                                                <Col md="12" className="mb-1">
                                                    <Label className="form-label" for="data_date">HemaOnco </Label>
                                                    <Select
                                                        isClearable={false}
                                                        theme={selectThemeColors}
                                                        value={selectedHemaOnco}
                                                        isMulti
                                                        name='hemaOnco_xxx'
                                                        options={hemaOncoOptions}
                                                        onChange={handleHemaOncoSelectChange}
                                                        className='react-select'
                                                        classNamePrefix='select'
                                                    />

                                                </Col>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                    <Col>
                                        <Card>
                                            <CardHeader className='border-bottom'>
                                                <CardTitle tag='h4'>
                                                    <Check size={18} className='me-50' />
                                                    Musculoskeletal & Endocrine
                                                </CardTitle>
                                            </CardHeader>
                                            <CardBody className='py-2 my-25'>
                                                <Col md="12" className="mb-1">
                                                    <Label className="form-label" for="data_date">Musculoskeletal </Label>
                                                    <Select
                                                        isClearable={false}
                                                        theme={selectThemeColors}
                                                        value={selectedMusculoskeletal}
                                                        isMulti
                                                        name='musculoskeletal_xxx'
                                                        options={musculoskeletalOptions}
                                                        onChange={handleMusculoskeletalSelectChange}
                                                        className='react-select'
                                                        classNamePrefix='select'
                                                    />

                                                </Col>

                                                <Col md="12" className="mb-1">
                                                    <Label className="form-label" for="data_date">Endocrine </Label>
                                                    <Select
                                                        isClearable={false}
                                                        theme={selectThemeColors}
                                                        value={selectedEndocrine}
                                                        isMulti
                                                        name='endocrine_xxx'
                                                        options={endocrineOptions}
                                                        onChange={handleEndocrineSelectChange}
                                                        className='react-select'
                                                        classNamePrefix='select'
                                                    />

                                                </Col>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tabId="6">
                                <Card>
                                    <CardHeader className='border-bottom'>
                                        <CardTitle tag='h4'>Goals</CardTitle>
                                    </CardHeader>
                                    <CardBody className='py-2 my-25'>
                                        <Row>

                                            {goalOptions.map((option) => (
                                                <Col md="6" className="mb-1" key={option.value}>
                                                    <div className="form-check form-check-inline">
                                                        <Input
                                                            type="checkbox"
                                                            id={`goal_${option.value}`}
                                                            name={`goal_${option.value}`}
                                                            checked={selectedGoal.some((selectedOption) => selectedOption.value === option.value)}
                                                            onChange={() => handleGoalCheckboxChange(option)}
                                                            style={{ width: "20px", height: "20px" }}
                                                        />
                                                        <div className='d-flex flex-column'>
                                                            <Label for={`goal_${option.value}`} className='form-check-label mb-50'>
                                                                {option.label}
                                                            </Label>
                                                        </div>
                                                    </div>
                                                </Col>
                                            ))}


                                        </Row>

                                    </CardBody>
                                </Card>
                            </TabPane>

                        </TabContent>

                    </Col>
                </Row>
            </section>


        </>
    )
}

export default SOCView;