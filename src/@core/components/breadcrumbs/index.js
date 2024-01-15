// ** React Imports
import { Fragment, useState } from "react";
import { Link } from "react-router-dom";

// ** Third Party Components
import Proptypes from "prop-types";
import classnames from "classnames";
import {
  Grid,
  CheckSquare,
  MessageSquare,
  Mail,
  Calendar,
} from "react-feather";

import { FaHospitalUser } from "react-icons/fa6";


// ** Reactstrap Imports
import {
  Breadcrumb,
  DropdownMenu,
  DropdownItem,
  BreadcrumbItem,
  DropdownToggle,
  UncontrolledButtonDropdown,
} from "reactstrap";

import PatientDischargeNoteDialog from "../../../views/pages/discharge_notes/PatientDischargeNoteDialog";
import PatientReadmissionDialog from "../../../views/pages/readmission/PatientReadmissionDialog";
import AgreementCard from "../../../views/pages/patients/view-tabs/AgreementCard";

const BreadCrumbs = (props) => {
  // ** Props
  const { data, title, page } = props;

  const renderBreadCrumbs = () => {
    return data.map((item, index) => {
      const Wrapper = item.link ? Link : Fragment;
      const isLastItem = data.length - 1 === index;
      return (
        <BreadcrumbItem
          tag="li"
          key={index}
          active={!isLastItem}
          className={classnames({ "text-primary": !isLastItem })}
        >
          <Wrapper {...(item.link ? { to: item.link } : {})}>
            {item.title}
          </Wrapper>
        </BreadcrumbItem>
      );
    });
  };

  const [openDischargeNote, setOpenDischargeNote] = useState(false);
  const [openReadmission, setReadmission] = useState(false);
  const [openAgreement, setAgreement] = useState(false);

  const doToggleDischargeNoteDialogPopup = () => {
    setOpenDischargeNote(!openDischargeNote);
  };

  const doToggleReadmissionDialogPopup = () => {
    setReadmission(!openReadmission);
  };

  const doToggleAgreementDialogPopup = () => {
    setAgreement(!openAgreement);
  };

  const openDischargeNoteDialog = (e) => {
    e.preventDefault();
    setOpenDischargeNote(!openDischargeNote);
  };

  const openReadmissionDialog = (e) => {
    e.preventDefault();
    setReadmission(!openReadmission);
  };

  const openAgreementDialog = (e) => {
    e.preventDefault();
    setAgreement(!openAgreement);
  };

  return (
    <div className="content-header row">
      <div className="content-header-left col-md-9 col-12 mb-2">
        <div className="row breadcrumbs-top">
          <div className="col-12">
            {title ? (
              <h2 className="content-header-title float-start mb-0">{title}</h2>
            ) : (
              ""
            )}
            <div className="breadcrumb-wrapper vs-breadcrumbs d-sm-block d-none col-12">
              <Breadcrumb>
                <BreadcrumbItem tag="li">
                  <Link to="/">Home</Link>
                </BreadcrumbItem>
                {data ? renderBreadCrumbs() : ""}
              </Breadcrumb>
            </div>
          </div>
        </div>
      </div>
      {page === "patients" ? (
        <div className="content-header-right text-md-end col-md-3 col-12 d-md-block d-none">
          <div className="breadcrumb-right dropdown">
            <UncontrolledButtonDropdown>
              <DropdownToggle
                color="primary"
                className="btn-icon btn-round dropdown-toggle"
              >
                <Grid size={14} />
              </DropdownToggle>
              <DropdownMenu tag="ul" end>
                <DropdownItem
                  tag={Link}
                  onClick={(e) => openDischargeNoteDialog(e)}
                >
                  <MessageSquare className="me-1" size={14} />
                  <span className="align-middle">Discharge Note</span>
                </DropdownItem>

                <DropdownItem
                  tag={Link}
                  onClick={(e) => openReadmissionDialog(e)}
                >
                  <CheckSquare className="me-1" size={14} />
                  <span className="align-middle">Re-Admit Patient</span>
                </DropdownItem>
                <DropdownItem
                  tag={Link}
                  onClick={(e) => openAgreementDialog(e)}
                >
                  <FaHospitalUser className="me-1" size={14} />
                  <span className="align-middle">Agreement Page</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledButtonDropdown>
          </div>
        </div>
      ) : (
        <></>
      )}

      {openDischargeNote && (
        <PatientDischargeNoteDialog
          open={openDischargeNote}
          doTogglePopup={doToggleDischargeNoteDialogPopup}
          doHandleSaveAndClosePopup={doToggleDischargeNoteDialogPopup}
        />
      )}

      {openReadmission && (
        <PatientReadmissionDialog
          open={openReadmission}
          doTogglePopup={doToggleReadmissionDialogPopup}
          doHandleSaveAndClosePopup={doToggleReadmissionDialogPopup}
        />
      )}

      {openAgreement && (
        <AgreementCard
          open={openAgreement}
          doTogglePopup={doToggleAgreementDialogPopup}
          doHandleSaveAndClosePopup={doToggleAgreementDialogPopup}
        />
      )}

    </div>
  );
};
export default BreadCrumbs;

// ** PropTypes
BreadCrumbs.propTypes = {
  title: Proptypes.string.isRequired,
  data: Proptypes.arrayOf(
    Proptypes.shape({
      link: Proptypes.string,
      title: Proptypes.string.isRequired,
    })
  ),
};
