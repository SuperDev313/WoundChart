// ** Store Imports
import { handleNavbarType } from "@store/layout";
import { useDispatch, useSelector } from "react-redux";

export const useNavbarType = () => {
  // ** Hooks
  const dispatch = useDispatch();
  const store = useSelector((state) => state.layout);

  const setNavbarType = (type) => {
    dispatch(handleNavbarType(type));
  };

  return { navbarType: store.navbarType, setNavbarType };
};
