import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { message, Modal } from 'antd';
import { EVENT_KEYS } from 'shared/constants';
import Approuter from './router';
import SettingStore from '@/shared/stores/SettingStore';
import TagStore from '@/shared/stores/TagStore';
import AuthStore from '@/shared/stores/AuthStore';
import HomePageStore from '@/home/stores/HomePageStore';
import UIStore, { BeforeInstallPromptEvent } from '@/shared/stores/UIStore';
import NotificationStore from '@/shared/stores/NotificationStore';
import { DomainSingleStore } from "@/forum/stores/DomainStore";
import Loading from '@/shared/components/Loading';
import promiseFinally from 'promise.prototype.finally';
import { setUser } from '@/utils/sentry';
import "core-js/features/array/flat-map";
import "animate.css"
import './app.less'


declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

@observer
class App extends Component<any, any> {
  componentDidMount() {
    promiseFinally.shim();
    SettingStore.initGeo();
    TagStore.initStore();
    HomePageStore.initStore();
    DomainSingleStore.fetchRecommendDomainList();

    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      UIStore.setDeferredPrompt(e);
      // Stash the event so it can be triggered later.
      UIStore.setPromptVisible(true);
      // Update UI notify the user they can install the PWA
      // showInstallPromotion();
      // Optionally, send analytics event that PWA install promo was shown.
      // console.log(`'beforeinstallprompt' event was fired.`);
    });
  
    window.addEventListener('appinstalled', () => {
      // Hide the app-provided install promotion
      UIStore.setPromptVisible(false);
      UIStore.setDeferredPrompt(null);
      // Clear the deferredPrompt so it can be garbage collected
      // Optionally, send analytics event to indicate successful install
      console.log('PWA was installed');
    });

    window.addEventListener(
      EVENT_KEYS.UserLogin, 
      () => {
        DomainSingleStore.fetchJoinedDomainList();
        NotificationStore.fetchUnreadNotifications();
        AuthStore.fetchUserData().then((user) => {
          // Tracker.login(userStore.id.toString());
          setUser(user)
          gtag('config', 'G-NNRGNDT9K7', {
            'user_id': user._id,
          });
          // notificationStore.subscribeNotificaiton();
          // discoverStore.refresh();
          // problemStore.refresh();
        })
      }
    )

    window.addEventListener(
      EVENT_KEYS.UserLogout,
      () => {
        message.success('登出成功')
        DomainSingleStore.clearJoinedDomainList();
      },
    )

    window.addEventListener(
      "unhandledrejection",
      (error) => {
        if (error.reason.detail) {
          message.error(error.reason.detail)
        }

        if (error.reason.response && error.reason.response.data?.code === 200002) {
          UIStore.openLoginModal();
        }
      },
    );
  }


  render() {
    if (!AuthStore.initialized) {
      return <Loading />;
    }

    return (
      <Approuter />
    );
  }
}

export default App;
