import React, { Fragment, useState, useEffect } from "react";
import { batch } from "react-redux";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Plus } from "react-feather";
import Select from "react-select";

// ** Custom components
import useApi from "../../api/useApi";
import LoadingSpinner from "../spinner/LoadingSpinner";
import UILoader from "../ui-loader";
import { selectThemeColors } from "@utils";

// ** Third Party Components
import { Card, Row, Col, Input, CardText, Button } from "reactstrap";
import debounce from "lodash/debounce";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";

const MySwal = withReactContent(Swal);

const SearchDataTable = ({
  url,
  defaultSortColumn,
  columns,
  addRecordHandler,
  addNewButtonLabel,
  reload = false,
  doResetReload,
  defaultSortOrder = "asc",
  showAddNewButton = true,
  showFilters = true,
  filterOptions = [{ value: "", label: "Select Option" }],
}) => {
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
  const [currentFilter, setCurrentFilter] = useState(filterOptions[0]);

  const [payload, setPayload] = useState({
    q: "",
    limit: perPage,
    offset: page,
    sortColumn,
    sort,
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
      doResetReload();
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

  const handleChange = debounce((value) => {
    setSearchText(value);
    doSearch();
  }, 300);

  useEffect(() => {
    if (currentFilter === "") return;

    setSearchText(currentFilter.value);
    doSearch();
  }, [currentFilter]);

  const Loader = () => {
    return (
      <Fragment>
        <LoadingSpinner />
        <CardText className="mb-0 mt-1 text-white">Please Wait...</CardText>
      </Fragment>
    );
  };

  return (
    <div className="invoice-list-table-header w-100 py-2">
      <Card>
        <Row className="mx-0 mt-1 mb-1">
          <Col lg="12" className="d-flex justify-content-between">
            <div className="d-flex align-items-center me-2">
              <Input
                className="ms-50 me-2 w-100"
                placeholder="Enter search text"
                type="text"
                bsSize="md"
                id="search-input"
                autoComplete="off"
                onChange={(e) => handleChange(e.target.value)}
              />
            </div>
            <div className="d-flex justify-content-between">
              {showFilters && (
                <Select
                  isClearable={false}
                  value={currentFilter}
                  options={filterOptions}
                  className="react-select"
                  classNamePrefix="select"
                  theme={selectThemeColors}
                  onChange={(filter) => setCurrentFilter(filter)}
                />
              )}
              {showAddNewButton && (
                <Button
                  className="ms-2"
                  color="primary"
                  onClick={addRecordHandler}
                >
                  <Plus size={15} />
                  <span className="align-middle ms-50">
                    {addNewButtonLabel
                      ? addNewButtonLabel
                      : "Create New Record"}
                  </span>
                </Button>
              )}
            </div>
          </Col>
        </Row>

        <UILoader blocking={loading} loader={<Loader />}>
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
        </UILoader>
      </Card>
    </div>
  );
};

export default SearchDataTable;
