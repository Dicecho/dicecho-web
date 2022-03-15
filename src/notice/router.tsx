import React from 'react';
import { observer } from "mobx-react";
import { Route, Switch, RouteComponentProps } from 'react-router-dom';
import AboutNotice from './containers/AboutNotice';
import RuleNotice from './containers/RuleNotice';
import DevelopNotice from './containers/DevelopNotice';
import TermNotice from './containers/TermNotice';
import RateRuleNotice from './containers/RateRuleNotice';
import ArticleNotice from './containers/ArticleNotice';
import CopyrightNotice from './containers/CopyrightNotice';
import WorkingPage from "@/shared/components/Working";


export default observer((props: RouteComponentProps) => {
  return (
    <Switch>
      <Route path={`${props.match.path}/copyright`} component={CopyrightNotice} />
      <Route path={`${props.match.path}/article`} component={ArticleNotice} />
      <Route path={`${props.match.path}/rule`} component={RuleNotice} />
      <Route path={`${props.match.path}/about`} component={AboutNotice} />
      <Route path={`${props.match.path}/develop`} component={DevelopNotice} />
      <Route path={`${props.match.path}/rate`} component={RateRuleNotice} />
      <Route path={`${props.match.path}/terms`} component={TermNotice} />
      <Route path={`${props.match.path}/`} component={RuleNotice} />
    </Switch>
  )
});
