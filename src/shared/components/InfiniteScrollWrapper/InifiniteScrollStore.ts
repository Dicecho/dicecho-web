import { observable } from 'mobx';


class InifiniteScrollStore {
  @observable total: number = 0;
  @observable page: number = 1;
  @observable data: Array<any> = [];
  @observable hasNext: boolean = false;
  @observable initialized: boolean = false;

  @observable lastQuery: any = {};
}

export { InifiniteScrollStore }