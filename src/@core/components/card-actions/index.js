// ** React Imports
import { Fragment, useState, useEffect } from "react";

// ** Third Party Components
import PropTypes from "prop-types";
import classnames from "classnames";
import UiLoader from "@components/ui-loader";
import { ChevronDown, RotateCw, X } from "react-feather";

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, Collapse } from "reactstrap";

const CardActions = (props) => {
  // ** Props
  const {
    title,
    actions,
    children,
    collapseIcon,
    reloadIcon,
    removeIcon,
    endReload,
  } = props;

  // ** States
  const [reload, setReload] = useState(false);
  const [collapse, setCollapse] = useState(true);
  const [visibility, setVisibility] = useState(true);

  /**
   ** If custom icon is defined then consider that else default icons
   */
  const Icons = {
    collapse: collapseIcon ? collapseIcon : ChevronDown,
    remove: removeIcon ? removeIcon : X,
    reload: reloadIcon ? reloadIcon : RotateCw,
  };

  // ** Action to call
  const callAction = (action) => {
    switch (action) {
      case "collapse":
        return setCollapse(!collapse);
      case "remove":
        return setVisibility(false);
      case "reload":
        return setReload(true);
      default:
    }
  };

  // ** Renders card actions
  const renderIcons = () => {
    /**
     ** IF: user passes array of actions then loop through them & render all of the actions
     ** ELSE: render single action
     */

    if (Array.isArray(actions)) {
      return actions.map((action, i) => {
        const Tag = Icons[action];
        return (
          <Tag
            key={i}
            className={classnames("cursor-pointer", {
              "me-50": i < actions.length - 1,
            })}
            size={15}
            onClick={() => callAction(action)}
          />
        );
      });
    } else {
      const Tag = Icons[actions];
      return (
        <Tag
          className="cursor-pointer"
          size={15}
          onClick={() => callAction(actions)}
        />
      );
    }
  };

  // ** Ends reload
  const removeReload = () => {
    setReload(false);
  };

  // ** If user passes endReload function call it.
  useEffect(() => {
    if (reload) {
      endReload(removeReload);
    }
  });

  // ** If user passes collapse action then return <Collapse> as Wrapper else return <Fragment>
  const CollapseWrapper =
    actions === "collapse" || actions.includes("collapse")
      ? Collapse
      : Fragment;

  // ** If user passes reload action then return <BlockUi> as Wrapper else return <Fragment>
  const BlockUiWrapper =
    actions === "reload" || actions.includes("reload") ? UiLoader : Fragment;

  return (
    <BlockUiWrapper
      /*eslint-disable */
      {...(actions === "reload" || actions.includes("reload")
        ? {
            blocking: reload,
          }
        : {})}
      /*eslint-enable */
    >
      <Card
        className={classnames("card-action", {
          "d-none": !visibility,
        })}
      >
        <CardHeader>
          <CardTitle tag="h4">{title}</CardTitle>
          <div className="action-icons">{renderIcons()}</div>
        </CardHeader>
        <CollapseWrapper
          {...(actions === "collapse" || actions.includes("collapse")
            ? { isOpen: collapse }
            : {})}
        >
          {children}
        </CollapseWrapper>
      </Card>
    </BlockUiWrapper>
  );
};

export default CardActions;

// ** PropTypes
CardActions.propTypes = {
  removeIcon: PropTypes.any,
  reloadIcon: PropTypes.any,
  collapseIcon: PropTypes.any,
  title: PropTypes.string.isRequired,
  actions: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  endReload(props) {
    // ** User passes reload action and doesn't pass endReload then return Error
    if (
      (props["actions"] === "reload" && props["endReload"] === undefined) ||
      (props["actions"].includes("reload") && props["endReload"] === undefined)
    ) {
      return new Error("Please provide a function to end reload!");
    }
  },
};
