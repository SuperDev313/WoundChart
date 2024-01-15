import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// ** Custom Components
import toast from "react-hot-toast";
import useApi from "../../../api/useApi";
import Breadcrumbs from "@components/breadcrumbs";
import PlainDataTable from "../../../components/datatables/PlainDataTable";
import * as alertUtils from "../../../components/alerts/AlertUtils";
import * as utils from "../../../utility/Utils";
import {
    Button,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem

} from "reactstrap" // ** Icons Imports
import {
    MoreVertical,
    Edit,
    Trash,
    Eye
} from "react-feather"

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";

export default function CmSearch() {
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
        setReload(false)
    }

    const gotoView = (id) => {
        navigate(`/patients/${id}`);
    }

    const columns = [
        {
            name: "Patient Name",
            selector: (row) => [row.full_name],
            column_name: "full_name",
            with: "100px",
            sortable: true,
            cell: (row) => (
                <a onClick={(e) => gotoView(row.id)} className="custom-link">
                    {row.full_name}
                </a>
            ),
        },
        {
            name: "Age",
            selector: (row) => [row.patient_age],
            column_name: "patient_age",
            sortable: true
        },
        {
            name: "Last Visit",
            selector: (row) => [row.last_visit],
            column_name: "last_visit",
            sortable: true,
            cell: (row) => (
                <a onClick={(e) => gotoView(row.id)} className="custom-link">
                    {row.last_visit}
                </a>
            ),
        },
        {
            name: "Wound ID",
            selector: (row) => [row.tracking_id],
            column_name: "tracking_id",
            sortable: true,
            cell: (row) => (
                <a onClick={(e) => gotoView(row.id)} className="custom-link">
                    {row.tracking_id}
                </a>
            ),
        },
        {
            name: "Wound Type",
            selector: (row) => [row.wound_trajectory],
            column_name: "wound_trajectory",
            sortable: true,
            cell: (row) => (
                <a onClick={(e) => gotoView(row.id)} className="custom-link">
                    {row.wound_trajectory}
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
                    {row.wound_trajectory}
                </a>
            ),
        },
        {
            name: "Wound Location",
            selector: (row) => [row.wound_location],
            column_name: "wound_location",
            sortable: true,
            cell: (row) => (
                <a onClick={(e) => gotoView(row.id)} className="custom-link">
                    {row.wound_location}
                </a>
            ),
        },

        {
            name: "Visit Frequency",
            selector: (row) => [row.visit_frequency],
            column_name: "visit_frequency",
            cell: (row) => (
                <a onClick={(e) => gotoView(row.id)} className="custom-link">
                    {row.visit_frequency}
                </a>
            ),
            sortable: true,
        },
        {
            name: "Signs of Infection",
            selector: (row) => [row.signs_infected_wound],
            column_name: "signs_infected_wound",
            cell: (row) => (
                <a onClick={(e) => gotoView(row.id)} className="custom-link">
                    {row.signs_infected_wound}
                </a>
            ),
            sortable: true,
        },
        {
            name: "Type of Exudate",
            selector: (row) => [row.type_of_exudate],
            column_name: "type_of_exudate",
            cell: (row) => (
                <a onClick={(e) => gotoView(row.id)} className="custom-link">
                    {row.type_of_exudate}
                </a>
            ),
            sortable: true,
        },
        {
            name: "Amount of Exudate",
            selector: (row) => [row.amount_of_exudate],
            column_name: "amount_of_exudate",
            cell: (row) => (
                <a onClick={(e) => gotoView(row.id)} className="custom-link">
                    {row.amount_of_exudate}
                </a>
            ),
            sortable: true,
        },
        {
            name: "Granulation Tissue",
            selector: (row) => [row.granulation_tissue],
            column_name: "granulation_tissue",
            cell: (row) => (
                <a onClick={(e) => gotoView(row.id)} className="custom-link">
                    {row.granulation_tissue}
                </a>
            ),
            sortable: true,
        },
        {
            name: "Slough Tissue",
            selector: (row) => [row.slough_tissue],
            column_name: "slough_tissue",
            cell: (row) => (
                <a onClick={(e) => gotoView(row.id)} className="custom-link">
                    {row.slough_tissue}
                </a>
            ),
            sortable: true,
        },
        {
            name: "Primary Dressing",
            selector: (row) => [row.primary_dressing],
            column_name: "primary_dressing",
            cell: (row) => (
                <a onClick={(e) => gotoView(row.id)} className="custom-link">
                    {row.primary_dressing}
                </a>
            ),
            sortable: true,
        },
        {
            name: "Other Primary Dressing",
            selector: (row) => [row.other_primary_dressing],
            column_name: "other_primary_dressing",
            cell: (row) => (
                <a onClick={(e) => gotoView(row.id)} className="custom-link">
                    {row.other_primary_dressing}
                </a>
            ),
            sortable: true,
        },
        {
            name: "Secondary Dressing",
            selector: (row) => [row.secondary_dressing],
            column_name: "secondary_dressing",
            cell: (row) => (
                <a onClick={(e) => gotoView(row.id)} className="custom-link">
                    {row.secondary_dressing}
                </a>
            ),
            sortable: true,
        },
    ];

    return (
        <>
            <PlainDataTable
                url={"/data/case_monitoring_view"}
                columns={columns}
                defaultSortColumn={"first_name"}
                defaultSortOrder='desc'
                reload={reload}
                doResetReload={doResetReload}
            />
        </>
    );
}




