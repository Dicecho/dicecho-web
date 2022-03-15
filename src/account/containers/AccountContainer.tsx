import React, { useEffect, useState } from "react";
import { Button, Avatar, message, Divider, Affix, BackTop, Popconfirm } from "antd";
import { Helmet } from "react-helmet";
import {
  useRouteMatch,
  NavLink,
  Switch,
  Redirect,
  Route,
  Link,
} from "react-router-dom";
import {
  HeaderLayout,
  HeaderBack,
  HeaderMenu,
  HeaderNotification,
} from "@/shared/components/Header";
import { Pendant } from '@/shared/components/Pendant'
import CustomizedHeader from "@/shared/layout/CustomizedHeader";
import modalAlert from "@/shared/components/ModalAlert";
import useScrollPosition from "@/shared/hooks/useScrollPosition";
import LoadableButton from "@/shared/components/LoadableButton";
import ResponsiveContainer from "@/shared/components/ResponsiveContainer";
import ScrollToTop from "@/shared/components/ScrollToTop";
import WorkingPage from "@/shared/components/Working";
import AccountHome from "./AccountHome";
import AccountRate from "./AccountRate";
import AccountMark from "./AccountMark";
import AccountTopic from "./AccountTopic";
import AccountCollection from "./AccountCollection";
import AccountFollowers from "./AccountFollowers";
import AccountFollowings from "./AccountFollowings";
import AccountSetting from "./AccountSetting";
import AvatarUploader from "@/shared/components/AvatarUploader";
import UIStore from "@/shared/stores/UIStore";
import AuthStore from "@/shared/stores/AuthStore";
import SettingStore from "@/shared/stores/SettingStore";
import AccountStore, { IAccountDto } from "../stores/AccountStore";
import { observer } from "mobx-react";
import styles from "./AccountContainer.module.less";
import { 
  VerticalAlignTopOutlined, 
  UserDeleteOutlined,
} from "@ant-design/icons";
import BlockStore from "@/shared/stores/BlockStore";

const AccountContainer: React.FunctionComponent = observer(() => {
  const route = useRouteMatch<{ uuid: string }>();
  const [headerTransparent, setHeaderTransparent] = useState(true);
  const [user, setUser] = useState<undefined | IAccountDto>(
    route.params.uuid === AuthStore.user._id ? AuthStore.user : undefined
  );
  useScrollPosition((top) => setHeaderTransparent(top < 160))

  useEffect(() => {
    if (route.params.uuid === AuthStore.user._id) {
      setUser(AuthStore.user);
      return;
    }

    AccountStore.fetchAccount(route.params.uuid).then((res) => {
      setUser(res.data);
    });
  }, [route.params.uuid]);

  async function refreshUser() {
    return AccountStore.fetchAccount(route.params.uuid).then((res) => {
      setUser(res.data);
    });
  }

  async function follow(uuid: string) {
    return AccountStore.follow(uuid).then(() => {
      message.success("关注成功");
      refreshUser();
    });
  }

  async function unFollow(uuid: string) {
    return AccountStore.unfollow(uuid).then(() => {
      message.success("取消关注成功");
      refreshUser();
    });
  }

  if (!user) {
    return null;
  }

  const isSelf = user._id === AuthStore.user._id;

  const tabItems = [
    {
      link: "",
      title: "主页",
      exact: true,
    },
    ...(SettingStore.rateAvailable
      ? [
          {
            link: "rate",
            title: "评价",
          },
          {
            link: "mark",
            title: "想玩",
          },
        ]
      : []),
    {
      link: "topic",
      title: "帖子",
    },
    {
      link: "collection",
      title: "收藏夹",
    },
    ...(isSelf && !UIStore.isMobile
      ? [
          {
            link: "setting",
            title: "设置",
          },
        ]
      : []),
  ];

  const renderHeader = () => {
    if (UIStore.isMobile) {
      return (
        <div className={styles.mobileUserHeader} style={{ marginBottom: 16 }}>
          <div
            className={styles.userBackground}
            style={{ background: `url(${user.backgroundUrl})` }}
          />
          <div className={`${styles.userDetail} container`}>
            <div className={styles.userInfo} style={{ marginBottom: 16 }}>
              <Pendant url={user.pendantUrl} style={{ marginRight: 24 }}>
                {isSelf ? (
                    <AvatarUploader className={styles.userAvatarEdit} />
                ) : (
                    <Avatar
                      size={80}
                      src={user.avatarUrl}
                      className={styles.userAvatar}
                    />
                )}
              </Pendant>
              <div style={{ flex: 1 }}>
                <div className={styles.userData}>
                  <Link to={`/account/${user._id}/followers`}>
                    <div className={styles.userDataItem}>
                      <span className={styles.userDataItemCount}>
                        {user.followerCount}
                      </span>
                      粉丝
                    </div>
                  </Link>
                  <Divider type="vertical" />
                  <Link to={`/account/${user._id}/followings`}>
                    <div className={styles.userDataItem}>
                      <span className={styles.userDataItemCount}>
                        {user.followingCount}
                      </span>
                      关注
                    </div>
                  </Link>
                  <Divider type="vertical" />
                  <div className={styles.userDataItem}>
                    <span className={styles.userDataItemCount}>
                      {user.likedCount}
                    </span>
                    获赞
                  </div>
                </div>
                <div className={styles.userMobileAction} style={{ marginTop: 8 }}>
                  {isSelf ? (
                    <Link to={`/account/${user._id}/setting`} style={{ flex: 1 }}>
                      <Button type="primary" ghost block size="small">
                        编辑资料
                      </Button>
                    </Link>
                  ) : (
                    <React.Fragment>
                      {user.isFollowed ? (
                        <LoadableButton
                          danger
                          ghost
                          block
                          size="small"
                          onSubmit={() => unFollow(user._id)}
                        >
                          取消关注
                        </LoadableButton>
                      ) : (
                        <LoadableButton
                          type="primary"
                          ghost
                          block
                          size="small"
                          onSubmit={() => follow(user._id)}
                        >
                          关注
                        </LoadableButton>
                      )}
                      <Button 
                        icon={(<UserDeleteOutlined />)}
                        danger
                        size="small"
                        style={{ marginLeft: 8 }}
                        onClick={() => {
                          modalAlert({
                            title: "屏蔽用户",
                            content: "屏蔽后此用户的模组、评价、评论以及来自此用户的提醒将不显示",
                            cancelText: "取消",
                            okText: "屏蔽",
                            maskClosable: true,
                            onOk: () =>
                              BlockStore.block('User', user._id).then(() => {
                                message.success("屏蔽成功");
                              }),
                          });
                        }}
                      />
                    </React.Fragment>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.userNickname}>{user.nickName}</div>
            {user.note && (
              <div className={styles.userNote} style={{ marginBottom: 8 }}>
                {user.note}
              </div>
            )}
          </div>
          <Affix offsetTop={58}>
            <div className={`${styles.headerTabs} ${styles.mobileHeaderTabs} container`}>
              {tabItems.map((tab) => (
                <NavLink
                  key={tab.link}
                  exact={tab.exact}
                  activeClassName={styles.headerTabActive}
                  replace={true}
                  to={
                    tab.link === "" ? route.url : `${route.url}/${tab.link}`
                  }
                  className={styles.headerTab}
                >
                  <span className={styles.headerTabText}>{tab.title}</span>
                </NavLink>
              ))}
            </div>
          </Affix>
        </div>
      );
    }

    return (
      <div className={styles.userHeader}>
        <div
          className={styles.userBackground}
          style={{ background: `url(${user.backgroundUrl})` }}
        />
        <Pendant url={user.pendantUrl} style={{ marginBottom: 24, marginTop: 40 }}>
          {isSelf ? (
            <AvatarUploader
              className={styles.userAvatarEdit}
            />
          ) : (
            <Avatar
              size={120}
              src={user.avatarUrl}
              className={styles.userAvatar}
            />
          )}
        </Pendant>
        <div className={styles.userNickname} style={{ marginBottom: 8 }}>
          {user.nickName}
        </div>
        {user.note && (
          <div className={styles.userNote} style={{ marginBottom: 8 }}>
            {user.note}
          </div>
        )}
        <div className={styles.userData} style={{ marginBottom: 16 }}>
          <Link to={`/account/${user._id}/followers`}>
            <div className={styles.userDataItem}>
              <span className={styles.userDataItemCount}>
                {user.followerCount}
              </span>
              粉丝
            </div>
          </Link>
          <Divider type="vertical" />
          <Link to={`/account/${user._id}/followings`}>
            <div className={styles.userDataItem}>
              <span className={styles.userDataItemCount}>
                {user.followingCount}
              </span>
              关注
            </div>
          </Link>
          <Divider type="vertical" />
          <div className={styles.userDataItem}>
            <span className={styles.userDataItemCount}>{user.likedCount}</span>
            获赞
          </div>
        </div>
        <div className={styles.userAction}>
          {isSelf ? (
            <Link to={`/account/${user._id}/setting`}>
              <Button type="primary" ghost>
                编辑资料
              </Button>
            </Link>
          ) : (
            <React.Fragment>
              {user.isFollowed ? (
                <LoadableButton
                  danger
                  ghost
                  onSubmit={() => unFollow(user._id)}
                >
                  取消关注
                </LoadableButton>
              ) : (
                <LoadableButton
                  type="primary"
                  ghost
                  onSubmit={() => follow(user._id)}
                >
                  关注
                </LoadableButton>
              )}
              <Popconfirm
                title="屏蔽后此用户的模组、评价、评论以及来自此用户的提醒将不显示"
                onConfirm={() =>
                  BlockStore.block('User', user._id).then(() => {
                    message.success("屏蔽成功");
                  })
                }
                okText="屏蔽"
                cancelText="取消"
              >
                <Button 
                  icon={(<UserDeleteOutlined />)}
                  style={{ marginLeft: 8 }}
                  danger
                />
              </Popconfirm>
            </React.Fragment>
          )}
        </div>
        <div style={{ marginTop: "auto" }} />
        <div
          className={styles.headerTabs}
          style={{ marginTop: 40, marginBottom: 40 }}
        >
          {tabItems.map((tab) => (
            <NavLink
              key={tab.link}
              exact={tab.exact}
              activeClassName={styles.headerTabActive}
              to={tab.link === "" ? route.url : `${route.url}/${tab.link}`}
              className={styles.headerTab}
            >
              <span className={styles.headerTabText}>{tab.title}</span>
            </NavLink>
          ))}
        </div>
      </div>
    );
  };

  return (
    <React.Fragment>
      <Helmet title={`${user.nickName} | 用户 | 骰声回响`} />
      <ScrollToTop pathname={`account/${route.params.uuid}`} />
      <CustomizedHeader options={{ transparent: true }}>
        <HeaderLayout
          className={`${styles.accountHeader} ${
            headerTransparent ? styles.transparent : ""
          }`}
          left={isSelf ? <HeaderMenu /> : <HeaderBack />}
          title={user.nickName}
          right={<HeaderNotification />}
        />
      </CustomizedHeader>
      {renderHeader()}
      <ResponsiveContainer mobileAvaliable={false}>
        <Switch>
          <Route exact path={`${route.url}`}>
            <AccountHome user={user} />
          </Route>
          <Route path={`${route.url}/rate`}>
            <AccountRate user={user} />
          </Route>
          <Route path={`${route.url}/mark`}>
            <AccountMark user={user} />
          </Route>
          <Route path={`${route.url}/topic`}>
            <AccountTopic user={user} />
          </Route>
          <Route path={`${route.url}/favorites`} component={WorkingPage} />
          <Route path={`${route.url}/followers`}>
            <AccountFollowers user={user} />
          </Route>
          <Route path={`${route.url}/followings`}>
            <AccountFollowings user={user} />
          </Route>
          <Route path={`${route.url}/collection`}>
            <AccountCollection user={user} />
          </Route>
          <Route path={`${route.url}/setting`}>
            <AccountSetting
              user={user}
              onUpdate={() => {
                AccountStore.fetchAccount(route.params.uuid).then((res) => {
                  setUser(res.data);
                });
              }}
            />
          </Route>
          <Redirect to={`${route.url}`} />
        </Switch>
      </ResponsiveContainer>
      
      <BackTop >
        <div className='custom-back-top'>
          <VerticalAlignTopOutlined />
        </div>
      </BackTop>
    </React.Fragment>
  );
});
export default AccountContainer;
