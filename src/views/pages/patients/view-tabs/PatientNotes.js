import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { useNavigate } from 'react-router-dom'
import useApi from '../../../../api/useApi'
import { getDateFromISODate, getFormatedDateFromISODate } from '../../../../utility/Utils'
import PatientNotesTableDetails from './PatientNotesTableDetails'
import { Link } from 'react-router-dom'
import { Button, CardText, Card, CardHeader, CardTitle } from 'reactstrap'

import { ChevronDown, Plus } from 'react-feather'
import { showAlertError } from '../../../../components/alerts/AlertUtils'
import UILoader from '../../../../components/ui-loader'
import LoadingSpinner from '../../../../components/spinner/LoadingSpinner'
import WoundNoteDetailsDialog from '../../wound-notes/dialogs/WoundNoteDetailsDialog'

export default function PatientNotes({ patientId, data, totalRows }) {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [id, setId] = useState([])

  //Pagination

  //   const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  //   const [totalRows, setTotalRows] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [page, setPage] = useState(0)

  const [payload, setPayload] = useState({
    limit: perPage,
    offset: page,
  })

  //   React.useEffect(() => {
  //     setLoading(true)
  //     useApi
  //       .post(`/patients/${patientId}/notes/by_dates`, payload)
  //       .then((res) => {
  //         setData(res.data.data.rows)
  //         setTotalRows(res.data.data.total)
  //         setLoading(false)
  //       })
  //       .catch((err) => {
  //         showAlertError(err)
  //         setLoading(false)
  //       })
  //   }, [payload, setPayload])

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

  const Loader = () => {
    return (
      <>
        <LoadingSpinner />
        <CardText className='mb-0 mt-1 text-white'>Please Wait...</CardText>
      </>
    )
  }

  const ExpandedComponent = ({ data }) => (
    <PatientNotesTableDetails id={data.patient_id} date={getDateFromISODate(formData.visit_date)} />
  )

  const columns = [
    {
      name: '',
      selector: (row) => [row.visit_date],
      cell: (row) => (
        <>
          {getFormatedDateFromISODate(row.visit_date)} [{row.total}]
        </>
      ),
      sortable: true,
    },
  ]

  const doTogglePopup = () => {
    setSidebarOpen(!sidebarOpen)
    if (sidebarOpen) {
      setId(0)
    }
  }

  const doHandleSaveAndClosePopup = (id) => {
    if (id > 0) {
      navigate(`/patients/${patientId}/wound-notes/${id}`)
    }
  }

  return (
    <>
      <UILoader blocking={loading} loader={<Loader />}>
        <Card>
          <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
            <CardTitle tag='h4'></CardTitle>
            <div className='d-flex mt-md-0 mt-1'>
              <Button className='ms-2' color='primary' onClick={doTogglePopup}>
                <Plus size={15} />
                <span className='align-middle ms-50'>Add Wound Note</span>
              </Button>
            </div>
          </CardHeader>
          <div className='react-dataTable'>
            <DataTable
              columns={columns}
              data={data}
              noHeader
              pagination
              paginationServer
              className='react-dataTable'
              paginationTotalRows={totalRows}
              onChangeRowsPerPage={handlePerRowsChange}
              onChangePage={handlePageChange}
              sortIcon={<ChevronDown size={10} />}
              expandableRows
              expandOnRowClicked
              expandableRowsComponent={ExpandedComponent}
              paginationRowsPerPageOptions={[10, 25, 50, 100]}
            />
          </div>
        </Card>
      </UILoader>

      <WoundNoteDetailsDialog
        open={sidebarOpen}
        doTogglePopup={doTogglePopup}
        recordId={patientId}
        doHandleSaveAndClosePopup={doHandleSaveAndClosePopup}
      />
    </>
  )
}
