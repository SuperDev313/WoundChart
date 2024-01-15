
// ** React Imports
import { Fragment, useState } from 'react'
import toast from "react-hot-toast";
import useApi from "../../../api/useApi"

// ** Third Party Imports
import { useDropzone } from 'react-dropzone'
import { FileText, X, DownloadCloud } from 'react-feather'
import {
    Row,
    Col,
    Card,
    Button,
    CardBody,
    CardTitle,
    CardHeader,
    ListGroup, 
    ListGroupItem
} from 'reactstrap'
import * as alertUtils from "../../../components/alerts/AlertUtils";

const SocImage = ({ formData }) => {

    const [files, setFiles] = useState([])
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: acceptedFiles => {
            setFiles([...files, ...acceptedFiles.map(file => Object.assign(file))])
        }
    })

    const renderFilePreview = file => {
        if (file.type.startsWith('image')) {
            return <img className='rounded' alt={file.name} src={URL.createObjectURL(file)} height='28' width='28' />
        } else {
            return <FileText size='28' />
        }
    }

    const handleRemoveFile = file => {
        const uploadedFiles = files
        const filtered = uploadedFiles.filter(i => i.name !== file.name)
        setFiles([...filtered])
    }

    const renderFileSize = size => {
        if (Math.round(size / 100) / 10 > 1000) {
            return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`
        } else {
            return `${(Math.round(size / 100) / 10).toFixed(1)} kb`
        }
    }

    const fileList = files.map((file, index) => (
        <ListGroupItem key={`${file.name}-${index}`} className='d-flex align-items-center justify-content-between'>
            <div className='file-details d-flex align-items-center'>
                <div className='file-preview me-1'>{renderFilePreview(file)}</div>
                <div>
                    <p className='file-name mb-0'>{file.name}</p>
                    <p className='file-size mb-0'>{renderFileSize(file.size)}</p>
                </div>
            </div>
          <Button color='danger' outline size='sm' className='btn-icon' onClick={() => handleRemoveFile(file)}>
            <X size={14} />
          </Button>
        </ListGroupItem>
      ))
    
      const handleRemoveAllFiles = () => {
        setFiles([])
      }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle tag='h4'>IMAGES</CardTitle>
                </CardHeader>
                <CardBody>
                    <div {...getRootProps({ className: 'dropzone' })}>
                        <input {...getInputProps()} />
                        <div className='d-flex align-items-center justify-content-center flex-column'>
                            <DownloadCloud size={64} />
                            <h5>Drop Files here or click to upload</h5>
                            <p className='text-secondary'>
                                Drop files here or click{' '}
                            <a href='/' onClick={e => e.preventDefault()}>
                                browse
                            </a>{' '}
                                thorough your device
                            </p>
                        </div>
                    </div>
                    {files.length ? (
                        <Fragment>
                            <ListGroup className='my-2'>{fileList}</ListGroup>
                            <div className='d-flex justify-content-end'>
                                <Button className='me-1' color='danger' outline onClick={handleRemoveAllFiles}>
                                    Remove All
                                </Button>
                                <Button color='primary'>Upload Files</Button>
                            </div>
                        </Fragment>
                    ) : null}
                </CardBody>
            </Card>
        </>
    )
}

export default SocImage;