import React, { useEffect, useState } from "react";

// ** Custom Components
import toast from "react-hot-toast";
import useApi from "../../../api/useApi";
import Breadcrumbs from "@components/breadcrumbs";
import SearchDataTable from "../../../components/datatables/SearchDataTable";
import DiagnosisEditPopup from "./DiagnosisEditPopup";
import * as alertUtils from "../../../components/alerts/AlertUtils";
import {
  Badge,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap"; // ** Icons Imports
import { MoreVertical, Trash2, Archive } from "react-feather";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";

export default function DiagnosisSearch() {
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

  const doDeleteRecord = (id) => {
    alertUtils.showDeleteDialog(() => {
      useApi
        .delete(`/diagnoses/${id}`, {})
        .then((res) => {
          toast("Diagnosis deleted successfuly");
          setReload(true);
        })
        .catch((err) => {
          // alertUtils.showAlertError(err);
        });
    });
  };

  const columns = [
    {
      name: "DESCRIPTION",
      selector: (row) => [row.description],
      column_name: "description",
      sortable: true,
    },
    {
      name: "CODE",
      selector: (row) => [row.code],
      column_name: "code",
      sortable: true,
    },
    {
      name: "Actions",
      maxWidth: "120px",
      cell: (row) => (
        <div className="column-action">
          <UncontrolledDropdown>
            <DropdownToggle tag="div" className="btn btn-sm">
              <MoreVertical size={14} className="cursor-pointer" />
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem
                tag="a"
                href="/"
                className="w-100"
                onClick={(e) => {
                  e.preventDefault();
                  setId(row.id);
                }}
              >
                <Archive size={14} className="me-50" />
                <span className="align-middle">Edit</span>
              </DropdownItem>

              <DropdownItem
                tag="a"
                href="/"
                className="w-100"
                onClick={(e) => {
                  e.preventDefault();
                  doDeleteRecord(row.id);
                }}
              >
                <Trash2 size={14} className="me-50" />
                <span className="align-middle">Delete</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      ),
    },
  ];

  return (
    <>
      <Breadcrumbs title="Diagnoses" data={[{ title: "Diagnoses" }]} />

      <SearchDataTable
        url={"/diagnoses"}
        columns={columns}
        defaultSortColumn={"description"}
        addRecordHandler={doTogglePopup}
        addNewButtonLabel={"Add New Diagnosis"}
        reload={reload}
        doResetReload={doResetReload}
      />

      <DiagnosisEditPopup
        open={sidebarOpen}
        doTogglePopup={doTogglePopup}
        recordId={id}
        doReloadTable={doReloadTable}
      />
    </>
  );
}
