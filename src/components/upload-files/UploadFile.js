import { useState, useRef } from "react";
import { useDropzone } from "react-dropzone";

export function UploadFile({
  route = "",
  onResponseCallback = () => {},
  onFatalError = () => {},
}) {
  // const imageRef = useRef(null);

  // const [image, setImage] = useState(null);
  // const [loading, setLoading] = useState(false);
  // const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
  // const [uploadedImage, setUploadedImage] = useState(null);

  // const handleChangeImage = (e) => {
  //   setImage(e.target.files[0]);
  // };

  // const handleUploadImage = (file) => {
  //   setLoading(true);
  //   const formData = new FormData();
  //   formData.append("username", "abc123");
  //   formData.append("file", file);

  //   //   hitApi({
  //   //     method: "post",
  //   //     route: route,
  //   //     formData: formData,
  //   //     onResponse: ({ json, ok }) => {
  //   //       if (ok) {
  //   //         if (json.response_code == "0000") {
  //   //           onResponseCallback(ok, json);
  //   //         }
  //   //       }
  //   //       // setImage(null);
  //   //       setLoading(false);
  //   //     },
  //   //     onFatalError: () => {
  //   //       //setImage(null);
  //   //       setUploadedImage(null);
  //   //       setLoading(false);
  //   //     },
  //   //   });
  // };
  // const uploadFiles = (e) => {
  //   acceptedFiles.map((file) => {
  //     handleUploadImage(file);
  //   });
  //   //e.target.preventDefault();
  // };

  // const files = acceptedFiles.map((file) => (
  //   <li key={file.path}>
  //     {file.path} - {file.size} bytes
  //   </li>
  // ));

  return (
    <>
    xxx
      {/* <form encType="multipart/form-data" method="POST">
        <section className="container">
          <div {...getRootProps({ className: "dropzone" })} className="drops">
            <input {...getInputProps()} name="file" />
            <p className="alitext">
              Drag 'n' drop some files here, or click to select files
            </p>
            <h4 className="alitext">Files</h4>
            <ul>{files}</ul>
          </div>
          <button
            className="btn btn-success pull-right"
            type="button"
            onClick={uploadFiles}
          >
            Upload
          </button>
        </section>
      </form> */}
    </>
  );
}