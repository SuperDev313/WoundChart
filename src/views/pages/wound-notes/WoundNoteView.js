import React, { useState, useRef } from 'react'
import * as yup from 'yup'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import classnames from 'classnames'
import { useParams } from 'react-router-dom'
import useApi from '../../../api/useApi'
import { showAlertError, ToastContent } from '../../../components/alerts/AlertUtils'
import LoadingSpinner from '../../../components/spinner/LoadingSpinner'
import AsyncSelect from 'react-select/async'
import Cleave from 'cleave.js/react'
import PatientView from '../patients/PatientView'
import PatientHeader from '../../../components/edits/patients/PatientHeader'
import AssessmentCard from './sections/AssessmentCard'
import WoundNoteTunnelingCard from './sections/WoundNoteTunnelingCard'
import WoundNoteFistulaCard from './sections/WoundNoteFistulaCard'
import WoundNotesUnderminingCard from './sections/WoundNotesUnderminingCard'
import PatientDiagnosisCard from './sections/PatientDiagnosisCard'
import WoundNotesCleanserCard from './sections/WoundNotesCleanserCard'
import WoundNotesImages from './sections/WoundNotesImages'
import WarningAlert from '../../../components/alerts/Alert'

import MyCleave from '../../../components/forms/MyCleave'
import ErrorMessaje from '../../../components/forms/ErrorMessaje'
// import { getDateFromISODate } from '../../../utility/Utils';
import EditWoundNotesCleanser from '../../../components/edits/wound-notes/EditWoundNotesCleanser'

import { dateToISOString, isValidDate, getFullName } from '../../../utility/Utils'
import SwitchControl from '../../../components/forms/SwitchControl'

import { User, Lock, Bookmark, Image, List } from 'react-feather'
import { ConeTestOnNets } from 'healthicons-react/dist/filled'
// ** Reactstrap Imports
import {
  Row,
  Col,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  FormFeedback,
  Form,
  Input,
  Label,
  InputGroup,
  InputGroupText,
} from 'reactstrap'
import Breadcrumbs from '@components/breadcrumbs'
import { Check, X, Minus } from 'react-feather'
import 'react-datetime/css/react-datetime.css'
import Datetime from 'react-datetime'
import moment from 'moment'

const WoundNoteView = () => {
  const { id, woundNoteId } = useParams()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('1')
  const [today] = useState(new Date().toISOString().substr(0, 10))
  const [filedError, setFieldError] = useState({})
  const [woundMeasurements, setWoundMeasurements] = useState({
    lxw: 0,
    lxwxd: 0,
  })
  const [showMeasurementAlert, setShowMeasurementAlert] = useState(false)
  const [showInfectedAlert, setshowInfectedAlert] = useState(false)
  const [showEpiboleAlert, setShowEpiboleAlert] = useState(false)
  const [showIodineAlert, setShowIodineAlert] = useState(false)
  const [showNegativePressureAlert, setShowNegativePressureAlert] = useState(false)

  //Lookups
  const [exudate_types, setExudate_Types] = useState([{ label: '', value: '' }])
  const [exudate_amounts, setExudate_Amounts] = useState([{ label: '', value: '' }])
  const [exudate_odors, setExudate_Odors] = useState([{ label: '', value: '' }])
  const [pulse_options, setPulse_Options] = useState([{ label: '', value: '' }])
  const [trajectoryOptions, setTrajectoryOptions] = useState([{ label: '', value: '' }])
  const [visitFrequencyOptions, setVisitFrequencyOptions] = useState([{ label: '', value: '' }])
  const [temperature_of_extremities, setTemperature_Of_Extremities] = useState([{ label: '', value: '' }])
  const [capillary_refills, setCapillary_Refills] = useState([{ label: '', value: '' }])
  const [plus_minus_options, setPlus_Minus_Options] = useState([{ label: '', value: '' }])
  const [edema_options, setEdema_Options] = useState([{ label: '', value: '' }])
  const [procedure_performed_options, setProcedure_Performed_Options] = useState([{ label: '', value: '' }])
  const [products, setProducts] = useState([{ label: '', value: '' }])
  const [iodineAlert, setIodineAlert] = useState({
    pri: false,
    opri: false,
    spri: false,
    pwst: false,
    sedr: false,
    taut: false,
  })
  const [alerts, setAlerts] = useState({
    exudateAlert: false,
    exudateMsg: '',
    exudateAmtAlert: false,
    exudateAmtMsg: '',
    exudateAmtAlertVariant: 'info',
    neuroticTissueAlert: false,
    sloughTissueAlert: false,
    odorAlert: false,
    odorMsg: '',
    odorAlertVariant: 'info',
  })

  const formSchema = yup.object().shape({
    wound_length: yup
      .number()
      .transform((value) => (isNaN(value) || value === null || value === undefined ? null : value))
      .required()
      .label('Wound Length'),
    wound_width: yup
      .number()
      .transform((value) => (isNaN(value) || value === null || value === undefined ? null : value))
      .required()
      .label('Wound Width'),
    wound_depth: yup
      .number()
      .transform((value) => (isNaN(value) || value === null || value === undefined ? null : value))
      .required()
      .label('Wound Depth'),
    wound_at_facility: yup.bool().notRequired().label('Wound at Facility'),
    wound_recurrence: yup.bool().notRequired().label('Wound Recurrence'),
    signs_infected_wound: yup.bool().notRequired().label('Signs Infected Wound'),
    granulation_tissue: yup.number().notRequired().label('Granulation Tissue'),
    slough_tissue: yup.number().notRequired().label('Slough Tissue'),
    neurotic_tissue: yup.number().notRequired().label('Neurotic Tissue'),
    other_tissue: yup.number().notRequired().label('Other Tissue'),
    type_of_exudate_id: yup.number().notRequired().label('Type Of Exudate'),
    amount_of_exudate_id: yup.number().notRequired().label('Amount Of Exudate'),
    odor_id: yup.string().notRequired().label('Odor'),

    //Edges
    wound_edges_irregular: yup.bool().notRequired().label('Wound Edges Irregular'),
    wound_edges_epibole: yup.bool().notRequired().label('Wound Edges Epibole'),
    wound_edges_well: yup.bool().notRequired().label('Wound Edges Well'),
    wound_edges_good: yup.bool().notRequired().label('Wound Edges Good'),
    wound_edges_hyperkeratosis: yup.bool().notRequired().label('Wound Edges Hyperkeratosis'),
    wound_edges_fibrotic: yup.bool().notRequired().label('Wound Edges Fibrotic'),
    wound_edges_not_deter: yup.bool().notRequired().label('Wound Edges Not Deter'),

    //Periwound
    periwound_healthy: yup
      .bool()
      .transform((value) => (value == '' || value === undefined ? null : value))
      .notRequired()
      .label('Healthy'),
    periwound_blistered: yup
      .bool()
      .transform((value) => (value == '' || value === undefined ? null : value))
      .notRequired()
      .label('Blistered'),
    periwound_cayosed: yup
      .bool()
      .transform((value) => (value == '' || value === undefined ? null : value))
      .notRequired()
      .label('Cayosed'),
    periwound_discolored: yup
      .bool()
      .transform((value) => (value == '' || value === undefined ? null : value))
      .notRequired()
      .label('Discolored'),
    periwound_contact: yup
      .bool()
      .transform((value) => (value == '' || value === undefined ? null : value))
      .notRequired()
      .label('Contact Dermatitis'),
    periwound_dry_scaly: yup
      .bool()
      .transform((value) => (value == '' || value === undefined ? null : value))
      .notRequired()
      .label('Dry Scaly'),
    periwound_edema: yup
      .bool()
      .transform((value) => (value == '' || value === undefined ? null : value))
      .notRequired()
      .label('Edema'),
    periwound_erythema: yup
      .bool()
      .transform((value) => (value == '' || value === undefined ? null : value))
      .notRequired()
      .label('Erythema'),
    periwound_indurated: yup
      .bool()
      .transform((value) => (value == '' || value === undefined ? null : value))
      .notRequired()
      .label('Indurated'),
    periwound_macerated: yup
      .bool()
      .transform((value) => (value == '' || value === undefined ? null : value))
      .notRequired()
      .label('Macerated'),
    periwound_hyperpigmented: yup
      .bool()
      .transform((value) => (value == '' || value === undefined ? null : value))
      .notRequired()
      .label('Hyperpigmented'),
    periwound_hyperemic: yup
      .bool()
      .transform((value) => (value == '' || value === undefined ? null : value))
      .notRequired()
      .label('Hyperemic'),
    periwound_skin_irritation: yup
      .bool()
      .transform((value) => (value == '' || value === undefined ? null : value))
      .notRequired()
      .label('Skin Irritation'),
    periwound_not_determined: yup
      .bool()
      .transform((value) => (value == '' || value === undefined ? null : value))
      .notRequired()
      .label('Not Determined'),

    tissue_exposure_bone: yup.bool().notRequired().label('Bone'),
    tissue_exposure_tendon: yup.bool().notRequired().label('Tendon'),
    tissue_exposure_vessel: yup.bool().notRequired().label('Vessel'),
    tissue_exposure_muscle: yup.bool().notRequired().label('Muscle'),
    tissue_exposure_fat: yup.bool().notRequired().label('Fat'),
    tissue_exposure_hardware: yup.bool().notRequired().label('Hardware'),
    tissue_exposure_fascia: yup.bool().notRequired().label('Fascia'),

    //EditWoundNoteLowerExtremityAssessment
    dorsalis_pedis_pulses_id: yup
      .number()
      .transform((value) => (isNaN(value) || value === null || value === undefined ? null : value))
      .notRequired()
      .label('Dorsalis Pedis Pulses'),
    posterior_tibialis_pulses_id: yup
      .number()
      .transform((value) => (isNaN(value) || value === null || value === undefined ? null : value))
      .notRequired()
      .label('Posterior Tibialis Pulses'),
    radial_pulses_id: yup
      .number()
      .transform((value) => (isNaN(value) || value === null || value === undefined ? null : value))
      .notRequired()
      .label('Radial Pulses'),
    capillary_refill_id: yup
      .number()
      .transform((value) => (isNaN(value) || value === null || value === undefined ? null : value))
      .notRequired()
      .label('Capillary Refill'),
    dependant_rubor_id: yup
      .number()
      .transform((value) => (isNaN(value) || value === null || value === undefined ? null : value))
      .notRequired()
      .label('Dependant Rubor'),
    venous_filling_time: yup.string().max(100).notRequired().label('Venous Filling Time'),
    ankle_brachial_index: yup.string().max(100).notRequired().label('Ankle Brachial Index'),
    edema_id: yup
      .number()
      .transform((value) => (isNaN(value) || value === null || value === undefined ? null : value))
      .notRequired()
      .label('Edema'),
    compression_in_use: yup.bool().notRequired().label('Compression In Use'),
    sensation_id: yup
      .number()
      .transform((value) => (isNaN(value) || value === null || value === undefined ? null : value))
      .notRequired()
      .label('Sensation'),
    claudication_in_use: yup.bool().notRequired().label('Claudication In Use'),
    temperature_of_extremity_id: yup
      .number()
      .transform((value) => (isNaN(value) || value === null || value === undefined ? null : value))
      .notRequired()
      .label('Temperature Of Extremity'),
    hair_growth_on_extremity: yup.bool().notRequired().label('Hair Growth On Extremity'),
    erythema: yup.bool().notRequired().label('Erythema'),
    hyperpigmentation: yup.bool().notRequired().label('Hyperpigmentation'),
    lipodermatosclerosis: yup.bool().notRequired().label('Lipodermatosclerosis'),
    varicose_veins: yup.bool().notRequired().label('Varicose Veins'),
    off_loading_device_in_use: yup.bool().notRequired().label('Offloading Device In Use'),

    //Barriers
    barrier_necrosis: yup.bool().notRequired().label('Necrosis'),
    barrier_infection: yup.bool().notRequired().label('Infection'),
    barrier_haemorrhage: yup.bool().notRequired().label('Barrier Haemorrhage'),
    barrier_mechanical_damage: yup.bool().notRequired().label('Barrier Mechanical Damage'),
    barrier_diet: yup.bool().notRequired().label('Barrier Diet'),
    barrier_medical_conditions: yup.bool().notRequired().label('Barrier Medical Conditions'),
    barrier_age: yup.bool().notRequired().label('Barrier Age'),
    barrier_medicines: yup.bool().notRequired().label('Barrier Medicines'),
    barrier_smoking: yup.bool().notRequired().label('Barrier Smoking'),
    barrier_varicose_veins: yup.bool().notRequired().label('Barrier Varicose Veins'),
    barrier_dryness: yup.bool().notRequired().label('Barrier Dryness'),
    barrier_bedridden: yup.bool().notRequired().label('Barrier Bedridden'),
    barrier_diabetic: yup.bool().notRequired().label('Barrier Diabetic'),
    barrier_immuno: yup.bool().notRequired().label('Barrier Immuno'),

    //Compliance
    ncw_limb_elevation: yup.bool().notRequired().label('Limb Elevation'),
    ncw_offloading: yup.bool().notRequired().label('Offloading'),
    ncw_keep_intact_dressings: yup.bool().notRequired().label('Keep Intact Dressings'),
    ncw_compression: yup.bool().notRequired().label('Compression'),
    ncw_meds: yup.bool().notRequired().label('NCW Meds'),
    ncw_glucose_control: yup.bool().notRequired().label('Glucose Control'),
    ncw_visits: yup.bool().notRequired().label('Visits'),
    ncw_other: yup.bool().notRequired().label('Other'),

    //Treatment
    tod_autolytic: yup.bool().notRequired().label('Autolytic'),
    tod_enzymatic: yup.bool().notRequired().label('Enzymatic'),
    tod_mechanical: yup.bool().notRequired().label('Mechanical'),
    tod_sharp: yup.bool().notRequired().label('Sharp'),
    tod_biological: yup.bool().notRequired().label('Biological'),
    tod_other: yup.bool().notRequired().label('Other'),
    tod_other_text: yup.string().max(200).notRequired().label('Other Text'),
    tod_applied_product: yup.string().max(200).notRequired().label('Applied Product'),

    primary_dressing_id: yup
      .number()
      .transform((value) => (isNaN(value) || value === null || value === undefined ? null : value))
      .notRequired()
      .label('Primary Dressing'),
    other_primary_dressing_id: yup
      .number()
      .transform((value) => (isNaN(value) || value === null || value === undefined ? null : value))
      .notRequired()
      .label('Other Primary Dressing'),
    secondary_dressing_id: yup
      .number()
      .transform((value) => (isNaN(value) || value === null || value === undefined ? null : value))
      .notRequired()
      .label('Secondary Dressing'),
    peri_wound_skin_treatment_id: yup
      .number()
      .transform((value) => (isNaN(value) || value === null || value === undefined ? null : value))
      .notRequired()
      .label('PeriWound Skin Treatment'),
    secure_dressing_id: yup
      .number()
      .transform((value) => (isNaN(value) || value === null || value === undefined ? null : value))
      .notRequired()
      .label('Secure Dressing'),
    tunneling_and_undermining_treatment_id: yup
      .number()
      .transform((value) => (isNaN(value) || value === null || value === undefined ? null : value))
      .notRequired()
      .label('Tunneling and Undermining Treatment'),
    primary_dressing_quantity: yup
      .number()
      .transform((value) => (isNaN(value) || value === null || value === undefined ? null : value))
      .notRequired()
      .label('Primary Dressing Quantity'),
    other_primary_dressing_quantity: yup
      .number()
      .transform((value) => (isNaN(value) || value === null || value === undefined ? null : value))
      .notRequired()
      .label('Other Primary Dressing Quantity'),
    secondary_dressing_quantity: yup
      .number()
      .transform((value) => (isNaN(value) || value === null || value === undefined ? null : value))
      .notRequired()
      .label('Secondary Dressing Quantity'),
    peri_wound_skin_treatment_quantity: yup
      .number()
      .transform((value) => (isNaN(value) || value === null || value === undefined ? null : value))
      .notRequired()
      .label('PeriWound Skin Treatment Quantity'),
    secure_dressing_quantity: yup
      .number()
      .transform((value) => (isNaN(value) || value === null || value === undefined ? null : value))
      .notRequired()
      .label('Secure Dressing Quantity'),
    tunneling_and_undermining_treatment_quantity: yup
      .number()
      .transform((value) => (isNaN(value) || value === null || value === undefined ? null : value))
      .notRequired()
      .label('Tunneling and Undermining Treatment Quantity'),
    procedure_performed_id: yup
      .number()
      .transform((value) => (isNaN(value) || value === null || value === undefined ? null : value))
      .notRequired()
      .label('Procedure Performed'),
    folley_insert_change: yup.bool().notRequired().label('Folley Insert Change'),

    //Wound Note
    rr_vascular_evaluation: yup.bool().notRequired().label('Vascular Evaluation'),
    rr_nutrition_evaluation: yup.bool().notRequired().label('Nutrition Evaluation'),
    rr_infectious_diseases_evaluation: yup.bool().notRequired().label('Infectious Diseases Evaluation'),
    rr_physical_therapy_evaluation: yup.bool().notRequired().label('Physical Therapy Evaluation'),
    rr_primary_physician_evaluation: yup.bool().notRequired().label('Primary Physician Evaluation'),
    rr_hyperbaric_medicine_evaluation: yup.bool().notRequired().label('Hyperbaric Medicine Evaluation'),
    rr_occupational_therapy_evaluation: yup.bool().notRequired().label('Occupational Therapy Evaluation'),
    rr_pain_management_evaluation: yup.bool().notRequired().label('Pain Management Evaluation'),
    rr_off_loading: yup.bool().notRequired().label('Offloading'),
    rr_social_worker_evaluation: yup.bool().notRequired().label('Social Worker Evaluation'),
    rr_surgery_evaluation: yup.bool().notRequired().label('Surgery Evaluation'),
    rr_disease_management_evaluation: yup.bool().notRequired().label('Disease Management Evaluation'),
    rr_case_management_evaluation: yup.bool().notRequired().label('Case Management Evaluation'),
    rr_community_res_evaluation: yup.bool().notRequired().label('Community Res Evaluation'),
    rr_compression_therapy: yup.bool().notRequired().label('Compression Therapy'),
    rr_negative_pressure_system: yup.bool().notRequired().label('Negative Pressure System'),
    rr_quit_smoking: yup.bool().notRequired().label('Quit Smoking'),
    rr_other_referrals: yup.string().max(200).notRequired().label('Other Referrals'),
    rr_additional_comments: yup.string().max(50).notRequired().label('Additional Comments'),

    //Tests
    as_wound_culture: yup.bool().notRequired().label('AS Wound Culture'),
    as_biopsy: yup.bool().notRequired().label('AS Biopsy'),
    as_mri: yup.bool().notRequired().label('AS MRI'),
    as_arterial_venous_duplex: yup.bool().notRequired().label('AS Arterial Venous Duplex'),
    as_arteriogram: yup.bool().notRequired().label('AS Arteriogram'),
    as_ctscan: yup.bool().notRequired().label('AS CT Scan'),
    as_arterial_venous_doppler: yup.bool().notRequired().label('AS Arterial Venous Doppler'),
    as_xray: yup.bool().notRequired().label('AS X-ray'),
    as_gallium_scan: yup.bool().notRequired().label('AS Gallium Scan'),
    as_ankle_brachial: yup.bool().notRequired().label('AS Ankle Brachial'),
    as_transcutaneous_done_oximetry: yup.bool().notRequired().label('AS Transcutaneous Done Oximetry'),
    as_transcutaneous_oximetry: yup.bool().notRequired().label('AS Transcutaneous Oximetry'),
    as_abi_tbi_ppg: yup.bool().notRequired().label('AS ABI TBI PPG'),
    as_other_text: yup.string().max(50).notRequired().label('AS Other Text'),
    wound_culture_was_obtain: yup.bool().notRequired().label('Wound Culture Was Obtain'),
    wound_biopsy_was_obtain: yup.bool().notRequired().label('Wound Biopsy Was Obtain'),
    wound_shave_biopsy_was_obtain: yup.bool().notRequired().label('Wound Shave Biopsy Was Obtain'),
    wound_punch_biopsy_was_done: yup.bool().notRequired().label('Wound Punch Biopsy Was Done'),

    //Adjuvant Treatment
    patient_has_cleansing: yup.bool().notRequired().label('Patient Has Cleansing'),
    patient_on_offloading_device: yup.bool().notRequired().label('Patient On Offloading Device'),
    patient_on_wheelchair: yup.bool().notRequired().label('Patient On Wheelchair'),
    patient_is_using_compression_device: yup.bool().notRequired().label('Patient Is Using Compression Device'),
    patient_receiving_hyperbaric_oxygen_treatment: yup
      .bool()
      .notRequired()
      .label('Patient Receiving Hyperbaric Oxygen Treatment'),
    patient_has_receiving_hyperbaric_oxygen_treatment: yup
      .bool()
      .notRequired()
      .label('Patient Has Receiving Hyperbaric Oxygen Treatment'),
    patient_treated_with_low_level_laser_therapy: yup
      .bool()
      .notRequired()
      .label('Patient Treated With Low Level Laser Therapy'),
    patient_receiving_occupational_therapy: yup.bool().notRequired().label('Patient Receiving Occupational Therapy'),
    patient_receiving_intermittent_pneumatic_compression: yup
      .bool()
      .notRequired()
      .label('Patient Receiving Intermittent Pneumatic Compression'),
    patient_receiving_whirlpool: yup.bool().notRequired().label('Patient Receiving Whirlpool'),
    patient_receiving_complete_decongestive_therapy_on_lower_ex: yup
      .bool()
      .notRequired()
      .label('Patient Receiving Complete Decongestive Therapy On Lower Ex'),
    patient_receiving_manual_lymph_drainage: yup.bool().notRequired().label('Patient Receiving Manual Lymph Drainage'),
    patient_receiving_electrical_stimulation_therapy: yup
      .bool()
      .notRequired()
      .label('Patient Receiving Electrical Stimulation Therapy'),
    patient_receiving_electromagnetic_therapy: yup
      .bool()
      .notRequired()
      .label('Patient Receiving Electromagnetic Therapy'),
    cellular_and_or_tissue_based_product: yup.bool().notRequired().label('Cellular and/or Tissue Based Product'),
    patient_receiving_transcutaneous_oxygen_therapy: yup
      .bool()
      .notRequired()
      .label('Patient Receiving Transcutaneous Oxygen Therapy'),
    patient_receiving_ultrasound_therapy: yup.bool().notRequired().label('Patient Receiving Ultrasound Therapy'),
    patient_receiving_shockwave_therapy: yup.bool().notRequired().label('Patient Receiving Shockwave Therapy'),

    trajectory: yup.number().notRequired().label('Patient Trajectory'),
    visit_frequency: yup.number().notRequired().label('Visit Frequency'),
    appointment_date: yup
      .date()
      .required('Visit Date is required.')
      .label('Visit Date')
      .transform((value) => (isValidDate(value) ? value : null))
      .min(new Date(), 'Appointment Date must be today or greater'),
  })

  const {
    control,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm({ resolver: yupResolver(formSchema) })

  const [formData, setFormData] = useState({
    record_number: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    second_last_name: '',
    date_of_birth: '',
    picture_file_url: '',
  })

  const [formWoundNoteData, setFormWoundNoteData] = useState({
    patient_id: '',
    user_id: '',
    visit_date: '',
    closed_date: '',
    visit_frequency_id: '',
    wound_location: '',
    wound_number: '',
    more_wound_type: '',
    pain_grade_id: '',
    wound_length: '',
    wound_width: '',
    wound_depth: '',
    wound_lxw: '',
    wound_lxwxd: '',
    periwound: '',
  })

  React.useEffect(() => {
    useApi
      .get(`/patients/${id}`, {})
      .then((res) => {
        console.log(res)
        const data = res.data.data
        setFormData({
          id: data.id,
          record_number: data.record_number,
          first_name: data.first_name,
          middle_name: data.middle_name,
          last_name: data.last_name,
          second_last_name: data.second_last_name,
          date_of_birth: data.date_of_birth,
          picture_file_url: data.picture_file_url,
        })
        setLoading(false)
      })
      .catch((err) => {
        showAlertError(err)
        setLoading(false)
      })
  }, [])

  React.useEffect(() => {
    const length = getValues('wound_length')
    const width = getValues('wound_width')
    const depth = getValues('wound_depth')
    // alert(length)

    const val = length == 0 && width == 0 && depth == 0
    setShowMeasurementAlert(val)

    const lxw = length && width ? length * width : 0
    const lxwxd = length && width && depth ? length * width * depth : 0

    setWoundMeasurements({ lxw, lxwxd })
  }, [watch('wound_length'), watch('wound_width'), watch('wound_depth')])

  React.useEffect(() => {
    const signs_infected_wound = getValues('signs_infected_wound')

    if (signs_infected_wound) {
      setshowInfectedAlert(true)
    } else {
      setshowInfectedAlert(false)
    }
  }, [watch('signs_infected_wound')])

  const dismissMeasurementAlert = () => {
    setShowMeasurementAlert(false)
  }

  const dismissInfectedAlert = () => {
    setshowInfectedAlert(false)
  }

  React.useEffect(() => {
    setLoading(true)
    useApi
      .get(`/wound_notes/${woundNoteId}`, {})
      .then((res) => {
        const data = res.data.data
        setFormWoundNoteData({
          id: woundNoteId,
          patient_id: isNaN(data.patient_id) ? null : parseInt(data.patient_id),
          user_id: isNaN(data.user_id) ? null : parseInt(data.user_id),
          visit_date: data.visit_date,
          closed_date: data.closed_date,
          visit_frequency_id: isNaN(data.visit_frequency_id) ? null : parseInt(data.visit_frequency_id),
          wound_location: data.wound_location,
          wound_number: data.wound_number,
          more_wound_type: data.more_wound_type,
          pain_grade_id: isNaN(data.pain_grade_id) ? null : parseInt(data.pain_grade_id),
          wound_length: isNaN(data.wound_length) ? null : parseFloat(data.wound_length),
          wound_width: isNaN(data.wound_width) ? null : parseFloat(data.wound_width),
          wound_depth: isNaN(data.wound_depth) ? null : parseFloat(data.wound_depth),
          wound_lxw: isNaN(data.wound_lxw) ? null : parseFloat(data.wound_lxw),
          wound_lxwxd: isNaN(data.wound_lxwxd) ? null : parseFloat(data.wound_lxwxd),

          wound_type_id_description: data.wound_type_id_description,
          type_of_exudate_id_description: data.type_of_exudate_id_description,
          sensation_id_description: data.sensation_id_description,
          temperature_of_extremity_id_description: data.temperature_of_extremity_id_description,
          capillary_refill_id_description: data.capillary_refill_id_description,
          dependant_rubor_id_description: data.dependant_rubor_id_description,
          dorsalis_pedis_pulses_id_description: data.dorsalis_pedis_pulses_id_description,
          edema_id_description: data.edema_id_description,
          amount_of_exudate_id_description: data.amount_of_exudate_id_description,
          odor_id_description: data.odor_id_description,
          posterior_tibialis_pulses_id_description: data.posterior_tibialis_pulses_id_description,
          radial_pulses_id_description: data.radial_pulses_id_description,
          visit_frequency_id_description: data.visit_frequency_id_description,
          wound_trajectory_id_description: data.wound_trajectory_id_description,
          pain_grade_id_description: data.pain_grade_id_description,
          visit_type_id_description: data.visit_type_id_description,
          location_id_name: data.location_id_name,
        })
        setValue('wound_at_facility', data.wound_at_facility)
        setValue('wound_recurrence', data.wound_recurrence)

        setValue('wound_length', data.wound_length)
        setValue('wound_width', isNaN(data.wound_width) ? '' : data.wound_width)
        setValue('wound_depth', isNaN(data.wound_depth) ? '' : data.wound_depth)

        setValue('signs_infected_wound', data.signs_infected_wound)
        setValue('granulation_tissue', isNaN(data.granulation_tissue) ? '' : data.granulation_tissue)
        setValue('slough_tissue', isNaN(data.slough_tissue) ? '' : data.slough_tissue)
        setValue('neurotic_tissue', isNaN(data.neurotic_tissue) ? '' : data.neurotic_tissue)
        setValue('other_tissue', isNaN(data.other_tissue) ? '' : data.other_tissue)
        setValue('type_of_exudate_id', isNaN(data.type_of_exudate_id) ? '' : data.type_of_exudate_id)
        setValue('amount_of_exudate_id', isNaN(data.amount_of_exudate_id) ? '' : data.amount_of_exudate_id)
        setValue('odor_id', isNaN(data.odor_id) ? '' : data.odor_id)

        //wound_edges_
        setValue('wound_edges_irregular', data.wound_edges_irregular)
        setValue('wound_edges_epibole', data.wound_edges_epibole)
        setValue('wound_edges_well', data.wound_edges_well)
        setValue('wound_edges_good', data.wound_edges_good)
        setValue('wound_edges_hyperkeratosis', data.wound_edges_hyperkeratosis)
        setValue('wound_edges_fibrotic', data.wound_edges_fibrotic)
        setValue('wound_edges_not_deter', data.wound_edges_not_deter)

        setValue('periwound_healthy', data.periwound_healthy)
        setValue('periwound_blistered', data.periwound_blistered)
        setValue('periwound_cayosed', data.periwound_cayosed)
        setValue('periwound_discolored', data.periwound_discolored)
        setValue('periwound_contact', data.periwound_contact)
        setValue('periwound_dry_scaly', data.periwound_dry_scaly)
        setValue('periwound_edema', data.periwound_edema)
        setValue('periwound_erythema', data.periwound_erythema)
        setValue('periwound_indurated', data.periwound_indurated)
        setValue('periwound_macerated', data.periwound_macerated)
        setValue('periwound_hyperpigmented', data.periwound_hyperpigmented)
        setValue('periwound_hyperemic', data.periwound_hyperemic)
        setValue('periwound_skin_irritation', data.periwound_skin_irritation)
        setValue('periwound_not_determined', data.periwound_not_determined)

        setValue('tissue_exposure_bone', data.tissue_exposure_bone)
        setValue('tissue_exposure_tendon', data.tissue_exposure_tendon)
        setValue('tissue_exposure_vessel', data.tissue_exposure_vessel)
        setValue('tissue_exposure_muscle', data.tissue_exposure_muscle)
        setValue('tissue_exposure_fat', data.tissue_exposure_fat)
        setValue('tissue_exposure_hardware', data.tissue_exposure_hardware)
        setValue('tissue_exposure_fascia', data.tissue_exposure_fascia)

        setValue('dorsalis_pedis_pulses_id', isNaN(data.dorsalis_pedis_pulses_id) ? '' : data.dorsalis_pedis_pulses_id)
        setValue(
          'posterior_tibialis_pulses_id',
          isNaN(data.posterior_tibialis_pulses_id) ? '' : data.posterior_tibialis_pulses_id
        )
        setValue('radial_pulses_id', isNaN(data.radial_pulses_id) ? '' : data.radial_pulses_id)
        setValue('capillary_refill_id', isNaN(data.capillary_refill_id) ? '' : data.capillary_refill_id)
        setValue('dependant_rubor_id', isNaN(data.dependant_rubor_id) ? '' : data.dependant_rubor_id)
        setValue('venous_filling_time', data.venous_filling_time)
        setValue('ankle_brachial_index', data.ankle_brachial_index)
        setValue('edema_id', isNaN(data.edema_id) ? '' : data.edema_id)
        setValue('compression_in_use', data.compression_in_use)
        setValue('sensation_id', isNaN(data.sensation_id) ? '' : data.sensation_id)
        setValue('claudication_in_use', data.claudication_in_use)
        setValue(
          'temperature_of_extremity_id',
          isNaN(data.temperature_of_extremity_id) ? '' : data.temperature_of_extremity_id
        )
        setValue('hair_growth_on_extremity', data.hair_growth_on_extremity)
        setValue('erythema', data.erythema)
        setValue('hyperpigmentation', data.hyperpigmentation)
        setValue('lipodermatosclerosis', data.lipodermatosclerosis)
        setValue('varicose_veins', data.varicose_veins)
        setValue('off_loading_device_in_use', data.off_loading_device_in_use)

        setValue('barrier_necrosis', data.barrier_necrosis)
        setValue('barrier_infection', data.barrier_infection)
        setValue('barrier_haemorrhage', data.barrier_haemorrhage)
        setValue('barrier_mechanical_damage', data.barrier_mechanical_damage)
        setValue('barrier_diet', data.barrier_diet)
        setValue('barrier_medical_conditions', data.barrier_medical_conditions)
        setValue('barrier_age', data.barrier_age)
        setValue('barrier_medicines', data.barrier_medicines)
        setValue('barrier_smoking', data.barrier_smoking)
        setValue('barrier_varicose_veins', data.barrier_varicose_veins)
        setValue('barrier_dryness', data.barrier_dryness)
        setValue('barrier_bedridden', data.barrier_bedridden)
        setValue('barrier_diabetic', data.barrier_diabetic)
        setValue('barrier_immuno', data.barrier_immuno)

        setValue('ncw_limb_elevation', data.ncw_limb_elevation)
        setValue('ncw_offloading', data.ncw_offloading)
        setValue('ncw_keep_intact_dressings', data.ncw_keep_intact_dressings)
        setValue('ncw_compression', data.ncw_compression)
        setValue('ncw_meds', data.ncw_meds)
        setValue('ncw_glucose_control', data.ncw_glucose_control)
        setValue('ncw_visits', data.ncw_visits)
        setValue('ncw_other', data.ncw_other)

        setValue('tod_autolytic', data.tod_autolytic)
        setValue('tod_enzymatic', data.tod_enzymatic)
        setValue('tod_mechanical', data.tod_mechanical)
        setValue('tod_sharp', data.tod_sharp)
        setValue('tod_biological', data.tod_biological)
        setValue('tod_other', data.tod_other)
        setValue('tod_other_text', data.tod_other_text)
        setValue('tod_applied_product', data.tod_applied_product)

        //Dressing
        setValue('primary_dressing_id', isNaN(data.primary_dressing_id) ? '' : data.primary_dressing_id)
        setValue(
          'other_primary_dressing_id',
          isNaN(data.other_primary_dressing_id) ? '' : data.other_primary_dressing_id
        )
        setValue('secondary_dressing_id', isNaN(data.secondary_dressing_id) ? '' : data.secondary_dressing_id)
        setValue(
          'peri_wound_skin_treatment_id',
          isNaN(data.peri_wound_skin_treatment_id) ? '' : data.peri_wound_skin_treatment_id
        )
        setValue('secure_dressing_id', isNaN(data.secure_dressing_id) ? '' : data.secure_dressing_id)
        setValue(
          'tunneling_and_undermining_treatment_id',
          isNaN(data.tunneling_and_undermining_treatment_id) ? '' : data.tunneling_and_undermining_treatment_id
        )
        setValue('procedure_performed_id', isNaN(data.procedure_performed_id) ? '' : data.procedure_performed_id)
        setValue('folley_insert_change', data.folley_insert_change)

        setSelectedPrimaryDressing({
          label: data.primary_dressing_id_product_name,
          value: isNaN(data.primary_dressing_id) ? '' : data.primary_dressing_id,
        })

        setSelectedOtherPrimaryDressing({
          label: data.other_primary_dressing_id_product_name,
          value: isNaN(data.other_primary_dressing_id) ? '' : data.other_primary_dressing_id,
        })

        setSelectedSecondaryDressing({
          label: data.secondary_dressing_id_product_name,
          value: isNaN(data.secondary_dressing_id) ? '' : data.secondary_dressing_id,
        })

        setSelectedPeriWound({
          label: data.peri_wound_skin_treatment_id_product_name,
          value: isNaN(data.peri_wound_skin_treatment_id) ? '' : data.peri_wound_skin_treatment_id,
        })

        setSelectedSecureDressing({
          label: data.secure_dressing_id_product_name,
          value: isNaN(data.secure_dressing_id) ? '' : data.secure_dressing_id,
        })

        setSelectedUnderminingTreatment({
          label: data.tunneling_and_undermining_treatment_id_product_name,
          value: isNaN(data.tunneling_and_undermining_treatment_id) ? '' : data.tunneling_and_undermining_treatment_id,
        })

        setValue('procedure_performed_id_description', data.procedure_performed_id_description)
        setValue('other_primary_dressing_id_product_name', data.other_primary_dressing_id_product_name)
        setValue('secondary_dressing_id_product_name', data.secondary_dressing_id_product_name)
        setValue('peri_wound_skin_treatment_id_product_name', data.peri_wound_skin_treatment_id_product_name)
        setValue('secure_dressing_id_product_name', data.secure_dressing_id_product_name)
        setValue(
          'tunneling_and_undermining_treatment_id_product_name',
          data.tunneling_and_undermining_treatment_id_product_name
        )

        //Notes
        setValue('rr_vascular_evaluation', data.rr_vascular_evaluation)
        setValue('rr_nutrition_evaluation', data.rr_nutrition_evaluation)
        setValue('rr_infectious_diseases_evaluation', data.rr_infectious_diseases_evaluation)
        setValue('rr_physical_therapy_evaluation', data.rr_physical_therapy_evaluation)
        setValue('rr_primary_physician_evaluation', data.rr_primary_physician_evaluation)
        setValue('rr_hyperbaric_medicine_evaluation', data.rr_hyperbaric_medicine_evaluation)
        setValue('rr_occupational_therapy_evaluation', data.rr_occupational_therapy_evaluation)
        setValue('rr_pain_management_evaluation', data.rr_pain_management_evaluation)
        setValue('rr_off_loading', data.rr_off_loading)
        setValue('rr_social_worker_evaluation', data.rr_social_worker_evaluation)
        setValue('rr_surgery_evaluation', data.rr_surgery_evaluation)
        setValue('rr_disease_management_evaluation', data.rr_disease_management_evaluation)
        setValue('rr_case_management_evaluation', data.rr_case_management_evaluation)
        setValue('rr_community_res_evaluation', data.rr_community_res_evaluation)
        setValue('rr_compression_therapy', data.rr_compression_therapy)
        setValue('rr_negative_pressure_system', data.rr_negative_pressure_system)
        setValue('rr_quit_smoking', data.rr_quit_smoking)
        setValue('rr_other_referrals', data.rr_other_referrals)
        setValue('rr_additional_comments', data.rr_additional_comments)

        //Tests
        setValue('as_wound_culture', data.as_wound_culture)
        setValue('as_biopsy', data.as_biopsy)
        setValue('as_mri', data.as_mri)
        setValue('as_arterial_venous_duplex', data.as_arterial_venous_duplex)
        setValue('as_arteriogram', data.as_arteriogram)
        setValue('as_ctscan', data.as_ctscan)
        setValue('as_arterial_venous_doppler', data.as_arterial_venous_doppler)
        setValue('as_xray', data.as_xray)
        setValue('as_gallium_scan', data.as_gallium_scan)
        setValue('as_ankle_brachial', data.as_ankle_brachial)
        setValue('as_transcutaneous_done_oximetry', data.as_transcutaneous_done_oximetry)
        setValue('as_transcutaneous_oximetry', data.as_transcutaneous_oximetry)
        setValue('as_abi_tbi_ppg', data.as_abi_tbi_ppg)
        setValue('as_other_text', data.as_other_text)
        setValue('wound_culture_was_obtain', data.wound_culture_was_obtain)
        setValue('wound_biopsy_was_obtain', data.wound_biopsy_was_obtain)
        setValue('wound_shave_biopsy_was_obtain', data.wound_shave_biopsy_was_obtain)
        setValue('wound_punch_biopsy_was_done', data.wound_punch_biopsy_was_done)
        setValue('wound_incisional_biopsy_was_done', data.wound_incisional_biopsy_was_done)

        //Adjuvant
        setValue('patient_has_cleansing', data.patient_has_cleansing)
        setValue('patient_on_offloading_device', data.patient_on_offloading_device)
        setValue('patient_on_wheelchair', data.patient_on_wheelchair)
        setValue('patient_is_using_compression_device', data.patient_is_using_compression_device)
        setValue('patient_receiving_hyperbaric_oxygen_treatment', data.patient_receiving_hyperbaric_oxygen_treatment)
        setValue(
          'patient_has_receiving_hyperbaric_oxygen_treatment',
          data.patient_has_receiving_hyperbaric_oxygen_treatment
        )
        setValue('patient_treated_with_low_level_laser_therapy', data.patient_treated_with_low_level_laser_therapy)
        setValue('patient_receiving_occupational_therapy', data.patient_receiving_occupational_therapy)
        setValue(
          'patient_receiving_intermittent_pneumatic_compression',
          data.patient_receiving_intermittent_pneumatic_compression
        )
        setValue('patient_receiving_whirlpool', data.patient_receiving_whirlpool)
        setValue(
          'patient_receiving_complete_decongestive_therapy_on_lower_ex',
          data.patient_receiving_complete_decongestive_therapy_on_lower_ex
        )
        setValue('patient_receiving_manual_lymph_drainage', data.patient_receiving_manual_lymph_drainage)
        setValue(
          'patient_receiving_electrical_stimulation_therapy',
          data.patient_receiving_electrical_stimulation_therapy
        )
        setValue('patient_receiving_electromagnetic_therapy', data.patient_receiving_electromagnetic_therapy)
        setValue('cellular_and_or_tissue_based_product', data.cellular_and_or_tissue_based_product)
        setValue(
          'patient_receiving_transcutaneous_oxygen_therapy',
          data.patient_receiving_transcutaneous_oxygen_therapy
        )
        setValue('patient_receiving_ultrasound_therapy', data.patient_receiving_ultrasound_therapy)
        setValue('patient_receiving_shockwave_therapy', data.patient_receiving_shockwave_therapy)

        loadLookup()

        setLoading(false)
      })
      .catch((err) => {
        showAlertError(err)
        setLoading(false)
      })
  }, [])

  const toggleTab = (tab) => {
    setActiveTab(tab)
  }

  const updateField = (field, value) => {
    console.log(field, value)
    useApi
      .doRun('post', `/patients/${id}/wound_notes/${woundNoteId}`, {
        field_name: field,
        field_value: value === '' ? null : value,
      })
      .then((res) => {})
      .catch((err) => {
        showAlertError(err)
      })
  }

  //https://www.techzaion.com/validation-with-yup
  const valueChange = (e) => {
    const { value, name } = e.target

    //updatValidField(e, name, value);

    const data = { ...filedError }
    data[name] = null

    var jsonData = {}
    jsonData[name] = value

    formSchema
      .validate(jsonData, { abortEarly: false })
      .then(function (val) {
        setFieldError(data)
        updatValidField(e, name, value)
      })
      .catch(function (err) {
        const errorMessage = err.inner.reduce((acc, error) => {
          return error.path == name ? error.message : null
        }, {})

        data[name] = errorMessage
        setFieldError(data)

        if (errorMessage === null) {
          updatValidField(e, name, value)
        }
      })
  }

  const checkBoxValueChange = (e) => {
    const { value, name } = e.target

    setValue(name, e.target.checked && true)
    // updatValidField(e, name, value);

    updateField(name, e.target.checked && true ? 'true' : 'false')
  }

  const getDressingsData = (q, limit, offset) => {
    return new Promise((resolve) => {
      setLoading(true)
      useApi
        .post('/lookup/products/dressings', {
          q: q,
          limit: limit,
          offset: offset,
          sortColumn: 'product_name',
          sort: 'ASC',
        })
        .then((res) => {
          const data = res.data.data
          var items = [{ label: '', value: '' }]
          data.rows.map((r) => {
            const option = { label: r.product_name, value: r.id }
            items.push(option)
            return option
          })
          resolve(() => {
            setLoading(false)
            return items
          })
        })
        .catch((err) => {
          setLoading(false)
          resolve(() => {
            return [{ label: '', value: '' }]
          })
        })
    })
  }

  const getSecureDressingsData = (q, limit, offset) => {
    return new Promise((resolve) => {
      setLoading(true)
      useApi
        .post('/lookup/products/secure_dressings', {
          q: q,
          limit: limit,
          offset: offset,
          sortColumn: 'product_name',
          sort: 'ASC',
        })
        .then((res) => {
          const data = res.data.data
          var items = [{ label: '', value: '' }]
          data.rows.map((r) => {
            const option = { label: r.product_name, value: r.id }
            items.push(option)
            return option
          })
          resolve(() => {
            setLoading(false)
            return items
          })
        })
        .catch((err) => {
          setLoading(false)
          //handleError(err);
          console.log(err)
          resolve(() => {
            return [{ label: '', value: '' }]
          })
        })
    })
  }

  const getPeriWoundsData = (q, limit, offset) => {
    return new Promise((resolve) => {
      setLoading(true)
      useApi
        .post('/lookup/products/peri_wounds', {
          q: q,
          limit: limit,
          offset: offset,
          sortColumn: 'product_name',
          sort: 'ASC',
        })
        .then((res) => {
          const data = res.data.data
          var items = [{ label: '', value: '' }]
          data.rows.map((r) => {
            const option = { label: r.product_name, value: r.id }
            items.push(option)
            return option
          })
          resolve(() => {
            setLoading(false)
            return items
          })
        })
        .catch((err) => {
          setLoading(false)
          //handleError(err);
          resolve(() => {
            return [{ label: '', value: '' }]
          })
        })
    })
  }

  const updatValidField = (e, name, value) => {
    switch (name) {
      case 'wound_length':
      case 'wound_width':
      case 'wound_depth':
        if (e.type == 'blur') {
          updateField(name, String(value))
        }
        break
      case 'date_wound_developed':
        updateField(name, value)
        break
      default:
        updateField(name, value)
        break
    }
  }

  const updateIodineAlert = (key, value) => {
    setIodineAlert((prevState) => ({
      ...prevState,
      [key]: value,
    }))
  }

  const updateAlerts = (key, value) => {
    setAlerts((prevState) => ({
      ...prevState,
      [key]: value,
    }))
  }

  const loadLookup = () => {
    useApi
      .get('/lookup/wound_notes', {})
      .then((res) => {
        console.log('befor trajectory----------- ')
        console.log(res)
        var items = [{ label: '', value: '', source: 'exudate_types' }]
        items.push({ label: '', value: '', source: 'exudate_amounts' })
        items.push({ label: '', value: '', source: 'exudate_odors' })
        items.push({ label: '', value: '', source: 'pulse_options' })
        items.push({ label: '', value: '', source: 'temperature_of_extremities' })
        items.push({ label: '', value: '', source: 'capillary_refills' })
        items.push({ label: '', value: '', source: 'plus_minus_options' })
        items.push({ label: '', value: '', source: 'edema_options' })
        items.push({ label: '', value: '', source: 'procedure_performed_options' })

        res.data.data.map((r) => {
          const option = { label: r.description, value: r.id, source: r.source }
          items.push(option)
          return option
        })

        setExudate_Types(items.filter((r) => r.source == 'exudate_types'))
        setExudate_Amounts(items.filter((r) => r.source == 'exudate_amounts'))
        setExudate_Odors(items.filter((r) => r.source == 'exudate_odors'))
        setPulse_Options(items.filter((r) => r.source == 'pulse_options'))
        setTemperature_Of_Extremities(items.filter((r) => r.source == 'temperature_of_extremities'))
        setCapillary_Refills(items.filter((r) => r.source == 'capillary_refills'))
        setPlus_Minus_Options(items.filter((r) => r.source == 'plus_minus_options'))
        setEdema_Options(items.filter((r) => r.source == 'edema_options'))
        setProcedure_Performed_Options(items.filter((r) => r.source == 'procedure_performed_options'))
      })
      .catch((err) => {
        showAlertError(err)
      })
  }

  React.useEffect(() => {
    useApi
      .get('/lookup/wound_trajectories', {})
      .then((res) => {
        var items = []
        res.data.data.map((r) => {
          const option = { label: r.description, value: r.id }
          items.push(option)
          return option
        })
        items.sort((a, b) => a.value - b.value)
        // console.log(items)
        setTrajectoryOptions(items)
      })
      .catch((err) => {
        showAlertError(err)
      })

    useApi
      .get('/lookup/visit_frequencies', {})
      .then((res) => {
        var items = []
        res.data.data.map((r) => {
          const option = { label: r.description, value: r.id }
          items.push(option)
          return option
        })
        items.sort((a, b) => a.value - b.value)
        // console.log(items)
        setVisitFrequencyOptions(items)
      })
      .catch((err) => {
        showAlertError(err)
      })
  }, [])

  const saveCallback = (data, isValid) => {
    if (isValid) {
      useApi
        .doRun(
          formData.id == '' ? 'post' : 'put',
          `/wound_notes/${recordId}/wound_notes_cleansers/` + (formData.id == '' ? 0 : formData.id),
          {
            product_id: isNaN(data.product_id) ? null : parseInt(data.product_id),
          }
        )
        .then((res) => {
          toast('WoundNotesCleanser Saved Successfully!')
          setLoading(false)
          doHandleSaveAndClosePopup()
        })
        .catch((err) => {
          setLoading(false)
          showAlertError(err)
        })
    }
    setDoSubmit(false)
  }

  const [selectedPrimaryDressing, setSelectedPrimaryDressing] = useState(null)
  const handleSelectedPrimaryDressing = (value) => {
    setSelectedPrimaryDressing(value)

    // alert(value.label)

    if (value != null) {
      value.label.includes('Iod') || value.label.includes('IOD')
        ? updateIodineAlert('pri', true)
        : updateIodineAlert('pri', false)(value.label.includes('Negative Pressure'))
        ? setShowNegativePressureAlert(true)
        : setShowNegativePressureAlert(false)

      const hasIodineAlert = Object.values(iodineAlert).some((value) => value)
      // alert(hasIodineAlert)
      setShowIodineAlert(hasIodineAlert)

      // alert((value.label.includes("Negative Pressure")))
      updateField('primary_dressing_id', String(value.value))
      setValue('primary_dressing_id', value.value)
      setValue('primary_dressing_id_product_name', value.label)
    } else {
      updateField('primary_dressing_id', null)
      setValue('primary_dressing_id', '')
      setValue('primary_dressing_id_product_name', '')
    }
  }

  const [selectedOtherPrimaryDressing, setSelectedOtherPrimaryDressing] = useState(null)
  const handleSelectedOtherPrimaryDressing = (value) => {
    setSelectedOtherPrimaryDressing(value)

    if (value != null) {
      value.label.includes('Iod') || value.label.includes('IOD')
        ? updateIodineAlert('opri', true)
        : updateIodineAlert('opri', false)(value.label.includes('Negative Pressure'))
        ? setShowNegativePressureAlert(true)
        : setShowNegativePressureAlert(false)

      const hasIodineAlert = Object.values(iodineAlert).some((value) => value)
      setShowIodineAlert(hasIodineAlert)

      updateField('other_primary_dressing_id', String(value.value))
      setValue('other_primary_dressing_id', value.value)
      setValue('other_primary_dressing_id_product_name', value.label)
    } else {
      updateField('other_primary_dressing_id', null)
      setValue('other_primary_dressing_id', '')
      setValue('other_primary_dressing_id_product_name', '')
    }
  }

  const [selectedSecondayDressing, setSelectedSecondaryDressing] = useState(null)
  const handleSelectedSecondaryDressing = (value) => {
    setSelectedSecondaryDressing(value)

    if (value != null) {
      value.label.includes('Iod') || value.label.includes('IOD')
        ? updateIodineAlert('spri', true)
        : updateIodineAlert('spri', false)(value.label.includes('Negative Pressure'))
        ? setShowNegativePressureAlert(true)
        : setShowNegativePressureAlert(false)

      const hasIodineAlert = Object.values(iodineAlert).some((value) => value)
      setShowIodineAlert(hasIodineAlert)

      updateField('secondary_dressing_id', String(value.value))
      setValue('secondary_dressing_id', value.value)
      setValue('secondary_dressing_id_product_name', value.label)
    } else {
      updateField('secondary_dressing_id', null)
      setValue('secondary_dressing_id', '')
      setValue('secondary_dressing_id_product_name', '')
    }
  }

  const [selectedPeriWound, setSelectedPeriWound] = useState(null)
  const handleSelectedPeriWound = (value) => {
    setSelectedPeriWound(value)

    if (value != null) {
      value.label.includes('Iod') || value.label.includes('IOD')
        ? updateIodineAlert('pwst', true)
        : updateIodineAlert('pwst', false)(value.label.includes('Negative Pressure'))
        ? setShowNegativePressureAlert(true)
        : setShowNegativePressureAlert(false)

      const hasIodineAlert = Object.values(iodineAlert).some((value) => value)
      setShowIodineAlert(hasIodineAlert)

      updateField('peri_wound_skin_treatment_id', String(value.value))
      setValue('peri_wound_skin_treatment_id', value.value)
      setValue('peri_wound_skin_treatment_id_product_name', value.label)
    } else {
      updateField('peri_wound_skin_treatment_id', null)
      setValue('peri_wound_skin_treatment_id', '')
      setValue('peri_wound_skin_treatment_id_product_name', '')
    }
  }

  const [selectedSecureDressing, setSelectedSecureDressing] = useState(null)
  const handleSelectedSecureDressing = (value) => {
    setSelectedSecureDressing(value)

    if (value != null) {
      value.label.includes('Iod') || value.label.includes('IOD')
        ? updateIodineAlert('sedr', true)
        : updateIodineAlert('sedr', false)(value.label.includes('Negative Pressure'))
        ? setShowNegativePressureAlert(true)
        : setShowNegativePressureAlert(false)

      const hasIodineAlert = Object.values(iodineAlert).some((value) => value)
      setShowIodineAlert(hasIodineAlert)

      updateField('secure_dressing_id', String(value.value))
      setValue('secure_dressing_id', value.value)
      setValue('secure_dressing_id_product_name', value.label)
    } else {
      updateField('secure_dressing_id', null)
      setValue('secure_dressing_id', '')
      setValue('secure_dressing_id_product_name', '')
    }
  }

  const [selectedUnderminingTreatment, setSelectedUnderminingTreatment] = useState(null)
  const handleSelectedUnderminingTreatment = (value) => {
    setSelectedUnderminingTreatment(value)

    if (value != null) {
      value.label.includes('Iod') || value.label.includes('IOD')
        ? updateIodineAlert('taut', true)
        : updateIodineAlert('taut', false)(value.label.includes('Negative Pressure'))
        ? setShowNegativePressureAlert(true)
        : setShowNegativePressureAlert(false)

      const hasIodineAlert = Object.values(iodineAlert).some((value) => value)
      setShowIodineAlert(hasIodineAlert)

      updateField('tunneling_and_undermining_treatment_id', String(value.value))
      setValue('tunneling_and_undermining_treatment_id', value.value)
      setValue('tunneling_and_undermining_treatment_id_product_name', value.label)
    } else {
      updateField('tunneling_and_undermining_treatment_id', null)
      setValue('tunneling_and_undermining_treatment_id', '')
      setValue('tunneling_and_undermining_treatment_id_product_name', '')
    }
  }

  React.useEffect(() => {
    const wound_edges_epibole = getValues('wound_edges_epibole')
    // alert(wound_edges_epibole)
    setShowEpiboleAlert(wound_edges_epibole)
  }, [watch('wound_edges_epibole')])

  React.useEffect(() => {
    const neurotic_tissue = getValues('neurotic_tissue')
    updateAlerts('neuroticTissueAlert', neurotic_tissue >= 1)
  }, [watch('neurotic_tissue')])

  React.useEffect(() => {
    const slough_tissue = getValues('slough_tissue')
    // alert(slough_tissue >= 1)
    updateAlerts('sloughTissueAlert', slough_tissue >= 1)
  }, [watch('slough_tissue')])

  const handleTypeOfExudateChange = (event) => {
    const type_of_exudate_id = event.target.value

    // const type_of_exudate_id = getValues('type_of_exudate_id')
    console.log(type_of_exudate_id)

    switch (parseInt(type_of_exudate_id)) {
      case 2:
        updateAlerts('exudateAlert', true)
        updateAlerts(
          'exudateMsg',
          'Wound may be infected<br>- Consider wound culture<br>- Consider infectology evaluation'
        )
        break
      case 6:
        // alert('true')
        updateAlerts('exudateAlert', true)
        updateAlerts(
          'exudateMsg',
          'Sanguineous drainage<p>- Sanguineous drainage may last longer in deeper wounds</p><p>- May be a sign of further damage to the tissues</p><p>- Report this type of drainage to your surgeon or PCP depending on time/amount</p>'
        )
        break
      case 3:
        updateAlerts('exudateAlert', true)
        updateAlerts(
          'exudateMsg',
          'Wound may be infected<br>- Consider wound culture<br>- Consider infectology evaluation'
        )
        break
      case 7:
        updateAlerts('exudateAlert', true)
        updateAlerts(
          'exudateMsg',
          'Wound most likely infected<br>- Consider wound culture<br>- Consider infectology evaluation<br>- Often due to Pseudomonas<br>- Consider acetic acid irrigation solution'
        )
        break
      default:
        updateAlerts('exudateAlert', false)
        updateAlerts('exudateMsg', '')
        break
    }
  }

  const handleAmounteOfExudateChange = (event) => {
    const amount_of_exudate_id = event.target.value

    // const amount_of_exudate_id = getValues('amount_of_exudate_id')
    console.log(amount_of_exudate_id)

    switch (parseInt(amount_of_exudate_id)) {
      case 1:
        updateAlerts('exudateAmtAlert', true)
        updateAlerts('exudateAmtMsg', 'No exudate<br>Remember to hydrate wound')
        updateAlerts('exudateAmtAlertVariant', 'info')
        break

      case 2:
        updateAlerts('exudateAmtAlert', true)
        updateAlerts('exudateAmtMsg', 'Amount of exudate small<br>Remember to hydrate wound')
        updateAlerts('exudateAmtAlertVariant', 'info')
        break

      case 6:
        updateAlerts('exudateAmtAlert', true)
        updateAlerts('exudateAmtMsg', 'Beware maceration<br>- Consider a foam<br>- Consider Mesalt<br>- Consider NPWT')
        updateAlerts('exudateAmtAlertVariant', 'warning')
        break

      case 3:
        updateAlerts('exudateAmtAlert', true)
        updateAlerts('exudateAmtMsg', 'Amount of exudate small<br>Remember to hydrate wound')
        updateAlerts('exudateAmtAlertVariant', 'info')
        break
      case 4:
        updateAlerts('exudateAmtAlert', true)
        updateAlerts(
          'exudateAmtMsg',
          'Amount of exudate moderate<br>- Consider an alginate<br>- Consider a foam<br>- Consider idosorb if fibrin present'
        )
        updateAlerts('exudateAmtAlertVariant', 'info')
        break

      default:
        updateAlerts('exudateAmtAlert', false)
        updateAlerts('exudateAmtMsg', '')
        break
    }
  }

  const handleOdorChange = (event) => {
    const odor_id = event.target.value

    // const odor_id = getValues('odor_id')
    console.log(odor_id)

    switch (parseInt(odor_id)) {
      case 3:
        updateAlerts('odorAlert', true)
        updateAlerts(
          'odorMsg',
          'Wound most likely infected<br>- Consider antimicrobial cleansers and dressings<br>- Consider wound culture<br>- Consider infectology evaluation'
        )
        updateAlerts('odorAlertVariant', 'warning')
        break

      case 2:
        updateAlerts('odorAlert', true)
        updateAlerts(
          'odorMsg',
          'Wound may be infected<br>- Consider antimicrobial cleansers and dressings<br>- Consider wound culture<br>- Consider infectology evaluation'
        )
        updateAlerts('odorAlertVariant', 'info')
        break

      default:
        updateAlerts('odorAlert', false)
        updateAlerts('odorMsg', '')
        break
    }
  }

  const dismissEpiboleAlert = () => {
    setShowEpiboleAlert(false)
  }
  const dismissIodineAlert = () => {
    setShowIodineAlert(false)
  }
  const dismissNegativePressureAlert = () => {
    setShowNegativePressureAlert(false)
  }

  const dismissAlerts = (value) => {
    updateAlerts(value, false)
  }

  return (
    <>
      <Breadcrumbs
        title='Wound Note'
        data={[
          { title: 'Patients', link: '/patients' },
          {
            title: getFullName(
              formData.first_name,
              formData.middle_name,
              formData.last_name,
              formData.second_last_name
            ),
            link: `/patients/${id}`,
          },
          { title: 'View Wound Note' },
        ]}
      />

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
                  <span className='fw-bold'>Wound Notes</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink active={activeTab === '2'} onClick={() => toggleTab('2')}>
                  <List size={18} className='me-50' />
                  <span className='fw-bold'>Tunneling</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink active={activeTab === '3'} onClick={() => toggleTab('3')}>
                  <List size={18} className='me-50' />
                  <span className='fw-bold'>Undermining</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink active={activeTab === '4'} onClick={() => toggleTab('4')}>
                  <List size={18} className='me-50' />
                  <span className='fw-bold'>Fistula</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink active={activeTab === '5'} onClick={() => toggleTab('5')}>
                  <ConeTestOnNets size={18} className='me-50' />
                  <span className='fw-bold'>Diagnosis</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink active={activeTab === '7'} onClick={() => toggleTab('7')}>
                  <Image size={18} className='me-50' />
                  <span className='fw-bold'>Images</span>
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
              <TabPane tabId='1'>
                <Row>
                  <Col sm='12'>
                    <AssessmentCard formData={formWoundNoteData} />
                  </Col>
                  <Col sm='6'>
                    <Card>
                      <CardHeader>
                        <CardTitle tag='h4'>Wound Development</CardTitle>
                      </CardHeader>
                      <CardBody>
                        <Row>
                          <Col xl='12' xs='12'>
                            <Row tag='dl' className='mb-0'>
                              <Row>
                                <Col sm='5' className='fw-bolder mb-1'>
                                  Date Wound Developed
                                </Col>
                                <Col sm='6' className='mb-1'>
                                  <Input
                                    max={today}
                                    type='date'
                                    defaultValue={formWoundNoteData.date_wound_developed}
                                    invalid={errors.date_wound_developed && true}
                                    id='date_wound_developed'
                                    onChange={valueChange}
                                  />
                                  <ErrorMessaje message={errors.date_wound_developed} />
                                </Col>
                              </Row>
                              <Row>
                                <Col xl='12' xs='12'>
                                  <Row tag='dl' className='mb-0'>
                                    <Col sm='5' className='fw-bolder mb-1'>
                                      <label for='wound_at_facility'>Wound Acquired at a Facility?</label>
                                    </Col>
                                    <Col
                                      tag='dd'
                                      className='mb-1'
                                      style={{
                                        display: 'flex',
                                        justifyContent: 'start',
                                      }}
                                    >
                                      <div className='mt-50 mt-sm-0'>
                                        <Controller
                                          id='wound_at_facility'
                                          name='wound_at_facility'
                                          control={control}
                                          render={({ field: { value, ...field } }) => (
                                            <Input
                                              type='checkbox'
                                              invalid={errors.wound_at_facility && true}
                                              checked={!!value}
                                              style={{ border: '1px solid gray' }}
                                              {...field}
                                            />
                                          )}
                                        />

                                        {errors.wound_at_facility && (
                                          <FormFeedback>{errors.wound_at_facility.message}</FormFeedback>
                                        )}
                                      </div>
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                              <Row>
                                <Col xl='12' xs='12'>
                                  <Row tag='dl' className='mb-0'>
                                    <Col sm='5' className='fw-bolder mb-1'>
                                      <label for='wound_recurrence'>Wound Recurrence?</label>
                                    </Col>
                                    <Col
                                      tag='dd'
                                      className='mb-1'
                                      style={{
                                        display: 'flex',
                                        justifyContent: 'start',
                                      }}
                                    >
                                      <div className='mt-50 mt-sm-0'>
                                        <Controller
                                          id='wound_recurrence'
                                          name='wound_recurrence'
                                          control={control}
                                          render={({ field: { value, ...field } }) => (
                                            <Input
                                              type='checkbox'
                                              invalid={errors.wound_recurrence && true}
                                              checked={!!value}
                                              style={{ border: '1px solid gray' }}
                                              {...field}
                                            />
                                          )}
                                        />

                                        {errors.wound_recurrence && (
                                          <FormFeedback>{errors.wound_recurrence.message}</FormFeedback>
                                        )}
                                      </div>
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            </Row>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col sm='6'>
                    <Card>
                      <CardHeader>
                        <CardTitle tag='h4'>WOUND MEASUREMENT</CardTitle>
                      </CardHeader>
                      <CardBody>
                        <Row>
                          <Col xl='12' xs='12'>
                            <Row tag='dl' className='mb-0'>
                              <Col md='3' className='mb-1'>
                                <Label className='form-label' for='wound_length'>
                                  Wound Length{' '}
                                </Label>
                                <Controller
                                  id='wound_length'
                                  name='wound_length'
                                  control={control}
                                  placeholder='0'
                                  render={({ field: { onBlur, value, ...field } }) => (
                                    <MyCleave
                                      {...field}
                                      onBlur={valueChange}
                                      maxLength='3'
                                      value={value}
                                      className={classnames('form-control', {
                                        'is-invalid': errors.wound_length && true,
                                      })}
                                      options={{
                                        numeral: true,
                                        numeralThousandsGroupStyle: 'thousand',
                                      }}
                                    />
                                  )}
                                />

                                <ErrorMessaje message={filedError.wound_length} />
                              </Col>

                              <Col md='3' className='mb-1'>
                                <Label className='form-label' for='wound_width'>
                                  Wound Width{' '}
                                </Label>
                                <Controller
                                  id='wound_width'
                                  name='wound_width'
                                  control={control}
                                  placeholder='0'
                                  render={({ field: { onBlur, value, ...field } }) => (
                                    <MyCleave
                                      {...field}
                                      onBlur={valueChange}
                                      maxLength='3'
                                      value={value}
                                      className={classnames('form-control', {
                                        'is-invalid': errors.wound_width && true,
                                      })}
                                      options={{
                                        numeral: true,
                                        numeralThousandsGroupStyle: 'thousand',
                                      }}
                                    />
                                  )}
                                />

                                <ErrorMessaje message={filedError.wound_width} />
                              </Col>

                              <Col md='3' className='mb-1'>
                                <Label className='form-label' for='wound_depth'>
                                  Wound Depth{' '}
                                </Label>
                                <Controller
                                  id='wound_depth'
                                  name='wound_depth'
                                  control={control}
                                  placeholder='0'
                                  render={({ field: { onBlur, value, ...field } }) => (
                                    <MyCleave
                                      {...field}
                                      onBlur={valueChange}
                                      maxLength='3'
                                      value={value}
                                      className={classnames('form-control', {
                                        'is-invalid': errors.wound_depth && true,
                                      })}
                                      options={{
                                        numeral: true,
                                        numeralThousandsGroupStyle: 'thousand',
                                      }}
                                    />
                                  )}
                                />

                                <ErrorMessaje message={filedError.wound_depth} />
                              </Col>

                              <Col md='4' className='mb-1'>
                                <Label className='form-label' for='wound_lxw'>
                                  Wound LxW
                                </Label>
                                <InputGroup>
                                  <Input
                                    id='wound_lxw'
                                    name='wound_lxw'
                                    disabled
                                    value={woundMeasurements.lxw.toLocaleString()}
                                    className={classnames('form-control', {
                                      'is-invalid': errors.wound_lxw,
                                    })}
                                  />
                                  <InputGroupText>cm²</InputGroupText>
                                </InputGroup>
                                {errors.wound_lxw && <FormFeedback>{errors.wound_lxw.message}</FormFeedback>}
                              </Col>

                              <Col md='4' className='mb-1'>
                                <Label className='form-label' for='wound_lxwxd'>
                                  Wound Lxwxd
                                </Label>
                                <InputGroup>
                                  <Input
                                    id='wound_lxwxd'
                                    name='wound_lxwxd'
                                    disabled
                                    value={woundMeasurements.lxwxd.toLocaleString()}
                                    className={classnames('form-control', {
                                      'is-invalid': errors.wound_lxwxd,
                                    })}
                                  />
                                  <InputGroupText>cm²</InputGroupText>
                                </InputGroup>

                                {errors.wound_lxwxd && <FormFeedback>{errors.wound_lxwxd.message}</FormFeedback>}
                              </Col>
                            </Row>
                          </Col>

                          {showMeasurementAlert && (
                            <>
                              <WarningAlert
                                variant='warning'
                                message='Wound will be considered closed. Even after your wound looks closed and repaired, it’s still healing.'
                                isOpen={showMeasurementAlert}
                                toggle={dismissMeasurementAlert}
                              />
                            </>
                          )}
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>

                  <Col sm='12'>
                    <Card>
                      <CardHeader>
                        <CardTitle tag='h4'>WOUND NOTE DESCRIPTION</CardTitle>
                      </CardHeader>
                      <CardBody>
                        <Row>
                          <Col xl='12' xs='12'>
                            <Row tag='dl' className='mb-0'>
                              <Col xl='6' xs='6'>
                                <Row tag='dl' className='mb-0'>
                                  <Col sm='5' className='fw-bolder mb-1'>
                                    <label for='signs_infected_wound'>Signs Infected Wound</label>
                                  </Col>
                                  <Col
                                    tag='dd'
                                    className='mb-1'
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'end',
                                    }}
                                  >
                                    <div className='mt-50 mt-sm-0'>
                                      <Controller
                                        id='signs_infected_wound'
                                        name='signs_infected_wound'
                                        control={control}
                                        render={({ field: { value, ...field } }) => (
                                          <Input
                                            type='checkbox'
                                            invalid={errors.signs_infected_wound && true}
                                            checked={!!value}
                                            style={{ border: '1px solid gray' }}
                                            {...field}
                                          />
                                        )}
                                      />

                                      {errors.signs_infected_wound && (
                                        <FormFeedback>{errors.signs_infected_wound.message}</FormFeedback>
                                      )}
                                    </div>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            <Row>
                              <Col md='3' className='mb-1'>
                                <Label className='form-label' for='granulation_tissue'>
                                  Granulation Tissue{' '}
                                </Label>
                                <Controller
                                  id='granulation_tissue'
                                  name='granulation_tissue'
                                  control={control}
                                  placeholder='%'
                                  render={({ field: { onBlur, value, ...field } }) => (
                                    <Cleave
                                      {...field}
                                      onBlur={valueChange}
                                      value={value}
                                      className={classnames('form-control', {
                                        'is-invalid': errors.granulation_tissue && true,
                                      })}
                                      options={{
                                        numericOnly: true,
                                        blocks: [3],
                                      }}
                                    />
                                  )}
                                />
                                <ErrorMessaje message={filedError.granulation_tissue} />

                                {errors.granulation_tissue && (
                                  <FormFeedback>{errors.granulation_tissue.message}</FormFeedback>
                                )}
                              </Col>

                              <Col md='3' className='mb-1'>
                                <Label className='form-label' for='slough_tissue'>
                                  Slough Tissue{' '}
                                </Label>
                                <Controller
                                  id='slough_tissue'
                                  name='slough_tissue'
                                  control={control}
                                  placeholder='%'
                                  render={({ field: { onBlur, value, ...field } }) => (
                                    <Cleave
                                      {...field}
                                      onBlur={valueChange}
                                      value={value}
                                      className={classnames('form-control', {
                                        'is-invalid': errors.slough_tissue && true,
                                      })}
                                      options={{
                                        numericOnly: true,
                                        blocks: [3],
                                      }}
                                    />
                                  )}
                                />
                                <ErrorMessaje message={filedError.slough_tissue} />
                                {errors.slough_tissue && <FormFeedback>{errors.slough_tissue.message}</FormFeedback>}
                              </Col>

                              <Col md='3' className='mb-1'>
                                <Label className='form-label' for='neurotic_tissue'>
                                  Neurotic Tissue{' '}
                                </Label>
                                <Controller
                                  id='neurotic_tissue'
                                  name='neurotic_tissue'
                                  control={control}
                                  placeholder='%'
                                  render={({ field: { onBlur, value, ...field } }) => (
                                    <Cleave
                                      {...field}
                                      onBlur={valueChange}
                                      value={value}
                                      className={classnames('form-control', {
                                        'is-invalid': errors.neurotic_tissue && true,
                                      })}
                                      options={{
                                        numericOnly: true,
                                        blocks: [3],
                                      }}
                                    />
                                  )}
                                />
                                <ErrorMessaje message={filedError.neurotic_tissue} />

                                {errors.neurotic_tissue && (
                                  <FormFeedback>{errors.neurotic_tissue.message}</FormFeedback>
                                )}
                              </Col>

                              <Col md='3' className='mb-1'>
                                <Label className='form-label' for='other_tissue'>
                                  Other Tissue{' '}
                                </Label>
                                <Controller
                                  id='other_tissue'
                                  name='other_tissue'
                                  control={control}
                                  placeholder='%'
                                  render={({ field: { onBlur, value, ...field } }) => (
                                    <Cleave
                                      {...field}
                                      onBlur={valueChange}
                                      value={value}
                                      className={classnames('form-control', {
                                        'is-invalid': errors.other_tissue && true,
                                      })}
                                      options={{
                                        numericOnly: true,
                                        blocks: [3],
                                      }}
                                    />
                                  )}
                                />
                                <ErrorMessaje message={filedError.other_tissue} />

                                {errors.other_tissue && <FormFeedback>{errors.other_tissue.message}</FormFeedback>}
                              </Col>

                              <Col className='col-md-3 mb-1'>
                                <Label className='form-label' for='type_of_exudate_id'>
                                  Type Of Exudate Id{' '}
                                </Label>

                                <Controller
                                  name='type_of_exudate_id'
                                  control={control}
                                  render={({ field: { onChange, value, ...field } }) => (
                                    <Input
                                      type='select'
                                      id='type_of_exudate_id'
                                      onChange={(event) => {
                                        handleTypeOfExudateChange(event)
                                        valueChange(event)
                                      }}
                                      invalid={errors.type_of_exudate_id && true}
                                      {...field}
                                    >
                                      {exudate_types.map &&
                                        exudate_types.map((item, index) => (
                                          <option
                                            value={item.value}
                                            key={item.value}
                                            selected={item.value == value + ''}
                                          >
                                            {item.label}
                                          </option>
                                        ))}
                                    </Input>
                                  )}
                                />
                                {errors.type_of_exudate_id && (
                                  <FormFeedback>{errors.type_of_exudate_id.message}</FormFeedback>
                                )}
                              </Col>

                              <Col className='col-md-3 mb-1'>
                                <Label className='form-label' for='amount_of_exudate_id'>
                                  Amount Of Exudate Id{' '}
                                </Label>

                                <Controller
                                  name='amount_of_exudate_id'
                                  control={control}
                                  render={({ field: { onChange, value, ...field } }) => (
                                    <Input
                                      type='select'
                                      id='amount_of_exudate_id'
                                      onChange={(event) => {
                                        handleAmounteOfExudateChange(event)
                                        valueChange(event)
                                      }}
                                      invalid={errors.amount_of_exudate_id && true}
                                      {...field}
                                    >
                                      {exudate_amounts.map &&
                                        exudate_amounts.map((item, index) => (
                                          <option
                                            value={item.value}
                                            key={item.value}
                                            selected={item.value == value + ''}
                                          >
                                            {item.label}
                                          </option>
                                        ))}
                                    </Input>
                                  )}
                                />
                                {errors.amount_of_exudate_id && (
                                  <FormFeedback>{errors.amount_of_exudate_id.message}</FormFeedback>
                                )}
                              </Col>

                              <Col className='col-md-3 mb-1'>
                                <Label className='form-label' for='odor_id'>
                                  Odor Id{' '}
                                </Label>

                                <Controller
                                  name='odor_id'
                                  control={control}
                                  render={({ field: { onChange, value, ...field } }) => (
                                    <Input
                                      type='select'
                                      id='odor_id'
                                      onChange={(event) => {
                                        handleOdorChange(event)
                                        valueChange(event)
                                      }}
                                      invalid={errors.odor_id && true}
                                      {...field}
                                    >
                                      {exudate_odors.map &&
                                        exudate_odors.map((item, index) => (
                                          <option
                                            value={item.value}
                                            key={item.value}
                                            selected={item.value == value + ''}
                                          >
                                            {item.label}
                                          </option>
                                        ))}
                                    </Input>
                                  )}
                                />
                                {errors.odor_id && <FormFeedback>{errors.odor_id.message}</FormFeedback>}
                              </Col>
                            </Row>
                          </Col>

                          {showInfectedAlert && (
                            <WarningAlert
                              variant='danger'
                              message={`DANGER : Wound may be infected<p>- Consider wound culture</p><p>- Consider infectology evaluation</p>`}
                              isOpen={showInfectedAlert}
                              toggle={dismissInfectedAlert}
                            />
                          )}
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>

                  <Col sm='12'>
                    <Card>
                      <CardHeader>
                        <CardTitle tag='h4'>WOUND EDGES</CardTitle>
                      </CardHeader>
                      <CardBody>
                        <Row>
                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='wound_edges_irregular'>Irregulary</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='wound_edges_irregular'
                                    name='wound_edges_irregular'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.wound_edges_irregular && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.wound_edges_irregular && (
                                    <FormFeedback>{errors.wound_edges_irregular.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='wound_edges_epibole'>Epibole</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='wound_edges_epibole'
                                    name='wound_edges_epibole'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.wound_edges_epibole && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.wound_edges_epibole && (
                                    <FormFeedback>{errors.wound_edges_epibole.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='wound_edges_well'>Well</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='wound_edges_well'
                                    name='wound_edges_well'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.wound_edges_well && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.wound_edges_well && (
                                    <FormFeedback>{errors.wound_edges_well.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='wound_edges_good'>Good</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='wound_edges_good'
                                    name='wound_edges_good'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.wound_edges_good && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.wound_edges_good && (
                                    <FormFeedback>{errors.wound_edges_good.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='wound_edges_hyperkeratosis'>Hyperkeratosis</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='wound_edges_hyperkeratosis'
                                    name='wound_edges_hyperkeratosis'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.wound_edges_hyperkeratosis && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.wound_edges_hyperkeratosis && (
                                    <FormFeedback>{errors.wound_edges_hyperkeratosis.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='wound_edges_fibrotic'>Fibrotic </label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='wound_edges_fibrotic'
                                    name='wound_edges_fibrotic'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.wound_edges_fibrotic && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.as_biopsy && (
                                    <FormFeedback>{errors.wound_edges_fibrotic.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='wound_edges_not_deter'>No Determined</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='wound_edges_not_deter'
                                    name='wound_edges_not_deter'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.wound_edges_not_deter && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.as_biopsy && (
                                    <FormFeedback>{errors.wound_edges_not_deter.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>

                  <Col sm='12'>
                    <Card>
                      <CardHeader>
                        <CardTitle tag='h4'>PERIWOUND</CardTitle>
                      </CardHeader>
                      <CardBody>
                        <Row>
                          <Col xl='12' xs='12'>
                            <Row tag='dl' className='mb-0'>
                              <Col xl='6' xs='6'>
                                <Row tag='dl' className='mb-0'>
                                  <Col sm='5' className='fw-bolder mb-1'>
                                    <label for='periwound_healthy'>Healthy</label>
                                  </Col>
                                  <Col
                                    tag='dd'
                                    className='mb-1'
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'start',
                                    }}
                                  >
                                    <div className='mt-50 mt-sm-0'>
                                      <Controller
                                        id='periwound_healthy'
                                        name='periwound_healthy'
                                        control={control}
                                        render={({ field: { value, ...field } }) => (
                                          <Input
                                            type='checkbox'
                                            invalid={errors.periwound_healthy && true}
                                            checked={!!value}
                                            style={{ border: '1px solid gray' }}
                                            {...field}
                                          />
                                        )}
                                      />

                                      {errors.periwound_healthy && (
                                        <FormFeedback>{errors.periwound_healthy.message}</FormFeedback>
                                      )}
                                    </div>
                                  </Col>
                                </Row>
                              </Col>

                              <Col xl='6' xs='6'>
                                <Row tag='dl' className='mb-0'>
                                  <Col sm='5' className='fw-bolder mb-1'>
                                    <label for='periwound_blistered'>Blistered</label>
                                  </Col>
                                  <Col
                                    tag='dd'
                                    className='mb-1'
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'start',
                                    }}
                                  >
                                    <div className='mt-50 mt-sm-0'>
                                      <Controller
                                        id='periwound_blistered'
                                        name='periwound_blistered'
                                        control={control}
                                        render={({ field: { value, ...field } }) => (
                                          <Input
                                            type='checkbox'
                                            invalid={errors.periwound_blistered && true}
                                            checked={!!value}
                                            style={{ border: '1px solid gray' }}
                                            {...field}
                                          />
                                        )}
                                      />

                                      {errors.periwound_blistered && (
                                        <FormFeedback>{errors.periwound_blistered.message}</FormFeedback>
                                      )}
                                    </div>
                                  </Col>
                                </Row>
                              </Col>

                              <Col xl='6' xs='6'>
                                <Row tag='dl' className='mb-0'>
                                  <Col sm='5' className='fw-bolder mb-1'>
                                    <label for='periwound_cayosed'>Cayosed</label>
                                  </Col>
                                  <Col
                                    tag='dd'
                                    className='mb-1'
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'start',
                                    }}
                                  >
                                    <div className='mt-50 mt-sm-0'>
                                      <Controller
                                        id='periwound_cayosed'
                                        name='periwound_cayosed'
                                        control={control}
                                        render={({ field: { value, ...field } }) => (
                                          <Input
                                            type='checkbox'
                                            invalid={errors.periwound_cayosed && true}
                                            checked={!!value}
                                            style={{ border: '1px solid gray' }}
                                            {...field}
                                          />
                                        )}
                                      />

                                      {errors.periwound_cayosed && (
                                        <FormFeedback>{errors.periwound_cayosed.message}</FormFeedback>
                                      )}
                                    </div>
                                  </Col>
                                </Row>
                              </Col>

                              <Col xl='6' xs='6'>
                                <Row tag='dl' className='mb-0'>
                                  <Col sm='5' className='fw-bolder mb-1'>
                                    <label for='periwound_discolored'>Discolored</label>
                                  </Col>
                                  <Col
                                    tag='dd'
                                    className='mb-1'
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'start',
                                    }}
                                  >
                                    <div className='mt-50 mt-sm-0'>
                                      <Controller
                                        id='periwound_discolored'
                                        name='periwound_discolored'
                                        control={control}
                                        render={({ field: { value, ...field } }) => (
                                          <Input
                                            type='checkbox'
                                            invalid={errors.periwound_discolored && true}
                                            checked={!!value}
                                            style={{ border: '1px solid gray' }}
                                            {...field}
                                          />
                                        )}
                                      />

                                      {errors.periwound_discolored && (
                                        <FormFeedback>{errors.periwound_discolored.message}</FormFeedback>
                                      )}
                                    </div>
                                  </Col>
                                </Row>
                              </Col>

                              <Col xl='6' xs='6'>
                                <Row tag='dl' className='mb-0'>
                                  <Col sm='5' className='fw-bolder mb-1'>
                                    <label for='periwound_contact'>Contact Dermatitis</label>
                                  </Col>
                                  <Col
                                    tag='dd'
                                    className='mb-1'
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'start',
                                    }}
                                  >
                                    <div className='mt-50 mt-sm-0'>
                                      <Controller
                                        id='periwound_contact'
                                        name='periwound_contact'
                                        control={control}
                                        render={({ field: { value, ...field } }) => (
                                          <Input
                                            type='checkbox'
                                            invalid={errors.periwound_contact && true}
                                            checked={!!value}
                                            style={{ border: '1px solid gray' }}
                                            {...field}
                                          />
                                        )}
                                      />

                                      {errors.periwound_contact && (
                                        <FormFeedback>{errors.periwound_contact.message}</FormFeedback>
                                      )}
                                    </div>
                                  </Col>
                                </Row>
                              </Col>

                              <Col xl='6' xs='6'>
                                <Row tag='dl' className='mb-0'>
                                  <Col sm='5' className='fw-bolder mb-1'>
                                    <label for='periwound_dry_scaly'>Dry Scaly </label>
                                  </Col>
                                  <Col
                                    tag='dd'
                                    className='mb-1'
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'start',
                                    }}
                                  >
                                    <div className='mt-50 mt-sm-0'>
                                      <Controller
                                        id='periwound_dry_scaly'
                                        name='periwound_dry_scaly'
                                        control={control}
                                        render={({ field: { value, ...field } }) => (
                                          <Input
                                            type='checkbox'
                                            invalid={errors.periwound_dry_scaly && true}
                                            checked={!!value}
                                            style={{ border: '1px solid gray' }}
                                            {...field}
                                          />
                                        )}
                                      />

                                      {errors.as_biopsy && (
                                        <FormFeedback>{errors.periwound_dry_scaly.message}</FormFeedback>
                                      )}
                                    </div>
                                  </Col>
                                </Row>
                              </Col>

                              <Col xl='6' xs='6'>
                                <Row tag='dl' className='mb-0'>
                                  <Col sm='5' className='fw-bolder mb-1'>
                                    <label for='periwound_edema'>Edema</label>
                                  </Col>
                                  <Col
                                    tag='dd'
                                    className='mb-1'
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'start',
                                    }}
                                  >
                                    <div className='mt-50 mt-sm-0'>
                                      <Controller
                                        id='periwound_edema'
                                        name='periwound_edema'
                                        control={control}
                                        render={({ field: { value, ...field } }) => (
                                          <Input
                                            type='checkbox'
                                            invalid={errors.periwound_edema && true}
                                            checked={!!value}
                                            style={{ border: '1px solid gray' }}
                                            {...field}
                                          />
                                        )}
                                      />

                                      {errors.as_biopsy && (
                                        <FormFeedback>{errors.periwound_edema.message}</FormFeedback>
                                      )}
                                    </div>
                                  </Col>
                                </Row>
                              </Col>
                              <Col xl='6' xs='6'>
                                <Row tag='dl' className='mb-0'>
                                  <Col sm='5' className='fw-bolder mb-1'>
                                    <label for='periwound_erythema'>Erythema</label>
                                  </Col>
                                  <Col
                                    tag='dd'
                                    className='mb-1'
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'start',
                                    }}
                                  >
                                    <div className='mt-50 mt-sm-0'>
                                      <Controller
                                        id='periwound_erythema'
                                        name='periwound_erythema'
                                        control={control}
                                        render={({ field: { value, ...field } }) => (
                                          <Input
                                            type='checkbox'
                                            invalid={errors.periwound_erythema && true}
                                            checked={!!value}
                                            style={{ border: '1px solid gray' }}
                                            {...field}
                                          />
                                        )}
                                      />

                                      {errors.periwound_erythema && (
                                        <FormFeedback>{errors.periwound_erythema.message}</FormFeedback>
                                      )}
                                    </div>
                                  </Col>
                                </Row>
                              </Col>

                              <Col xl='6' xs='6'>
                                <Row tag='dl' className='mb-0'>
                                  <Col sm='5' className='fw-bolder mb-1'>
                                    <label for='periwound_indurated'>Indurated</label>
                                  </Col>
                                  <Col
                                    tag='dd'
                                    className='mb-1'
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'start',
                                    }}
                                  >
                                    <div className='mt-50 mt-sm-0'>
                                      <Controller
                                        id='periwound_indurated'
                                        name='periwound_indurated'
                                        control={control}
                                        render={({ field: { value, ...field } }) => (
                                          <Input
                                            type='checkbox'
                                            invalid={errors.periwound_indurated && true}
                                            checked={!!value}
                                            style={{ border: '1px solid gray' }}
                                            {...field}
                                          />
                                        )}
                                      />

                                      {errors.periwound_indurated && (
                                        <FormFeedback>{errors.periwound_indurated.message}</FormFeedback>
                                      )}
                                    </div>
                                  </Col>
                                </Row>
                              </Col>

                              <Col xl='6' xs='6'>
                                <Row tag='dl' className='mb-0'>
                                  <Col sm='5' className='fw-bolder mb-1'>
                                    <label for='periwound_macerated'>Macerated</label>
                                  </Col>
                                  <Col
                                    tag='dd'
                                    className='mb-1'
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'start',
                                    }}
                                  >
                                    <div className='mt-50 mt-sm-0'>
                                      <Controller
                                        id='periwound_macerated'
                                        name='periwound_macerated'
                                        control={control}
                                        render={({ field: { value, ...field } }) => (
                                          <Input
                                            type='checkbox'
                                            invalid={errors.periwound_macerated && true}
                                            checked={!!value}
                                            style={{ border: '1px solid gray' }}
                                            {...field}
                                          />
                                        )}
                                      />

                                      {errors.periwound_macerated && (
                                        <FormFeedback>{errors.periwound_macerated.message}</FormFeedback>
                                      )}
                                    </div>
                                  </Col>
                                </Row>
                              </Col>

                              <Col xl='6' xs='6'>
                                <Row tag='dl' className='mb-0'>
                                  <Col sm='5' className='fw-bolder mb-1'>
                                    <label for='periwound_hyperpigmented'>Hyperpigmented</label>
                                  </Col>
                                  <Col
                                    tag='dd'
                                    className='mb-1'
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'start',
                                    }}
                                  >
                                    <div className='mt-50 mt-sm-0'>
                                      <Controller
                                        id='periwound_hyperpigmented'
                                        name='periwound_hyperpigmented'
                                        control={control}
                                        render={({ field: { value, ...field } }) => (
                                          <Input
                                            type='checkbox'
                                            invalid={errors.periwound_hyperpigmented && true}
                                            checked={!!value}
                                            style={{ border: '1px solid gray' }}
                                            {...field}
                                          />
                                        )}
                                      />

                                      {errors.periwound_hyperpigmented && (
                                        <FormFeedback>{errors.periwound_hyperpigmented.message}</FormFeedback>
                                      )}
                                    </div>
                                  </Col>
                                </Row>
                              </Col>

                              <Col xl='6' xs='6'>
                                <Row tag='dl' className='mb-0'>
                                  <Col sm='5' className='fw-bolder mb-1'>
                                    <label for='periwound_hyperemic'>Hyperemic</label>
                                  </Col>
                                  <Col
                                    tag='dd'
                                    className='mb-1'
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'start',
                                    }}
                                  >
                                    <div className='mt-50 mt-sm-0'>
                                      <Controller
                                        id='periwound_hyperemic'
                                        name='periwound_hyperemic'
                                        control={control}
                                        render={({ field: { value, ...field } }) => (
                                          <Input
                                            type='checkbox'
                                            invalid={errors.periwound_hyperemic && true}
                                            checked={!!value}
                                            style={{ border: '1px solid gray' }}
                                            {...field}
                                          />
                                        )}
                                      />

                                      {errors.periwound_hyperemic && (
                                        <FormFeedback>{errors.periwound_hyperemic.message}</FormFeedback>
                                      )}
                                    </div>
                                  </Col>
                                </Row>
                              </Col>

                              <Col xl='6' xs='6'>
                                <Row tag='dl' className='mb-0'>
                                  <Col sm='5' className='fw-bolder mb-1'>
                                    <label for='periwound_skin_irritation'>Skin Irritation </label>
                                  </Col>
                                  <Col
                                    tag='dd'
                                    className='mb-1'
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'start',
                                    }}
                                  >
                                    <div className='mt-50 mt-sm-0'>
                                      <Controller
                                        id='periwound_skin_irritation'
                                        name='periwound_skin_irritation'
                                        control={control}
                                        render={({ field: { value, ...field } }) => (
                                          <Input
                                            type='checkbox'
                                            invalid={errors.periwound_skin_irritation && true}
                                            checked={!!value}
                                            style={{ border: '1px solid gray' }}
                                            {...field}
                                          />
                                        )}
                                      />

                                      {errors.as_biopsy && (
                                        <FormFeedback>{errors.periwound_skin_irritation.message}</FormFeedback>
                                      )}
                                    </div>
                                  </Col>
                                </Row>
                              </Col>

                              <Col xl='6' xs='6'>
                                <Row tag='dl' className='mb-0'>
                                  <Col sm='5' className='fw-bolder mb-1'>
                                    <label for='periwound_not_determined'>Not Determined</label>
                                  </Col>
                                  <Col
                                    tag='dd'
                                    className='mb-1'
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'start',
                                    }}
                                  >
                                    <div className='mt-50 mt-sm-0'>
                                      <Controller
                                        id='periwound_not_determined'
                                        name='periwound_not_determined'
                                        control={control}
                                        render={({ field: { value, ...field } }) => (
                                          <Input
                                            type='checkbox'
                                            invalid={errors.periwound_not_determined && true}
                                            checked={!!value}
                                            style={{ border: '1px solid gray' }}
                                            {...field}
                                          />
                                        )}
                                      />

                                      {errors.as_biopsy && (
                                        <FormFeedback>{errors.periwound_not_determined.message}</FormFeedback>
                                      )}
                                    </div>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>

                  <Col sm='12'>
                    <Card>
                      <CardHeader>
                        <CardTitle tag='h4'>TISSUE EXPOSURE</CardTitle>
                      </CardHeader>
                      <CardBody>
                        <Col xl='12' xs='12'>
                          <Row tag='dl' className='mb-0'>
                            <Col xl='6' xs='6'>
                              <Row tag='dl' className='mb-0'>
                                <Col sm='5' className='fw-bolder mb-1'>
                                  <label for='tissue_exposure_bone'>Bone</label>
                                </Col>
                                <Col
                                  tag='dd'
                                  className='mb-1'
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'start',
                                  }}
                                >
                                  <div className='mt-50 mt-sm-0'>
                                    <Controller
                                      id='tissue_exposure_bone'
                                      name='tissue_exposure_bone'
                                      control={control}
                                      render={({ field: { value, ...field } }) => (
                                        <Input
                                          type='checkbox'
                                          invalid={errors.tissue_exposure_bone && true}
                                          checked={!!value}
                                          style={{ border: '1px solid gray' }}
                                          {...field}
                                        />
                                      )}
                                    />

                                    {errors.tissue_exposure_bone && (
                                      <FormFeedback>{errors.tissue_exposure_bone.message}</FormFeedback>
                                    )}
                                  </div>
                                </Col>
                              </Row>
                            </Col>

                            <Col xl='6' xs='6'>
                              <Row tag='dl' className='mb-0'>
                                <Col sm='5' className='fw-bolder mb-1'>
                                  <label for='tissue_exposure_tendon'>Tendon</label>
                                </Col>
                                <Col
                                  tag='dd'
                                  className='mb-1'
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'start',
                                  }}
                                >
                                  <div className='mt-50 mt-sm-0'>
                                    <Controller
                                      id='tissue_exposure_tendon'
                                      name='tissue_exposure_tendon'
                                      control={control}
                                      render={({ field: { value, ...field } }) => (
                                        <Input
                                          type='checkbox'
                                          invalid={errors.tissue_exposure_tendon && true}
                                          checked={!!value}
                                          style={{ border: '1px solid gray' }}
                                          {...field}
                                        />
                                      )}
                                    />

                                    {errors.tissue_exposure_tendon && (
                                      <FormFeedback>{errors.tissue_exposure_tendon.message}</FormFeedback>
                                    )}
                                  </div>
                                </Col>
                              </Row>
                            </Col>

                            <Col xl='6' xs='6'>
                              <Row tag='dl' className='mb-0'>
                                <Col sm='5' className='fw-bolder mb-1'>
                                  <label for='tissue_exposure_vessel'>Vessel</label>
                                </Col>
                                <Col
                                  tag='dd'
                                  className='mb-1'
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'start',
                                  }}
                                >
                                  <div className='mt-50 mt-sm-0'>
                                    <Controller
                                      id='tissue_exposure_vessel'
                                      name='tissue_exposure_vessel'
                                      control={control}
                                      render={({ field: { value, ...field } }) => (
                                        <Input
                                          type='checkbox'
                                          invalid={errors.tissue_exposure_vessel && true}
                                          checked={!!value}
                                          style={{ border: '1px solid gray' }}
                                          {...field}
                                        />
                                      )}
                                    />

                                    {errors.tissue_exposure_vessel && (
                                      <FormFeedback>{errors.tissue_exposure_vessel.message}</FormFeedback>
                                    )}
                                  </div>
                                </Col>
                              </Row>
                            </Col>

                            <Col xl='6' xs='6'>
                              <Row tag='dl' className='mb-0'>
                                <Col sm='5' className='fw-bolder mb-1'>
                                  <label for='tissue_exposure_muscle'>Muscle</label>
                                </Col>
                                <Col
                                  tag='dd'
                                  className='mb-1'
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'start',
                                  }}
                                >
                                  <div className='mt-50 mt-sm-0'>
                                    <Controller
                                      id='tissue_exposure_muscle'
                                      name='tissue_exposure_muscle'
                                      control={control}
                                      render={({ field: { value, ...field } }) => (
                                        <Input
                                          type='checkbox'
                                          invalid={errors.tissue_exposure_muscle && true}
                                          checked={!!value}
                                          style={{ border: '1px solid gray' }}
                                          {...field}
                                        />
                                      )}
                                    />

                                    {errors.tissue_exposure_muscle && (
                                      <FormFeedback>{errors.tissue_exposure_muscle.message}</FormFeedback>
                                    )}
                                  </div>
                                </Col>
                              </Row>
                            </Col>

                            <Col xl='6' xs='6'>
                              <Row tag='dl' className='mb-0'>
                                <Col sm='5' className='fw-bolder mb-1'>
                                  <label for='tissue_exposure_fat'>Fat</label>
                                </Col>
                                <Col
                                  tag='dd'
                                  className='mb-1'
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'start',
                                  }}
                                >
                                  <div className='mt-50 mt-sm-0'>
                                    <Controller
                                      id='tissue_exposure_fat'
                                      name='tissue_exposure_fat'
                                      control={control}
                                      render={({ field: { value, ...field } }) => (
                                        <Input
                                          type='checkbox'
                                          invalid={errors.tissue_exposure_fat && true}
                                          checked={!!value}
                                          style={{ border: '1px solid gray' }}
                                          {...field}
                                        />
                                      )}
                                    />

                                    {errors.tissue_exposure_fat && (
                                      <FormFeedback>{errors.tissue_exposure_fat.message}</FormFeedback>
                                    )}
                                  </div>
                                </Col>
                              </Row>
                            </Col>

                            <Col xl='6' xs='6'>
                              <Row tag='dl' className='mb-0'>
                                <Col sm='5' className='fw-bolder mb-1'>
                                  <label for='tissue_exposure_hardware'>Hardware </label>
                                </Col>
                                <Col
                                  tag='dd'
                                  className='mb-1'
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'start',
                                  }}
                                >
                                  <div className='mt-50 mt-sm-0'>
                                    <Controller
                                      id='tissue_exposure_hardware'
                                      name='tissue_exposure_hardware'
                                      control={control}
                                      render={({ field: { value, ...field } }) => (
                                        <Input
                                          type='checkbox'
                                          invalid={errors.tissue_exposure_hardware && true}
                                          checked={!!value}
                                          style={{ border: '1px solid gray' }}
                                          {...field}
                                        />
                                      )}
                                    />

                                    {errors.as_biopsy && (
                                      <FormFeedback>{errors.tissue_exposure_hardware.message}</FormFeedback>
                                    )}
                                  </div>
                                </Col>
                              </Row>
                            </Col>

                            <Col xl='6' xs='6'>
                              <Row tag='dl' className='mb-0'>
                                <Col sm='5' className='fw-bolder mb-1'>
                                  <label for='tissue_exposure_fascia'>Fascia</label>
                                </Col>
                                <Col
                                  tag='dd'
                                  className='mb-1'
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'start',
                                  }}
                                >
                                  <div className='mt-50 mt-sm-0'>
                                    <Controller
                                      id='tissue_exposure_fascia'
                                      name='tissue_exposure_fascia'
                                      control={control}
                                      render={({ field: { value, ...field } }) => (
                                        <Input
                                          type='checkbox'
                                          invalid={errors.tissue_exposure_fascia && true}
                                          checked={!!value}
                                          style={{ border: '1px solid gray' }}
                                          {...field}
                                        />
                                      )}
                                    />

                                    {errors.as_biopsy && (
                                      <FormFeedback>{errors.tissue_exposure_fascia.message}</FormFeedback>
                                    )}
                                  </div>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Col>
                      </CardBody>
                    </Card>
                  </Col>

                  <Col sm='12'>
                    <Card>
                      <CardHeader>
                        <CardTitle tag='h4'>LOWER EXTREMITY ASSESSMENT (if applicable)</CardTitle>
                      </CardHeader>
                      <CardBody>
                        <Row>
                          <Col className='col-md-6 mb-1'>
                            <Label className='form-label' for='dorsalis_pedis_pulses_id'>
                              Dorsalis Pedis Pulses Id{' '}
                            </Label>

                            <Controller
                              name='dorsalis_pedis_pulses_id'
                              control={control}
                              render={({ field: { onChange, value, ...field } }) => (
                                <Input
                                  type='select'
                                  onChange={valueChange}
                                  id='dorsalis_pedis_pulses_id'
                                  invalid={errors.dorsalis_pedis_pulses_id && true}
                                  {...field}
                                >
                                  {pulse_options.map &&
                                    pulse_options.map((item, index) => (
                                      <option value={item.value} key={item.value}>
                                        {item.label}
                                      </option>
                                    ))}
                                </Input>
                              )}
                            />
                            {errors.dorsalis_pedis_pulses_id && (
                              <FormFeedback>{errors.dorsalis_pedis_pulses_id.message}</FormFeedback>
                            )}
                          </Col>

                          <Col className='col-md-6 mb-1'>
                            <Label className='form-label' for='posterior_tibialis_pulses_id'>
                              Posterior Tibialis Pulses Id{' '}
                            </Label>

                            <Controller
                              name='posterior_tibialis_pulses_id'
                              control={control}
                              render={({ field: { onChange, value, ...field } }) => (
                                <Input
                                  type='select'
                                  onChange={valueChange}
                                  id='posterior_tibialis_pulses_id'
                                  invalid={errors.posterior_tibialis_pulses_id && true}
                                  {...field}
                                >
                                  {pulse_options.map &&
                                    pulse_options.map((item, index) => (
                                      <option value={item.value} key={item.value}>
                                        {item.label}
                                      </option>
                                    ))}
                                </Input>
                              )}
                            />
                            {errors.posterior_tibialis_pulses_id && (
                              <FormFeedback>{errors.posterior_tibialis_pulses_id.message}</FormFeedback>
                            )}
                          </Col>

                          <Col className='col-md-6 mb-1'>
                            <Label className='form-label' for='radial_pulses_id'>
                              Radial Pulses Id{' '}
                            </Label>

                            <Controller
                              name='radial_pulses_id'
                              control={control}
                              render={({ field: { onChange, value, ...field } }) => (
                                <Input
                                  type='select'
                                  onChange={valueChange}
                                  id='radial_pulses_id'
                                  invalid={errors.radial_pulses_id && true}
                                  {...field}
                                >
                                  {pulse_options.map &&
                                    pulse_options.map((item, index) => (
                                      <option value={item.value} key={item.value}>
                                        {item.label}
                                      </option>
                                    ))}
                                </Input>
                              )}
                            />
                            {errors.radial_pulses_id && <FormFeedback>{errors.radial_pulses_id.message}</FormFeedback>}
                          </Col>

                          <Col className='col-md-6 mb-1'>
                            <Label className='form-label' for='capillary_refill_id'>
                              Capillary Refill Id{' '}
                            </Label>

                            <Controller
                              name='capillary_refill_id'
                              control={control}
                              render={({ field: { onChange, value, ...field } }) => (
                                <Input
                                  type='select'
                                  onChange={valueChange}
                                  id='capillary_refill_id'
                                  invalid={errors.capillary_refill_id && true}
                                  {...field}
                                >
                                  {capillary_refills.map &&
                                    capillary_refills.map((item, index) => (
                                      <option value={item.value} key={item.value}>
                                        {item.label}
                                      </option>
                                    ))}
                                </Input>
                              )}
                            />
                            {errors.capillary_refill_id && (
                              <FormFeedback>{errors.capillary_refill_id.message}</FormFeedback>
                            )}
                          </Col>

                          <Col className='col-md-6 mb-1'>
                            <Label className='form-label' for='dependant_rubor_id'>
                              Dependant Rubor Id{' '}
                            </Label>

                            <Controller
                              name='dependant_rubor_id'
                              control={control}
                              render={({ field: { onChange, value, ...field } }) => (
                                <Input
                                  type='select'
                                  onChange={valueChange}
                                  id='dependant_rubor_id'
                                  invalid={errors.dependant_rubor_id && true}
                                  {...field}
                                >
                                  {plus_minus_options.map &&
                                    plus_minus_options.map((item, index) => (
                                      <option value={item.value} key={item.value}>
                                        {item.label}
                                      </option>
                                    ))}
                                </Input>
                              )}
                            />
                            {errors.dependant_rubor_id && (
                              <FormFeedback>{errors.dependant_rubor_id.message}</FormFeedback>
                            )}
                          </Col>

                          <Col md='6' className='mb-1'>
                            <Label className='form-label' for='venous_filling_time'>
                              Venous Filling Time{' '}
                            </Label>

                            <Controller
                              id='venous_filling_time'
                              name='venous_filling_time'
                              control={control}
                              render={({ field: { onChange, value, ...field } }) => (
                                <Input invalid={errors.venous_filling_time && true} {...field} />
                              )}
                            />
                            {errors.venous_filling_time && (
                              <FormFeedback>{errors.venous_filling_time.message}</FormFeedback>
                            )}
                          </Col>

                          <Col md='6' className='mb-1'>
                            <Label className='form-label' for='ankle_brachial_index'>
                              Ankle Brachial Index{' '}
                            </Label>

                            <Controller
                              id='ankle_brachial_index'
                              name='ankle_brachial_index'
                              control={control}
                              render={({ field: { onChange, value, ...field } }) => (
                                <Input invalid={errors.ankle_brachial_index && true} {...field} />
                              )}
                            />
                            {errors.ankle_brachial_index && (
                              <FormFeedback>{errors.ankle_brachial_index.message}</FormFeedback>
                            )}
                          </Col>

                          <Col className='col-md-6 mb-1'>
                            <Label className='form-label' for='edema_id'>
                              Edema Id{' '}
                            </Label>

                            <Controller
                              name='edema_id'
                              control={control}
                              render={({ field: { onChange, value, ...field } }) => (
                                <Input
                                  type='select'
                                  onChange={valueChange}
                                  id='edema_id'
                                  invalid={errors.edema_id && true}
                                  {...field}
                                >
                                  {edema_options.map &&
                                    edema_options.map((item, index) => (
                                      <option value={item.value} key={item.value}>
                                        {item.label}
                                      </option>
                                    ))}
                                </Input>
                              )}
                            />
                            {errors.edema_id && <FormFeedback>{errors.edema_id.message}</FormFeedback>}
                          </Col>

                          <Col className='col-md-6 mb-1'>
                            <Label className='form-label' for='sensation_id'>
                              Sensation Id{' '}
                            </Label>

                            <Controller
                              name='sensation_id'
                              control={control}
                              render={({ field: { onChange, value, ...field } }) => (
                                <Input
                                  type='select'
                                  onChange={valueChange}
                                  id='sensation_id'
                                  invalid={errors.sensation_id && true}
                                  {...field}
                                >
                                  {pulse_options.map &&
                                    pulse_options.map((item, index) => (
                                      <option value={item.value} key={item.value}>
                                        {item.label}
                                      </option>
                                    ))}
                                </Input>
                              )}
                            />
                            {errors.sensation_id && <FormFeedback>{errors.sensation_id.message}</FormFeedback>}
                          </Col>

                          <Col className='col-md-6 mb-1'>
                            <Label className='form-label' for='temperature_of_extremity_id'>
                              Temperature Of Extremity Id{' '}
                            </Label>

                            <Controller
                              name='temperature_of_extremity_id'
                              control={control}
                              render={({ field: { onChange, value, ...field } }) => (
                                <Input
                                  type='select'
                                  onChange={valueChange}
                                  id='temperature_of_extremity_id'
                                  invalid={errors.temperature_of_extremity_id && true}
                                  {...field}
                                >
                                  {temperature_of_extremities.map &&
                                    temperature_of_extremities.map((item, index) => (
                                      <option value={item.value} key={item.value}>
                                        {item.label}
                                      </option>
                                    ))}
                                </Input>
                              )}
                            />
                            {errors.temperature_of_extremity_id && (
                              <FormFeedback>{errors.temperature_of_extremity_id.message}</FormFeedback>
                            )}
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='claudication_in_use'>Claudication In Use</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='claudication_in_use'
                                    name='claudication_in_use'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.claudication_in_use && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.claudication_in_use && (
                                    <FormFeedback>{errors.claudication_in_use.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='compression_in_use'>Compression In Use</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                  alignItmes: 'center',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='compression_in_use'
                                    name='compression_in_use'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.compression_in_use && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.compression_in_use && (
                                    <FormFeedback>{errors.compression_in_use.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='hair_growth_on_extremity'>Hair Growth On Extremity</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='hair_growth_on_extremity'
                                    name='hair_growth_on_extremity'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.hair_growth_on_extremity && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.hair_growth_on_extremity && (
                                    <FormFeedback>{errors.hair_growth_on_extremity.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='erythema'>Erythema</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='erythema'
                                    name='erythema'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.erythema && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.erythema && <FormFeedback>{errors.erythema.message}</FormFeedback>}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='hyperpigmentation'>Hyperpigmentation</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='hyperpigmentation'
                                    name='hyperpigmentation'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.hyperpigmentation && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.hyperpigmentation && (
                                    <FormFeedback>{errors.hyperpigmentation.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='lipodermatosclerosis'>Lipodermatosclerosis</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='lipodermatosclerosis'
                                    name='lipodermatosclerosis'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.lipodermatosclerosis && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.lipodermatosclerosis && (
                                    <FormFeedback>{errors.lipodermatosclerosis.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='varicose_veins'>Varicose Veins</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='varicose_veins'
                                    name='varicose_veins'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.varicose_veins && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.varicose_veins && (
                                    <FormFeedback>{errors.varicose_veins.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='off_loading_device_in_use'>Off Loading Device In Use </label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='off_loading_device_in_use'
                                    name='off_loading_device_in_use'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.off_loading_device_in_use && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.as_biopsy && (
                                    <FormFeedback>{errors.off_loading_device_in_use.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>

                  <Col sm='12'>
                    <Card>
                      <CardHeader>
                        <CardTitle tag='h4'>Barrier</CardTitle>
                      </CardHeader>
                      <CardBody>
                        <Row>
                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='barrier_necrosis'>Necrosis</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='barrier_necrosis'
                                    name='barrier_necrosis'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.barrier_necrosis && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.barrier_necrosis && (
                                    <FormFeedback>{errors.barrier_necrosis.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='barrier_infection'>Infection</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                  alignItmes: 'center',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='barrier_infection'
                                    name='barrier_infection'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.barrier_infection && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.barrier_infection && (
                                    <FormFeedback>{errors.barrier_infection.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='barrier_haemorrhage'>Haemorrhage</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='barrier_haemorrhage'
                                    name='barrier_haemorrhage'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.barrier_haemorrhage && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.barrier_haemorrhage && (
                                    <FormFeedback>{errors.barrier_haemorrhage.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='barrier_mechanical_damage'>Mechanical Damage</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='barrier_mechanical_damage'
                                    name='barrier_mechanical_damage'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.barrier_mechanical_damage && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.barrier_mechanical_damage && (
                                    <FormFeedback>{errors.barrier_mechanical_damage.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='barrier_diet'>Diet</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='barrier_diet'
                                    name='barrier_diet'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.barrier_diet && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.barrier_diet && <FormFeedback>{errors.barrier_diet.message}</FormFeedback>}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='barrier_medical_conditions'>Medical Conditions</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='barrier_medical_conditions'
                                    name='barrier_medical_conditions'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.barrier_medical_conditions && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.barrier_medical_conditions && (
                                    <FormFeedback>{errors.barrier_medical_conditions.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='barrier_age'>Age</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='barrier_age'
                                    name='barrier_age'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.barrier_age && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.barrier_age && <FormFeedback>{errors.barrier_age.message}</FormFeedback>}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='barrier_medicines'>Medicines</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='barrier_medicines'
                                    name='barrier_medicines'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.barrier_medicines && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.as_biopsy && <FormFeedback>{errors.barrier_medicines.message}</FormFeedback>}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='barrier_smoking'>Smoking</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='barrier_smoking'
                                    name='barrier_smoking'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.barrier_smoking && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.barrier_smoking && (
                                    <FormFeedback>{errors.barrier_smoking.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='barrier_varicose_veins'>Varicose Veins</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='barrier_varicose_veins'
                                    name='barrier_varicose_veins'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.barrier_varicose_veins && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.barrier_varicose_veins && (
                                    <FormFeedback>{errors.barrier_varicose_veins.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='barrier_dryness'>Dryness</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='barrier_dryness'
                                    name='barrier_dryness'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.barrier_dryness && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.barrier_dryness && (
                                    <FormFeedback>{errors.barrier_dryness.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='barrier_bedridden'>Bedridden</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='barrier_bedridden'
                                    name='barrier_bedridden'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.barrier_bedridden && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.barrier_bedridden && (
                                    <FormFeedback>{errors.barrier_bedridden.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='barrier_diabetic'>Diabetic</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='barrier_diabetic'
                                    name='barrier_diabetic'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.barrier_diabetic && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.barrier_diabetic && (
                                    <FormFeedback>{errors.barrier_diabetic.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='barrier_immuno'>Immunocompromised</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='barrier_immuno'
                                    name='barrier_immuno'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.barrier_immuno && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.as_biopsy && <FormFeedback>{errors.barrier_immuno.message}</FormFeedback>}
                                </div>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>

                  <Col sm='12'>
                    <Card>
                      <CardHeader>
                        <CardTitle tag='h4'>Compliance</CardTitle>
                      </CardHeader>
                      <CardBody>
                        <Row>
                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='ncw_limb_elevation'>Limb Elevation</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='ncw_limb_elevation'
                                    name='ncw_limb_elevation'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.ncw_limb_elevation && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.ncw_limb_elevation && (
                                    <FormFeedback>{errors.ncw_limb_elevation.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='ncw_offloading'>Offloading</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                  alignItmes: 'center',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='ncw_offloading'
                                    name='ncw_offloading'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.ncw_offloading && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.ncw_offloading && (
                                    <FormFeedback>{errors.ncw_offloading.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='ncw_keep_intact_dressings'>Keep Intact Dressings</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='ncw_keep_intact_dressings'
                                    name='ncw_keep_intact_dressings'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.ncw_keep_intact_dressings && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.ncw_keep_intact_dressings && (
                                    <FormFeedback>{errors.ncw_keep_intact_dressings.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='ncw_compression'>Compression</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='ncw_compression'
                                    name='ncw_compression'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.ncw_compression && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.ncw_compression && (
                                    <FormFeedback>{errors.ncw_compression.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='ncw_meds'>Meds</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='ncw_meds'
                                    name='ncw_meds'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.ncw_meds && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.ncw_meds && <FormFeedback>{errors.ncw_meds.message}</FormFeedback>}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='ncw_glucose_control'>Glucose Control</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='ncw_glucose_control'
                                    name='ncw_glucose_control'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.ncw_glucose_control && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.ncw_glucose_control && (
                                    <FormFeedback>{errors.ncw_glucose_control.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='ncw_visits'>Visits</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='ncw_visits'
                                    name='ncw_visits'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.ncw_visits && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.ncw_visits && <FormFeedback>{errors.ncw_visits.message}</FormFeedback>}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='ncw_other'>Other</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='ncw_other'
                                    name='ncw_other'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.ncw_other && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.as_biopsy && <FormFeedback>{errors.ncw_other.message}</FormFeedback>}
                                </div>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col sm='12'>
                    <Card>
                      <CardHeader>
                        <CardTitle tag='h4'>Treatment</CardTitle>
                      </CardHeader>
                      <CardBody>
                        <Row>
                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='tod_autolytic'>Autolytic</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='tod_autolytic'
                                    name='tod_autolytic'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.tod_autolytic && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.tod_autolytic && <FormFeedback>{errors.tod_autolytic.message}</FormFeedback>}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='tod_enzymatic'>Enzymatic</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='tod_enzymatic'
                                    name='tod_enzymatic'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.tod_enzymatic && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.tod_enzymatic && <FormFeedback>{errors.tod_enzymatic.message}</FormFeedback>}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='tod_mechanical'>Mechanical</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='tod_mechanical'
                                    name='tod_mechanical'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.tod_mechanical && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.tod_mechanical && (
                                    <FormFeedback>{errors.tod_mechanical.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='tod_sharp'>Sharp</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='tod_sharp'
                                    name='tod_sharp'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.tod_sharp && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.tod_sharp && <FormFeedback>{errors.tod_sharp.message}</FormFeedback>}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='tod_biological'>Biological</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='tod_biological'
                                    name='tod_biological'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.tod_biological && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.tod_biological && (
                                    <FormFeedback>{errors.tod_biological.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='tod_other'>Other</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='tod_other'
                                    name='tod_other'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.tod_other && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.as_biopsy && <FormFeedback>{errors.tod_other.message}</FormFeedback>}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col md='6' className='mb-1'>
                            <Label className='form-label' for='tod_other_text'>
                              Tod Other Text{' '}
                            </Label>

                            <Controller
                              id='tod_other_text'
                              name='tod_other_text'
                              control={control}
                              render={({ field: { onBlur, value, ...field } }) => (
                                <Input
                                  invalid={errors.tod_other_text && true}
                                  {...field}
                                  onBlur={valueChange}
                                  value={value}
                                />
                              )}
                            />

                            <ErrorMessaje message={filedError.tod_other_text} />
                            {errors.tod_other_text && <FormFeedback>{errors.tod_other_text.message}</FormFeedback>}
                          </Col>

                          <Col md='6' className='mb-1'>
                            <Label className='form-label' for='tod_applied_product'>
                              Tod Applied Product{' '}
                            </Label>

                            <Controller
                              id='tod_applied_product'
                              name='tod_applied_product'
                              control={control}
                              render={({ field: { onBlur, value, ...field } }) => (
                                <Input
                                  invalid={errors.tod_applied_product && true}
                                  {...field}
                                  onBlur={valueChange}
                                  value={value}
                                />
                              )}
                            />

                            <ErrorMessaje message={filedError.tod_applied_product} />
                            {errors.tod_applied_product && (
                              <FormFeedback>{errors.tod_applied_product.message}</FormFeedback>
                            )}
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>

                  <Col sm='12'>
                    <Card>
                      <CardHeader>
                        <CardTitle tag='h4'>Cleansers and Dressings</CardTitle>
                      </CardHeader>
                      <CardBody>
                        <Row>
                          <Col className='col-md-6 mb-1'>
                            <Label className='form-label' for='primary_dressing_id'>
                              Primary Dressing{' '}
                            </Label>

                            <Controller
                              name='primary_dressing_id'
                              control={control}
                              render={({ field: { onChange, ...field } }) => (
                                <AsyncSelect
                                  id='primary_dressing_id'
                                  invalid={errors.primary_dressing_id && true}
                                  {...field}
                                  isClearable={true}
                                  className='react-select'
                                  classNamePrefix='select'
                                  loadOptions={(v) => getDressingsData(v, 50, 0)}
                                  onChange={handleSelectedPrimaryDressing}
                                  value={selectedPrimaryDressing}
                                  cacheOptions
                                />
                              )}
                            />

                            {errors.primary_dressing_id && (
                              <FormFeedback>{errors.primary_dressing_id.message}</FormFeedback>
                            )}
                          </Col>

                          <Col md='6' className='mb-1'>
                            <Label className='form-label' for='other_primary_dressing_id'>
                              Other Primary Dressing
                            </Label>
                            <Controller
                              name='other_primary_dressing_id'
                              control={control}
                              render={({ field: { onChange, ...field } }) => (
                                <AsyncSelect
                                  id='other_primary_dressing_id'
                                  invalid={errors.other_primary_dressing_id && true}
                                  {...field}
                                  isClearable={true}
                                  className='react-select'
                                  classNamePrefix='select'
                                  loadOptions={(v) => getDressingsData(v, 50, 0)}
                                  onChange={handleSelectedOtherPrimaryDressing}
                                  value={selectedOtherPrimaryDressing}
                                  cacheOptions
                                />
                              )}
                            />
                            {errors.other_primary_dressing_id && (
                              <FormFeedback>{errors.other_primary_dressing_id.message}</FormFeedback>
                            )}
                          </Col>

                          <Col className='col-md-6 mb-1'>
                            <Label className='form-label' for='secondary_dressing_id'>
                              Secondary Dressing
                            </Label>
                            <Controller
                              name='secondary_dressing_id'
                              control={control}
                              render={({ field: { onChange, ...field } }) => (
                                <AsyncSelect
                                  id='secondary_dressing_id'
                                  invalid={errors.secondary_dressing_id && true}
                                  {...field}
                                  isClearable={true}
                                  className='react-select'
                                  classNamePrefix='select'
                                  loadOptions={(v) => getDressingsData(v, 50, 0)}
                                  onChange={handleSelectedSecondaryDressing}
                                  value={selectedSecondayDressing}
                                  cacheOptions
                                />
                              )}
                            />

                            {errors.secondary_dressing_id && (
                              <FormFeedback>{errors.secondary_dressing_id.message}</FormFeedback>
                            )}
                          </Col>

                          <Col md='6' className='mb-1'>
                            <Label className='form-label' for='peri_wound_skin_treatment_id'>
                              Peri Wound Skin Treatment
                            </Label>
                            <Controller
                              name='peri_wound_skin_treatment_id'
                              control={control}
                              render={({ field: { onChange, ...field } }) => (
                                <AsyncSelect
                                  id='peri_wound_skin_treatment_id'
                                  invalid={errors.peri_wound_skin_treatment_id && true}
                                  {...field}
                                  isClearable={true}
                                  className='react-select'
                                  classNamePrefix='select'
                                  loadOptions={(v) => getPeriWoundsData(v, 50, 0)}
                                  onChange={handleSelectedPeriWound}
                                  value={selectedPeriWound}
                                  cacheOptions
                                />
                              )}
                            />

                            {errors.peri_wound_skin_treatment_id && (
                              <FormFeedback>{errors.peri_wound_skin_treatment_id.message}</FormFeedback>
                            )}
                          </Col>

                          <Col className='col-md-6 mb-1'>
                            <Label className='form-label' for='secure_dressing_id'>
                              Secure Dressing
                            </Label>

                            <Controller
                              name='secure_dressing_id'
                              control={control}
                              render={({ field: { onChange, ...field } }) => (
                                <AsyncSelect
                                  id='secure_dressing_id'
                                  invalid={errors.secure_dressing_id && true}
                                  {...field}
                                  isClearable={true}
                                  className='react-select'
                                  classNamePrefix='select'
                                  loadOptions={(v) => getSecureDressingsData(v, 50, 0)}
                                  onChange={handleSelectedSecureDressing}
                                  value={selectedSecureDressing}
                                  cacheOptions
                                />
                              )}
                            />

                            {errors.secure_dressing_id && (
                              <FormFeedback>{errors.secure_dressing_id.message}</FormFeedback>
                            )}
                          </Col>

                          <Col className='col-md-6 mb-1'>
                            <Label className='form-label' for='tunneling_and_undermining_treatment_id'>
                              Tunneling And Undermining Treatment
                            </Label>

                            <Controller
                              name='tunneling_and_undermining_treatment_id'
                              control={control}
                              render={({ field: { onChange, ...field } }) => (
                                <AsyncSelect
                                  id='tunneling_and_undermining_treatment_id'
                                  invalid={errors.tunneling_and_undermining_treatment_id && true}
                                  {...field}
                                  isClearable={true}
                                  className='react-select'
                                  classNamePrefix='select'
                                  loadOptions={(v) => getDressingsData(v, 50, 0)}
                                  onChange={handleSelectedUnderminingTreatment}
                                  value={selectedUnderminingTreatment}
                                  cacheOptions
                                />
                              )}
                            />

                            {errors.tunneling_and_undermining_treatment_id && (
                              <FormFeedback>{errors.tunneling_and_undermining_treatment_id.message}</FormFeedback>
                            )}
                          </Col>

                          <Col className='col-md-6 mb-1'>
                            <Label className='form-label' for='procedure_performed_id'>
                              Procedure Performed{' '}
                            </Label>

                            <Controller
                              name='procedure_performed_id'
                              control={control}
                              render={({ field: { onChange, value, ...field } }) => (
                                <Input
                                  type='select'
                                  onChange={valueChange}
                                  name='procedure_performed_id'
                                  invalid={errors.procedure_performed_id && true}
                                  {...field}
                                >
                                  {procedure_performed_options.map &&
                                    procedure_performed_options.map((item, index) => (
                                      <option value={item.value} key={item.value}>
                                        {item.label}
                                      </option>
                                    ))}
                                </Input>
                              )}
                            />
                            {errors.procedure_performed_id && (
                              <FormFeedback>{errors.procedure_performed_id.message}</FormFeedback>
                            )}
                          </Col>
                          <Col className='col-md-6 mb-1'>
                            <EditWoundNotesCleanser formData={formData}></EditWoundNotesCleanser>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='folley_insert_change'>Folley Insert Change</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='folley_insert_change'
                                    name='folley_insert_change'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.folley_insert_change && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.as_biopsy && (
                                    <FormFeedback>{errors.folley_insert_change.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>
                          {alerts.neuroticTissueAlert && (
                            <WarningAlert
                              variant='danger'
                              message='DANGER: If necrotic tissue is stable, consider skin prep or betadine'
                              isOpen={alerts.neuroticTissueAlert}
                              toggle={() => dismissAlerts('neuroticTissueAlert')}
                            />
                          )}
                          {alerts.sloughTissueAlert && (
                            <WarningAlert
                              variant='danger'
                              message='Fibrin tissue is present; consider Iodosorb if no allergies, medihoney, debrisoft or debridement'
                              isOpen={alerts.sloughTissueAlert}
                              toggle={() => dismissAlerts('sloughTissueAlert')}
                            />
                          )}
                          {alerts.exudateAlert && (
                            <WarningAlert
                              variant='danger'
                              message={alerts.exudateMsg}
                              isOpen={alerts.exudateAlert}
                              toggle={() => dismissAlerts('exudateAlert')}
                            />
                          )}
                          {alerts.exudateAmtAlert && (
                            <WarningAlert
                              variant={alerts.exudateAmtAlertVariant}
                              message={alerts.exudateAmtMsg}
                              isOpen={alerts.exudateAmtAlert}
                              toggle={() => dismissAlerts('exudateAmtAlert')}
                            />
                          )}
                          {alerts.odorAlert && (
                            <WarningAlert
                              variant={alerts.odorAlertVariant}
                              message={alerts.odorMsg}
                              isOpen={alerts.odorAlert}
                              toggle={() => dismissAlerts('odorAlert')}
                            />
                          )}
                          {showEpiboleAlert && (
                            <WarningAlert
                              variant='warning'
                              message='Epibole/Rolled edges: <br />- Consider silver nitrat'
                              isOpen={showEpiboleAlert}
                              toggle={dismissEpiboleAlert}
                            />
                          )}
                          {showIodineAlert && (
                            <WarningAlert
                              variant='warning'
                              message="Warning: Contraindications / Precautions <br />
                                                                Product contains iodine, which is contraindicated in: <br />
                                                                - patients with known or suspected iodine sensitivity <br />

                                                                - Hashimoto's thyroiditis <br />

                                                                - non-toxic nodular goitre <br />

                                                                - children <br />

                                                                Product should not be used: <br />

                                                                - by pregnant or lactating women <br />"
                              isOpen={showIodineAlert}
                              toggle={dismissIodineAlert}
                            />
                          )}

                          {showNegativePressureAlert && (
                            <WarningAlert
                              variant='warning'
                              message='Contraindications for negative-pressure wound therapy: <br />
                                                            - Presence of necrotic and fibrotic tissue <br />

                                                            - Untreated osteomyelitis <br />

                                                            - Malignant wounds <br />

                                                            - Localized ischemia <br />

                                                            - High output, non-enteric and unexplored fistulas <br />

                                                            - In the absence of appropriate blood supply <br />

                                                            - Severe excoriation of periwound <br />

                                                            - Do not place dressings in direct contact with exposed blood vessels, anastomotic sites, organs or nerves <br />

                                                            - Do not place dressings into blind/unexplored tunnels<br />

                                                            - Stop therapy if person experiences autonomic dysreflexia <br />

                                                            - Do not place therapy in proximity to the vagus nerve <br />

                                                            - Do not over fill the wound with dressing material <br />
                                                            '
                              isOpen={showNegativePressureAlert}
                              toggle={dismissNegativePressureAlert}
                            />
                          )}
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>

                  <Col sm='12'>
                    <Card>
                      <CardHeader>
                        <CardTitle tag='h4'>REFERRAL AND RECOMMENDATIONS</CardTitle>
                      </CardHeader>
                      <CardBody>
                        <Row>
                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='rr_vascular_evaluation'>Vascular Evaluation</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='rr_vascular_evaluation'
                                    name='rr_vascular_evaluation'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.rr_vascular_evaluation && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.rr_vascular_evaluation && (
                                    <FormFeedback>{errors.rr_vascular_evaluation.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='rr_nutrition_evaluation'>Nutrition Evaluatio</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='rr_nutrition_evaluation'
                                    name='rr_nutrition_evaluation'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.rr_nutrition_evaluation && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.rr_nutrition_evaluation && (
                                    <FormFeedback>{errors.rr_nutrition_evaluation.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='rr_infectious_diseases_evaluation'>Infectious Diseases Evaluation</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='rr_infectious_diseases_evaluation'
                                    name='rr_infectious_diseases_evaluation'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.rr_infectious_diseases_evaluation && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.rr_infectious_diseases_evaluation && (
                                    <FormFeedback>{errors.rr_infectious_diseases_evaluation.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='rr_physical_therapy_evaluation'>Physical Therapy Evaluation</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='rr_physical_therapy_evaluation'
                                    name='rr_physical_therapy_evaluation'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.rr_physical_therapy_evaluation && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.rr_physical_therapy_evaluation && (
                                    <FormFeedback>{errors.rr_physical_therapy_evaluation.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='rr_primary_physician_evaluation'>Primary Physician Evaluatio</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='rr_primary_physician_evaluation'
                                    name='rr_primary_physician_evaluation'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.rr_primary_physician_evaluation && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.rr_primary_physician_evaluation && (
                                    <FormFeedback>{errors.rr_primary_physician_evaluation.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='rr_hyperbaric_medicine_evaluation'>Hyperbaric Medicine Evaluation</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='rr_hyperbaric_medicine_evaluation'
                                    name='rr_hyperbaric_medicine_evaluation'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.rr_hyperbaric_medicine_evaluation && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.rr_hyperbaric_medicine_evaluation && (
                                    <FormFeedback>{errors.rr_hyperbaric_medicine_evaluation.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='rr_occupational_therapy_evaluation'>Occupational Therapy Evaluation</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='rr_occupational_therapy_evaluation'
                                    name='rr_occupational_therapy_evaluation'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.rr_occupational_therapy_evaluation && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.rr_occupational_therapy_evaluation && (
                                    <FormFeedback>{errors.rr_occupational_therapy_evaluation.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='rr_pain_management_evaluation'>Pain Management Evaluation</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='rr_pain_management_evaluation'
                                    name='rr_pain_management_evaluation'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.rr_pain_management_evaluation && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.rr_pain_management_evaluation && (
                                    <FormFeedback>{errors.rr_pain_management_evaluation.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='rr_off_loading'>Off Loading</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='rr_off_loading'
                                    name='rr_off_loading'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.rr_off_loading && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.rr_off_loading && (
                                    <FormFeedback>{errors.rr_off_loading.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='rr_social_worker_evaluation'>Social Worker Loading</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='rr_social_worker_evaluation'
                                    name='rr_social_worker_evaluation'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.rr_social_worker_evaluation && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.rr_social_worker_evaluation && (
                                    <FormFeedback>{errors.rr_social_worker_evaluation.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='rr_surgery_evaluation'>Surgery Evaluation</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='rr_surgery_evaluation'
                                    name='rr_surgery_evaluation'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.rr_surgery_evaluation && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.rr_surgery_evaluation && (
                                    <FormFeedback>{errors.rr_surgery_evaluation.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='rr_disease_management_evaluation'>Disease Management Evaluation</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='rr_disease_management_evaluation'
                                    name='rr_disease_management_evaluation'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.rr_disease_management_evaluation && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.rr_disease_management_evaluation && (
                                    <FormFeedback>{errors.rr_disease_management_evaluation.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='rr_community_res_evaluation'>Community Resource Evaluation </label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='rr_community_res_evaluation'
                                    name='rr_community_res_evaluation'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.rr_community_res_evaluation && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.as_biopsy && (
                                    <FormFeedback>{errors.rr_community_res_evaluation.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='rr_case_management_evaluation'>Case Management Evaluation</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='rr_case_management_evaluation'
                                    name='rr_case_management_evaluation'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.rr_case_management_evaluation && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.as_biopsy && (
                                    <FormFeedback>{errors.rr_case_management_evaluation.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='rr_community_res_evaluation'>Community Res Evaluation</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='rr_community_res_evaluation'
                                    name='rr_community_res_evaluation'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.rr_community_res_evaluation && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.as_biopsy && (
                                    <FormFeedback>{errors.rr_community_res_evaluation.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='rr_compression_therapy'>Compression Therapy</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='rr_compression_therapy'
                                    name='rr_compression_therapy'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.rr_compression_therapy && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.as_biopsy && (
                                    <FormFeedback>{errors.rr_compression_therapy.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='rr_negative_pressure_system'>Negative Pressure System</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='rr_negative_pressure_system'
                                    name='rr_negative_pressure_system'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.rr_negative_pressure_system && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.as_biopsy && (
                                    <FormFeedback>{errors.rr_negative_pressure_system.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='rr_quit_smoking'>Quit Smokingm</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='rr_quit_smoking'
                                    name='rr_quit_smoking'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.rr_quit_smoking && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.as_biopsy && <FormFeedback>{errors.rr_quit_smoking.message}</FormFeedback>}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col md='6' className='mb-1'>
                            <Label className='form-label' for='rr_other_referrals'>
                              Other Referrals{' '}
                            </Label>

                            <Controller
                              id='rr_other_referrals'
                              name='rr_other_referrals'
                              control={control}
                              render={({ field: { onBlur, value, ...field } }) => (
                                <Input
                                  invalid={errors.rr_other_referrals && true}
                                  {...field}
                                  onBlur={valueChange}
                                  value={value}
                                />
                              )}
                            />

                            <ErrorMessaje message={filedError.rr_other_referrals} />
                            {errors.rr_other_referrals && (
                              <FormFeedback>{errors.rr_other_referrals.message}</FormFeedback>
                            )}
                          </Col>

                          <Col md='6' className='mb-1'>
                            <Label className='form-label' for='rr_additional_comments'>
                              Additional Comments{' '}
                            </Label>

                            <Controller
                              id='rr_additional_comments'
                              name='rr_additional_comments'
                              control={control}
                              render={({ field: { onBlur, value, ...field } }) => (
                                <Input
                                  invalid={errors.rr_additional_comments && true}
                                  {...field}
                                  onBlur={valueChange}
                                  value={value}
                                />
                              )}
                            />

                            <ErrorMessaje message={filedError.rr_additional_comments} />
                            {errors.rr_additional_comments && (
                              <FormFeedback>{errors.rr_additional_comments.message}</FormFeedback>
                            )}
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>

                  <Col sm='12'>
                    <Card>
                      <CardHeader>
                        <CardTitle tag='h4'>Test and Studies</CardTitle>
                      </CardHeader>
                      <CardBody>
                        <Row>
                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='as_wound_culture'>Wound Culture</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='as_wound_culture'
                                    name='as_wound_culture'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.as_wound_culture && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.as_wound_culture && (
                                    <FormFeedback>{errors.as_wound_culture.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='as_biopsy'>Biopsy</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='as_biopsy'
                                    name='as_biopsy'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.as_biopsy && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.as_biopsy && <FormFeedback>{errors.as_biopsy.message}</FormFeedback>}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='as_mri'>MRI</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='as_mri'
                                    name='as_mri'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.as_mri && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.as_mri && <FormFeedback>{errors.as_mri.message}</FormFeedback>}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='as_arterial_venous_duplex'>Arterial Venous Duplex</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='as_arterial_venous_duplex'
                                    name='as_arterial_venous_duplex'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.as_arterial_venous_duplex && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.as_arterial_venous_duplex && (
                                    <FormFeedback>{errors.as_arterial_venous_duplex.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='as_arteriogram'>Arteriogram</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='as_arteriogram'
                                    name='as_arteriogram'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.as_arteriogram && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.as_arteriogram && (
                                    <FormFeedback>{errors.as_arteriogram.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='as_ctscan'>CT Scan</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='as_ctscan'
                                    name='as_ctscan'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.as_ctscan && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.as_ctscan && <FormFeedback>{errors.as_ctscan.message}</FormFeedback>}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='as_arterial_venous_doppler'>Arterial Venous Doppler</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='as_arterial_venous_doppler'
                                    name='as_arterial_venous_doppler'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.as_arterial_venous_doppler && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.as_arterial_venous_doppler && (
                                    <FormFeedback>{errors.as_arterial_venous_doppler.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='as_xray'>X-Ray</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='as_xray'
                                    name='as_xray'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.as_xray && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.as_xray && <FormFeedback>{errors.as_xray.message}</FormFeedback>}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='as_gallium_scan'>Gallium Scan</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='as_gallium_scan'
                                    name='as_gallium_scan'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.as_gallium_scan && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.as_gallium_scan && (
                                    <FormFeedback>{errors.as_gallium_scan.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='as_ankle_brachial'>Ankle Brachial</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='as_ankle_brachial'
                                    name='as_ankle_brachial'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.as_ankle_brachial && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.as_ankle_brachial && (
                                    <FormFeedback>{errors.as_ankle_brachial.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='as_transcutaneous_done_oximetry'>Transcutaneous Done Oximetr</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='as_transcutaneous_done_oximetry'
                                    name='as_transcutaneous_done_oximetry'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.as_transcutaneous_done_oximetry && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.as_transcutaneous_done_oximetry && (
                                    <FormFeedback>{errors.as_transcutaneous_done_oximetry.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='as_transcutaneous_oximetry'>Transcutaneous Oximetry</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='as_transcutaneous_oximetry'
                                    name='as_transcutaneous_oximetry'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.as_transcutaneous_oximetry && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.as_transcutaneous_oximetry && (
                                    <FormFeedback>{errors.as_transcutaneous_oximetry.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='as_abi_tbi_ppg'>ABI TBI PPG </label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='as_abi_tbi_ppg'
                                    name='as_abi_tbi_ppg'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.as_abi_tbi_ppg && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.as_biopsy && <FormFeedback>{errors.as_abi_tbi_ppg.message}</FormFeedback>}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='as_other_text'>Other Tex</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='as_other_text'
                                    name='as_other_text'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.as_other_text && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.as_biopsy && <FormFeedback>{errors.as_other_text.message}</FormFeedback>}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='wound_culture_was_obtain'>Wound Culture was Obtained</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='wound_culture_was_obtain'
                                    name='wound_culture_was_obtain'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.wound_culture_was_obtain && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.as_biopsy && (
                                    <FormFeedback>{errors.wound_culture_was_obtain.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='wound_biopsy_was_obtain'>Wound Biopsy was Obtained</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='wound_biopsy_was_obtain'
                                    name='wound_biopsy_was_obtain'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.wound_biopsy_was_obtain && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.as_biopsy && (
                                    <FormFeedback>{errors.wound_biopsy_was_obtain.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='wound_shave_biopsy_was_obtain'>Wound Shave Biopsy was Obtained</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='wound_shave_biopsy_was_obtain'
                                    name='wound_shave_biopsy_was_obtain'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.wound_shave_biopsy_was_obtain && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.as_biopsy && (
                                    <FormFeedback>{errors.wound_shave_biopsy_was_obtain.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='wound_punch_biopsy_was_done'>Quit Smokingm</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='wound_punch_biopsy_was_done'
                                    name='wound_punch_biopsy_was_done'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.wound_punch_biopsy_was_done && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.as_biopsy && (
                                    <FormFeedback>{errors.wound_punch_biopsy_was_done.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='wound_incisional_biopsy_was_done'>Wound Incisional Biopsy was Done</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='wound_incisional_biopsy_was_done'
                                    name='wound_incisional_biopsy_was_done'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.wound_incisional_biopsy_was_done && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.as_biopsy && (
                                    <FormFeedback>{errors.wound_incisional_biopsy_was_done.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>
                          <Col md='6' className='mb-1'>
                            <Label className='form-label' for='as_other_text'>
                              As Other Text{' '}
                            </Label>

                            <Controller
                              id='as_other_text'
                              name='as_other_text'
                              control={control}
                              render={({ field: { onBlur, value, ...field } }) => (
                                <Input
                                  invalid={errors.as_other_text && true}
                                  {...field}
                                  onBlur={valueChange}
                                  value={value}
                                />
                              )}
                            />

                            <ErrorMessaje message={filedError.as_other_text} />
                            {errors.as_other_text && <FormFeedback>{errors.as_other_text.message}</FormFeedback>}
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col sm='12'>
                    <Card>
                      <CardHeader>
                        <CardTitle tag='h4'>Adjuvant Treatment</CardTitle>
                      </CardHeader>
                      <CardBody>
                        <Row>
                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='patient_has_cleansing'>Patient Has Cleansing</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='patient_has_cleansing'
                                    name='patient_has_cleansing'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.patient_has_cleansing && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.patient_has_cleansing && (
                                    <FormFeedback>{errors.patient_has_cleansing.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='patient_on_offloading_device'>Patient on Offloading Device</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='patient_on_offloading_device'
                                    name='patient_on_offloading_device'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.patient_on_offloading_device && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.patient_on_offloading_device && (
                                    <FormFeedback>{errors.patient_on_offloading_device.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='patient_on_wheelchair'>Patient on Wheelchair</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='patient_on_wheelchair'
                                    name='patient_on_wheelchair'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.patient_on_wheelchair && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.patient_on_wheelchair && (
                                    <FormFeedback>{errors.patient_on_wheelchair.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='patient_is_using_compression_device'>
                                  Patient Is Using Compression Device
                                </label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='patient_is_using_compression_device'
                                    name='patient_is_using_compression_device'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.patient_is_using_compression_device && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.patient_is_using_compression_device && (
                                    <FormFeedback>{errors.patient_is_using_compression_device.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='patient_receiving_hyperbaric_oxygen_treatment'>
                                  Patient Receiving Hyperbaric Oxygen Treatment
                                </label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='patient_receiving_hyperbaric_oxygen_treatment'
                                    name='patient_receiving_hyperbaric_oxygen_treatment'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.patient_receiving_hyperbaric_oxygen_treatment && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.patient_receiving_hyperbaric_oxygen_treatment && (
                                    <FormFeedback>
                                      {errors.patient_receiving_hyperbaric_oxygen_treatment.message}
                                    </FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='patient_has_receiving_hyperbaric_oxygen_treatment'>
                                  Patient Has Receiving Hyperbaric Oxygen Treatment
                                </label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='patient_has_receiving_hyperbaric_oxygen_treatment'
                                    name='patient_has_receiving_hyperbaric_oxygen_treatment'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.patient_has_receiving_hyperbaric_oxygen_treatment && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.patient_has_receiving_hyperbaric_oxygen_treatment && (
                                    <FormFeedback>
                                      {errors.patient_has_receiving_hyperbaric_oxygen_treatment.message}
                                    </FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='patient_treated_with_low_level_laser_therapy'>
                                  Patient Treated with Low Level Laser Therapy
                                </label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='patient_treated_with_low_level_laser_therapy'
                                    name='patient_treated_with_low_level_laser_therapy'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.patient_treated_with_low_level_laser_therapy && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.patient_treated_with_low_level_laser_therapy && (
                                    <FormFeedback>
                                      {errors.patient_treated_with_low_level_laser_therapy.message}
                                    </FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='patient_receiving_occupational_therapy'>
                                  Patient Receiving Occupational Therap
                                </label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='patient_receiving_occupational_therapy'
                                    name='patient_receiving_occupational_therapy'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.patient_receiving_occupational_therapy && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.patient_receiving_occupational_therapy && (
                                    <FormFeedback>{errors.patient_receiving_occupational_therapy.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='patient_receiving_intermittent_pneumatic_compression'>
                                  Patient Receiving Intermittent Pneumatic Compression
                                </label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='patient_receiving_intermittent_pneumatic_compression'
                                    name='patient_receiving_intermittent_pneumatic_compression'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.patient_receiving_intermittent_pneumatic_compression && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.patient_receiving_intermittent_pneumatic_compression && (
                                    <FormFeedback>
                                      {errors.patient_receiving_intermittent_pneumatic_compression.message}
                                    </FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='patient_receiving_whirlpool'>Patient Receiving Whirlpool</label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='patient_receiving_whirlpool'
                                    name='patient_receiving_whirlpool'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.patient_receiving_whirlpool && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.patient_receiving_whirlpool && (
                                    <FormFeedback>{errors.patient_receiving_whirlpool.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='patient_receiving_complete_decongestive_therapy_on_lower_ex'>
                                  Patient Receiving Complete Decongestive Therapy on Lower Ex
                                </label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='patient_receiving_complete_decongestive_therapy_on_lower_ex'
                                    name='patient_receiving_complete_decongestive_therapy_on_lower_ex'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={
                                          errors.patient_receiving_complete_decongestive_therapy_on_lower_ex && true
                                        }
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.patient_receiving_complete_decongestive_therapy_on_lower_ex && (
                                    <FormFeedback>
                                      {errors.patient_receiving_complete_decongestive_therapy_on_lower_ex.message}
                                    </FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='patient_receiving_manual_lymph_drainage'>
                                  Patient Receiving Manual Lymph Drainage
                                </label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='patient_receiving_manual_lymph_drainage'
                                    name='patient_receiving_manual_lymph_drainage'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.patient_receiving_manual_lymph_drainage && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.patient_receiving_manual_lymph_drainage && (
                                    <FormFeedback>
                                      {errors.patient_receiving_manual_lymph_drainage.message}
                                    </FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='patient_receiving_electrical_stimulation_therapy'>
                                  Patient Receiving Electrical Stimulation Therapy{' '}
                                </label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='patient_receiving_electrical_stimulation_therapy'
                                    name='patient_receiving_electrical_stimulation_therapy'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.patient_receiving_electrical_stimulation_therapy && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.as_biopsy && (
                                    <FormFeedback>
                                      {errors.patient_receiving_electrical_stimulation_therapy.message}
                                    </FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='patient_receiving_electromagnetic_therapy'>
                                  Patient Receiving Electromagnetic Therapy
                                </label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='patient_receiving_electromagnetic_therapy'
                                    name='patient_receiving_electromagnetic_therapy'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.patient_receiving_electromagnetic_therapy && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.as_biopsy && (
                                    <FormFeedback>
                                      {errors.patient_receiving_electromagnetic_therapy.message}
                                    </FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='cellular_and_or_tissue_based_product'>
                                  Cellular and/or Tissue-based Product
                                </label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='cellular_and_or_tissue_based_product'
                                    name='cellular_and_or_tissue_based_product'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.cellular_and_or_tissue_based_product && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.as_biopsy && (
                                    <FormFeedback>{errors.cellular_and_or_tissue_based_product.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='patient_receiving_transcutaneous_oxygen_therapy'>
                                  Patient Receiving Transcutaneous Oxygen Ther
                                </label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='patient_receiving_transcutaneous_oxygen_therapy'
                                    name='patient_receiving_transcutaneous_oxygen_therapy'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.patient_receiving_transcutaneous_oxygen_therapy && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.as_biopsy && (
                                    <FormFeedback>
                                      {errors.patient_receiving_transcutaneous_oxygen_therapy.message}
                                    </FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='patient_receiving_ultrasound_therapy'>
                                  Patient Receiving Ultrasound Therapy
                                </label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='patient_receiving_ultrasound_therapy'
                                    name='patient_receiving_ultrasound_therapy'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.patient_receiving_ultrasound_therapy && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.as_biopsy && (
                                    <FormFeedback>{errors.patient_receiving_ultrasound_therapy.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col xl='6' xs='6'>
                            <Row tag='dl' className='mb-0'>
                              <Col sm='5' className='fw-bolder mb-1'>
                                <label for='patient_receiving_shockwave_therapy'>
                                  Patient Receiving Shockwave Therapy
                                </label>
                              </Col>
                              <Col
                                tag='dd'
                                className='mb-1'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'start',
                                }}
                              >
                                <div className='mt-50 mt-sm-0'>
                                  <Controller
                                    id='patient_receiving_shockwave_therapy'
                                    name='patient_receiving_shockwave_therapy'
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                      <Input
                                        type='checkbox'
                                        invalid={errors.patient_receiving_shockwave_therapy && true}
                                        checked={!!value}
                                        style={{ border: '1px solid gray' }}
                                        {...field}
                                      />
                                    )}
                                  />

                                  {errors.as_biopsy && (
                                    <FormFeedback>{errors.patient_receiving_shockwave_therapy.message}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>

                  <Col sm='12'>
                    <Card>
                      <CardHeader>
                        <CardTitle tag='h4'>Trajectory </CardTitle>
                      </CardHeader>
                      <CardBody>
                        <Row>
                          <Col className='col-md-6 mb-1'>
                            {/* <Label className='form-label' for='trajectory'>
                              Trajectory
                            </Label> */}

                            <Controller
                              name='trajectory'
                              control={control}
                              render={({ field: { onChange, value, ...field } }) => (
                                <Input
                                  type='select'
                                  onChange={valueChange}
                                  id='trajectory'
                                  invalid={errors.trajectory && true}
                                  {...field}
                                >
                                  <option value=''>Select Trajectory</option>
                                  {trajectoryOptions.map((option, index) => (
                                    <option key={index} value={option.value}>
                                      {option.label}
                                    </option>
                                  ))}
                                </Input>
                              )}
                            />
                            {errors.trajectory && <FormFeedback>{errors.trajectory.message}</FormFeedback>}
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                    <Card>
                      <CardHeader tag='h4'>Visit Frequency</CardHeader>
                      <CardBody>
                        <Col className='col-md-6 mb-1'>
                          <Controller
                            name='visit_frequency'
                            control={control}
                            render={({ field: { onChange, value, ...field } }) => (
                              <Input
                                type='select'
                                onChange={valueChange}
                                id='visit_frequency'
                                invalid={errors.visit_frequency && true}
                                {...field}
                              >
                                <option value=''>Select Visit Frequency</option>
                                {visitFrequencyOptions.map((option, index) => (
                                  <option key={index} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </Input>
                            )}
                          />
                          {errors.visit_frequency && <FormFeedback>{errors.visit_frequency.message}</FormFeedback>}
                        </Col>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col sm='12'>
                    <Card>
                      <CardHeader>
                        <CardTitle tag='h4'>Next Appointment Date</CardTitle>
                      </CardHeader>
                      <CardBody>
                        <Row>
                          <Col md='12' className='mb-1'>
                            <Label className='form-label' for='appointment_date'>
                              Date and Time
                            </Label>
                            <Datetime
                              isValidDate={(current) => {
                                return current.isAfter(moment().subtract(1, 'day'))
                              }}
                            />
                            ;{errors.appointment_date && <FormFeedback>{errors.appointment_date.message}</FormFeedback>}
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId='2'>
                <Row>
                  <Col sm='12'>
                    {isNaN(formWoundNoteData.id) ? (
                      <LoadingSpinner />
                    ) : (
                      <WoundNoteTunnelingCard formData={formWoundNoteData} />
                    )}
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId='3'>
                <Row>
                  <Col sm='12'>
                    {isNaN(formWoundNoteData.id) ? (
                      <LoadingSpinner />
                    ) : (
                      <WoundNotesUnderminingCard formData={formWoundNoteData} />
                    )}
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId='4'>
                <Row>
                  <Col sm='12'>
                    {isNaN(formWoundNoteData.id) ? (
                      <LoadingSpinner />
                    ) : (
                      <WoundNoteFistulaCard formData={formWoundNoteData} />
                    )}
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId='5'>
                <Row>
                  <Col sm='12'>
                    {isNaN(formWoundNoteData.id) ? (
                      <LoadingSpinner />
                    ) : (
                      <PatientDiagnosisCard formData={formWoundNoteData} />
                    )}
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId='6'>
                <Row>
                  <Col sm='12'>
                    {isNaN(formWoundNoteData.id) ? (
                      <LoadingSpinner />
                    ) : (
                      <WoundNotesCleanserCard formData={formWoundNoteData} />
                    )}
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId='7'>
                <Row>
                  <Col sm='12'>
                    {isNaN(formWoundNoteData.id) ? (
                      <LoadingSpinner />
                    ) : (
                      <WoundNotesImages formData={formWoundNoteData} />
                    )}
                  </Col>
                </Row>
              </TabPane>
            </TabContent>
          </Col>
        </Row>
      </section>
    </>
  )
}

export default WoundNoteView
