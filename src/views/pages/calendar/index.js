// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Third Party Components
import classnames from 'classnames'
import { Row, Col } from 'reactstrap'

// ** Calendar App Component Imports
import Calendar from './CalendarCard'
import SidebarLeft from './SidebarLeft'
import AddAppointment from './AddAppointment'

import useApi from "../../../api/useApi";

// ** Styles
import '@styles/react/apps/app-calendar.scss'

import Breadcrumbs from "@components/breadcrumbs";

const CalendarComponent = () => {
  // ** states
  const [appointments, setAppointments] = useState([]);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false)

  // ** AddEventSidebar Toggle Function
  const handleAddEventSidebar = () => setAddSidebarOpen(!addSidebarOpen)

  // ** LeftSidebar Toggle Function
  const toggleSidebar = val => setLeftSidebarOpen(val)

  // ** Fetch Events On Mount
  useEffect(() => {
    useApi
      .get("/me/appointments/2023-01-01/2024-10-10", {})
      .then((res) => {
          if (res.data.status === 200) {
              const appointmentData = res.data.data.rows;
              setAppointments(appointmentData);
          } else {
              console.error("API returned an error:", res.data.response_message);
          }

      })
      .catch((err) => {
          console.log(err);
      })
  }, []);

  console.log(appointments);


  return (
    <Fragment>
        <Breadcrumbs title="Calendar" data={[{ title: "Calendar" }]} />

      <div className='app-calendar overflow-hidden border'>

        <Row className='g-0'>
          <Col
            id='app-calendar-sidebar'
            className={classnames('col app-calendar-sidebar flex-grow-0 overflow-hidden d-flex flex-column', {
              show: leftSidebarOpen
            })}
          >
            <SidebarLeft
              toggleSidebar={toggleSidebar}
              handleAddEventSidebar={handleAddEventSidebar}
            />
          </Col>
          <Col className='position-relative'>
            <Calendar
              appointments={appointments}
            />
          </Col>
          <div
            className={classnames('body-content-overlay', {
              show: leftSidebarOpen === true
            })}
            onClick={() => toggleSidebar(false)}
          ></div>
        </Row>
      </div>
      {/* <AddEventSidebar
        store={store}
        dispatch={dispatch}
        addEvent={addEvent}
        open={addSidebarOpen}
        selectEvent={selectEvent}
        updateEvent={updateEvent}
        removeEvent={removeEvent}
        calendarApi={calendarApi}
        refetchEvents={refetchEvents}
        calendarsColor={calendarsColor}
        handleAddEventSidebar={handleAddEventSidebar}
      /> */}
    </Fragment>
  )
}

export default CalendarComponent
