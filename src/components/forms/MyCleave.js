import React, { useRef, useImperativeHandle, forwardRef } from "react";
import Cleave from "cleave.js/react";

function MyCleave(props, ref) {
  const cleaveRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      //console.log(`fake focus`);
    }
  }));
  return (
    <Cleave ref={cleaveRef} {...props}></Cleave>
  );
}

export default forwardRef(MyCleave);