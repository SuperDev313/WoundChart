// ** React Imports
import { Fragment } from "react";

// ** Third Party Components
import Proptypes from "prop-types";
import classnames from "classnames";

// ** Reactstrap Imports
import { Spinner } from "reactstrap";

// ** Styles
import "./ui-loader.scss";

const UILoader = (props) => {
  const { children, blocking, loader, className, tag, overlayColor } = props;

  const Tag = tag;

  return (
    <Tag
      className={classnames("ui-loader", {
        [className]: className,
        show: blocking,
      })}
    >
      {children}
      {blocking ? (
        <Fragment>
          <div
            className="overlay" /*eslint-disable */
            {...(blocking && overlayColor
              ? { style: { backgroundColor: overlayColor } }
              : {})}
            /*eslint-enable */
          ></div>
          <div className="loader">{loader}</div>
        </Fragment>
      ) : null}
    </Tag>
  );
};

export default UILoader;

UILoader.defaultProps = {
  tag: "div",
  blocking: false,
  loader: <Spinner color="primary" />,
};

UILoader.propTypes = {
  tag: Proptypes.string,
  loader: Proptypes.any,
  className: Proptypes.string,
  overlayColor: Proptypes.string,
  blocking: Proptypes.bool.isRequired,
};
