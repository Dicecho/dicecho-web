import React from 'react';
import { observer } from "mobx-react";
import { Route, Switch, RouteComponentProps } from 'react-router-dom';
import ModuleContainer from './containers/ModuleContainer'
import ModuleDetailContainer from './containers/ModuleDetailContainer'
import SubmissionMod from './containers/SubmissionMod'
import AdditionMod from './containers/AdditionMod'
import { PrivateRoute } from '@/shared/components/CustomRoute';



export default observer((props: RouteComponentProps) => {
  return (
    <Switch>
      <PrivateRoute path={`${props.match.path}/addition`} component={AdditionMod} />
      <PrivateRoute path={`${props.match.path}/submission`} component={SubmissionMod} />
      <Route path={`${props.match.path}/:uuidOrTitle`} component={ModuleDetailContainer} />
      <Route path={`${props.match.path}/`} component={ModuleContainer} />
    </Switch>
  )
});
