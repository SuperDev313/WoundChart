import React, { useEffect, useState } from "react";

// ** Custom Components
import toast from "react-hot-toast";
import useApi from "../../../api/useApi";
import Breadcrumbs from "@components/breadcrumbs";
import SearchDataTable from "../../../components/datatables/SearchDataTable";
import LocationEditPopup from "./LocationEditPopup";
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

export default function LocationsSearch() {
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
        .delete(`/locations/${id}`, {})
        .then((res) => {
          toast("Location deleted successfuly");
          setReload(true);
        })
        .catch((err) => {
          // alertUtils.showAlertError(err);
        });
    });
  };

  const columns = [
    {
      name: "NAME",
      selector: (row) => [row.name],
      column_name: "name",
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
      <Breadcrumbs title="Locations" data={[{ title: "Locations" }]} />

      <SearchDataTable
        url={"/locations"}
        columns={columns}
        defaultSortColumn={"name"}
        addRecordHandler={doTogglePopup}
        addNewButtonLabel={"Add New Location"}
        reload={reload}
        doResetReload={doResetReload}
      />

      <LocationEditPopup
        open={sidebarOpen}
        doTogglePopup={doTogglePopup}
        recordId={id}
        doReloadTable={doReloadTable}
      />
    </>
  );
}
