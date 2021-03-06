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
  [RateView.PL]: "????????????",
  [RateView.KP]: "???????????????",
  [RateView.OB]: "????????????",
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
              <summary>??????????????????????????????????????????????????????</summary>
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
                {isFold ? "??????????????????" : "????????????"}
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
                <div>{rate.type === RateType.Rate ? "??????" : "??????"}</div>
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
            <div>{rate.type === RateType.Rate ? "??????" : "??????"}</div>
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
          {rate.remarkLength > 50 && <Tag>????????? {rate.remarkLength} ???</Tag>}
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
                  ? '??????'
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
                  <div>??????</div>
                </div>
              </ShareWrapper>
              {rate.canEdit && (
                <React.Fragment>
                  <div
                    className={styles.action}
                    onClick={() => setEditVisible(true)}
                  >
                    <EditOutlined className={styles.actionIcon} />
                    <div>??????</div>
                  </div>

                  <Popconfirm
                    title="??????????????????????????????"
                    onConfirm={() => {
                      RateStore.deleteRate(rate._id).then(() => {
                        message.success("????????????");
                        onRemoved();
                      });
                    }}
                    okText="??????"
                    cancelText="??????"
                  >
                    <div className={styles.action}>
                      <DeleteOutlined className={styles.deleteIcon} />
                      <div>??????</div>
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
                  <div>??????</div>
                </div>
              )}

              {!isSelf && (
                <Popconfirm
                  title="??????????????????????????????????????????????????????"
                  onConfirm={() =>
                    BlockStore.block("Rate", rate._id).then(() => {
                      message.success("??????????????????");
                      onRemoved();
                    })
                  }
                  okText="??????"
                  cancelText="??????"
                >
                  <div className={styles.action}>
                    <EyeInvisibleOutlined className={styles.actionIcon} />
                    <div>??????</div>
                  </div>
                </Popconfirm>
              )}

              {!isSelf && (
                <Popconfirm
                  title="?????????????????????????????????????????????????????????????????????"
                  onConfirm={() => RateStore.reportSpoiler(rate._id)}
                  okText="??????"
                  cancelText="??????"
                >
                  <div className={styles.action}>
                    <WarningOutlined className={styles.warningIcon} />
                    <div>????????????</div>
                  </div>
                </Popconfirm>
              )}

              {AuthStore.checkRole('admin') && (
                <div 
                  className={styles.action}
                  onClick={() => setManageVisible(true)}
                >
                  <AuditOutlined className={styles.warningIcon} />
                  <div>??????</div>
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
              message.success("????????????");
            });
          }}
        />

        <ActionSheet
          visible={actionsOpened}
          onClose={() => setActionsOpened(false)}
        >
          <ActionSheetItem
            content="??????"
            onOptionClick={() => {
              copy(`${window.location.origin}/rate/${rate._id}`);
              message.success("??????????????????????????????");
            }}
          />
          {rate.canEdit && (
            <ActionSheetItem
              content="??????"
              onOptionClick={() => setEditVisible(true)}
            />
          )}
          {rate.canEdit && (
            <ActionSheetItem
              content="??????"
              danger
              onOptionClick={() => {
                modalAlert({
                  title: "????????????",
                  content: "??????????????????????????????",
                  cancelText: "??????",
                  okText: "??????",
                  maskClosable: true,
                  onOk: () => {
                    RateStore.deleteRate(rate._id).then(() => {
                      message.success("????????????");
                      onRemoved();
                    });
                  },
                });
              }}
            />
          )}

          {!isSelf && (
            <ActionSheetItem
              content="????????????"
              danger
              onOptionClick={() => {
                modalAlert({
                  title: "????????????",
                  content: "?????????????????????????????????????????????????????????????????????",
                  cancelText: "??????",
                  okText: "??????",
                  maskClosable: true,
                  onOk: () => RateStore.reportSpoiler(rate._id),
                });
              }}
            />
          )}

          {!isSelf && (
            <ActionSheetItem
              content="????????????"
              danger
              onOptionClick={() => {
                modalAlert({
                  title: "????????????",
                  content: "??????????????????????????????????????????????????????",
                  cancelText: "??????",
                  okText: "??????",
                  maskClosable: true,
                  onOk: () =>
                    BlockStore.block("Rate", rate._id).then(() => {
                      message.success("??????????????????");
                      onRemoved();
                    }),
                });
              }}
            />
          )}

          {!isSelf && (
            <ActionSheetItem
              content="????????????"
              danger
              onOptionClick={() => setReportVisible(true)}
            />
          )}
          {AuthStore.checkRole('admin') && (
            <ActionSheetItem
              content="????????????"
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
