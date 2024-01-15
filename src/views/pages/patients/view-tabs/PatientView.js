import React, { useEffect, useState } from "react";
// ** Reactstrap Imports
import { Button, Form, Input, Row, Col } from "reactstrap";
import { useNavigate } from "react-router-dom";

// ** Custom Hooks
import toast from "react-hot-toast";
import useApi from "../../../../api/useApi";
import SearchDataTable from "../../../../components/datatables/SearchDataTable";
import PatientAddPopup from "../../patients/PatientAddPopup";
import * as alertUtils from "../../../../components/alerts/AlertUtils";
import * as utils from "../../../../utility/Utils";
import { useSkin } from "@hooks/useSkin";

import Breadcrumbs from "@components/breadcrumbs";
// ** Icons Imports
import { Edit, Trash } from "react-feather";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import "../app-patient.css";

const PatientView = () => {
  // ** Hooks
  const { skin } = useSkin();

  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [id, setId] = useState("");
  const [reload, setReload] = useState(false);

  const doTogglePopup = () => {
    setSidebarOpen(!sidebarOpen);
    if (sidebarOpen) {
      setId(0);
    }
  };

  const doReloadTable = () => {
    setReload(true);
  };

  const doResetReload = () => {
    setReload(false);
  };

  const doDeleteRecord = (patientId) => {
    alertUtils.showDeleteDialog(() => {
      useApi
        .delete(`/patients/${patientId}`, {})
        .then((res) => {
          toast("Patient deleted successfuly");
          setReload(true);
        })
        .catch((err) => {
          // alertUtils.showAlertError(err);
        });
    });
  };

  const doHandleSaveAndClosePopup = (id) => {
    if (id > 0) {
      navigate(`/patients/add/${id}`);
    }
  };

  const gotoView = (id) => {
    navigate(`/patients/${id}`);
  };

  const columns = [
    {
      name: "Name",
      selector: (row) => [row.full_name],
      column_name: "full_name",
      sortable: true,
      cell: (row) => (
        <a onClick={(e) => gotoView(row.id)} className="custom-link">
          {row.full_name ?? "-"}
        </a>
      ),
    },
    {
      name: "Record #",
      selector: (row) => [row.record_number],
      column_name: "record_number",
      with: "100px",
      sortable: true,
      cell: (row) => (
        <a onClick={(e) => gotoView(row.id)} className="custom-link">
          {row.record_number ?? "-"}
        </a>
      ),
    },

    {
      name: "# of Wounds",
      selector: (row) => [row.wound_trajectory],
      column_name: "wounds",
      sortable: true,
      cell: (row) => (
        <a onClick={(e) => gotoView(row.id)} className="custom-link">
          {row.wounds ?? "-"}
        </a>
      ),
    },
    {
      name: "Trajectory",
      selector: (row) => [row.wound_trajectory],
      column_name: "wound_trajectory",
      sortable: true,
      cell: (row) => (
        <a onClick={(e) => gotoView(row.id)} className="custom-link">
          {row.wound_trajectory ?? "-"}
        </a>
      ),
    },
    {
      name: "# of Visits",
      selector: (row) => [row.wound_notes_total],
      column_name: "wound_notes_total",
      sortable: true,
      cell: (row) => (
        <a onClick={(e) => gotoView(row.id)} className="custom-link">
          {row.wound_notes_total ?? "-"}
        </a>
      ),
    },

    {
      name: "Last Visit",
      selector: (row) => [row.last_visit],
      column_name: "last_visit",
      cell: (row) => (
        <a onClick={(e) => gotoView(row.id)} className="custom-link">
          {row.last_visit
            ? utils.getFormatedDateFromISODate(row.last_visit)
            : "-"}
        </a>
      ),
      sortable: true,
    },
    {
      name: "Next Visit",
      selector: (row) => [row.next_visit],
      column_name: "next_visit",
      cell: (row) => (
        <a onClick={(e) => gotoView(row.id)} className="custom-link">
          {row.next_visit
            ? utils.getFormatedDateFromISODate(row.next_visit)
            : "-"}
        </a>
      ),
      sortable: true,
    },
    // {
    //     name: "Actions",
    //     maxWidth: "120px",
    //     cell: (row) => (
    //         <div className="column-action d-flex align-items-center">
    //             <div className='d-flex align-items-center permissions-actions'>
    //                 <Button size='sm' color='transparent' className='btn btn-icon' onClick={(e) => gotoView(row.id)}>
    //                     <Edit className='font-medium-2' />
    //                 </Button>
    //                 <Button
    //                     size='sm'
    //                     color='transparent'
    //                     className='btn btn-icon'
    //                     onClick={(e) => doDeleteRecord(row.id)}
    //                 >
    //                     <Trash className='font-medium-2' />
    //                 </Button>
    //             </div>
    //         </div>
    //     ),
    // },
  ];

  return (
    <>
      <Row>
        <SearchDataTable
          url={"/patients"}
          columns={columns}
          defaultSortColumn={"record_number"}
          defaultSortOrder="desc"
          addRecordHandler={doTogglePopup}
          addNewButtonLabel={"Create Patient"}
          reload={reload}
          doResetReload={doResetReload}
          showFilters={false}
        />
      </Row>
      <PatientAddPopup
        open={sidebarOpen}
        doTogglePopup={doTogglePopup}
        recordId={id}
        doHandleSaveAndClosePopup={doHandleSaveAndClosePopup}
      />
    </>
  );
};
export default PatientView;
