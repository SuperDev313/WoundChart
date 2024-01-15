// ** React Imports
import { useState, Fragment } from "react";

// ** Reactstrap Imports
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Button,
  ListGroup,
  ListGroupItem,
} from "reactstrap";

// ** Third Party Imports
import { useDropzone } from "react-dropzone";
import { FileText, X, DownloadCloud } from "react-feather";
import { LightgalleryProvider, LightgalleryItem } from "react-lightgallery";

import useApi from "../../api/useApi";
import { showAlertError } from "../alerts/AlertUtils";
import { DefaultLoader } from "../spinner/LoadingSpinner";
import UILoader from "../ui-loader";

export function FileUploaderWithImageGallery({
  route = "",
  onResponseCallback = () => { },
  onFatalError = () => { },
}) {
  // ** State
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles([...files, ...acceptedFiles.map((file) => Object.assign(file))]);
    },
  });

  const renderFilePreview = (file) => {
    if (file.type.startsWith("image")) {
      return (
        <img
          className="rounded"
          alt={file.name}
          src={URL.createObjectURL(file)}
          height="28"
          width="28"
        />
      );
    } else {
      return <FileText size="28" />;
    }
  };

  const handleRemoveFile = (file) => {
    const uploadedFiles = files;
    const filtered = uploadedFiles.filter((i) => i.name !== file.name);
    setFiles([...filtered]);
  };

  const renderFileSize = (size) => {
    if (Math.round(size / 100) / 10 > 1000) {
      return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`;
    } else {
      return `${(Math.round(size / 100) / 10).toFixed(1)} kb`;
    }
  };

  const fileList = files.map((file, index) => (
    <ListGroupItem
      key={`${file.name}-${index}`}
      className="d-flex align-items-center justify-content-between"
    >
      <div className="file-details d-flex align-items-center">
        <div className="file-preview me-1">{renderFilePreview(file)}</div>
        <div>
          <p className="file-name mb-0">{file.name}</p>
          <p className="file-size mb-0">{renderFileSize(file.size)}</p>
        </div>
      </div>
      <Button
        color="danger"
        outline
        size="sm"
        className="btn-icon"
        onClick={() => handleRemoveFile(file)}
      >
        <X size={14} />
      </Button>
    </ListGroupItem>
  ));

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  const handleUploadFile = (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("username", "abc123");
    formData.append("file", file);

    useApi
      .uploadFile(route, formData)
      .then((res) => {
        console.log("response", res);
        handleRemoveAllFiles();
        setLoading(false);
      })
      .catch((err) => {
        showAlertError(err);
        setLoading(false);
      });
  };

  const uploadFiles = (e) => {
    files.map((file) => {
      handleUploadFile(file);
    });
  };

  function PhotobookImage({ url }) {
    return (
      <div>
        <div>
          <img className="d-block img-fluid br-5" src={url} alt="" />
        </div>
      </div>
    );
  }

  const PhotoItem = ({ image, group }) => (
    <div>
      <LightgalleryItem group={group} src={image}>
        <PhotobookImage url={image} />
      </LightgalleryItem>

      <button
        className="btn btn-success pull-right"
        type="button"
        onClick={() => handleRemoveFile(image)}
      >
        Remove
      </button>
    </div>
  );

  return (
    <UILoader blocking={loading} loader={<DefaultLoader />}>
      <Card>
        <CardHeader>
          <CardTitle tag="h4">Multiple</CardTitle>
        </CardHeader>
        <CardBody>

          <div className="widgetg">
            <div id="lightgallery" className="row img-gallery" lg-uid="lg0">
              <LightgalleryProvider>
                {files.map((file) => {
                  return (
                    <div className="col-4" key={file.id}>
                      <PhotoItem
                        image={`${file.src}`}
                        className="br-5"
                        group="group1"
                      />
                    </div>
                  );
                })}
              </LightgalleryProvider>
            </div>
          </div>


          <div {...getRootProps({ className: "dropzone" })}>
            <input {...getInputProps()} />
            <div className="d-flex align-items-center justify-content-center flex-column">
              <DownloadCloud size={64} />
              <h5>Drop Files here or click to upload</h5>
              <p className="text-secondary">
                Drop files here or click &nbsp;
                <a href="/" onClick={(e) => e.preventDefault()}>
                  browse &nbsp;
                </a>
                thorough your machine
              </p>
            </div>
          </div>
          {files.length ? (
            <Fragment>
              <ListGroup className="my-2">{fileList}</ListGroup>
              <div className="d-flex justify-content-end">
                <Button
                  className="me-1"
                  color="danger"
                  outline
                  onClick={handleRemoveAllFiles}
                >
                  Remove All
                </Button>
                <Button color="primary" onClick={uploadFiles}>
                  Upload Files
                </Button>
              </div>
            </Fragment>
          ) : null}


        </CardBody>
      </Card>
    </UILoader>
  );
}

export default FileUploaderWithImageGallery;
