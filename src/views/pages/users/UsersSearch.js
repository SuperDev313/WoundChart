import React, { useEffect, useState } from "react";

// ** Custom Components
import toast from "react-hot-toast";
import useApi from "../../../api/useApi";
import Breadcrumbs from "@components/breadcrumbs";
import SearchDataTable from "../../../components/datatables/SearchDataTable";
import UserEditPopup from "./UserEditPopup";
import * as alertUtils from "../../../components/alerts/AlertUtils";
import {
    Button,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
  } from "reactstrap"; // ** Icons Imports

  
import { Edit, Trash, Archive } from "react-feather";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";

export default function UsersSearch() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [id, setId] = useState("");
    const [reload, setReload] = useState(false);

    const doTogglePopup = () => {
        setSidebarOpen(!sidebarOpen);
        if (sidebarOpen) {
            setId('');
        }
    };

    const doReloadTable = () => {
        setReload(true);
        setSidebarOpen(false);
    };

    const doResetReload = () => {
        setReload(false);
    };

    const gotoView = (e, rowId) => {
        e.preventDefault();
        setId(rowId);
        setSidebarOpen(true); 
    };


    const doDeleteRecord = (id) => {
        alertUtils.showDeleteDialog(() => {
            useApi
                .delete(`/users/${id}`, {})
                .then((res) => {
                    toast("User deleted successfuly");
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
            selector: (row) => [row.full_name],
            column_name: "full_name",
            sortable: true,
        }, {
            name: "Actions",
            maxWidth: "120px",
            cell: (row) => (
                <div className="column-action d-flex align-items-center">
                    <div className="d-flex align-items-center permissions-actions">
                        <Button
                            size="sm"
                            color="transparent"
                            className="btn btn-icon"
                            onClick={(e) => gotoView(e, row.id)}
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
            <Breadcrumbs title="Users" data={[{ title: "Users" }]} />

            <SearchDataTable
                url={"/users"}
                columns={columns}
                defaultSortColumn={"full_name"}
                addRecordHandler={doTogglePopup}
                addNewButtonLabel={"Add New User"}
                reload={reload}
                doResetReload={doResetReload}
            />

            <UserEditPopup
                open={sidebarOpen}
                doTogglePopup={doTogglePopup}
                recordId={id}
                doReloadTable={doReloadTable}
            />
        </>
    );
}
