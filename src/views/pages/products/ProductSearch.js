import React, { useEffect, useState } from "react";

// ** Custom Components
import toast from "react-hot-toast";
import useApi from "../../../api/useApi";
import Breadcrumbs from "@components/breadcrumbs";
import SearchDataTable from "../../../components/datatables/SearchDataTable";
import ProductEditPopup from "./ProductEditPopup";
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

export default function ProductsSearch() {
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
        .delete(`/products/${id}`, {})
        .then((res) => {
          toast('Product deleted successfuly')
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
      name: "PRODUCT TYPE",
      selector: (row) => [row.product_type],
      column_name: "product_type",
      sortable: true,
    },
    {
      name: "Name",
      column_name: "product_name",
      selector: (row) => [row.product_name],
      sortable: true,
    },
    {
      name: "HCPCS",
      selector: (row) => [row.hcpcs_code],
      sortable: false,
    },
    {
      name: "CODE",
      selector: (row) => [row.product_code],
      sortable: false,
    },
    {
      name: "PRICE",
      selector: (row) => [row.product_price],
      sortable: false,
      cell: (row) => {
        const formattedPrice = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(row.product_price);
    
        return <div>{formattedPrice}</div>;
      },
    },
    {
      name: "IS ACTIVE",
      column_name: "is_active",
      selector: (row) => [row.is_active],
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
      <Breadcrumbs title="Products" data={[{ title: "Products" }]} />

      <SearchDataTable
        url={"/products"}
        columns={columns}
        defaultSortColumn={"product_name"}
        addRecordHandler={doTogglePopup}
        addNewButtonLabel={"Add New Product"}
        reload={reload}
        doResetReload = {doResetReload}
      />

      <ProductEditPopup
        open={sidebarOpen}
        doTogglePopup={doTogglePopup}
        recordId={id}
        doReloadTable={doReloadTable}
      />
    </>
  );
}
