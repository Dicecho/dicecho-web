import { action, observable } from "mobx";
import { HTMLAttributes, ReactNode } from "react";
import { EVENT_KEYS } from "shared/constants";

export interface HeaderOptions {
  layoutProps: Omit<HTMLAttributes<HTMLDivElement>, "title">;
  content: ReactNode;
  transparent: boolean;
  visible: boolean;
}

export interface FooterOptions {
  content: ReactNode;
  visible: boolean;
  className: string;
}

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

class UIStore {
  @observable initial = true;
  @observable promptVisible = false;
  @observable deferredPrompt: BeforeInstallPromptEvent | null = null;

  @observable loginModalVisible = false;
  @observable theme: "light" | "dark" = "dark";

  @observable isMobile = window.matchMedia("(max-width: 767px)").matches;

  @observable searchVisible = true;
  @observable searchText: string = "";

  @observable headerOptions: Partial<HeaderOptions> = {};
  @observable footerOptions: Partial<FooterOptions> = {};

  constructor() {
    window
      .matchMedia("(max-width: 767px)")
      .addListener((e) => (this.isMobile = Boolean(e.matches)));
  }

  @action swtichTheme = () => {
    this.theme = this.theme === "light" ? "dark" : "light";
  };

  handleLoginSuccess: EventListenerOrEventListenerObject = () => {};

  @action openLoginModal = (option?: { callBack?: Function }) => {
    this.loginModalVisible = true;

    if (option && option.callBack) {
      const fn = option.callBack;
      this.handleLoginSuccess = () => {
        fn();
        window.removeEventListener(
          EVENT_KEYS.UserLogin,
          this.handleLoginSuccess
        );
      };

      window.addEventListener(EVENT_KEYS.UserLogin, this.handleLoginSuccess);
    }
  };
  @action closeLoginModal = () => {
    this.loginModalVisible = false;
    window.removeEventListener(EVENT_KEYS.UserLogin, this.handleLoginSuccess);
    this.handleLoginSuccess = () => {};
  };

  @action setHeader = (headerOptions: Partial<HeaderOptions> = {}) => {
    this.headerOptions = headerOptions;
  };

  @action setFooter = (footerOptions: Partial<FooterOptions> = {}) => {
    this.footerOptions = footerOptions;
  };

  @action setSearchText = (value?: string) => {
    this.searchText = value || "";
  };

  @action setSearchVisible = (value: boolean) => {
    this.searchVisible = value;
  };

  @action setPromptVisible = (value: boolean) => {
    this.promptVisible = value;
  };

  @action setDeferredPrompt = (value: BeforeInstallPromptEvent | null) => {
    this.deferredPrompt = value;
  };

  @action reset = () => {
    this.initial = true;
    this.loginModalVisible = false;
    this.theme = "dark";
  };
}

const store = new UIStore();

export default store;
