import React from 'react';
import { observer } from "mobx-react";
import { Route, Redirect, Switch, RouteComponentProps } from 'react-router-dom';
import ResetPassword from './containers/ResetPassword'
import VertifyAccount from './containers/VertifyAccount'
import AccountContainer from './containers/AccountContainer'
import NotificationContainer from './containers/NotificationContainer'
import DefaultAccount from './containers/DefaultAccount'
import AccountMobileAvatar from './containers/AccountMobileAvatar'
import AccountMobileProfile from './containers/AccountMobileProfile';
import AccountMobilePassword from './containers/AccountMobilePassword';
import AccountMobileSetting from './containers/AccountMobileSetting';
import AccountMobileBlock from './containers/AccountMobileBlock';

import AuthStore from '@/shared/stores/AuthStore';
import { PrivateRoute } from '@/shared/components/CustomRoute';


export default observer((props: RouteComponentProps) => {
  return (
    <Switch>
      <PrivateRoute path={`${props.match.path}/setting/change-password`} component={AccountMobilePassword} />
      <PrivateRoute path={`${props.match.path}/setting/profile`} component={AccountMobileProfile} />
      <PrivateRoute path={`${props.match.path}/setting/block`} component={AccountMobileBlock} />
      <PrivateRoute path={`${props.match.path}/setting/avatar`} component={AccountMobileAvatar} />
      <PrivateRoute path={`${props.match.path}/setting`} component={AccountMobileSetting} />
      <Route path={`${props.match.path}/forget`} component={ResetPassword} />
      <Route path={`${props.match.path}/vertify`} component={VertifyAccount} />
      <Route path={`${props.match.path}/notification`} component={NotificationContainer} />
      <Route path={`${props.match.path}/:uuid`} component={AccountContainer} />
      {AuthStore.isAuthenticated &&
        <Redirect exact from={`${props.match.path}`} to={`${props.match.path}/${AuthStore.user._id}`}/>
      }
      <Route exact path={`${props.match.path}`} component={DefaultAccount} />
    </Switch>
  )
});
