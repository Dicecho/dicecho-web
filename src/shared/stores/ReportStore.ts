import { observable, action, computed } from 'mobx';
import _ from 'lodash';
import BaseProvider from '@/utils/BaseProvider';

export enum ReportClassification {
  // 法律
  Illegal = 'illegal', // 违反法规
  Pornographic = 'pornographic', // 色情
  Gamble = 'gamble', // 赌博诈骗

  // 侵犯个人权益
  PersonalAttack = 'personalattack', // 人身攻击
  Privacy = 'privacy', // 侵犯隐私

  // 有害社区环境
  Spam = 'spam', // 垃圾广告/刷屏

  // other
  Spoiler = 'spoiler',                // 剧透
  Invalid = 'invalid',              // 无效
}

class ReportStore {
  @observable appealModalVisible = false;
  @observable appealTargetName = '';
  @observable appealTargetId = '';

  @action report(data: {
    targetName: string,
    targetId: string,
    classification: ReportClassification,
    reason: string,
  }) {
    return BaseProvider.post('/api/report', data)
  }

  @action appeal(data: {
    targetName: string,
    targetId: string,
    reason: string,
  }) {
    return BaseProvider.post('/api/report/appeal', data)
  }

  @action openAppealModal(target: string, targetId: string) {
    this.appealTargetName = target;
    this.appealTargetId = targetId;
    this.appealModalVisible = true;
  }

  @action closeAppealModal() {
    this.appealModalVisible = false;
  }
}

export default new ReportStore();
