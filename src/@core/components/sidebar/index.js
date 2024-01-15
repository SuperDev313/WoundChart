// ** Third Party Components
import { X } from "react-feather";
import Proptypes from "prop-types";
import classnames from "classnames";
import PerfectScrollbar from "react-perfect-scrollbar";

import { Modal, ModalHeader, ModalBody } from "reactstrap";

const Sidebar = (props) => {
  // ** Props
  const {
    open,
    size,
    title,
    width,
    children,
    closeBtn,
    className,
    doTogglePopup,
    bodyClassName,
    contentClassName,
    wrapperClassName,
    headerClassName,
    ...rest
  } = props;

  // ** If user passes custom close btn render that else default close btn
  const renderCloseBtn = closeBtn ? (
    closeBtn
  ) : (
    <X className="cursor-pointer" size={15} onClick={doTogglePopup} />
  );

  return (
    <Modal
      isOpen={open}
      toggle={doTogglePopup}
      contentClassName={classnames("overflow-hidden", {
        [contentClassName]: contentClassName,
      })}
      modalClassName={classnames("modal-slide-in", {
        [wrapperClassName]: wrapperClassName,
      })}
      className={classnames({
        [className]: className,
        "sidebar-lg": size === "lg",
        "sidebar-sm": size === "sm",
      })}
      /*eslint-disable */
      {...(width !== undefined
        ? {
            style: { width: String(width) + "px" },
          }
        : {})}
      /*eslint-enable */
      {...rest}
    >
      <ModalHeader
        className={classnames({
          [headerClassName]: headerClassName,
        })}
        toggle={doTogglePopup}
        close={renderCloseBtn}
        tag="div"
      >
        <h5 className="modal-title">
          <span className="align-middle">{title}</span>
        </h5>
      </ModalHeader>
      <PerfectScrollbar options={{ wheelPropagation: false }}>
        <ModalBody
          className={classnames("flex-grow-1", {
            [bodyClassName]: bodyClassName,
          })}
        >
          {children}
        </ModalBody>
      </PerfectScrollbar>
    </Modal>
  );
};

export default Sidebar;

// ** PropTypes
Sidebar.propTypes = {
  className: Proptypes.string,
  bodyClassName: Proptypes.string,
  open: Proptypes.bool.isRequired,
  title: Proptypes.string.isRequired,
  contentClassName: Proptypes.string,
  wrapperClassName: Proptypes.string,
  children: Proptypes.any.isRequired,
  size: Proptypes.oneOf(["sm", "lg"]),
  doTogglePopup: Proptypes.func.isRequired,
  width: Proptypes.oneOfType([Proptypes.number, Proptypes.string]),
};
