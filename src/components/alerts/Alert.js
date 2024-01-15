import React from "react";
import { Alert } from "reactstrap";
import PropTypes from "prop-types";

const WarningAlert = ({ variant, message, isOpen, toggle }) => {
  return <Alert color={variant} style={{ padding: 10 }} isOpen={isOpen} toggle={toggle}><div dangerouslySetInnerHTML={{ __html: message }} /></Alert>;
};

WarningAlert.propTypes = {
  variant: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired
};

export default WarningAlert;
