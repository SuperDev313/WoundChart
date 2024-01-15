
// ** React Imports
import React, { Fragment, useState, setState } from 'react'
import toast from "react-hot-toast";
import useApi from "../../../../api/useApi";
import FileUploaderMultiple from '../../../../components/upload-files/FileUploaderMultiple';

// ** Third Party Imports
import {
    Row,
    Col,
    Card,
    Button,
    CardBody,
    CardTitle,
    CardHeader,
    CardImg,
    CardFooter,
    CardText
} from 'reactstrap'
import { showAlertError, showDeleteDialog } from "../../../../components/alerts/AlertUtils";

import FileUploader from '../../../../components/upload-files/FileUploader';

const WoundNotesImages = ({ formData }) => {

    const accept = {"image/*": [".png", ".jpg", ".jpeg", ".gif"]}

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle tag='h4'>WOUND NOTES IMAGES</CardTitle>
                </CardHeader>
                <CardBody>

                    <FileUploader id={formData.id} name="wound_image" accept={accept}></FileUploader>

                </CardBody>
            </Card>
        </>
    )
}

export default WoundNotesImages;