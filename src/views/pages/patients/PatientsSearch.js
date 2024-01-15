import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// ** Custom Components
import toast from "react-hot-toast";
import useApi from "../../../api/useApi";
import Breadcrumbs from "@components/breadcrumbs";
import SearchDataTable from "../../../components/datatables/SearchDataTable";
import PatientAddPopup from "./PatientAddPopup";
import * as alertUtils from "../../../components/alerts/AlertUtils";
import * as utils from "../../../utility/Utils";
import {
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap"; // ** Icons Imports
import { MoreVertical, Edit, Trash, Eye } from "react-feather";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";

export default function PatientsSearch() {
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
      navigate(`/patients/${id}`)
    }
  };

  const gotoView = (id) => {
    navigate(`/patients/${id}`);
  };

  const calculateAge = (patientAge) => {
    const birthdate = new Date(patientAge);
    const today = new Date();

    const age = today.getFullYear() - birthdate.getFullYear();
    const m = today.getMonth() - birthdate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
      return age - 1;
    } else {
      return age;
    }
  };

  const columns = [
    {
      name: "Record #",
      selector: (row) => [row.record_number],
      column_name: "record_number",
      with: "100px",
      sortable: true,
      cell: (row) => (
        <a onClick={(e) => gotoView(row.id)} className="custom-link">
          {row.record_number}
        </a>
      ),
    },
    {
      name: "Name",
      selector: (row) => [row.full_name],
      column_name: "full_name",
      sortable: true,
      cell: (row) => (
        <a onClick={(e) => gotoView(row.id)} className="custom-link">
          {row.full_name}
        </a>
      ),
    },
    {
      name: "Age",
      selector: (row) => [row.age],
      column_name: "age",
      sortable: true,
      cell: (row) => (
        <a onClick={(e) => gotoView(row.id)} className="custom-link">
          {calculateAge(row.date_of_birth)}
        </a>
      ),
    },
    {
      name: "Gender",
      selector: (row) => [row.gender],
      column_name: "gender",
      sortable: true,
      cell: (row) => (
        <a onClick={(e) => gotoView(row.id)} className="custom-link">
          {row.gender}
        </a>
      ),
    },
    {
      name: "Actions",
      maxWidth: "120px",
      cell: (row) => (
        <div className="column-action d-flex align-items-center">
          <div className="d-flex align-items-center permissions-actions">
            <Button
              size="sm"
              color="transparent"
              className="btn btn-icon"
              onClick={(e) => gotoView(row.id)}
            >
              <Edit className="font-medium-2" />
            </Button>
            <Button
              size="sm"
              color="transparent"
              className="btn btn-icon"
              onClick={(e) => doDeleteRecord(row.id)}
            >
              <Trash className="font-medium-2" />
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <Breadcrumbs title="Patients" data={[{ title: "Patients" }]} />
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

      <PatientAddPopup
        open={sidebarOpen}
        doTogglePopup={doTogglePopup}
        recordId={id}
        doHandleSaveAndClosePopup={doHandleSaveAndClosePopup}
      />
    </>
  );
}
