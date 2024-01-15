import React, { Fragment, useState, useEffect } from "react";
import { batch } from "react-redux";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// ** Custom components
import useApi from "../../api/useApi";
import LoadingSpinner from "../spinner/LoadingSpinner";
import UILoader from "../ui-loader";

// ** Third Party Components
import { Card, CardText, CardHeader, CardTitle, CardBody, Collapse } from "reactstrap";
import {  FaPlus, FaChevronDown, FaChevronUp } from "react-icons/fa6";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";

const MySwal = withReactContent(Swal);

const StatsDataTable = ({ columns, data, title }) => {
    // ** Hooks
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [sortedColumn, setSortedColumn] = useState(null);
    // State to manage the collapse state
    const [isOpen, setIsOpen] = useState(true);

    const [totalRows, setTotalRows] = useState(data.length);

    // When data changes, update the totalRows
    useEffect(() => {
        setTotalRows(data.length);
    }, [data]);

    const handlePerRowsChange = async (newPerPage, page) => {
        setPerPage(newPerPage);
        setCurrentPage(1); // Reset to the first page
    };

    const handlePageChange = async (page) => {
        setCurrentPage(page);
    };

    const handleSort = async (column, sortDirection) => {
        // Update sortedColumn state
    };

    // Function to toggle the collapse state
    const toggleCollapse = () => {
        setIsOpen(!isOpen);
    };

    // Calculate the slice of data for the current page
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    const pageData = data.slice(startIndex, endIndex);

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
                <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
                    <CardTitle tag='h4'>{title} </CardTitle>
                    <div className='d-flex mt-md-0 mt-1'>
                        {isOpen ? (
                            <FaChevronUp size={15} onClick={toggleCollapse} />
                        ) : (
                            <FaChevronDown size={15} onClick={toggleCollapse} />
                        )}
                    </div>
                </CardHeader>
                <Collapse isOpen={isOpen}>
                    <CardBody>
                        <div className="react-dataTable">
                            <DataTable
                                columns={columns}
                                data={pageData} // Use the data for the current page
                                className="react-dataTable"
                                fixedHeader
                                pagination
                                paginationServer
                                paginationTotalRows={totalRows}
                                paginationPerPage={perPage}
                                paginationDefaultPage={currentPage}
                                onChangeRowsPerPage={handlePerRowsChange}
                                onChangePage={handlePageChange}
                                onSort={handleSort}
                                sortServer
                                // sortIcon={<ChevronDown />}
                            />
                        </div>
                    </CardBody>
                </Collapse>
                

            </Card>
        </div>
    );
};

export default StatsDataTable;
