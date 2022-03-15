import { observable, action } from 'mobx';
import { STORAGE_KEYS } from "shared/constants/storage";
import { getGeoInfo } from '@/utils/geo';


class SettingStore {
  @observable mode: 'browser' | 'application' = (localStorage.getItem(STORAGE_KEYS.AppMode) as 'browser' | 'application') || 'browser'
  @observable rateAvailable: boolean = localStorage.getItem(STORAGE_KEYS.RateAvailable) !== 'false'
  @observable rateScoreAvailable: boolean = localStorage.getItem(STORAGE_KEYS.RateScoreAvailable) !== 'false'

  @observable countryCode: string = ''
  @observable countryName: string = ''

  @action setMode = (mode: 'browser' | 'application') => {
    this.mode = mode;
    localStorage.setItem(STORAGE_KEYS.AppMode, mode)
  }

  @action initGeo = () => {
    getGeoInfo().then((res) => {
      this.countryCode = res.data.country_code
      this.countryName = res.data.country_name
      if (this.countryCode === 'JP' && localStorage.getItem(STORAGE_KEYS.RateScoreAvailable) === undefined) {
        this.rateScoreAvailable = false;
      }
    })
  }

  @action setRateScoreAvailable = (value: boolean) => {
    this.rateScoreAvailable = value;
    localStorage.setItem(STORAGE_KEYS.RateScoreAvailable, value.toString())
  }

  @action setRateAvailable = (value: boolean) => {
    this.rateAvailable = value;
    localStorage.setItem(STORAGE_KEYS.RateAvailable, value.toString())
  }
}

const store = new SettingStore();

export default store;
