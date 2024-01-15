import React, { Fragment, useState, setState } from 'react'
import toast from "react-hot-toast";

import FileUploaderMultiple from './FileUploaderMultiple';

import useApi from "../../api/useApi";
import { showAlertError, showDeleteDialog } from "../alerts/AlertUtils";

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

const FileUploader = ({ id, name, accept = {"image/*": [".png", ".jpg", ".jpeg", ".gif"]} }) => {

    const [images, setImages] = useState([])

    const uplaodUrl = `/files/upload/${id}/${name}`
    const fetchUrl = `/files/${id}/${name}`

    React.useEffect(() => {

        useApi
            .get(fetchUrl, {})
            .then((res) => {
                var items = [];
                res.data.data.rows.map((r) => {
                    const option = { url: r.file_url, id: r.id, mime_type: r.mime_type };
                    items.push(option);
                    return option;
                });

                setImages([...images, ...items]);

            })
            .catch((err) => {
                showAlertError(err);
            });

    }, []);

    const doDeleteRecord = (id) => {
        showDeleteDialog(() => {
            useApi
                .delete(`/files/${id}`, {})
                .then((res) => {
                    setImages(images.filter(item => item.id !== id));
                    toast("File deleted successfuly");
                })
                .catch((err) => {
                    showAlertError(err);
                });
        });
    };

    const handleUploadedFile = (file) => {
        var data = file.data.data;

        setImages(current => [...current, {
            url: data.file_url,
            id: data.id,
            mime_type: data.mime_type,
        }]);
    }

    return (
        <>
            <FileUploaderMultiple
                route={uplaodUrl}
                autoUpload={false}
                onResponseCallback={handleUploadedFile}
            />
            <Row className='match-height mb-2'>
                {images.map(item => (
                    <Col md='4' xs='12'>
                        <Card>
                            <CardImg top src={item.url} alt='' />
                            <CardBody>
                                <Button color='danger' outline onClick={(e) => doDeleteRecord(item.id)}>
                                    Delete
                                </Button>
                            </CardBody>
                            <CardFooter>
                                <small className='text-muted'>{item.mime_type}</small>
                            </CardFooter>
                        </Card>
                    </Col>
                ))}
            </Row>
        </>
    )

}

export default FileUploader;
