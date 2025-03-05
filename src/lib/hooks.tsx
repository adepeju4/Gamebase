import React from "react";

export function useDispatchComp(Comp, props) {
  return <Comp {...props} />;
}
