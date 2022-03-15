import { action, computed } from 'mobx';
import AuthStore from './AuthStore';
import UIStore from './UIStore';

class CommonStore {
  @computed get initialized() {
    return true;
  }

  @action initApp = () => {
  }

  @action resetApp = () => {
    AuthStore.reset();
    UIStore.reset();
    this.reset();
  }

  @action logout = () => {
    return AuthStore.logout().then(() => {
      this.resetApp();
    }); 
  }

  @action reset = () => {
  }
}

const store = new CommonStore();

export default store;
