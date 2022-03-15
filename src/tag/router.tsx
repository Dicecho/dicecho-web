import React from 'react';
import { observer } from "mobx-react";
import { Route, Switch, RouteComponentProps } from 'react-router-dom';
import TagDetailContainer from './containers/TagDetailContainer'


export default observer((props: RouteComponentProps) => {
  return (
    <Switch>
      <Route path={`${props.match.path}/:name`} component={TagDetailContainer} />
    </Switch>
  )
});
