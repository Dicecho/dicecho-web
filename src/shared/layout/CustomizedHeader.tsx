import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import UIStore, { HeaderOptions } from "shared/stores/UIStore";

interface IProps {
  options?: Partial<HeaderOptions>;
}

const CustomizedHeader: React.FC<IProps> = observer(({
  children,
  options = {},
  ...props
}) => {
  useEffect(() => {
    UIStore.setHeader({ ...options, content: children })

    return () => {
      UIStore.setHeader()
    }
  }, [children, options])

  return null;

  // return (
  //   <HeaderContext.Consumer>
  //     {({ headerOptions, setHeaderOptions }) => {
  //       setHeaderOptions(props.options);
  //       return null;
  //     }}
  //   </HeaderContext.Consumer>
  // )
});

export default CustomizedHeader;
