// ** React Imports
import { Fragment, useState, forwardRef } from "react";

// ** Third Party Components
import PropTypes from "prop-types";
import classnames from "classnames";
import { Eye, EyeOff } from "react-feather";

// ** Reactstrap Imports
import { InputGroup, Input, InputGroupText, Label } from "reactstrap";

const InputPasswordToggle = forwardRef((props, ref) => {
  // ** Props
  const {
    label,
    hideIcon,
    showIcon,
    visible,
    className,
    htmlFor,
    placeholder,
    iconSize,
    inputClassName,
    invalid,
    ...rest
  } = props;

  // ** State
  const [inputVisibility, setInputVisibility] = useState(visible);

  // ** Renders Icon Based On Visibility
  const renderIcon = () => {
    const size = iconSize ? iconSize : 14;

    if (inputVisibility === false) {
      return hideIcon ? hideIcon : <Eye size={size} />;
    } else {
      return showIcon ? showIcon : <EyeOff size={size} />;
    }
  };

  return (
    <Fragment>
      {label ? (
        <Label className="form-label" for={htmlFor}>
          {label}
        </Label>
      ) : null}
      <InputGroup
        className={classnames({
          [className]: className,
          "is-invalid": invalid,
        })}
      >
        <Input
          ref={ref}
          invalid={invalid}
          type={inputVisibility === false ? "password" : "text"}
          placeholder={placeholder ? placeholder : "············"}
          className={classnames({
            [inputClassName]: inputClassName,
          })}
          /*eslint-disable */
          {...(label && htmlFor
            ? {
                id: htmlFor,
              }
            : {})}
          {...rest}
          /*eslint-enable */
        />
        <InputGroupText
          className="cursor-pointer"
          onClick={() => setInputVisibility(!inputVisibility)}
        >
          {renderIcon()}
        </InputGroupText>
      </InputGroup>
    </Fragment>
  );
});

export default InputPasswordToggle;

// ** PropTypes
InputPasswordToggle.propTypes = {
  invalid: PropTypes.bool,
  hideIcon: PropTypes.node,
  showIcon: PropTypes.node,
  visible: PropTypes.bool,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  iconSize: PropTypes.number,
  inputClassName: PropTypes.string,
  label(props, propName) {
    // ** If label is defined and htmlFor is undefined throw error
    if (props[propName] && props["htmlFor"] === "undefined") {
      throw new Error("htmlFor prop is required when label prop is present");
    }
  },
  htmlFor(props, propName) {
    // ** If htmlFor is defined and label is undefined throw error
    if (props[propName] && props["label"] === "undefined") {
      throw new Error("label prop is required when htmlFor prop is present");
    }
  },
};

// ** Default Props
InputPasswordToggle.defaultProps = {
  visible: false,
};
