import React from 'react';
import { observer } from "mobx-react";
import { Route, Switch, RouteComponentProps, Redirect } from 'react-router-dom';
import RateContainer from './containers/RateContainer';
import RateListContainer from './containers/RateListContainer';
import WorkingPage from "@/shared/components/Working";


export default observer((props: RouteComponentProps) => {
  return (
    <Switch>
      <Route path={`${props.match.path}/:uuid`} component={RateContainer} />
      <Route path={`${props.match.path}/`} component={RateListContainer} />
      {/* <Redirect path={`${props.match.path}/`} to='/' /> */}
    </Switch>
  )
});
