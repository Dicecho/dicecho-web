import { observable, action } from 'mobx';


class ScrollRestorationStore {
  @observable scrollPosition: number = 0;

  @action setScrollPosition = (value: number) => {
    this.scrollPosition = value;
  }
}

export { ScrollRestorationStore }