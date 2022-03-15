import React from "react";
import { Button, Divider, Badge } from "antd";
import { Pendant } from '@/shared/components/Pendant'
import { Link } from "react-router-dom";
import { CloudUploadOutlined, LogoutOutlined } from "@ant-design/icons";
import CommonStore from "@/shared/stores/CommonStore";
import AuthStore from "@/shared/stores/AuthStore";
import { observer } from "mobx-react";
import styles from "./HomepageAccount.module.less";
import Avatar from "antd/lib/avatar/avatar";

const HomepageProfile: React.FunctionComponent = observer(() => {
  return (
    <div className={styles.userProfile}>
      <Pendant url={AuthStore.user.pendantUrl} style={{ marginBottom: 16 }}>
        <Avatar
          src={AuthStore.user.avatarUrl}
          size={60}
        />
      </Pendant>
      <div className={styles.userNickname} style={{ marginBottom: 8 }}>
        {AuthStore.user.nickName}
      </div>
      <div className={styles.userNote} style={{ marginBottom: 8 }}>
        {AuthStore.user.note}
      </div>

      <div className={styles.userData}>
        <Link
          to={`/account/${AuthStore.user._id}/followers`}
          className="custom-link"
        >
          <div className={styles.userDataItem}>
            <span className={styles.userDataItemCount}>
              {AuthStore.user.followerCount}
            </span>
            粉丝
          </div>
        </Link>
        <Divider type="vertical" />
        <Link
          to={`/account/${AuthStore.user._id}/followings`}
          className="custom-link"
        >
          <div className={styles.userDataItem}>
            <span className={styles.userDataItemCount}>
              {AuthStore.user.followingCount}
            </span>
            关注
          </div>
        </Link>
        <Divider type="vertical" />
        <div className={styles.userDataItem}>
          <span className={styles.userDataItemCount}>
            {AuthStore.user.likedCount}
          </span>
          获赞
        </div>
      </div>
    </div>
  );
});
export default HomepageProfile;
