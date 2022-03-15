import React, { useState } from "react";
import { Avatar, message } from "antd";
import { AccountInfoWrapper } from "@/shared/components/AccountInfo";
import styles from "./FollowItem.module.less";

interface Props {
  user: {
    _id: string;
    avatarUrl: string;
    nickName: string;
  };
  action: React.ReactNode;
}

const AccountItem: React.FunctionComponent<Props> = ({ user, action }) => {

  return (
    <div className={styles.item}>
      <AccountInfoWrapper _id={user._id}>
        <Avatar style={{ marginRight: 8 }} src={user.avatarUrl} size="small" />
      </AccountInfoWrapper>
      <AccountInfoWrapper _id={user._id}>
        <div style={{ color: "rgba(255,255,255,0.8)" }}>{user.nickName}</div>
      </AccountInfoWrapper>

      <div style={{ marginLeft: "auto" }}>
        {action}
      </div>
    </div>
  );
};

export default AccountItem;
