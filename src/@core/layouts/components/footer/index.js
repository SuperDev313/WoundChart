// ** Icons Import
import { Heart } from "react-feather";

const Footer = () => {
  return (
    <p className="clearfix mb-0">
      <span className="float-md-start d-block d-md-inline-block mt-25">
        COPYRIGHT ©{new Date().getFullYear()}&nbsp;
        <a
          href="https://www.woundcharts.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          WoundCharts
        </a>
        <span className="d-none d-sm-inline-block">, All rights Reserved</span>
      </span>
     
    </p>
  );
};

export default Footer;
