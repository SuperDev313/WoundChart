import React, { Fragment, useState } from "react";
import { batch } from "react-redux";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// ** Custom components
import useApi from "../../api/useApi";
import LoadingSpinner from "../spinner/LoadingSpinner";
import UILoader from "../ui-loader";

// ** Third Party Components
import { Card, Row, Col, Input, CardText, Button } from "reactstrap";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";

const MySwal = withReactContent(Swal);

const LookupSearchDataTable = ({ url, defaultSortColumn, columns, addRecordHandler, addNewButtonLabel, reload = false, doResetReload, defaultSortOrder = 'asc', selectedItemChanged }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [sortColumn, setSortColumn] = useState(
    defaultSortColumn ? defaultSortColumn : ""
  );
  const [sort, setSort] = useState(defaultSortOrder);

  const [payload, setPayload] = useState({
    q: "",
    limit: perPage,
    offset: page,
    sortColumn: sortColumn,
    sort: sort,
  });

  const handleError = (message) => {
    return MySwal.fire({
      title: "Error!",
      text: message,
      icon: "error",
      customClass: {
        confirmButton: "btn btn-primary",
      },
      buttonsStyling: false,
    });
  };

  const fetchData = (payload) => {
    setLoading(true);
    if (doResetReload) {
      doResetReload()
    }
    useApi
      .post(url, {
        q: searchText,
        limit: payload.limit,
        offset: payload.offset,
        sortColumn: sortColumn,
        sort: sort,
      })
      .then((res) => {
        const data = res.data.data;
        batch(() => {
          setData(data.rows);
          setTotalRows(data.total);
          setLoading(false);
        });
      })
      .catch((err) => {
        setLoading(false);
        handleError(err);
      });
  };

  React.useEffect(() => {
    fetchData(payload);
  }, [payload, setPayload]);

  React.useEffect(() => {
    if (reload) {
      fetchData(payload);
    }
  }, [reload]);

  const handlePageChange = (newPage) => {
    setPage(newPage - 1);
    setPayload({
      q: searchText,
      limit: perPage,
      offset: perPage * (newPage - 1),
    });
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
    setPayload({
      q: searchText,
      limit: newPerPage,
      offset: 0,
    });
  };

  const doSearch = () => {
    setPayload({
      q: searchText,
      limit: perPage,
      offset: 0,
    });
  };

  const handleSort = (column, sortDirection) => {
    setSort(sortDirection);
    setSortColumn(column.column_name);
    setPayload({
      q: searchText,
      limit: perPage,
      offset: 0,
    });
  };

  const Loader = () => {
    return (
      <Fragment>
        <LoadingSpinner />
        <CardText className="mb-0 mt-1 text-white">Please Wait...</CardText>
      </Fragment>
    );
  };

  const entities = [
    { label: 'Allergies', value: 'allergies' },
    { label: 'Activity', value: 'activity_options' },
    { label: 'Insurance Companies', value: 'insurance_companies' },
    { label: 'Insurance Categories', value: 'insurance_categories' },
    { label: 'Medicines', value: 'drugs' },
    { label: 'Transfer Places', value: 'transfer_place_options' },
    { label: 'Physician Order Types', value: 'physician_order_type_options' },
    { label: 'Admission Reasons', value: 'admission_reason_options' },
    { label: 'Admission Status', value: 'admission_status_options' },
    { label: 'Appointment Purpose', value: 'appointment_purpose' },
    { label: 'Appointment Reschedule Reazons', value: 'appointment_reschedule_reason' },
    { label: 'Appointment Status', value: 'appointment_status' },
    { label: 'ICT Invited Attendees', value: 'ict_invited_attendees_options' },
    { label: 'ICT reasons', value: 'ict_reason_options' },
    { label: 'ICT Types', value: 'ict_type_options' },
  ]

  const handleEntityChange = (e) => {
    var item = entities.find(item => item.value === e.target.value);
    if (selectedItemChanged != null){
      selectedItemChanged(item);
    }
  }

  return (
    <div className="invoice-list-table-header w-100 py-2">
      <Card>
        <Row className="mx-0 mt-1 mb-50">
          <Col lg="12" className="d-flex align-items-center px-0 px-lg-1">
            <div className="d-flex align-items-center me-2">


              <Input
                type="select"
                id="entity"
                name="entity"
                onChange={handleEntityChange}
              >
                {entities.map &&
                  entities.map((item, index) => (
                    <option value={item.value} key={item.value}>
                      {item.label}
                    </option>
                  ))}
              </Input>

              <Input
                className="ms-50 me-2 w-100"
                placeholder="Enter Search Text"
                type="text"
                bsSize="md"
                id="search-input"
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <Button onClick={doSearch} color="primary" className="me-2">
              Search
            </Button>
            <Button className='add-new-user' color='secondary' onClick={addRecordHandler}>
              {addNewButtonLabel ? addNewButtonLabel : 'Add New Record'}
            </Button>
          </Col>
        </Row>
      </Card>

      <UILoader blocking={loading} loader={<Loader />}>
        <Card>
          <div className="react-dataTable">
            <DataTable
              columns={columns}
              data={data}
              className="react-dataTable"
              fixedHeader
              pagination
              paginationServer
              paginationTotalRows={totalRows}
              onChangeRowsPerPage={handlePerRowsChange}
              onChangePage={handlePageChange}
              onSort={handleSort}
            />
          </div>
        </Card>
      </UILoader>
    </div>
  );
};

export default LookupSearchDataTable;
