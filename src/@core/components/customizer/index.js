// ** React Imports
import { useState } from "react";

// ** Third Party Components
import Select from "react-select";
import classnames from "classnames";
import { Settings, X } from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";

// ** Reactstrap Imports
import { Input, Label } from "reactstrap";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";

const Customizer = (props) => {
  // ** Props
  const {
    skin,
    isRtl,
    layout,
    setSkin,
    setIsRtl,
    isHidden,
    setLayout,
    navbarType,
    footerType,
    navbarColor,
    setIsHidden,
    contentWidth,
    menuCollapsed,
    setLastLayout,
    setNavbarType,
    setFooterType,
    setNavbarColor,
    setContentWidth,
    setMenuCollapsed,
  } = props;

  // ** State
  const [openCustomizer, setOpenCustomizer] = useState(false);

  // ** Toggles Customizer
  const handleToggle = (e) => {
    e.preventDefault();
    setOpenCustomizer(!openCustomizer);
  };

  // ** Render Layout Skin Options
  const renderSkinsRadio = () => {
    const skinsArr = [
      {
        name: "light",
        label: "Light",
        checked: skin === "light",
      },
      {
        name: "bordered",
        label: "Bordered",
        checked: skin === "bordered",
      },
      {
        name: "dark",
        label: "Dark",
        checked: skin === "dark",
      },
      {
        name: "semi-dark",
        label: "Semi Dark",
        checked: skin === "semi-dark",
      },
    ];

    return skinsArr.map((radio, index) => {
      const marginCondition = index !== skinsArr.length - 1;

      if (layout === "horizontal" && radio.name === "semi-dark") {
        return null;
      }

      return (
        <div
          key={index}
          className={classnames("form-check", { "mb-2 me-1": marginCondition })}
        >
          <Input
            type="radio"
            id={radio.name}
            checked={radio.checked}
            onChange={() => setSkin(radio.name)}
          />
          <Label className="form-check-label" for={radio.name}>
            {radio.label}
          </Label>
        </div>
      );
    });
  };

  // ** Render Navbar Colors Options
  const renderNavbarColors = () => {
    const colorsArr = [
      "white",
      "primary",
      "secondary",
      "success",
      "danger",
      "info",
      "warning",
      "dark",
    ];

    return colorsArr.map((color) => (
      <li
        key={color}
        className={classnames(`color-box bg-${color}`, {
          selected: navbarColor === color,
          border: color === "white",
        })}
        onClick={() => setNavbarColor(color)}
      ></li>
    ));
  };

  // ** Render Navbar Type Options
  const renderNavbarTypeRadio = () => {
    const navbarTypeArr = [
      {
        name: "floating",
        label: "Floating",
        checked: navbarType === "floating",
      },
      {
        name: "sticky",
        label: "Sticky",
        checked: navbarType === "sticky",
      },
      {
        name: "static",
        label: "Static",
        checked: navbarType === "static",
      },
      {
        name: "hidden",
        label: "Hidden",
        checked: navbarType === "hidden",
      },
    ];

    return navbarTypeArr.map((radio, index) => {
      const marginCondition = index !== navbarTypeArr.length - 1;

      if (layout === "horizontal" && radio.name === "hidden") {
        return null;
      }

      return (
        <div
          key={index}
          className={classnames("form-check", { "mb-2 me-1": marginCondition })}
        >
          <Input
            type="radio"
            id={radio.name}
            checked={radio.checked}
            onChange={() => setNavbarType(radio.name)}
          />
          <Label className="form-check-label" for={radio.name}>
            {radio.label}
          </Label>
        </div>
      );
    });
  };

  // ** Render Footer Type Options
  const renderFooterTypeRadio = () => {
    const footerTypeArr = [
      {
        name: "sticky",
        label: "Sticky",
        checked: footerType === "sticky",
      },
      {
        name: "static",
        label: "Static",
        checked: footerType === "static",
      },
      {
        name: "hidden",
        label: "Hidden",
        checked: footerType === "hidden",
      },
    ];

    return footerTypeArr.map((radio, index) => {
      const marginCondition = index !== footerTypeArr.length - 1;

      return (
        <div
          key={index}
          className={classnames("form-check", { "mb-2 me-1": marginCondition })}
        >
          <Input
            type="radio"
            checked={radio.checked}
            id={`footer-${radio.name}`}
            onChange={() => setFooterType(radio.name)}
          />
          <Label className="form-check-label" for={`footer-${radio.name}`}>
            {radio.label}
          </Label>
        </div>
      );
    });
  };

  return (
    <div
      className={classnames("customizer d-none d-md-block", {
        open: openCustomizer,
      })}
    >
      <a
        href="/"
        className="customizer-toggle d-flex align-items-center justify-content-center"
        onClick={handleToggle}
      >
        <Settings size={14} className="spinner" />
      </a>
      <PerfectScrollbar
        className="customizer-content"
        options={{ wheelPropagation: false }}
      >
        <div className="customizer-header px-2 pt-1 pb-0 position-relative">
          <h4 className="mb-0">Theme Customizer</h4>
          <p className="m-0">Customize & Preview in Real Time</p>
          <a href="/" className="customizer-close" onClick={handleToggle}>
            <X />
          </a>
        </div>

        <hr />

        <div className="px-2">
          <div className="mb-2">
            <p className="fw-bold">Skin</p>
            <div className="d-flex">{renderSkinsRadio()}</div>
          </div>

          <div className="mb-2">
            <p className="fw-bold">Content Width</p>
            <div className="d-flex">
              <div className="form-check me-1">
                <Input
                  type="radio"
                  id="full-width"
                  checked={contentWidth === "full"}
                  onChange={() => setContentWidth("full")}
                />
                <Label className="form-check-label" for="full-width">
                  Full Width
                </Label>
              </div>
              <div className="form-check">
                <Input
                  id="boxed"
                  type="radio"
                  checked={contentWidth === "boxed"}
                  onChange={() => setContentWidth("boxed")}
                />
                <Label className="form-check-label" for="boxed">
                  Boxed
                </Label>
              </div>
            </div>
          </div>

          <div className="form-switch mb-2 ps-0">
            <div className="d-flex">
              <p className="fw-bold me-auto mb-0">RTL</p>
              <Input
                type="switch"
                id="rtl"
                name="RTL"
                checked={isRtl}
                onChange={() => setIsRtl(!isRtl)}
              />
            </div>
          </div>
        </div>

        <hr />

        <div className="px-2">
          <p className="fw-bold">Menu Layout</p>
          <div className="mb-2">
            <div className="d-flex align-items-center">
              <div className="form-check me-1">
                <Input
                  type="radio"
                  id="vertical-layout"
                  checked={layout === "vertical"}
                  onChange={() => {
                    setLayout("vertical");
                    setLastLayout("vertical");
                  }}
                />
                <Label className="form-check-label" for="vertical-layout">
                  Vertical
                </Label>
              </div>
              <div className="form-check">
                <Input
                  type="radio"
                  id="horizontal-layout"
                  checked={layout === "horizontal"}
                  onChange={() => {
                    setLayout("horizontal");
                    setLastLayout("horizontal");
                  }}
                />
                <Label className="form-check-label" for="horizontal-layout">
                  Horizontal
                </Label>
              </div>
            </div>
          </div>
          {layout !== "horizontal" ? (
            <div className="form-switch mb-2 ps-0">
              <div className="d-flex align-items-center">
                <p className="fw-bold me-auto mb-0">Menu Collapsed</p>
                <Input
                  type="switch"
                  id="menu-collapsed"
                  name="menu-collapsed"
                  checked={menuCollapsed}
                  onChange={() => setMenuCollapsed(!menuCollapsed)}
                />
              </div>
            </div>
          ) : null}

          <div className="form-switch mb-2 ps-0">
            <div className="d-flex align-items-center">
              <p className="fw-bold me-auto mb-0">Menu Hidden</p>
              <Input
                type="switch"
                id="menu-hidden"
                name="menu-hidden"
                checked={isHidden}
                onChange={() => setIsHidden(!isHidden)}
              />
            </div>
          </div>
        </div>

        <hr />

        <div className="px-2">
          {layout !== "horizontal" ? (
            <div className="mb-2">
              <p className="fw-bold">Navbar Color</p>
              <ul className="list-inline unstyled-list">
                {renderNavbarColors()}
              </ul>
            </div>
          ) : null}

          <div className="mb-2">
            <p className="fw-bold">
              {layout === "horizontal" ? "Menu" : "Navbar"} Type
            </p>
            <div className="d-flex">{renderNavbarTypeRadio()}</div>
          </div>
        </div>

        <hr />

        <div className="px-2">
          <div className="mb-2">
            <p className="fw-bold">Footer Type</p>
            <div className="d-flex">{renderFooterTypeRadio()}</div>
          </div>
        </div>
      </PerfectScrollbar>
    </div>
  );
};

export default Customizer;
