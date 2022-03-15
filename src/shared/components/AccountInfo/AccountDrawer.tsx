import React, { HTMLAttributes, useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import {
  Avatar,
  Button,
  Spin,
  message,
  Divider,
  Drawer,
  DrawerProps,
} from "antd";
import modalAlert from "@/shared/components/ModalAlert";
import { Pendant } from "@/shared/components/Pendant";
import LoadableButton from "@/shared/components/LoadableButton";
import AccountStore, { IAccountDto } from "@/account/stores/AccountStore";
import styles from "./AccountDrawer.module.less";
import AuthStore from "@/shared/stores/AuthStore";
import { UserDeleteOutlined } from "@ant-design/icons";
import BlockStore from "@/shared/stores/BlockStore";

interface IProps extends DrawerProps {
  _id: string;
}

const AccountDrawer: React.FunctionComponent<IProps> = ({
  _id,
  className = "",
  ...drawerProps
}) => {
  const [user, setUser] = useState<IAccountDto | undefined>();
  const history = useHistory();
  const isSelf = _id === AuthStore.user._id;

  async function refreshUser() {
    return AccountStore.fetchAccount(_id).then((res) => {
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

  useEffect(() => {
    if (!drawerProps.visible) {
      return;
    }

    if (user && user._id === _id) {
      return;
    }

    AccountStore.fetchAccount(_id).then((res) => {
      setUser(res.data);
    });
  }, [user, _id, drawerProps.visible]);

  const renderContent = () => {
    if (!user) {
      return (
        <div className={styles.loadingPage}>
          <Spin size="large" />
        </div>
      );
    }

    return (
      <div className={styles.mobileUserHeader}>
        <div
          className={styles.userBackground}
          style={{ background: `url(${user.backgroundUrl})` }}
        />

        <Link 
          to={`/account/${_id}`} 
          className='custom-link'
          onClick={() => drawerProps.onClose && drawerProps.onClose({} as any)}
        >
          <div className={`container`}>
            <div className={styles.userInfo} style={{ marginBottom: 16 }}>
              <Pendant url={user.pendantUrl} style={{ marginRight: 24 }}>
                <Avatar
                  size={80}
                  src={user.avatarUrl}
                  className={styles.userAvatar}
                />
              </Pendant>
              <div style={{ flex: 1 }}>
                <div className={styles.userData}>
                  {/* <Link to={`/account/${user._id}/followers`}> */}
                    <div className={styles.userDataItem}>
                      <span className={styles.userDataItemCount}>
                        {user.followerCount}
                      </span>
                      粉丝
                    </div>
                  {/* </Link> */}
                  <Divider type="vertical" />
                  {/* <Link to={`/account/${user._id}/followings`}> */}
                    <div className={styles.userDataItem}>
                      <span className={styles.userDataItemCount}>
                        {user.followingCount}
                      </span>
                      关注
                    </div>
                  {/* </Link> */}
                  <Divider type="vertical" />
                  <div className={styles.userDataItem}>
                    <span className={styles.userDataItemCount}>
                      {user.likedCount}
                    </span>
                    获赞
                  </div>
                </div>
                {!isSelf &&
                <div className={styles.userAction} style={{ marginTop: 8 }}>
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
                </div>
                }
              </div>
            </div>
            <div className={styles.userNickname}>{user.nickName}</div>
            {user.note && (
              <div className={styles.userNote} style={{ marginBottom: 8 }}>
                {user.note}
              </div>
            )}
          </div>
        </Link>
      </div>
    );

    // return (
    //   <React.Fragment>
    //     <div
    //       className={styles.cardBg}
    //       style={{ background: `url(${user.backgroundUrl})` }}
    //     />
    //     <div className={styles.cardMain}>
    //       <Link
    //         className="custom-link"
    //         to={`/account/${_id}`}
    //         onClick={() =>
    //           drawerProps.onClose && drawerProps.onClose({} as any)
    //         }
    //       >
    //         <div className={styles.cardInfo}>
    //           <Avatar
    //             src={user.avatarUrl}
    //             size={40}
    //             className={styles.userAvatar}
    //             style={{ marginRight: 16 }}
    //           />
    //           <div style={{ flex: 1 }}>
    //             <div className={styles.userNickname}>{user.nickName}</div>
    //             <div className={styles.userNote}>{user.note}</div>
    //           </div>
    //         </div>
    //       </Link>
    //       <div className={styles.cardAction}>
    //         <div className={styles.cardData}>
    //           <Link to={`/account/${user._id}/followers`}>
    //             <div className={styles.userDataItem}>
    //               <span className={styles.userDataItemCount}>
    //                 {user.followerCount}
    //               </span>
    //               粉丝
    //             </div>
    //           </Link>
    //           <Divider type="vertical" />
    //           <Link to={`/account/${user._id}/followings`}>
    //             <div className={styles.userDataItem}>
    //               <span className={styles.userDataItemCount}>
    //                 {user.followingCount}
    //               </span>
    //               关注
    //             </div>
    //           </Link>
    //           <Divider type="vertical" />
    //           <div className={styles.userDataItem}>
    //             <span className={styles.userDataItemCount}>
    //               {user.likedCount}
    //             </span>
    //             获赞
    //           </div>
    //         </div>
    //         {AuthStore.user._id !== user._id && (
    //           <div style={{ marginLeft: "auto" }}>
    //             {user.isFollowed ? (
    //               <LoadableButton
    //                 danger
    //                 ghost
    //                 onSubmit={() => unFollow(user._id)}
    //               >
    //                 取消关注
    //               </LoadableButton>
    //             ) : (
    //               <LoadableButton
    //                 type="primary"
    //                 ghost
    //                 onSubmit={() => follow(user._id)}
    //               >
    //                 关注
    //               </LoadableButton>
    //             )}
    //           </div>
    //         )}
    //       </div>
    //     </div>
    //   </React.Fragment>
    // );
  };

  return (
    <Drawer {...drawerProps} className={`${styles.drawer} ${className}`}>
      {renderContent()}
    </Drawer>
  );
};

export { AccountDrawer };
export default AccountDrawer;
