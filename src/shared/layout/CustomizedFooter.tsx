import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import UIStore, { FooterOptions } from "shared/stores/UIStore";

interface IProps extends Partial<FooterOptions> {
  // options?: Partial<FooterOptions>;
}

const CustomizedFooter: React.FC<IProps> = observer(({
  children,
  // options = {},
  ...props
}) => {
  useEffect(() => {
    UIStore.setFooter({ ...props, content: children })

    return () => {
      UIStore.setFooter()
    }
  }, [children, props])

  return null;
});

export default CustomizedFooter;
