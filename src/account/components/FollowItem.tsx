import React, { useState } from "react";
import { Avatar, message } from "antd";
import { AccountInfoWrapper } from "@/shared/components/AccountInfo";
import AuthStore from "@/shared/stores/AuthStore";
import LoadableButton from "@/shared/components/LoadableButton";
import AccountStore, { IAccountDto } from "../stores/AccountStore";
import styles from "./FollowItem.module.less";

interface Props {
  user: IAccountDto;
}

const FollowItem: React.FunctionComponent<Props> = ({ user }) => {
  const [followed, setFollowed] = useState(user.isFollowed);

  async function follow(uuid: string) {
    return AccountStore.follow(uuid).then(() => {
      message.success("关注成功");
      setFollowed(true);
    });
  }

  async function unFollow(uuid: string) {
    return AccountStore.unfollow(uuid).then(() => {
      message.success("取消关注成功");
      setFollowed(false);
    });
  }

  return (
    <div className={styles.item}>
      <AccountInfoWrapper _id={user._id}>
        <Avatar style={{ marginRight: 8 }} src={user.avatarUrl} size="small" />
      </AccountInfoWrapper>
      <AccountInfoWrapper _id={user._id}>
        <div style={{ color: "rgba(255,255,255,0.8)" }}>{user.nickName}</div>
      </AccountInfoWrapper>

      <div style={{ marginLeft: "auto" }} />
      {AuthStore.user._id !== user._id && (
        <React.Fragment>
          {followed ? (
            <LoadableButton danger ghost onSubmit={() => unFollow(user._id)}>
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
        </React.Fragment>
      )}
    </div>
  );
};

export default FollowItem;
