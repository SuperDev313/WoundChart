// ** Third Party Components
import { MoreHorizontal } from "react-feather";

const VerticalNavMenuSectionHeader = ({ item }) => {
  return (
    <li className="navigation-header">
      <span>{item.header}</span>
      <MoreHorizontal className="feather-more-horizontal" />
    </li>
  );
};

export default VerticalNavMenuSectionHeader;
