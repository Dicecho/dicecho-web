import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react";
import { toJS } from 'mobx'; 
import { Editable, Slate } from 'slate-react';
import { IRateDto } from "interfaces/shared/api";
import { STORAGE_KEYS } from "shared/constants/storage";
import {
  Modal,
  Button,
  ButtonProps,
  Rate,
  Checkbox,
  Alert,
  Tabs,
} from "antd";
import {
  StarFilled,
  GlobalOutlined,
  UnlockOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  CrownOutlined,
  CarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { RichSelect } from '@/shared/components/RichSelect';
import { MarkdownEditor, Vditor } from "@/shared/components/MarkdownEditor";
import ResponsiveModal from "@/shared/components/ResponsiveModal";
import { RichTextEditor } from '@/shared/components/RichTextEditor';
import { PostRateDto, RateView, RateType, AccessLevel, RemarkContentType } from "@/rate/interfaces";
import RateRuleText from "@/notice/components/RateRuleText";
import UIStore from "@/shared/stores/UIStore";
import styles from "./RatePostModal.module.less";
const { TabPane } = Tabs;

interface IProps {
  visible: boolean;
  postKey: string;
  rate?: IRateDto;
  type?: RateType;
  onCancel: () => void;
  onSend: (dto: PostRateDto) => Promise<void>;
  BtnText?: string;
}


export const RATE_VIEW_MAP = {
  [RateView.PL]: "玩家视角",
  [RateView.KP]: "主持人视角",
  [RateView.OB]: "观战视角",
};

const RateDescription = [
  "纯属浪费时间",
  "可取之处不多",
  "值得一玩",
  "瑕不掩瑜的佳作",
  "不可错过的神作",
];

const AccessLevelOptions = [
  {
    key: AccessLevel.Public,
    icon: GlobalOutlined,
    title: '公开',
    description: '所有人可见，且会出现在公共时间轴上',
  },
  {
    key: AccessLevel.Private,
    icon: UnlockOutlined,
    title: '不公开',
    description: '所有人可见，但只会出现在个人时间轴上',
  }
]

const ViewOptions = [
  {
    key: RateView.PL.toString(),
    icon: UserOutlined,
    title: '玩家视角',
    description: '作为玩家游玩了游戏',
  },
  {
    key: RateView.KP.toString(),
    icon: CrownOutlined,
    title: '主持人视角',
    description: '作为主持人主持了游戏',
  },
  {
    key: RateView.OB.toString(),
    icon: CarOutlined,
    title: '观战视角',
    description: '作为观战者旁观了游戏或仅看过模组',
  }
]

const IsAnonymousOptions = [
  {
    key: 'true',
    icon: EyeInvisibleOutlined,
    title: '匿名',
  },
  {
    key: 'false',
    icon: EyeOutlined,
    title: '显示账户昵称',
  }
]

const RatePostModal: React.FunctionComponent<IProps> = observer((props) => {
  const [rate, setRate] = useState(props.rate ? props.rate.rate : 0);
  const [type, setType] = useState(props.rate?.type || props.type || RateType.Rate);
  const [richTextState, setRichTextState] = useState(props.rate ? props.rate.richTextState : []);
  const [remarkType, setRemarkType] = useState(props.rate ? props.rate.remarkType : RemarkContentType.Richtext);
  const [remark, setRemark] = useState(props.rate ? props.rate.remark : "");
  const [accessLevel, setAccessLevel] = useState(props.rate ? props.rate.accessLevel : AccessLevel.Public);
  const [isAnonymous, setIsAnonymous] = useState(
    props.rate ? props.rate.isAnonymous : false
  );
  const [ruleVisible, setRuleVisible] = useState(false);
  const [isRead, setIsRead] = useState<boolean>(
    localStorage.getItem(STORAGE_KEYS.RateIsRead) === "true"
  );
  const [view, setView] = useState<RateView>(
    props.rate
      ? props.rate.view
      : parseInt(localStorage.getItem(STORAGE_KEYS.RateView) || "0")
  );
  const [alertVisible, setAlertVisible] = useState(true);
  const [cachedValue, setCachedValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const editorRef = useRef<Vditor>(null);

  useEffect(() => {
    if (isRead) {
      localStorage.setItem(STORAGE_KEYS.RateIsRead, "true");
    } else {
      localStorage.setItem(STORAGE_KEYS.RateIsRead, "false");
    }
  }, [isRead]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RateView, view.toString());
  }, [view]);

  useEffect(() => {
    setRate(props.rate ? props.rate.rate : 0);
    setRemark(props.rate ? props.rate.remark : "");
    setIsAnonymous(props.rate ? props.rate.isAnonymous : false);
    setAccessLevel(props.rate ? props.rate.accessLevel : AccessLevel.Public)
    setView(
      props.rate
        ? props.rate.view
        : parseInt(localStorage.getItem(STORAGE_KEYS.RateView) || "0")
    );
    setRichTextState(props.rate ? props.rate.richTextState : []);
    setRemarkType(props.rate ? props.rate.remarkType : RemarkContentType.Richtext);
  }, [props.rate]);

  useEffect(() => {
    setType(props.rate?.type || props.type || RateType.Rate);
  }, [props.rate, props.type]);

  useEffect(() => {
    if (props.rate) {
      setCachedValue(
        localStorage.getItem(
          `${STORAGE_KEYS.RateRemarkUpdate}:${props.rate._id}`
        ) || ""
      );
    }
    setCachedValue(
      localStorage.getItem(`${STORAGE_KEYS.RateRemarkEdit}:${props.postKey}`) ||
        ""
    );
  }, [props.rate, props.postKey]);

  const setValue = (value: string) => {
    if (props.rate) {
      localStorage.setItem(
        `${STORAGE_KEYS.RateRemarkUpdate}:${props.rate._id}`,
        value
      );
    } else {
      localStorage.setItem(
        `${STORAGE_KEYS.RateRemarkEdit}:${props.postKey}`,
        value
      );
    }
    setRemark(value);
  };

  const renderSendBtn = (btnProps?: ButtonProps) => {
    return (
      <Button
        type="primary"
        disabled={type === RateType.Rate ? !isRead : false}
        loading={submitting}
        onClick={() => {
          if (submitting) {
            return;
          }
          setSubmitting(true);
          props
            .onSend({ 
              rate,
              remark,
              isAnonymous,
              view,
              type,
              accessLevel,
              richTextState: JSON.stringify(richTextState),
              remarkType,
            })
            .then(() => {
              if (props.rate) {
                localStorage.setItem(
                  `${STORAGE_KEYS.RateRemarkUpdate}:${props.rate._id}`,
                  ""
                );
              } else {
                localStorage.setItem(
                  `${STORAGE_KEYS.RateRemarkEdit}:${props.postKey}`,
                  ""
                );
              }
              props.onCancel();
            })
            .finally(() => {
              setSubmitting(false);
            });
        }}
        {...btnProps}
      >
        发布
      </Button>

    )
  }

  const renderOptions = () => (
    <React.Fragment>
      <div style={{ marginRight: 8 }}>
        <RichSelect
          options={AccessLevelOptions}
          activeKey={accessLevel}
          onSelect={(key) => setAccessLevel(key as AccessLevel)}
          hint
          hintKey={'AccessLevel'}
        >
          {(() => {
            const active = AccessLevelOptions.find(option => option.key === accessLevel) || AccessLevelOptions[0];
            return (
              <div>
                <active.icon className={styles.richSelectDisplay} />
              </div>
            )
          })()}
        </RichSelect>
      </div>

      <div style={{ marginRight: 8 }}>
        <RichSelect
          options={IsAnonymousOptions}
          activeKey={isAnonymous.toString()}
          onSelect={(key) => setIsAnonymous(key === 'true')}
          hint
          hintKey={'isAnonymous'}
        >
          {(() => {
            const active = IsAnonymousOptions.find(option => option.key === isAnonymous.toString()) || IsAnonymousOptions[0];
            return (
              <div>
                <active.icon className={styles.richSelectDisplay} />
              </div>
            )
          })()}
        </RichSelect>
      </div>

      <div style={{ marginRight: 8 }}>
        <RichSelect
          options={ViewOptions}
          activeKey={view.toString()}
          onSelect={(key) => setView(parseInt(key.toString()) as RateView)}
          hint
          hintKey={'View'}
        >
          {(() => {
            const active = ViewOptions.find(option => option.key === view.toString()) || ViewOptions[0];
            return (
              <div>
                <active.icon className={styles.richSelectDisplay} />
              </div>
            )
          })()}
        </RichSelect>
      </div>
    </React.Fragment>
  )

  const renderFooter = () => {
    if (type === RateType.Mark) {
      if (UIStore.isMobile) {
        return null;
      }

      return (
        <div style={{ textAlign: 'right' }}>
          {renderSendBtn()}
        </div>
      )
    }

    if (UIStore.isMobile) {
      return (
        <div className={styles.options}>
          {renderOptions()}
          <Checkbox
            checked={isRead}
            onChange={(e) => setIsRead(e.target.checked)}
            style={{ marginLeft: 'auto' }}
          >
            我已经阅读了<a onClick={() => setRuleVisible(true)}>评价规则</a>
          </Checkbox>
        </div>
      );
    }

    return (
      <div className={styles.footer}>
        {renderOptions()}
        <Checkbox
          checked={isRead}
          onChange={(e) => setIsRead(e.target.checked)}
          style={{ marginLeft: "auto", marginRight: 8 }}
        >
          我已经阅读了<a onClick={() => setRuleVisible(true)}>评价规则</a>
        </Checkbox>
        {renderSendBtn()}
      </div>
    );
  };

  return (
    <React.Fragment>
      <ResponsiveModal
        modalProps={{
          visible: props.visible,
          onCancel: props.onCancel,
          title: (
            <Tabs
              className={styles.rateTabs}
              defaultActiveKey={type.toString()}
              activeKey={type.toString()}
              onChange={(key) => setType(parseInt(key) as RateType)}
            >
              <TabPane tab="玩过" key={RateType.Rate} />
              <TabPane tab="想玩" key={RateType.Mark} />
            </Tabs>
          ),
          footer: null,
          className: styles.rateModal,
          closable: false,
          width: 640,
          centered: true,
          destroyOnClose: true,
        }}
        drawerProps={{
          placement: "bottom",
          visible: props.visible,
          closable: false,
          onClose: props.onCancel,
          height: "90vh",
          className: styles.rateDrawer,
          title: (
            <React.Fragment>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Button type='text' style={{ padding: 0 }} onClick={props.onCancel}>
                  取消
                </Button>
                {renderSendBtn({
                  type: 'text',
                  style: { marginLeft: "auto", padding: 0 },
                })}
              </div>

              <Tabs
                className={styles.mobileTabs}
                defaultActiveKey={type.toString()}
                activeKey={type.toString()}
                onChange={(key) => setType(parseInt(key) as RateType)}
              >
                <TabPane tab="玩过" key={RateType.Rate} />
                <TabPane tab="想玩" key={RateType.Mark} />
              </Tabs>
            </React.Fragment>
          ),
        }}
      >
        {type === RateType.Rate &&
          <div style={{ marginBottom: 16 }}>
            <Rate
              value={rate / 2}
              allowHalf
              allowClear={true}
              onChange={(value) => setRate(value * 2)}
              character={<StarFilled style={{ fontSize: "1.5rem" }} />}
            />
            <span className={styles.rateText} style={{ marginLeft: 32 }}>
              {rate ? (
                RateDescription[Math.round(rate / 2) - 1]
              ) : (
                "点击星星评分"
              )}
            </span>
          </div>
        }
        {cachedValue !== "" && alertVisible && (
          <Alert
            style={{ marginBottom: 16 }}
            message="有一份草稿箱中的内容，是否加载？"
            action={
              <Button
                type="link"
                onClick={() => {
                  setValue(cachedValue);
                  editorRef.current?.setValue(cachedValue);
                  setAlertVisible(false);
                }}
              >
                加载
              </Button>
            }
            onClose={() => {
              if (props.rate) {
                localStorage.setItem(
                  `${STORAGE_KEYS.RateRemarkUpdate}:${props.rate._id}`,
                  ""
                );
              } else {
                localStorage.setItem(
                  `${STORAGE_KEYS.RateRemarkEdit}:${props.postKey}`,
                  ""
                );
              }
              setCachedValue("");
            }}
            closable
            type="info"
          />
        )}

        {remarkType === RemarkContentType.Richtext 
          ? <RichTextEditor
              id={`rate-richtext-editor-${props.postKey}`}
              initialValue={toJS(richTextState)}
              onChange={setRichTextState}
              editableProps={{
                className: styles.editor,
                style: { marginBottom: 16 },
                placeholder: "（*选填）写下体验、感想、评测或记录。提醒您注意勾选上方对应按钮（剧透请收入折叠块内），请保持善意，严禁人身攻击",
              }}
            />
          : <MarkdownEditor
              ref={editorRef}
              defaultValue={remark}
              onChange={(value) => setValue(value)}
              minHeight={240}
              height={UIStore.isMobile ? window.innerHeight / 2 : 400}
              toolbarConfig={{ pin: false }}
              placeholder="（*选填）写下体验、感想、评测或记录。提醒您注意勾选上方对应按钮（剧透请收入折叠块内），请保持善意，严禁人身攻击"
              wrapperProps={{
                style: { marginBottom: 16 },
                className: styles.markdownEditor,
              }}
            />
        }

        {renderFooter()}
      </ResponsiveModal>
      <Modal
        visible={ruleVisible}
        onCancel={() => setRuleVisible(false)}
        title={null}
        footer={null}
      >
        <RateRuleText />
        <Button type="primary" block onClick={() => setRuleVisible(false)}>
          关闭
        </Button>
      </Modal>
    </React.Fragment>
  );
});

export default RatePostModal;
