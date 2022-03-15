import React from 'react';
import { observer } from "mobx-react";
import { Route, Switch, RouteComponentProps } from 'react-router-dom';
import ForumContainer from './containers/ForumContainer';
import TopicContainer from './containers/TopicContainer';
import DomainContainer from './containers/DomainContainer';
import WorkingPage from "@/shared/components/Working";


export default observer((props: RouteComponentProps) => {
  return (
    <Switch>
      <Route path={`${props.match.path}/category/:uuid`} component={WorkingPage} />
      <Route path={`${props.match.path}/domain/:uuid`} component={DomainContainer} />
      <Route path={`${props.match.path}/topic/:uuid`} component={TopicContainer} />
      <Route path={`${props.match.path}/`} exact component={ForumContainer} />
    </Switch>
  )
});
