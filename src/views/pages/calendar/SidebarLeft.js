// ** React Imports
import { Fragment, useState } from 'react'

// ** Reactstrap Imports
import { Card, CardBody, Button, Input, Label } from 'reactstrap'

import AddAppointment from './AddAppointment'
// ** illustration import
import illustration from '@src/assets/images/pages/calendar-illustration.png'

const SidebarLeft = props => {
  // ** Props
  const { handleAddEventSidebar, toggleSidebar } = props
  const [editOpen, setEditOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const [recordId, setRecordId] = useState(0);

  // ** Function to handle Add Event Click
  const handleAddEventClick = () => {
    toggleSidebar(false)
    handleAddEventSidebar()
  }

  const doTogglePopup = () => {
    setEditOpen(!editOpen);
    if (editOpen) {
        setRecordId(0);
    }
};

const doHandleSaveAndClosePopup = (rowId) => {
    setReload(!reload);
    doTogglePopup();

}

const doEditRecord = (e, rowId) => {
    e.preventDefault();
    setEditOpen(!editOpen);
    setRecordId(rowId);

}

  return (
    <Fragment>
      <Card className='sidebar-wrapper shadow-none'>
        <CardBody className='card-body d-flex justify-content-center my-sm-0 mb-3'>
          <Button color='primary' block onClick={doTogglePopup}>
            <span className='align-middle'>Add Appointment</span>
          </Button>
        </CardBody>
      </Card>
      <AddAppointment
        open={editOpen}
        doTogglePopup={doTogglePopup}
        recordId={recordId}
        doHandleSaveAndClosePopup={doHandleSaveAndClosePopup}
      />
    </Fragment>
  )
}

export default SidebarLeft
