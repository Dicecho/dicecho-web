import React from "react";
import { observer } from "mobx-react";
import { BrowserRouter, HashRouter, HashRouterProps, BrowserRouterProps } from "react-router-dom";

interface IProps {
  hashProps?: HashRouterProps,
  browserProps?: BrowserRouterProps,
  mode: 'browser' | 'application',
}

const DynamicRouter: React.FC<IProps> = observer(({
  children,
  mode,
  hashProps,
  browserProps,
  ...props
}) => {
  if (mode === 'application') {
    return (
      <HashRouter {...hashProps}>
        {children}
      </HashRouter>
    )
  }

  return (
    <BrowserRouter {...browserProps}>
      {children}
    </BrowserRouter>
  )
});

export default DynamicRouter;
