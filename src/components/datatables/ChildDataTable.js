import React, { Fragment, useState } from 'react'
import { batch } from 'react-redux'
import DataTable from 'react-data-table-component'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

// ** Custom components
import useApi from '../../api/useApi'
import LoadingSpinner from '../spinner/LoadingSpinner'
import UILoader from '../ui-loader'

// ** Third Party Components
import { Card, CardText } from 'reactstrap'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'

const MySwal = withReactContent(Swal)

const ChildDataTable = ({ columns, url, reload }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [totalRows, setTotalRows] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [page, setPage] = useState(0)
  const [sortColumn, setSortColumn] = useState('created_on')
  const [sort, setSort] = useState('desc')

  const [payload, setPayload] = useState({
    limit: perPage,
    offset: page,
    sortColumn: sortColumn,
    sort: sort,
  })

  const handleError = (message) => {
    return MySwal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      customClass: {
        confirmButton: 'btn btn-primary',
      },
      buttonsStyling: false,
    })
  }

  const fetchData = (payload) => {
    setLoading(true)
    useApi
      .post(url, {
        limit: payload.limit,
        offset: payload.offset,
        sortColumn: sortColumn,
        sort: sort,
      })
      .then((res) => {
        const data = res.data.data
        batch(() => {
          setData(data.rows)
          setTotalRows(data.total)
          setLoading(false)
        })
      })
      .catch((err) => {
        setLoading(false)
        handleError(err)
      })
  }

  React.useEffect(() => {
    fetchData(payload)
  }, [payload, setPayload])

  React.useEffect(() => {
    fetchData(payload)
  }, [reload])

  const handlePageChange = (newPage) => {
    setPage(newPage - 1)
    setPayload({
      limit: perPage,
      offset: perPage * (newPage - 1),
    })
  }

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage)
    setPayload({
      limit: newPerPage,
      offset: 0,
    })
  }

  const handleSort = (column, sortDirection) => {
    setSort(sortDirection)
    setSortColumn(column.column_name)
    setPayload({
      limit: perPage,
      offset: 0,
    })
  }

  const Loader = () => {
    return (
      <Fragment>
        <LoadingSpinner />
        <CardText className='mb-0 mt-1 text-white'>Please Wait...</CardText>
      </Fragment>
    )
  }

  return (
    <div className='invoice-list-table-header w-100 py-2'>
      <UILoader blocking={loading} loader={<Loader />}>
        <Card>
          <div className='react-dataTable'>
            <DataTable
              columns={columns}
              data={data}
              className='react-dataTable'
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
  )
}

export default ChildDataTable
