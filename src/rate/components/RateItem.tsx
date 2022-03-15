import React, { useEffect, useState, useRef } from "react";
import { observer } from "mobx-react";
import { toJS } from 'mobx';
import copy from "copy-to-clipboard";
import classnames from 'classnames';
import { STORAGE_KEYS } from "shared/constants/storage";
import {
  CommentOutlined,
  EditOutlined,
  DeleteOutlined,
  WarningOutlined,
  AlertOutlined,
  ShareAltOutlined,
  AuditOutlined,
  EllipsisOutlined,
  EyeInvisibleOutlined,
  LikeFilled,
  LikeOutlined,
  DislikeFilled,
  DislikeOutlined,
  SmileFilled,
  SmileOutlined,
} from "@ant-design/icons";
import modalAlert from "@/shared/components/ModalAlert";
import ActionSheet, { ActionSheetItem } from "@/shared/components/ActionSheet";
import scrollTo from "antd/lib/_util/scrollTo";
import { Link, useHistory } from "react-router-dom";
import {
  Card,
  Rate,
  Avatar,
  Tag,
  Popconfirm,
  Button,
  Typography,
  message,
  Alert,
  Pagination,
} from "antd";
import { RichTextPreview } from '@/shared/components/RichTextEditor';
import { MarkdownRender } from "@/shared/components/MarkdownEditor";
// import RateReportModal from "./RateReportModal";
import ReportModal from "@/shared/components/ReportModal";
import RatePostModal from "./RatePostModal";
import RateManagerModal from "./RateManagerModal";
import { AccountInfoWrapper } from "@/shared/components/AccountInfo";
import { Pendant } from "@/shared/components/Pendant";
import AttitudeLikeButton from "@/shared/components/AttitudeLikeButton";
import { IDeclareProps, DeclareButtonGroup, SimpleDeclareButton, SimpleDeclareButtonStyles as SDBStyles } from "@/shared/components/DeclareButton";
import ShareWrapper from "@/shared/components/ShareWrapper";
import ReportStore from "@/shared/stores/ReportStore";
import ModuleWidget from '@/module/components/ModuleWidget';
import { RateView } from "../stores/RateStore";
import { CommentBox } from "@/shared/components/Comment";
import { IRateDto, RateType, RemarkContentType } from "@/interfaces/shared/api";
import { formatDate } from "@/utils/time";
import RateStore from "../stores/RateStore";
import UIStore from "@/shared/stores/UIStore";
import styles from "./RateItem.module.less";
import BlockStore from "@/shared/stores/BlockStore";
import AuthStore from "@/shared/stores/AuthStore";
import SettingStore from "@/shared/stores/SettingStore";

const { Paragraph } = Typography;

interface IProps {
  rate: IRateDto;
  onRemoved?: () => any;
  showMod?: boolean;
  showAllComment?: boolean;
  defaultCommentVisible?: boolean;
}

export const RATE_VIEW_MAP = {
  [RateView.PL]: "玩家视角",
  [RateView.KP]: "主持人视角",
  [RateView.OB]: "观战视角",
};

const FOLD_LIMIT = 200;
const SPOILER_LIMIT = 1;

const RateItem: React.FC<IProps> = observer(
  ({
    rate,
    showMod = false,
    defaultCommentVisible = false,
    showAllComment = false,
    onRemoved = () => {},
  }) => {
    const history = useHistory();
    const [pageSize, setPageSize] = useState(
      showAllComment 
        ? parseInt(localStorage.getItem(STORAGE_KEYS.RateCommentPageSize) || '10')
        : 5
    );
    const [isFold, setIsFold] = useState(rate.remarkLength > FOLD_LIMIT);
    const [manageVisible, setManageVisible] = useState(false);
    const [reportVisible, setReportVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [actionsOpened, setActionsOpened] = useState(false);
    const [commentVisible, setCommentVisible] = useState(defaultCommentVisible);
    const [commentCount, setCommentCount] = useState(rate.commentCount);
    const headerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      setIsFold(rate.remarkLength > FOLD_LIMIT);
      setCommentVisible(defaultCommentVisible);
      setCommentCount(rate.commentCount);
    }, [rate._id]);

    const isSelf = AuthStore.user._id === rate.user._id;
    
    const renderRateContentRender = () => {
      if (rate.remarkType === RemarkContentType.Richtext) {
        return <RichTextPreview id={`rate-item-${rate._id}`} value={toJS(rate.richTextState)} />
      }

      return <MarkdownRender content={rate.remark} />
    }

    const renderContent = () => {
      if (rate.spoilerCount > SPOILER_LIMIT) {
        return (
          <div
            className="vditor-reset"
            style={{ marginBottom: 16, width: "100%", overflow: "hidden" }}
          >
            <details>
              <summary>该评价被多次警告有剧透内容已自动折叠</summary>
              <div className={`${styles.cardContent}`}>
                {renderRateContentRender()}
              </div>
            </details>
          </div>
        );
      }

      return (
        <React.Fragment>
          <div
            className={`${styles.cardContent} ${
              isFold ? styles.foldContent : ""
            }`}
          >
            {renderRateContentRender()}
          </div>
          {rate.remarkLength > FOLD_LIMIT && (
            <div
              className={`${styles.foldAction} ${
                isFold ? styles.fold : styles.unfold
              }`}
            >
              <Button
                type="primary"
                onClick={() => {
                  if (!isFold && headerRef.current) {
                    window.scrollTo(
                      0,
                      headerRef.current.getBoundingClientRect().y +
                        window.scrollY
                    );
                  }
                  setIsFold(!isFold);
                }}
              >
                {isFold ? "展开完整评价" : "折叠评价"}
              </Button>
            </div>
          )}
        </React.Fragment>
      );
    };

    return (
      <div className={styles.rateItem}>
        <div ref={headerRef} />
        {UIStore.isMobile ? (
          <div className={styles.mobileCardHeader}>
            {rate.isAnonymous ? (
              <Avatar style={{ marginRight: 8 }} src={rate.user.avatarUrl} />
            ) : (
              <AccountInfoWrapper _id={rate.user._id}>
                <Pendant url={rate.user.pendantUrl} style={{ marginRight: 8 }}>
                  <Avatar src={rate.user.avatarUrl} />
                </Pendant>
              </AccountInfoWrapper>
            )}
            <div className={styles.mobileCardHeaderMain}>
              <div style={{ display: "flex" }}>
                {rate.isAnonymous ? (
                  <div
                    style={{ marginRight: 8, color: "rgba(255,255,255,0.8)" }}
                  >
                    {rate.user.nickName}
                  </div>
                ) : (
                  <AccountInfoWrapper _id={rate.user._id}>
                    <div
                      style={{ marginRight: 8, color: "rgba(255,255,255,0.8)" }}
                    >
                      {rate.user.nickName}
                    </div>
                  </AccountInfoWrapper>
                )}
                <div>{rate.type === RateType.Rate ? "评价" : "想玩"}</div>
                <EllipsisOutlined
                  style={{
                    marginLeft: "auto",
                    fontSize: "1.2rem",
                    color: "#fff",
                  }}
                  onClick={() => setActionsOpened(true)}
                />
              </div>
              <div>{formatDate(new Date(rate.rateAt).getTime())}</div>
            </div>
          </div>
        ) : (
          <div className={styles.cardHeader}>
            {rate.isAnonymous ? (
              <React.Fragment>
                <Avatar
                  size={"small"}
                  style={{ marginRight: 8 }}
                  src={rate.user.avatarUrl}
                />
                <div style={{ marginRight: 8, color: "rgba(255,255,255,0.8)" }}>
                  {rate.user.nickName}
                </div>
              </React.Fragment>
            ) : (
              <AccountInfoWrapper
                style={{ display: "flex", alignItems: "center" }}
                _id={rate.user._id}
              >
                <Pendant url={rate.user.pendantUrl} style={{ marginRight: 8 }}>
                  <Avatar
                    size={"small"}
                    src={rate.user.avatarUrl}
                  />
                </Pendant>
                <div style={{ marginRight: 8, color: "rgba(255,255,255,0.8)" }}>
                  {rate.user.nickName}
                </div>
              </AccountInfoWrapper>
            )}
            <div>{rate.type === RateType.Rate ? "评价" : "想玩"}</div>
            <div style={{ marginLeft: "auto" }}>
              {formatDate(new Date(rate.rateAt).getTime())}
            </div>
          </div>
        )}
        {showMod && (
          <Link to={`/module/${rate.mod._id}`} style={{ width: "100%" }}>
            <ModuleWidget mod={rate.mod} />
          </Link>
        )}
        {rate.type === RateType.Rate && SettingStore.rateScoreAvailable && rate.rate > 0 && (
          <Rate
            className={styles.cardRate}
            allowHalf
            value={rate.rate / 2}
            disabled
          />
        )}

        <div style={{ marginBottom: 8 }}>
          {rate.type === RateType.Rate && <Tag>{RATE_VIEW_MAP[rate.view]}</Tag>}
          {rate.remarkLength > 50 && <Tag>全文长 {rate.remarkLength} 字</Tag>}
        </div>
        {renderContent()}
        <div className={styles.cardFooter}>
          <DeclareButtonGroup 
            declareCounts={rate.declareCounts}
            declareStatus={rate.declareStatus}
            targetName="Rate"
            targetId={rate._id}
          >
            <SimpleDeclareButton
              attitude='like'
              className={styles.likeBtn}
              wrapProps={{ style: { margin: 4 } }}
              renderPrefix={(isActive) => 
                isActive ? <LikeFilled className={classnames(SDBStyles.icon, SDBStyles.red)} style={{ marginRight: 8 }} />
                : <LikeOutlined className={SDBStyles.icon} style={{ marginRight: 8 }} />
              }
            />
            <SimpleDeclareButton
              attitude='dislike'
              className={styles.likeBtn}
              wrapProps={{ style: { margin: 4 } }}
              renderPrefix={(isActive) => 
                isActive 
                  ? <DislikeFilled className={classnames(SDBStyles.icon, SDBStyles.red)} />
                  : <DislikeOutlined className={SDBStyles.icon} />
              }
              renderCount={() => null}
            />
            <SimpleDeclareButton
              attitude='happy'
              className={styles.likeBtn}
              wrapProps={{ style: { margin: 4 } }}
              renderPrefix={(isActive, count) => 
                count === 0
                  ? '欢乐'
                  : isActive 
                    ? <SmileFilled className={classnames(SDBStyles.icon, SDBStyles.yellow)} style={{ marginRight: 8 }} />
                    : <SmileOutlined className={SDBStyles.icon} style={{ marginRight: 8 }} />
              }
              renderCount={(_, count) => 
                count === 0 
                  ? null
                  : count
              }
            />
          </DeclareButtonGroup>

          <div
            className={styles.comment}
            onClick={() => setCommentVisible(!commentVisible)}
          >
            <CommentOutlined className={styles.commentIcon} />
            <div>{commentCount}</div>
          </div>
          {!UIStore.isMobile && (
            <React.Fragment>

              <ShareWrapper url={`${window.location.origin}/rate/${rate._id}`}>
                <div className={styles.action}>
                  <ShareAltOutlined className={styles.actionIcon} />
                  <div>分享</div>
                </div>
              </ShareWrapper>
              {rate.canEdit && (
                <React.Fragment>
                  <div
                    className={styles.action}
                    onClick={() => setEditVisible(true)}
                  >
                    <EditOutlined className={styles.actionIcon} />
                    <div>编辑</div>
                  </div>

                  <Popconfirm
                    title="确定要删除这个评价么"
                    onConfirm={() => {
                      RateStore.deleteRate(rate._id).then(() => {
                        message.success("删除成功");
                        onRemoved();
                      });
                    }}
                    okText="删除"
                    cancelText="取消"
                  >
                    <div className={styles.action}>
                      <DeleteOutlined className={styles.deleteIcon} />
                      <div>删除</div>
                    </div>
                  </Popconfirm>
                </React.Fragment>
              )}

              {!isSelf && (
                <div
                  className={styles.action}
                  onClick={() => setReportVisible(true)}
                >
                  <AlertOutlined className={styles.deleteIcon} />
                  <div>举报</div>
                </div>
              )}

              {!isSelf && (
                <Popconfirm
                  title="屏蔽后该评价将不会显示在你的列表当中"
                  onConfirm={() =>
                    BlockStore.block("Rate", rate._id).then(() => {
                      message.success("评价屏蔽成功");
                      onRemoved();
                    })
                  }
                  okText="屏蔽"
                  cancelText="取消"
                >
                  <div className={styles.action}>
                    <EyeInvisibleOutlined className={styles.actionIcon} />
                    <div>屏蔽</div>
                  </div>
                </Popconfirm>
              )}

              {!isSelf && (
                <Popconfirm
                  title="确定要警告这条评价剧透么，恶意滥用警告会被追溯"
                  onConfirm={() => RateStore.reportSpoiler(rate._id)}
                  okText="警告"
                  cancelText="取消"
                >
                  <div className={styles.action}>
                    <WarningOutlined className={styles.warningIcon} />
                    <div>剧透警告</div>
                  </div>
                </Popconfirm>
              )}

              {AuthStore.checkRole('admin') && (
                <div 
                  className={styles.action}
                  onClick={() => setManageVisible(true)}
                >
                  <AuditOutlined className={styles.warningIcon} />
                  <div>管理</div>
                </div>
              )}

            </React.Fragment>
          )}
        </div>
        <CommentBox
          targetName="Rate"
          targetId={rate._id}
          visible={commentVisible}
          onComment={() => setCommentCount(commentCount + 1)}
          className={styles.rateCommentItem}
          pageSize={pageSize}
          setPageSize={showAllComment ? (size: number) => {
            setPageSize(size)
            localStorage.setItem(STORAGE_KEYS.RateCommentPageSize, size.toString());
          } : undefined}
          isRich
        />
        <RateManagerModal 
          visible={manageVisible}
          onCancel={() => setManageVisible(false)}
          onSend={(data) => 
            RateStore.hideRate(rate._id, data)
          }
        />
        <ReportModal
          visible={reportVisible}
          onCancel={() => setReportVisible(false)}
          onSend={(classification, reason) =>
            Promise.all([
              ReportStore.report({
                targetName: "Rate",
                targetId: rate._id,
                classification,
                reason,
              }),
              BlockStore.block("Rate", rate._id).then(() => {
                onRemoved()
              }),
            ])
          }
        />
        <RatePostModal
          rate={rate}
          postKey={rate.mod._id}
          visible={editVisible}
          onCancel={() => setEditVisible(false)}
          onSend={(dto) => {
            return RateStore.updateRate(rate._id, dto).then(() => {
              message.success("更新成功");
            });
          }}
        />

        <ActionSheet
          visible={actionsOpened}
          onClose={() => setActionsOpened(false)}
        >
          <ActionSheetItem
            content="分享"
            onOptionClick={() => {
              copy(`${window.location.origin}/rate/${rate._id}`);
              message.success("链接复制到剪贴板成功");
            }}
          />
          {rate.canEdit && (
            <ActionSheetItem
              content="编辑"
              onOptionClick={() => setEditVisible(true)}
            />
          )}
          {rate.canEdit && (
            <ActionSheetItem
              content="删除"
              danger
              onOptionClick={() => {
                modalAlert({
                  title: "删除评价",
                  content: "确定要删除这个评价么",
                  cancelText: "取消",
                  okText: "删除",
                  maskClosable: true,
                  onOk: () => {
                    RateStore.deleteRate(rate._id).then(() => {
                      message.success("删除成功");
                      onRemoved();
                    });
                  },
                });
              }}
            />
          )}

          {!isSelf && (
            <ActionSheetItem
              content="剧透警告"
              danger
              onOptionClick={() => {
                modalAlert({
                  title: "剧透警告",
                  content: "确定要警告这条评价剧透么，恶意滥用警告会被追溯",
                  cancelText: "取消",
                  okText: "警告",
                  maskClosable: true,
                  onOk: () => RateStore.reportSpoiler(rate._id),
                });
              }}
            />
          )}

          {!isSelf && (
            <ActionSheetItem
              content="屏蔽评价"
              danger
              onOptionClick={() => {
                modalAlert({
                  title: "屏蔽评价",
                  content: "屏蔽后该评价将不会显示在你的列表当中",
                  cancelText: "取消",
                  okText: "屏蔽",
                  maskClosable: true,
                  onOk: () =>
                    BlockStore.block("Rate", rate._id).then(() => {
                      message.success("评价屏蔽成功");
                      onRemoved();
                    }),
                });
              }}
            />
          )}

          {!isSelf && (
            <ActionSheetItem
              content="举报评价"
              danger
              onOptionClick={() => setReportVisible(true)}
            />
          )}
          {AuthStore.checkRole('admin') && (
            <ActionSheetItem
              content="管理评价"
              danger
              onOptionClick={() => setManageVisible(true)}
            />
          )}
        </ActionSheet>
      </div>
    );
  }
);

export default RateItem;
