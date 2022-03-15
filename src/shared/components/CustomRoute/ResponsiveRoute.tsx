import React from 'react';
import { observer } from "mobx-react";
import { Route, Redirect, RouteProps, RouteComponentProps } from 'react-router-dom';
import UIStore from '@/shared/stores/UIStore';

interface IProps extends RouteProps {
  mobileComponent: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
};

const ResponsiveRoute: React.FunctionComponent<IProps> = observer(({ mobileComponent, ...props }) => {

  if (UIStore.isMobile) {
    return (<Route {...props} component={mobileComponent} />)
  }

  return <Route {...props} />
})

export default ResponsiveRoute;