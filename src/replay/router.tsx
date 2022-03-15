import React from 'react';
import { observer } from "mobx-react";
import { Route, Switch, RouteComponentProps } from 'react-router-dom';
import ReplayContainer from './containers/ReplayContainer';
import ReplayListContainer from './containers/ReplayListContainer';
import WorkingPage from "@/shared/components/Working";


export default observer((props: RouteComponentProps) => {
  return (
    <Switch>
      <Route path={`${props.match.path}/:bvid`} component={ReplayContainer} />
      <Route path={`${props.match.path}/`} exact component={ReplayListContainer} />
    </Switch>
  )
});
