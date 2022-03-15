import React, { HTMLAttributes, useEffect, useState } from "react";
import classnames from 'classnames';
import { useHistory, Link } from "react-router-dom";
import { Pendant } from '@/shared/components/Pendant'
import { Avatar, Button, Spin, message, Divider, Popconfirm } from "antd";
import LoadableButton from "@/shared/components/LoadableButton";
import AccountStore, { IAccountDto } from "@/account/stores/AccountStore";
import { UserDeleteOutlined } from "@ant-design/icons";
import styles from "./AccountCard.module.less";
import AuthStore from "@/shared/stores/AuthStore";
import BlockStore from "@/shared/stores/BlockStore";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  _id: string;
  defaultUser?: IAccountDto;
}

const AccountCard: React.FunctionComponent<IProps> = ({
  _id,
  defaultUser,
  ...wrapperProps
}) => {
  const [user, setUser] = useState<IAccountDto | undefined>(defaultUser);
  const history = useHistory();

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
    if (defaultUser && defaultUser._id === _id) {
      setUser(defaultUser);
      return;
    }

    AccountStore.fetchAccount(_id).then((res) => {
      setUser(res.data);
    });
  }, [_id, defaultUser]);

  const renderContent = () => {
    if (!user) {
      return (
        <div className={styles.loadingPage}>
          <Spin size="large" />
        </div>
      );
    }

    return (
      <React.Fragment>
        <div className={styles.cardBg}>
          <div
            className={styles.cardBgImg}
            style={{ background: `url(${user.backgroundUrl})` }}
          />
        </div>
        <div className={styles.cardMain}>
          <div className={styles.cardInfo}>
            <Pendant url={user.pendantUrl} style={{ marginRight: 16 }}>
              <Avatar
                src={user.avatarUrl}
                size={40}
                className={styles.userAvatar}
              />
            </Pendant>
            <div style={{ flex: 1 }}>
              <div className={styles.userNickname}>{user.nickName}</div>
              <div className={styles.userNote}>{user.note}</div>
            </div>
          </div>
          <div className={styles.cardAction}>
            <div className={styles.cardData}>
              <Link to={`/account/${user._id}/followers`}>
              <div className={styles.userDataItem} >
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
            {AuthStore.user._id !== user._id && (
              <div style={{ marginLeft: "auto" }}>
                {user.isFollowed ? (
                  <LoadableButton
                    danger
                    ghost
                    size='small'
                    onSubmit={() => unFollow(user._id)}
                  >
                    取消关注
                  </LoadableButton>
                ) : (
                  <LoadableButton
                    type="primary"
                    ghost
                    size='small'
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
                    size='small'
                    danger
                  />
                </Popconfirm>
              </div>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  };

  return (
    <div {...wrapperProps} className={classnames(styles.cardWrapper, wrapperProps.className)}>
      <div className={styles.card}>
        {renderContent()}
      </div>
    </div>
  );
};

export { AccountCard };
export default AccountCard;
