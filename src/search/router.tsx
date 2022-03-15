import React from 'react';
import { observer } from "mobx-react";
import { Route, Switch, RouteComponentProps, Redirect } from 'react-router-dom';
import SearchContainer from '@/search/containers/SearchContainer'


export default observer((props: RouteComponentProps) => {
  return (
    <Switch>
      <Route path={`${props.match.path}/`} component={SearchContainer} />
    </Switch>
  )
});
