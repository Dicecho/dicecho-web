import React from 'react';
import { observer } from "mobx-react";
import { Route, Redirect, Switch, RouteComponentProps } from 'react-router-dom';
import CollectionDetailContainer from './containers/CollectionDetailContainer';
import CollectionEditContainer from './containers/CollectionEditContainer';

export default observer((props: RouteComponentProps) => {
  return (
    <Switch>
      <Route path={`${props.match.path}/:uuid/edit`} component={CollectionEditContainer} />
      <Route path={`${props.match.path}/:uuid`} component={CollectionDetailContainer} />
    </Switch>
  )
});
