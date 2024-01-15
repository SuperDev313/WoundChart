import React, { useEffect, useState } from "react";

// ** Custom Components
import toast from "react-hot-toast";
import useApi from "../../../api/useApi";
import Breadcrumbs from "@components/breadcrumbs";
import LookupSearchDataTable from "../../../components/datatables/LookupSearchDataTable";
import LookupEditPopup from "./LookupEditPopup";
import * as alertUtils from "../../../components/alerts/AlertUtils";
import {
  Button ,
} from "reactstrap"; // ** Icons Imports
import { Trash, Edit, Archive } from "react-feather";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";

export default function LookupsSearch() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [id, setId] = useState("");
  const [reload, setReload] = useState(false);
  const [entity, setEntity] = useState('allergies');
  const [entityLabel, setEntityLabel] = useState('Allergies');

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
        .delete(`/lookups/${entity}/${id}`, {})
        .then((res) => {
          toast("Record deleted successfuly");
          setReload(true);
        })
        .catch((err) => {
          // alertUtils.showAlertError(err);
        });
    });
  };

  const selectedItemChanged = (item) => {
    setEntity(item.value);
    setEntityLabel(item.label);

    setReload(true);
  }

  const columns = [
    {
      name: "Description",
      selector: (row) => [row.description],
      column_name: "description",
      sortable: true,
    },
    {
      name: "Actions",
      maxWidth: "120px",
      cell: (row) => (
        <div className="column-action d-flex align-items-center">
          <div className='d-flex align-items-center permissions-actions'>
            <Button size='sm' color='transparent' className='btn btn-icon' onClick={(e) => setId(row.id)}>
              <Edit className='font-medium-2' />
            </Button>
            <Button
              size='sm'
              color='transparent'
              className='btn btn-icon'
              onClick={(e) => doDeleteRecord(row.id)}
            >
              <Trash className='font-medium-2' />
            </Button>
          </div>

        </div>
      ),
    }, 
  ];

  return (
    <>
      <Breadcrumbs title="Lookups" data={[{ title: "Lookups" }]} />

      <LookupSearchDataTable
        url={`/lookups/${entity}`}
        columns={columns}
        defaultSortColumn={"description"}
        addRecordHandler={doTogglePopup}
        addNewButtonLabel={"Add New Record"}
        reload={reload}
        doResetReload={doResetReload}
        selectedItemChanged={selectedItemChanged}
      />

      <LookupEditPopup
        open={sidebarOpen}
        doTogglePopup={doTogglePopup}
        recordId={id}
        doReloadTable={doReloadTable}
        entity={entity}
        entityLabel={entityLabel}
      />
    </>
  );
}
