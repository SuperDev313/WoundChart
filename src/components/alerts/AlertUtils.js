import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import toast from "react-hot-toast";
import Avatar from "@components/avatar";
import { Check, X } from "react-feather";

const MySwal = withReactContent(Swal);

export const showAlertError = (message) => {
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


export const showDeleteDialog = deleteCallback => {
  return MySwal.fire({
    title: 'Delete Record',
    text: 'Are you sure you would like to delete this record?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    customClass: {
      confirmButton: 'btn btn-primary',
      cancelButton: 'btn btn-danger ms-1'
    },
    buttonsStyling: false
  }).then(function (result) {
    if (result.value) {
      if (deleteCallback){
        deleteCallback();
      }
      // MySwal.fire({
      //   icon: 'success',
      //   title: 'Deleted!',
      //   text: 'The record has been deleted.',
      //   customClass: {
      //     confirmButton: 'btn btn-success'
      //   }
      // })
    } else if (result.dismiss === MySwal.DismissReason.cancel) {
      
    }
  })
}

export const ToastContent = ({ t, message }) => {
  return (
    <div className="d-flex">
      <div className="me-1">
        <Avatar size="sm" color="success" icon={<Check size={12} />} />
      </div>
      <div className="d-flex flex-column">
        <div className="d-flex justify-content-between">
          <X
            size={12}
            className="cursor-pointer"
            onClick={() => toast.dismiss(t.id)}
          />
        </div>
        <span>{message}</span>
      </div>
    </div>
  );
};
