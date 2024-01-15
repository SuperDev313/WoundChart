

import React, { useEffect, useState } from "react";

// ** Custom Components
import toast from "react-hot-toast";
import useApi from "../../../api/useApi";
import Breadcrumbs from "@components/breadcrumbs";
import SearchDataTable from "../../../components/datatables/SearchDataTable";
import MedicineEditPopup from "./MedicineEditPopup";
import * as alertUtils from "../../../components/alerts/AlertUtils";
import {
  Badge,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap"; // ** Icons Imports
import {
  MoreVertical,
  Trash2,
  Archive,
} from "react-feather";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";

export default function MedicinesSearch() {
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
    setReload(false)
  }

  const doDeleteRecord = id => {
    alertUtils.showDeleteDialog(
      () => {
        useApi
        .delete(`/medicines/${id}`, {})
        .then((res) => {
          toast('Medicine deleted successfuly')
          setReload(true)
        })
        .catch((err) => {
          // alertUtils.showAlertError(err);
        });
      }
    )
  }

  const columns = [
          {
          name: "APPL NO",
          selector: (row) => [row.appl_no],
          column_name: "appl_no",
          sortable: true,
        },
        {
          name: "PRODUCT NO",
          selector: (row) => [row.product_no],
          column_name: "product_no",
          sortable: true,
        },
        {
          name: "FORM",
          selector: (row) => [row.form],
          column_name: "form",
          sortable: true,
        },
        {
          name: "STRENGTH",
          selector: (row) => [row.strength],
          column_name: "strength",
          sortable: true,
        },
        {
          name: "REFERENCE DRUG",
          selector: (row) => [row.reference_drug],
          column_name: "reference_drug",
          sortable: true,
        },
        {
          name: "DRUG NAME",
          selector: (row) => [row.drug_name],
          column_name: "drug_name",
          sortable: true,
        },
        {
          name: "ACTIVE INGREDIENT",
          selector: (row) => [row.active_ingredient],
          column_name: "active_ingredient",
          sortable: true,
        },
        {
          name: "REFERENCE STANDARD",
          selector: (row) => [row.reference_standard],
          column_name: "reference_standard",
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
      <Breadcrumbs title="Medicines" data={[{ title: "Medicines" }]} />

      <SearchDataTable
        url={"/medicines"}
        columns={columns}
        defaultSortColumn={"id"}
        addRecordHandler={doTogglePopup}
        addNewButtonLabel={"Add New Medicine"}
        reload={reload}
        doResetReload = {doResetReload}
      />

      <MedicineEditPopup
        open={sidebarOpen}
        doTogglePopup={doTogglePopup}
        recordId={id}
        doReloadTable={doReloadTable}
      />
    </>
  );
}

 


