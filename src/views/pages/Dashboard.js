import React from "react";
// ** Reactstrap Imports
import { Row, Col } from "reactstrap";

import Breadcrumbs from "@components/breadcrumbs";
// ** Icons Imports
import { Users, Activity, Calendar, AlertOctagon } from "react-feather";

// ** Custom Components
import StatsHorizontal from "@components/widgets/stats/StatsHorizontal";
import PatientView from "./patients/view-tabs/PatientView";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import "@styles/base/pages/page-misc.scss";

const Dashboard = () => {
  return (
    <>
      <Row>
        <Col lg="3" sm="6">
          <StatsHorizontal
            icon={<Users size={21} />}
            color="primary"
            stats="21"
            statTitle="Active Patients"
          />
        </Col>
        <Col lg="3" sm="6">
          <StatsHorizontal
            icon={<Calendar size={21} />}
            color="success"
            stats="15"
            statTitle="Appointments today"
          />
        </Col>
        <Col lg="3" sm="6">
          <StatsHorizontal
            icon={<Activity size={21} />}
            color="danger"
            stats="19"
            statTitle="Notes Entered Today"
          />
        </Col>
        <Col lg="3" sm="6">
          <StatsHorizontal
            icon={<AlertOctagon size={21} />}
            color="warning"
            stats="5"
            statTitle="Unsigned Users"
          />
        </Col>
      </Row>
      <PatientView />
    </>
  );
};
export default Dashboard;
