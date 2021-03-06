import React, { Component, useEffect, useState, useRef } from "react";
import { observer } from "mobx-react";
import { Helmet } from "react-helmet";
import { useIsMounted } from 'react-tidy'
import copy from "copy-to-clipboard";
import moment from "moment";
import {
  useRouteMatch,
  NavLink,
  Switch,
  Redirect,
  Route,
  useHistory,
  Link,
} from "react-router-dom";
import { ResponseError } from "@/interfaces/response";
import { Error } from '@/shared/components/Empty';
import ReportModal from "@/shared/components/ReportModal";
import ReportStore from "@/shared/stores/ReportStore";
import ScrollToTop from "@/shared/components/ScrollToTop";
import { LoadingAnimation } from "@/shared/components/Loading";
import { AccessLevel, IRatePostSearch, RateType } from '@/rate/interfaces';
import { Button, message, Card, Avatar, Affix, Modal, Tooltip } from "antd";
import {
  StarOutlined,
  DownloadOutlined,
  EllipsisOutlined,
  EditOutlined,
  HeartOutlined,
  HeartFilled,
  PlusOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import CollectionActionModal from '@/collection/components/CollectionActionModal';
import { HeaderLayout, HeaderNotification, HeaderBack } from '@/shared/components/Header'
import CustomizedHeader from "@/shared/layout/CustomizedHeader";
import CustomizedFooter from "@/shared/layout/CustomizedFooter";
import { AccountInfoWrapper } from '@/shared/components/AccountInfo';
import WorkingPage from "@/shared/components/Working";
import ActionSheet, { ActionSheetItem } from "@/shared/components/ActionSheet";
import modalAlert from "@/shared/components/ModalAlert";
import useScrollPosition from "@/shared/hooks/useScrollPosition";
import ModuleDetailHome from "./ModuleDetailHome";
import ModuleDetailForum from './ModuleDetailForum';
import ModuleDetailEdit from "./ModuleDetailEdit";
import ModuleDetailDownload from "./ModuleDetailDownload";
import ModuleInfoItem from "@/module/components/ModuleInfoItem";
import TagItem from "@/tag/components/TagItem";
import ModuleRate from "./ModuleRate";
import ModuleRateInfo from "@/module/components/ModuleRateInfo";
import RatePostModal from "@/rate/components/RatePostModal";
import RateStore from "@/rate/stores/RateStore";
import SettingStore from '@/shared/stores/SettingStore';
import BlockStore from "@/shared/stores/BlockStore";
import ModuleStore from "@/module/stores/ModuleStore";
import UIStore from "@/shared/stores/UIStore";
import AuthStore from "@/shared/stores/AuthStore";
import styles from "./ModuleDetail.module.less";

// const alert = Modal.alert;


const ModuleDetailContainer: React.FC = observer(() => {
  const route = useRouteMatch<{ uuidOrTitle: string }>();
  const history = useHistory();
  const isMounted = useIsMounted();
  const module = ModuleStore.moduleDetail;
  const [headerTransparent, setHeaderTransparent] = useState(false);
  const [actionsOpened, setActionsOpened] = useState(false);
  const [collectionVisible, setCollectionVisible] = useState(false);
  const [err, setErr] = useState<ResponseError>();
  const [initialized, setInitialized] = useState(
    module && (module._id === route.params.uuidOrTitle || module.title === route.params.uuidOrTitle)
  );

  useScrollPosition((top) => setHeaderTransparent(top < 160));

  useEffect(() => {
    setInitialized(module && (module._id === route.params.uuidOrTitle || module.title === route.params.uuidOrTitle))
  }, [route.params.uuidOrTitle])

  useEffect(() => {
    if (initialized) {
      return;
    }
    if (module && (module._id === route.params.uuidOrTitle || module.title === route.params.uuidOrTitle)) {
      return;
    }
    ModuleStore.fetchModuleDetail(route.params.uuidOrTitle)
      .catch((err) => {
        setErr(err);
      })
      .finally(() => {
        if (!isMounted()) {
          return;
        }
        setInitialized(true);
      })
  }, [route.params.uuidOrTitle, initialized]);

  if (!initialized) {
    return (
      <div className={styles.loadingPage}>
      <LoadingAnimation />
      </div>
    );
  }

  if (err) {
    if (err.response?.data.detail) {
      return (
        <Error text={err.response?.data.detail}/>
      )
    }

    return null;
  }

  if (!module) {
    return null;
  }

  const ModuleDetailTabs = [
    {
      link: "",
      title: "??????",
      exact: true,
    },
    // {
    //   link: "rate",
    //   title: "????????????",
    // },
    {
      link: "forum",
      title: module.topicCount ? `?????????${module.topicCount}???` : '??????',
    },
    // {
    //   link: "log",
    //   title: "????????????",
    // },
    // {
    //   link: "replay",
    //   title: "??????Replay",
    // },
  ];

  const Wrapper: React.FC = ({ children }) => {
    if (module.author.isForeign) {
      return (
        <Link 
          className='custom-link'
          to={`/module?keyword=${module.author.nickName}`}
          onClick={() => {
            UIStore.setSearchText(module.author.nickName)
          }}
        >
          {children}
        </Link>
      );
    }
    return (
      <AccountInfoWrapper _id={module.author._id}>
        {children}
      </AccountInfoWrapper>
    )
  }

  const renderActionButton = () => {
    if (module.canDownload) {
      return (
        <Link replace={true} to={`/module/${module._id}/download`} style={{ marginLeft: "auto" }}>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
          >
            ??????
          </Button>
        </Link>
      )
    }

    if (module.originUrl) {
      return (
        <Button
          type="primary"
          icon={<LinkOutlined />}
          style={{ marginLeft: "auto" }}
          href={module.originUrl}
          target="_blank"
        >
          ??????
        </Button>
      )
    }

    return null;
  }

  const renderPostModal = () => {
    return (
      <React.Fragment>
      <RatePostModal
        postKey={module._id}
        type={RateStore.currenRateType}
        rate={RateStore.currentModuleRate}
        visible={RateStore.ratesPostModalVisible}
        onCancel={() => RateStore.closeRatesPostModal()}
        onSend={(dto) => {
          if (RateStore.currentModuleRate) {
            return RateStore.updateRate(
              RateStore.currentModuleRate._id,
              dto
            ).then(() => {
              message.success("????????????");
            });
          }

          return RateStore.postModuleRate(module._id, dto).then(() => {
            message.success("????????????");
            ModuleStore.onRated(module._id, dto.type);
          });
        }}
      />
      <CollectionActionModal
        targetName='Mod'
        targetId={module._id}
        visible={collectionVisible}
        onCancel={() => setCollectionVisible(false)}
      />
      </React.Fragment>
    );
  };

  const renderContent = () => {
    return (
      <React.Fragment>
        <Switch>
          <Route exact path={`${route.url}`} component={ModuleDetailHome} />
          <Route path={`${route.url}/rate`} component={ModuleRate} />
          <Route path={`${route.url}/replay`} component={WorkingPage} />
          <Route path={`${route.url}/log`} component={WorkingPage} />
          <Route path={`${route.url}/forum`} component={ModuleDetailForum} />
          <Route path={`${route.url}/edit`} component={ModuleDetailEdit} />
          <Route path={`${route.url}/download`} component={ModuleDetailDownload} />
          <Redirect to={`${route.url}`} />
        </Switch>
      <ReportModal
        visible={ModuleStore.reportVisible}
        onCancel={() => ModuleStore.setReportVisible(false)}
        onSend={(classification, reason) =>
          Promise.all([
            ReportStore.report({
              targetName: "Mod",
              targetId: module._id,
              classification,
              reason,
            }),
            BlockStore.block("Mod", module._id),
          ])
        }
      />
      </React.Fragment>
    );
  };

  const renderAction = () => {
    if (RateStore.currentModuleRate && RateStore.currentModuleRate.type === RateType.Rate) {
      return (
        <Button
          type={"default"}
          icon={<EditOutlined />}
          style={{ marginRight: 8 }}
          onClick={() => RateStore.openRatesPostModal()}
        >
         ?????????
        </Button>
      )
    }

    return (
      <React.Fragment>
        <Button
          ghost
          type='primary'
          icon={<StarOutlined />}
          style={{ marginRight: 8 }}
          onClick={() => RateStore.openRatesPostModal(RateType.Rate)}
        >
          ??????
        </Button>
        <Button
          ghost={!RateStore.currentModuleRate || RateStore.currentModuleRate.remark !== ''}
          type='primary'
          icon={RateStore.currentModuleRate ? <HeartFilled /> : <HeartOutlined />}
          style={{ marginRight: 8 }}
          onClick={() => {
            if (RateStore.currentModuleRate) {
              RateStore.openRatesPostModal()
              return;
            }

            RateStore.markModule(module._id).then(() => {
              message.success('???????????????')
            });
          }}
        >
          {RateStore.currentModuleRate 
            ? RateStore.currentModuleRate.remarkLength === 0 ? '??????????????????' : '?????????'
            : '??????'
          }
        </Button>
      </React.Fragment>
    )
  }

  if (UIStore.isMobile) {
    return (
      <React.Fragment>
        <Helmet title={`${module.title} | ?????? | ????????????`} />
        <ScrollToTop pathname={`module/${module._id}`} />
        <CustomizedHeader options={{ transparent: true }}>
          <HeaderLayout
            className={`${styles.moduleDetailHeader} ${headerTransparent ? styles.transparent : ""}`}
            left={<HeaderBack />}
            titleProps={{ className: styles.moduleDetailHeaderTitle }}
            title={headerTransparent ? "" :module.title}
            right={(<EllipsisOutlined onClick={() => setActionsOpened(true)} />)}
          />
        </CustomizedHeader>
        <CustomizedFooter visible={false} />
        <div
          className={styles.mobileCover}
          style={{ backgroundImage: `url(${module.coverUrl})` }}
        />
        <Card
          bordered={false}
          className={styles.mobileHeader}
          style={{ marginBottom: 16 }}
        >
          <div className="container" style={{ marginBottom: 16 }}>
            <div className={styles.title}>{module.title}</div>
            {module.isForeign &&
              <i className='secondary-text'>
                [?????????????????????????????????????????????????????????????????????????????????????????????]??????
                <Link to='/notice/article'>
                  ???????????????????????????
                </Link>
              </i>
            }
            <div className={styles.mobileHeaderInfo}>
              {SettingStore.rateAvailable && SettingStore.rateScoreAvailable && module.rateAvg > 0 &&
                <ModuleRateInfo mod={module} style={{ marginTop: 8, marginBottom: 16 }} />
              }
              <ModuleInfoItem
                title="?????????"
                content={
                  <Wrapper>
                    <Avatar
                      size="small"
                      src={module.author.avatarUrl}
                      style={{ marginRight: 8 }}
                    />
                    {module.author.nickName}
                  </Wrapper>
                }
              />
              {module.contributors.length > 0 && module.isForeign && (
                <ModuleInfoItem
                  title="???????????????"
                  content={
                    <Avatar.Group size="small" maxCount={4}>
                      {module.contributors.map((contributor) => (
                        <AccountInfoWrapper _id={contributor._id} key={contributor._id}>
                          <Avatar
                            size="small"
                            src={contributor.avatarUrl}
                            style={{ marginRight: 8 }}
                          />
                        </AccountInfoWrapper>
                      ))}
                    </Avatar.Group>
                  }
                />
              )}
              {module.tags.length > 0 &&
                <ModuleInfoItem
                  title="??????"
                  content={module.tags.map(tag => <TagItem tag={tag} key={tag}/>)}
                />
              }
              <ModuleInfoItem
                title="????????????"
                content={<TagItem tag={module.moduleRule}/>}
              />
              <Tooltip overlay={`??????????????? ${moment(module.lastEditAt).format("YYYY???MM???DD???")}`}>
                <div style={{ margin: "8px 0" }}>
                  ????????? {moment(module.releaseDate).format("YYYY???MM???DD???")}
                </div>
              </Tooltip>
            </div>

            <div className={styles.mobileHeaderAction}>
              {/* <Button style={{ marginRight: 8 }}>??????</Button> */}
              {renderAction()}
              {renderActionButton()}
            </div>
          </div>
          <Affix offsetTop={58}>
            <div className={`${styles.headerTabs} container`}>
              {ModuleDetailTabs.map((tab) => (
                <NavLink
                  key={tab.link}
                  exact={tab.exact}
                  activeClassName={styles.headerTabActive}
                  replace={true}
                  to={tab.link === "" ? route.url : `${route.url}/${tab.link}`}
                  className={styles.headerTab}
                >
                  <span className={styles.headerTabText}>{tab.title}</span>
                </NavLink>
              ))}
            </div>
          </Affix>

        </Card>
        {renderContent()}
        {renderPostModal()}
        <ActionSheet 
          visible={actionsOpened}
          onClose={() => setActionsOpened(false)}
        >
          <ActionSheetItem
            content="??????"
            onOptionClick={() => {
              copy(`${window.location.origin}/module/${module._id}`);
              message.success("??????????????????????????????");
            }}
          />
          <ActionSheetItem
            content="??????"
            onOptionClick={() => {
              if (!AuthStore.isAuthenticated) {
                UIStore.openLoginModal({
                  callBack: () => {
                    setCollectionVisible(true)
                  },
                });
                return;
              }
              setCollectionVisible(true)
            }}
          />
          {(module.isForeign || module.canEdit) &&
            <ActionSheetItem
              content={module.canEdit ? '??????' : '????????????'}
              onOptionClick={() => {
                if (module.canEdit) {
                  history.replace(`/module/${module._id}/edit`)
                  return;
                }
                if (!AuthStore.isAuthenticated) {
                  UIStore.openLoginModal();
                  message.error("?????????????????????");
                  return;
                }
                ModuleStore.applyEditor(module._id).then(() => {
                  message.success("?????????????????????");
                  history.replace(`/module/${module._id}/edit`);
                });
              }}
            />
          }
          <ActionSheetItem 
            content='????????????'
            danger
            onOptionClick={() => {
              modalAlert({
                className: 'test',
                title: '????????????',
                content: '???????????????????????????????????????????????????????????????????????????',
                cancelText: '??????',
                okText: '??????',
                maskClosable: true,
                onOk: () => {
                  ModuleStore.blockMod(module._id).then(() => {
                    message.success("??????????????????")
                    if (history.length > 2) {
                      history.goBack();
                    } else {
                      history.replace('/module')
                    }
                  })
                }
              })
            }}
          />
          <ActionSheetItem 
            content='????????????'
            danger
            onOptionClick={() => ModuleStore.setReportVisible(true)}
          />
        </ActionSheet>
      </React.Fragment>
    );
  }

  return (
    <div className="container">
      <Helmet title={`${module.title} | ?????? | ????????????`}>
        <meta name="keywords" content={`${module.moduleRule},${module.title},${module.author.nickName}`} />
        <meta name="description" content={module.description} />
      </Helmet>
      <ScrollToTop pathname={`module/${module._id}`} />
      <Card
        className={styles.header}
        bordered={false}
        style={{ marginBottom: 16, marginTop: 40 }}
      >
        <div className={styles.headerMain}>
          <div
            className={styles.cover}
            style={{ backgroundImage: `url(${module.coverUrl})` }}
          />
          <div className={styles.headerContent}>
            <div>
              <div className={styles.title}>{module.title}</div>
              {module.isForeign &&
                <i className='secondary-text'>
                  [?????????????????????????????????????????????????????????????????????????????????????????????]??????
                  <Link to='/notice/article'>
                    ???????????????????????????
                  </Link>
                </i>
              }
            </div>
            <div className={styles.headerAction}>
              {renderAction()}
              <Button
                ghost
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  if (!AuthStore.isAuthenticated) {
                    UIStore.openLoginModal({
                      callBack: () => {
                        setCollectionVisible(true)
                      },
                    });
                    return;
                  }
                  setCollectionVisible(true)}
                }
              >
                ??????
              </Button>
              {renderActionButton()}
            </div>
          </div>

          {SettingStore.rateAvailable && SettingStore.rateScoreAvailable &&
            <div className={styles.headerInfo}>
              <div className={styles.rateText}>??????????????????</div>
              <div className={styles.rateValue}>
                {module.rateAvg > 0 ? (
                  <React.Fragment>
                    <span className={styles.rateNumber}>{module.rateAvg}</span> /
                    10
                  </React.Fragment>
                ) : (
                  <div className={styles.rateEmpty}>
                    {module.rateCount === 0 
                      ? '????????????'
                      : '????????????'
                    }
                  </div>
                )}
              </div>
              {module.rateCount > 0 && <div>{module.rateCount} ?????????</div>}
              {module.markCount > 0 && <div>{module.markCount} ?????????</div>}
            </div>
          }
        </div>

        <div className={styles.headerTabs} style={{ justifyContent: "center" }}>
          {ModuleDetailTabs.map((tab) => (
            <NavLink
              key={tab.link}
              exact={tab.exact}
              activeClassName={styles.headerTabActive}
              replace={true}
              to={tab.link === "" ? route.url : `${route.url}/${tab.link}`}
              className={styles.headerTab}
            >
              <span className={styles.headerTabText}>{tab.title}</span>
            </NavLink>
          ))}
        </div>
      </Card>
      {renderContent()}
      {renderPostModal()}
    </div>
  );
});
export default ModuleDetailContainer;
