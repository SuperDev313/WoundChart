import { lazy } from 'react'

const PatientsSearch = lazy(() => import('../../views/pages/patients/PatientsSearch'))
const PatientAddWizard = lazy(() => import('../../views/pages/patients/PatientAddWizard'))
const PatientAdd = lazy(() => import('../../views/pages/patients/PatientAdd'))
const PatientView = lazy(() => import('../../views/pages/patients/PatientView'))
const WoundNoteView = lazy(() => import('../../views/pages/wound-notes/WoundNoteView'))
const SOCView = lazy(() => import('../../views/pages/socs/SOCView'))

const PatientRoutes = [
  {
    path: '/patients',
    element: <PatientsSearch />,
  },
  {
    path: '/new-patient',
    element: <PatientAdd />,
  },
  {
    path: '/patients/add/:id',
    element: <PatientAddWizard />,
  },
  {
    path: '/patients/:id',
    element: <PatientView />,
  },
  {
    path: '/patients/:id/wound-notes/:woundNoteId/view',
    element: <WoundNoteView />,
  },
  {
    path: '/patients/:id/wound-notes',
    element: <WoundNoteView />,
  },
  {
    path: '/patients/:id/wound-notes/:woundNoteId',
    element: <WoundNoteView />,
  },
  {
    path: '/patients/:id/socs/:socId',
    element: <SOCView />,
  },
]

export default PatientRoutes
