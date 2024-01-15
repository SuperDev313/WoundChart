//** React Imports
import { useEffect } from "react";

// ** Store & Actions
import { handleRTL } from "@store/layout";
import { useDispatch, useSelector } from "react-redux";

export const useRTL = () => {
  // ** Store Vars
  const dispatch = useDispatch();
  const isRtl = useSelector((state) => state.layout.isRTL);

  // ** Return a wrapped version of useState's setter function
  const setValue = (value) => {
    dispatch(handleRTL(value));
  };

  useEffect(() => {
    // ** Get HTML Tag
    const element = document.getElementsByTagName("html")[0];

    // ** If isRTL then add attr dir='rtl' with HTML else attr dir='ltr'
    if (isRtl) {
      element.setAttribute("dir", "rtl");
    } else {
      element.setAttribute("dir", "ltr");
    }
  }, [isRtl]);

  return [isRtl, setValue];
};
