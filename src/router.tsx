import React from "react";
import { observer } from "mobx-react";
import { Route, Switch } from "react-router-dom";
import AppLayout from "shared/layout";
import SettingContainer from "shared/containers/SettingContainer";
import DynamicRouter from "shared/components/DynamicRouter";
import ModuleRouter from "@/module/router";
import TagRouter from "@/tag/router";
import AccountRouter from "@/account/router";
import ForumRouter from "@/forum/router";
import ReplayRouter from "@/replay/router";
import NoticeRouter from "@/notice/router";
import RateRouter from "@/rate/router";
import SearchRouter from "@/search/router";
// import EditorDemoContainer from "@/shared/components/RichTextEditor/EditorDemoContainer";
import PlateDemoContainer from "@/shared/components/RichTextEditor/demo";

import CollectionRouter from "@/collection/router";
import AdminLogRouter from "@/adminlog/router";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import UIStore from "@/shared/stores/UIStore";
import { TouchBackend } from "react-dnd-touch-backend";
import WorkingPage, { Maintaining } from "@/shared/components/Working";
import { PermissionRoute } from "@/shared/components/CustomRoute";
import LandingPageContainer from "@/home/containers/LandingPageContainer";
import HomePageContainer from "@/home/containers/HomePageContainer";
import ManagerContainer from "@/manager/containers/ManagerContainer";
import AuthStore from "./shared/stores/AuthStore";
import SettingStore from "./shared/stores/SettingStore";

@observer
class AppRouter extends React.Component<any, any> {
  render() {
    return (
      <DndProvider backend={UIStore.isMobile ? TouchBackend : HTML5Backend}>
        <DynamicRouter mode={SettingStore.mode}>
          <Switch>
            <PermissionRoute
              hasPermisson={AuthStore.checkRole("superuser")}
              path="/manager"
              component={ManagerContainer}
            />
            <AppLayout>
              {/* <Switch> */}
              {/* <Route exact path="/home" component={CharacterRouter} /> */}
              {/* <Route exact path="/module/:uuid" component={ModuleDetailContainer} />
                <Route exact path="/module" component={ModuleContainer} /> */}
              {/* <Route exact path="/replay" component={WorkingPage} /> */}
              {/* <Route path="/editor-demo" component={EditorDemoContainer} /> */}
              <Route path="/plate-demo" component={PlateDemoContainer} />
              <Route path="/rate" component={RateRouter} />
              <Route path="/replay" component={ReplayRouter} />
              <Route path="/notice" component={NoticeRouter} />
              <Route path="/forum" component={ForumRouter} />
              <Route path="/account" component={AccountRouter} />
              <Route path="/module" component={ModuleRouter} />
              <Route path="/tag" component={TagRouter} />
              <Route path="/search" component={SearchRouter} />
              <Route path="/setting" component={SettingContainer} />
              <Route path="/logs" component={AdminLogRouter} />
              <Route path="/collection" component={CollectionRouter} />
              <Route
                exact
                path="/"
                component={
                  // AuthStore.isAuthenticated
                  HomePageContainer
                  // : LandingPageContainer
                }
              />
              {/* </Switch> */}
            </AppLayout>
          </Switch>
        </DynamicRouter>
      </DndProvider>
    );
  }
}

export default AppRouter;
