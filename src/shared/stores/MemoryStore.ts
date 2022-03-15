import { observable, action } from 'mobx';
import _ from 'lodash';


class SettingStore {
  @observable stores: Record<string, any> = {};

  @action hasStore = (key: string) => {
    return _.has(this.stores, key);
  }

  @action addStore = (key: string, store: any) => {
    this.stores[key] = store;
  }

  @action removeStore = (key: string) => {
    _.omit(this.stores, [key]);
  }
}

const store = new SettingStore();

export default store;
