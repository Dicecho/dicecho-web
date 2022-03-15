import React from 'react';
import { observer } from "mobx-react";
import { Route, Switch, RouteComponentProps } from 'react-router-dom';
import AdminLogContainer from './containers/AdminLogContainer';


export default observer((props: RouteComponentProps) => {
  return (
    <Switch>
      <Route path={`${props.match.path}/`} component={AdminLogContainer} />
    </Switch>
  )
});
